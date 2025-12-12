import express from 'express';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { getAllAdmins, createAdmin, deleteAdmin, getAuditLogs } from '../controllers/adminController.js';

const adminRouter = express.Router();

// All routes require authentication and superadmin, developer, or ADMIN role
adminRouter.use(protect);
adminRouter.use(roleCheck('superadmin', 'developer', 'admin'));

// Check permissions
import { checkPermission } from '../middleware/checkPermission.js';

// Get all admins
adminRouter.get('/', checkPermission('manage_admins'), getAllAdmins);

// Create new admin
adminRouter.post('/', checkPermission('manage_admins'), createAdmin);

// Delete admin
adminRouter.delete('/:id', checkPermission('manage_admins'), deleteAdmin);

// Get audit logs
adminRouter.get('/audit-logs', checkPermission('view_analytics'), getAuditLogs);

export default adminRouter;