import Admin from '../models/Admin.js';
import User from '../models/User.js';
import { generatePassword } from '../utils/generatePassword.js';
import { sendAdminCredentialsEmail } from '../utils/emailService.js';
import { logAuditEvent } from '../utils/auditLogger.js';

// Get all admins
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    next(error);
  }
};

// Create new admin
export const createAdmin = async (req, res, next) => {
  try {
    // Only allow superadmin and developer to create new admins
    if (req.user.role !== 'superadmin' && req.user.role !== 'developer') {
      return res.status(403).json({
        success: false,
        message: 'Only superadmin and developer can create new admins'
      });
    }

    const { name, email, phone, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Generate temporary password
    const tempPassword = generatePassword();

    const admin = await Admin.create({
      name,
      email,
      phone,
      permissions: permissions || ['manage_volunteers', 'manage_courses', 'manage_posts'],
      password: tempPassword,
      role: 'admin',
      createdBy: req.user.id,
      isFirstLogin: true
    });

    // Create audit log
    await logAuditEvent('admin_created', req.user.id, admin._id, req.ip);

    // Send email with credentials
    await sendAdminCredentialsEmail(admin, tempPassword);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully. Email sent with credentials.',
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

// Delete admin
export const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    await admin.deleteOne();

    // Create audit log
    await logAuditEvent('admin_deleted', req.user.id, admin._id, req.ip);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get audit logs
export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, startDate, endDate, limit = 100 } = req.query;
    
    const filter = {};
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(filter)
      .populate('performedBy', 'name email role')
      .populate('targetUser', 'name email')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};