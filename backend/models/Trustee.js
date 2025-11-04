import mongoose from 'mongoose';
import User from './User.js'

const trusteeSchema = new mongoose.Schema({
  expertise: [{
    type: String,
    trim: true
  }],
  canViewStats: {
    type: Boolean,
    default: true
  }
});

export default User.discriminator('trustee', trusteeSchema);