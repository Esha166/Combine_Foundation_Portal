import React, { useState, useEffect } from 'react';
import FormField from '../../forms/FormField';
import FormSelect from '../../forms/FormSelect';
import Button from '../../ui/Button';
import CategoryModal from './CategoryModal';
import { categoryService } from '../../../services/categoryService';

const LectureSettings = ({ register, errors, setValue, watch }) => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getCategories('lecture');
            setCategories(response.data.data.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleCategoryCreated = (newCategory) => {
        setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
        setValue('category', newCategory.name); // Auto-select new category
    };

    const categoryOptions = categories.map(cat => ({
        value: cat.name,
        label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1)
    }));

    return (
        <div className="space-y-6">
            <div className="flex gap-2 items-start">
                <FormSelect
                    label="Category"
                    error={errors.category}
                    registration={register('category', { required: 'Category is required' })}
                    options={categoryOptions}
                    placeholder="Select a category"
                    className="flex-1"
                />
                <div className="mt-6">
                    <Button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 h-[42px]"
                    >
                        + Add New
                    </Button>
                </div>
            </div>

            <FormField
                label="Tags"
                error={errors.tags}
                registration={register('tags')}
                placeholder="Enter tags separated by commas (e.g., react, javascript)"
            />

            <FormField
                label="Duration"
                error={errors.duration}
                registration={register('duration')}
                placeholder="Enter duration (e.g., 5:30)"
            />

            <div className="flex items-center space-x-2 pt-2">
                <input
                    type="checkbox"
                    id="isPublic"
                    {...register('isPublic')}
                    className="h-4 w-4 text-[#FF6900] focus:ring-[#FF6900] border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 select-none">
                    Make this lecture public
                </label>
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCategoryCreated={handleCategoryCreated}
            />
        </div>
    );
};

export default LectureSettings;
