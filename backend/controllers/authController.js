import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { logAuditEvent } from '../utils/auditLogger.js';
import { sendForgotPasswordEmail, sendPasswordChangeEmail } from '../utils/emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Create audit log
    await logAuditEvent('login', user._id, null, null, req.ip, req.headers['user-agent']);

    // Generate token
    const token = generateToken(user._id);

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isFirstLogin: user.isFirstLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    user.isFirstLogin = false;
    await user.save();

    // Create audit log
    await logAuditEvent('password_change', user._id, null, null, req.ip);

    // Send email notification
    await sendPasswordChangeEmail(user);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log('=== GET ME DEBUG ===');
    console.log('User ID:', req.user.id);
    console.log('User Role:', user?.role);
    console.log('User Name:', user?.name);
    console.log('User Phone:', user?.phone);
    console.log('User Gender:', user?.gender);
    console.log('User CNIC:', user?.cnic);
    console.log('User Age:', user?.age);
    console.log('User City:', user?.city);
    console.log('User Education:', user?.education);
    console.log('User Skills:', user?.skills);
    console.log('User Expertise:', user?.expertise);
    console.log('==================');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password - Generate and send OTP
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      // To prevent email enumeration, return success even if email doesn't exist
      return res.status(200).json({
        success: true,
        message: 'If an account with this email exists, we\'ve sent an OTP to reset your password'
      });
    }

    // Remove any existing password reset records for this email
    await PasswordReset.deleteMany({ email: email });

    // Create new password reset record
    const passwordReset = new PasswordReset({
      email: email
    });

    await passwordReset.save();

    // Send OTP via email
    const emailResult = await sendForgotPasswordEmail(user, passwordReset.otp);

    if (!emailResult.success) {
      console.error('Failed to send forgot password email:', emailResult.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again later.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email address'
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    // Find the password reset record
    const passwordReset = await PasswordReset.findOne({
      email: email,
      otp: otp,
      expiresAt: { $gt: new Date() }, // Check if OTP is not expired
      used: false // Check if OTP is not already used
    });

    if (!passwordReset) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and new password'
      });
    }

    // Validate password strength if needed
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Verify the OTP first
    const passwordReset = await PasswordReset.findOne({
      email: email,
      otp: otp,
      expiresAt: { $gt: new Date() }, // Check if OTP is not expired
      used: false // Check if OTP is not already used
    });

    if (!passwordReset) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user's password
    user.password = newPassword;
    user.isFirstLogin = false; // Reset first login flag since password was changed
    await user.save();

    // Mark the OTP as used to prevent reuse
    passwordReset.used = true;
    await passwordReset.save();

    // Create audit log
    await logAuditEvent('password_reset', user._id, null, null, req.ip);

    // Send email notification
    await sendPasswordChangeEmail(user);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};
