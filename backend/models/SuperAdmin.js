import mongoose from 'mongoose';
import User from './User.js'

const superAdminSchema = new mongoose.Schema({
  canManageAdmins: {
    type: Boolean,
    default: true
  },
  canViewAuditLogs: {
    type: Boolean,
    default: true
  }
});

export default User.discriminator('superadmin', superAdminSchema);