import mongoose from 'mongoose';
import User from './User.js'

const volunteerSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  appliedFormId: {
    type: String,
    trim: true
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  invitedAt: {
    type: Date
  },
  termsAgreed: {
    type: Boolean,
    default: false
  },
  cnicFrontImage: {
    type: String,
    trim: true
  },
  cnicBackImage: {
    type: String,
    trim: true
  }
});

export default User.discriminator('volunteer', volunteerSchema);
