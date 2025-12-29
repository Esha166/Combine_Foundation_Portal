import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { checkPermission } from '../middleware/checkPermission.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories (filtered by type)
// @access  Private
router.get('/', protect, getCategories);

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (Admin only)
router.post('/', protect, checkPermission('manage_lectures'), createCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Admin only)
router.delete('/:id', protect, checkPermission('manage_lectures'), deleteCategory);

export default router;
