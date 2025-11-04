import mongoose from 'mongoose';
import User from './User.js';

const developerSchema = new mongoose.Schema({
  permissions: [{
    type: String,
    default: () => [
      'full_access', 
      'manage_admins',
      'manage_volunteers', 
      'manage_courses', 
      'manage_posts',
      'view_audit_logs',
      'view_error_logs'
    ]  // Developers have full permissions like superadmin
  }],
  canManageAdmins: {
    type: Boolean,
    default: true  // Developers can manage admins like superadmin
  },
  canViewAuditLogs: {
    type: Boolean,
    default: true  // Developers can view audit logs
  },
  canViewErrorLogs: {
    type: Boolean,
    default: true  // Developers can view error logs
  }
});

export default User.discriminator('developer', developerSchema);