import Category from '../models/Category.js';

// Get all categories by type
export const getCategories = async (req, res) => {
    try {
        const { type = 'lecture' } = req.query;

        const categories = await Category.find({
            type,
            isActive: true
        })
            .select('name type createdAt')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching categories'
        });
    }
};

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, type = 'lecture' } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({
            name: name.toLowerCase().trim(),
            type
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        const category = new Category({
            name: name.trim(),
            type,
            createdBy: req.user._id
        });

        await category.save();

        res.status(201).json({
            success: true,
            data: category,
            message: 'Category created successfully'
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating category'
        });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Soft delete by setting isActive to false
        category.isActive = false;
        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting category'
        });
    }
};
