import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Course image is required']
  },
  registrationLink: {
    type: String,
    trim: true
  },
  socialLink: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pre-launch', 'launched', 'completed'],
    default: 'pre-launch'
  },
  totalParticipants: {
    type: Number,
    min: 0,
    default: 0
  },
  maleParticipants: {
    type: Number,
    min: 0,
    default: 0
  },
  femaleParticipants: {
    type: Number,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

courseSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

export default mongoose.model('Course', courseSchema);
