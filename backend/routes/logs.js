import express from 'express';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { 
  getAuditLogs, 
  getErrorLogs, 
  clearAuditLogs, 
  clearErrorLogs,
  getAuditLogStats,
  getErrorLogStats
} from '../controllers/logController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Developer and superadmin routes
router.get('/audit', roleCheck('developer', 'superadmin'), getAuditLogs);
router.get('/audit/stats', roleCheck('developer', 'superadmin'), getAuditLogStats);
router.delete('/audit', roleCheck('developer', 'superadmin'), clearAuditLogs);

router.get('/errors', roleCheck('developer', 'superadmin'), getErrorLogs);
router.get('/errors/stats', roleCheck('developer', 'superadmin'), getErrorLogStats);
router.delete('/errors', roleCheck('developer', 'superadmin'), clearErrorLogs);

export default router;