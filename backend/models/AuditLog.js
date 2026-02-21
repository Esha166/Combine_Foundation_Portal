import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['volunteer_approved', 'volunteer_rejected', 'volunteer_completed', 'volunteer_invited', 'trustee_created', 'trustee_deleted', 'course_created', 'course_updated', 
           'course_deleted', 'post_created', 'post_updated', 'post_deleted', 
           'admin_created', 'admin_deleted', 'login', 'password_change', 'password_reset']
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  targetResource: {
    type: String // e.g., "Course:123abc", "Post:456def"
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
auditLogSchema.index({ performedBy: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
