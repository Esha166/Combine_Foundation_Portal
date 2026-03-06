import nodemailer from 'nodemailer';
const frontend_url = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/login';

// Create reusable transporter
const createTransporter = () => {
  // Default permissive TLS to support corporate SSL inspection/self-signed chains.
  // Set EMAIL_STRICT_TLS=true to enforce certificate validation.
  const strictTls = process.env.EMAIL_STRICT_TLS === 'true';

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD // 16-character app password
    },
    tls: {
      rejectUnauthorized: strictTls
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

const FRONTEND_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatDateTime = (date) => {
  if (!date) return 'Not specified';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Not specified';
  return parsed.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const priorityLabel = (priority) => {
  if (!priority) return 'Medium';
  return String(priority).charAt(0).toUpperCase() + String(priority).slice(1);
};

const sendTaskAssignmentEmail = async ({ volunteer, task, assignedBy }) => {
  try {
    const transporter = createTransporter();

    const dueDateText = formatDateTime(task?.dueDate);
    const volunteerTaskUrl = `${FRONTEND_BASE_URL}/volunteer/tasks`;

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: `New Task Assigned: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Task Assigned</h2>
          <p>Dear ${escapeHtml(volunteer.name)},</p>
          <p>A new task has been assigned to you by <strong>${escapeHtml(assignedBy.name || 'Admin')}</strong>.</p>

          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Assigned By:</strong> ${escapeHtml(assignedBy.name || 'Admin')}</p>
            <p><strong>Task:</strong> ${escapeHtml(task.title)}</p>
            <p><strong>Description:</strong> ${escapeHtml(task.description || 'No description provided')}</p>
            <p><strong>Priority:</strong> ${escapeHtml(priorityLabel(task.priority))}</p>
            <p><strong>Deadline:</strong> ${escapeHtml(dueDateText)}</p>
          </div>

          <p>
            <a href="${volunteerTaskUrl}" style="background-color: #2563eb; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Open & Submit Task
            </a>
          </p>

          <p>Best regards,<br/>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Task assignment email error:', error);
    return { success: false, error: error.message };
  }
};

const sendTaskReminderEmail = async ({ volunteer, task }) => {
  try {
    const transporter = createTransporter();

    const dueDateText = formatDateTime(task?.dueDate);
    const volunteerTaskUrl = `${FRONTEND_BASE_URL}/volunteer/tasks`;

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: `Reminder: Task Deadline in 36 Hours - ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Task Deadline Reminder</h2>
          <p>Dear ${escapeHtml(volunteer.name)},</p>
          <p>Your task is still pending and the deadline is within the next 36 hours.</p>

          <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc2626;">
            <p><strong>Task:</strong> ${escapeHtml(task.title)}</p>
            <p><strong>Description:</strong> ${escapeHtml(task.description || 'No description provided')}</p>
            <p><strong>Priority:</strong> ${escapeHtml(priorityLabel(task.priority))}</p>
            <p><strong>Deadline:</strong> ${escapeHtml(dueDateText)}</p>
          </div>

          <p>
            <a href="${volunteerTaskUrl}" style="background-color: #dc2626; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Open Task
            </a>
          </p>

          <p>Best regards,<br/>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Task reminder email error:', error);
    return { success: false, error: error.message };
  }
};

const sendTaskSubmittedAcknowledgementEmail = async ({ volunteer, task }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: `Task Submission Received: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Task Submitted</h2>
          <p>Dear ${escapeHtml(volunteer.name)},</p>
          <p>Your task submission has been received and is currently under review. We will update you soon.</p>

          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Task:</strong> ${escapeHtml(task.title)}</p>
            <p><strong>Submitted Details:</strong> ${escapeHtml(task.submissionDetails || 'No details provided')}</p>
          </div>

          <p>Best regards,<br/>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Task submission acknowledgement email error:', error);
    return { success: false, error: error.message };
  }
};

const sendTaskSubmittedForReviewEmail = async ({ recipient, volunteer, task, assignedBy }) => {
  try {
    const transporter = createTransporter();
    const reviewUrl = `${FRONTEND_BASE_URL}/admin/tasks`;

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: recipient.email,
      subject: `Task Submitted for Review: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6900;">Task Submitted for Review</h2>
          <p>Dear ${escapeHtml(recipient.name || recipient.email)},</p>
          <p>A volunteer has submitted a task. Please review it.</p>

          <div style="background-color: #f5f3ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #7c3aed;">
            <p><strong>Volunteer:</strong> ${escapeHtml(volunteer.name)} (${escapeHtml(volunteer.email)})</p>
            <p><strong>Assigned By:</strong> ${escapeHtml(assignedBy.name || 'Admin')}</p>
            <p><strong>Task:</strong> ${escapeHtml(task.title)}</p>
            <p><strong>Description:</strong> ${escapeHtml(task.description || 'No description provided')}</p>
            <p><strong>Priority:</strong> ${escapeHtml(priorityLabel(task.priority))}</p>
            <p><strong>Deadline:</strong> ${escapeHtml(formatDateTime(task.dueDate))}</p>
            <p><strong>Submission Details:</strong> ${escapeHtml(task.submissionDetails || 'No details provided')}</p>
          </div>

          <p>
            <a href="${reviewUrl}" style="background-color: #FF6900; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Task
            </a>
          </p>

          <p>Best regards,<br/>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Task submitted-for-review email error:', error);
    return { success: false, error: error.message };
  }
};

const sendTaskApprovedEmail = async ({ volunteer, task, reviewer }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: `Task Completed: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Task Approved</h2>
          <p>Dear ${escapeHtml(volunteer.name)},</p>
          <p>Your submitted task has been approved by ${escapeHtml(reviewer.name || 'Admin')}.</p>
          <p>The task is now marked as <strong>completed</strong>.</p>

          <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #16a34a;">
            <p><strong>Task:</strong> ${escapeHtml(task.title)}</p>
            <p><strong>Priority:</strong> ${escapeHtml(priorityLabel(task.priority))}</p>
            <p><strong>Deadline:</strong> ${escapeHtml(formatDateTime(task.dueDate))}</p>
          </div>

          <p>Best regards,<br/>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Task approved email error:', error);
    return { success: false, error: error.message };
  }
};

const sendTaskRejectedEmail = async ({ volunteer, task, reviewer, reason }) => {
  try {
    const transporter = createTransporter();
    const volunteerTaskUrl = `${FRONTEND_BASE_URL}/volunteer/tasks`;

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: `Task Rejected: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Task Rejected</h2>
          <p>Dear ${escapeHtml(volunteer.name)},</p>
          <p>Your submitted task has been rejected by ${escapeHtml(reviewer.name || 'Admin')}.</p>

          <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc2626;">
            <p><strong>Task:</strong> ${escapeHtml(task.title)}</p>
            <p><strong>Reason:</strong> ${escapeHtml(reason || 'No reason provided')}</p>
          </div>

          <p>
            <a href="${volunteerTaskUrl}" style="background-color: #dc2626; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review and Resubmit
            </a>
          </p>

          <p>Best regards,<br/>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Task rejected email error:', error);
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
    return { success: false, error: error.message };
  }
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

const sendApplicationReceivedEmail = async (volunteer) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: 'We Received Your Volunteer Application',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Application Submitted Successfully</h2>
          <p>Dear ${volunteer.name},</p>
          <p>Thank you for applying to volunteer with Combine Foundation.</p>
          <p>Your application has been received and is currently under review.</p>
          <p>We will contact you by email once there is an update on your application status.</p>
          <p>Best regards,<br>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Application received email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendCompletionEmail = async (volunteer) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Combine Foundation <${process.env.GMAIL_USER}>`,
      to: volunteer.email,
      subject: 'Thank You for Completing Your Volunteer Journey',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Volunteer Journey Completed</h2>
          <p>Dear ${volunteer.name},</p>
          <p>Congratulations on successfully completing your volunteer journey with Combine Foundation.</p>
          <p>We sincerely appreciate your time, effort, and contribution.</p>
          <p>Best regards,<br>Combine Foundation Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Completion email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

export {
  sendApprovalEmail,
  sendRejectionEmail,
  sendPasswordChangeEmail,
  sendForgotPasswordEmail,
  sendInvitationEmail,
  sendAdminCredentialsEmail,
  sendApplicationReceivedEmail,
  sendCompletionEmail,
  sendTaskAssignmentEmail,
  sendTaskReminderEmail,
  sendTaskSubmittedAcknowledgementEmail,
  sendTaskSubmittedForReviewEmail,
  sendTaskApprovedEmail,
  sendTaskRejectedEmail
};



