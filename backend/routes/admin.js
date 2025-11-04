import express from 'express';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { getAllAdmins, createAdmin, deleteAdmin, getAuditLogs } from '../controllers/adminController.js';

const adminRouter = express.Router();

// All routes require authentication and superadmin or developer role
adminRouter.use(protect);
adminRouter.use(roleCheck('superadmin', 'developer'));

// Get all admins
adminRouter.get('/', getAllAdmins);

// Create new admin
adminRouter.post('/', createAdmin);

// Delete admin
adminRouter.delete('/:id', deleteAdmin);

// Get audit logs
adminRouter.get('/audit-logs', getAuditLogs);

export default adminRouter;