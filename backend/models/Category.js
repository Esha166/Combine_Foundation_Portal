import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
        lowercase: true
    },
    type: {
        type: String,
        enum: ['lecture', 'post'],
        default: 'lecture'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
categorySchema.index({ type: 1, isActive: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
