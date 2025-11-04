import express from 'express';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validator.js';
import User from '../models/User.js';
import { generatePassword } from '../utils/generatePassword.js';
import { logAuditEvent } from '../utils/auditLogger.js';
import { createTrusteeValidator } from '../validators/trusteeValidator.js';
import { getStats, getDetailedReports, getMembers, getPosts, getCourses } from '../controllers/trusteeController.js';

const trusteeRoute = express.Router();

// All routes require authentication
trusteeRoute.use(protect);

// Create new trustee
trusteeRoute.post('/', roleCheck('admin', 'superadmin', 'developer'), validate(createTrusteeValidator), async (req, res, next) => {
  try {
    const { name, email, education } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate temporary password
    const tempPassword = generatePassword();

    const trustee = await User.create({
      name,
      email,
      education, // Add education field
      password: tempPassword,
      role: 'trustee',
      isFirstLogin: true
    });

    // Create audit log
    await logAuditEvent('trustee_created', req.user.id, trustee._id, null, req.ip, null, { email: trustee.email });

    // Send email with credentials
    const { sendAdminCredentialsEmail } = await import('../utils/emailService.js');
    await sendAdminCredentialsEmail(trustee, tempPassword);

    res.status(201).json({
      success: true,
      message: 'Trustee created successfully. Email sent with credentials.',
      data: trustee
    });
  } catch (error) {
    next(error);
  }
});

// Get all trustees
trusteeRoute.get('/', roleCheck('admin', 'superadmin', 'developer'), async (req, res, next) => {
  try {
    const trustees = await User.find({ role: 'trustee' }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: trustees.length,
      data: trustees
    });
  } catch (error) {
    next(error);
  }
});

// Delete trustee
trusteeRoute.delete('/:id', roleCheck('admin', 'superadmin', 'developer'), async (req, res, next) => {
  try {
    const trustee = await User.findById(req.params.id);

    if (!trustee) {
      return res.status(404).json({
        success: false,
        message: 'Trustee not found'
      });
    }

    // Ensure we're deleting a trustee
    if (trustee.role !== 'trustee') {
      return res.status(400).json({
        success: false,
        message: 'This user is not a trustee'
      });
    }

    await trustee.deleteOne();

    // Create audit log
    await logAuditEvent('trustee_deleted', req.user.id, trustee._id, null, req.ip);

    res.status(200).json({
      success: true,
      message: 'Trustee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get stats - accessible to trustee, admin, superadmin, and developer roles
trusteeRoute.get('/stats', roleCheck('admin', 'superadmin', 'developer', 'trustee'), getStats);

// Get detailed reports - accessible to trustee, admin, superadmin, and developer roles
trusteeRoute.get('/reports', roleCheck('admin', 'superadmin', 'developer', 'trustee'), getDetailedReports);

// Get members (admins and volunteers) - accessible to trustee, admin, superadmin, and developer roles
trusteeRoute.get('/members', roleCheck('admin', 'superadmin', 'developer', 'trustee'), getMembers);

// Get posts - accessible to trustee, admin, superadmin, and developer roles
trusteeRoute.get('/posts', roleCheck('admin', 'superadmin', 'developer', 'trustee'), getPosts);

// Get courses - accessible to trustee, admin, superadmin, and developer roles
trusteeRoute.get('/courses', roleCheck('admin', 'superadmin', 'developer', 'trustee'), getCourses);

export default trusteeRoute;