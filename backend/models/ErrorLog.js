import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    enum: ['error', 'warn', 'info', 'debug']
  },
  message: {
    type: String,
    required: true
  },
  stack: {
    type: String // Full stack trace for errors
  },
  meta: {
    type: mongoose.Schema.Types.Mixed // Additional metadata like user info, request details, etc.
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String, // e.g., 'controller', 'middleware', 'database', etc.
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // The user associated with the error, if applicable
  },
  endpoint: {
    type: String // The API endpoint where error occurred
  },
  statusCode: {
    type: Number // HTTP status code associated with the error
  }
});

// Index for efficient querying
errorLogSchema.index({ timestamp: -1 });
errorLogSchema.index({ level: 1, timestamp: -1 });
errorLogSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('ErrorLog', errorLogSchema);