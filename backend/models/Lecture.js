import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lecture title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subtitle: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, 'Subtitle cannot exceed 500 characters']
  },
  thumbnail: {
    type: String,
    required: [true, 'Lecture thumbnail is required'],
    trim: true
  },
  watchLink: {
    type: String,
    required: [true, 'Watch link is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.*/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  duration: {
    type: String,
    trim: true // Format like "5:30" for 5 minutes 30 seconds
  },
  views: {
    type: Number,
    default: 0
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

// Update timestamp on save
lectureSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Lecture = mongoose.model('Lecture', lectureSchema);

export default Lecture;