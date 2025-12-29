import api from './api';

export const categoryService = {
    // Get all categories by type
    getCategories: async (type = 'lecture') => {
        const response = await api.get(`/categories?type=${type}`);
        return response;
    },

    // Create a new category
    createCategory: async (data) => {
        const response = await api.post('/categories', data);
        return response;
    },

    // Delete a category
    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response;
    }
};
