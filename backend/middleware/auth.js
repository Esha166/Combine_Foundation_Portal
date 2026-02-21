import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies (HttpOnly)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fallback: Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists or is inactive'
      });
    }

    if (req.user.role === 'volunteer' && req.user.status === 'completed') {
      return res.status(403).json({
        success: false,
        message: 'Your volunteer access has ended. Please contact admin for further assistance.'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Restrict access to certain roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

export {protect, restrictTo};
