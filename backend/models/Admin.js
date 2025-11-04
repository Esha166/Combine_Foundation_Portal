import mongoose from 'mongoose';
import User from './User.js';

const adminSchema = new mongoose.Schema({
  permissions: [{
    type: String,
    enum: [
      'manage_volunteers', 
      'manage_trustees', 
      'manage_courses', 
      'manage_posts', 
      'view_analytics', 
      'manage_admins', 
      'view_reports'
    ]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  canManageAdmins: {
    type: Boolean,
    default: false  // Only superadmin should be able to manage other admins by default
  }
});

export default User.discriminator('admin', adminSchema);