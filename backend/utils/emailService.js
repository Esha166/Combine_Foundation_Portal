import nodemailer from 'nodemailer';
const frontend_url = 'https://combine-foundation-portal-frontend.vercel.app/login'

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD // 16-character app password
    }
  });
};

const sendApprovalEmail = async (volunteer, tempPassword) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: 'Welcome to Combine Foundation - Your Application is Approved! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Combine Foundation!</h2>
          <p>Dear ${volunteer.name},</p>
          <p>Congratulations! Your volunteer application has been approved.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${volunteer.email}</p>
            <p><strong>Temporary Password:</strong> <code style="background-color: #e5e7eb; padding: 5px 10px; border-radius: 4px;">${tempPassword}</code></p>
          </div>
          
          <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          
          <p>
            <a href="${frontend_url}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
              Login to Portal
            </a>
          </p>
          
          <p>We're excited to have you on board!</p>
          <p>Best regards,<br>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendRejectionEmail = async (volunteer, reason) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: 'Update on Your Volunteer Application',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Application Update</h2>
          <p>Dear ${volunteer.name},</p>
          <p>Thank you for your interest in volunteering with Combine Foundation.</p>
          <p>After careful review, we regret to inform you that we are unable to proceed with your application at this time.</p>
          
          ${reason ? `<div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <p><strong>Reason:</strong> ${reason}</p>
          </div>` : ''}
          
          <p>We encourage you to apply again in the future as opportunities arise.</p>
          <p>Thank you for your understanding.</p>
          <p>Best regards,<br>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Rejection email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendPasswordChangeEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: 'Password Changed Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Password Changed Successfully</h2>
          <p>Dear ${user.name},</p>
          <p>Your password has been successfully changed.</p>
          <p>If you did not make this change, please contact us immediately.</p>
          <p>Best regards,<br>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password change email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendAdminCredentialsEmail = async (admin, tempPassword) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: admin.email,
      subject: 'Admin Account Created - Combine Foundation Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Admin Account Created</h2>
          <p>Dear ${admin.name},</p>
          <p>An admin account has been created for you on the Combine Foundation Portal.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${admin.email}</p>
            <p><strong>Temporary Password:</strong> <code style="background-color: #e5e7eb; padding: 5px 10px; border-radius: 4px;">${tempPassword}</code></p>
          </div>
          
          <p><strong>Important:</strong> Please change your password immediately after your first login.</p>
          
          <p>
            <a href="${frontend_url}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
              Login to Portal
            </a>
          </p>
          
          <p>Best regards,<br>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin credentials email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Test email function
const sendTestEmail = async (toEmail) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: 'Test Email - Combine Foundation Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Email Configuration Test</h2>
          <p>This is a test email from Combine Foundation Portal.</p>
          <p>If you received this email, your email configuration is working correctly! ✅</p>
          <p>Best regards,<br>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Test email failed:', error);
    return { success: false, error: error.message };
  }
};

const sendForgotPasswordEmail = async (user, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset OTP - Combine Foundation Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Dear ${user.name},</p>
          <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to reset your password:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="margin-top: 0; color: #2563eb; font-size: 32px; letter-spacing: 4px;">${otp}</h3>
            <p><strong>This OTP is valid for 10 minutes only</strong></p>
          </div>
          
          <p>If you did not request this password reset, please ignore this email.</p>
          
          <p>Best regards,<br>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Forgot password email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };  }
};

// Function to send invitation email to a new volunteer
const sendInvitationEmail = async (volunteer, tempPassword) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: 'Invitation to Join Combine Foundation as a Volunteer',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Combine Foundation!</h2>
          <p>Dear ${volunteer.name || 'Volunteer'},</p>
          <p>Congratulations! You have been invited to join Combine Foundation as a volunteer.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Account Details:</h3>
            <p><strong>Email:</strong> ${volunteer.email}</p>
            <p><strong>Temporary Password:</strong> <code style="background-color: #e5e7eb; padding: 5px 10px; border-radius: 4px;">${tempPassword}</code></p>
          </div>
          
          <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          
          <p>
            <a href="${frontend_url}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
              Login to Portal
            </a>
          </p>
          
          <p>We're excited to have you on board!</p>
          <p>Best regards,<br>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Invitation email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Invitation email send error:', error);
    return { success: false, error: error.message };
  }
};

export {
  sendApprovalEmail,
  sendRejectionEmail,
  sendPasswordChangeEmail,
  sendForgotPasswordEmail,
  sendInvitationEmail,
  sendAdminCredentialsEmail
};