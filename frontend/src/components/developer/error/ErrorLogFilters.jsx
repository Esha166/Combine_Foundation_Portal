import React from 'react';
import Button from '../../ui/Button';

const ErrorLogFilters = ({ filters, onChange, onClear }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid md:grid-cols-5 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                    </label>
                    <select
                        name="level"
                        value={filters.level}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6900] focus:border-[#FF6900]"
                    >
                        <option value="">All Levels</option>
                        <option value="error">Error</option>
                        <option value="warn">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6900] focus:border-[#FF6900]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6900] focus:border-[#FF6900]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source
                    </label>
                    <input
                        type="text"
                        name="source"
                        value={filters.source}
                        onChange={onChange}
                        placeholder="e.g., controller, middleware"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6900] focus:border-[#FF6900]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Results per page
                    </label>
                    <select
                        name="limit"
                        value={filters.limit}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6900] focus:border-[#FF6900]"
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 flex space-x-2">
                <Button
                    onClick={onClear}
                    variant="secondary"
                >
                    Clear Filters
                </Button>
            </div>
        </div>
    );
};

export default ErrorLogFilters;
