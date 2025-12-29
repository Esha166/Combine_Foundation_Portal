import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';

const LectureFilter = ({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, onSearchSubmit }) => {
    const [categories, setCategories] = useState(['all']);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories('lecture');
                const categoryNames = response.data.data.map(cat => cat.name);
                setCategories(['all', ...categoryNames]);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="mb-6">
            <form onSubmit={onSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search lectures..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition"
                >
                    Search
                </button>
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category
                            ? 'bg-[#FF6900] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LectureFilter;
