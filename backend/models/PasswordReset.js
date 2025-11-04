import mongoose from 'mongoose';
import crypto from 'crypto';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate OTP before validation
passwordResetSchema.pre('validate', function(next) {
  // Only generate OTP if it's a new document and these values aren't already set
  if (this.isNew && (!this.otp || !this.expiresAt)) {
    // Generate a 6-digit numeric OTP
    this.otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time to 10 minutes from now
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }
  
  next();
});

// Generate OTP before saving (as backup in case validate doesn't run)
passwordResetSchema.pre('save', function(next) {
  // Only generate OTP if it's a new document and these values aren't already set
  if (this.isNew && (!this.otp || !this.expiresAt)) {
    // Generate a 6-digit numeric OTP
    this.otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time to 10 minutes from now
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }
  
  next();
});

// Create index on email and expiresAt for efficient querying
passwordResetSchema.index({ email: 1, expiresAt: 1 });
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-expire documents

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;