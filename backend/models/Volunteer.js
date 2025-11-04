import mongoose from 'mongoose';
import User from './User.js'

const volunteerSchema = new mongoose.Schema({
  expertise: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
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
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    required: true
  },
  // Additional profile fields for volunteer application
  cnic: {
    type: String,
    trim: true
  },
  age: {
    type: Number
  },
  city: {
    type: String,
    trim: true
  },
  institute: {
    type: String,
    trim: true
  },
  socialMedia: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  priorExperience: {
    type: String,
    trim: true
  },
  experienceDesc: {
    type: String,
    trim: true
  },
  availabilityDays: [{
    type: String,
    trim: true
  }],
  availabilityHours: {
    type: String,
    trim: true
  },
  termsAgreed: {
    type: Boolean,
    default: false
  }
});

export default User.discriminator('volunteer', volunteerSchema);