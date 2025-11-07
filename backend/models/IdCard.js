import mongoose from 'mongoose';

const idCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  qrCode: {
    type: String, // URL or data URL of the QR code
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validThru: {
    type: Date,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastDownloadedAt: {
    type: Date
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('IdCard', idCardSchema);