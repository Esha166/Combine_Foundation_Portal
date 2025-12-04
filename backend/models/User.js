import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false // Don't return password by default
  },
  phone: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['volunteer', 'admin', 'superadmin', 'trustee', 'developer'],
    required: true
  },
  // Common profile fields (available for all roles)
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    trim: true
  },
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
  education: {
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
  expertise: [{
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
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  discriminatorKey: 'role',
  collection: 'users'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);
export default User;