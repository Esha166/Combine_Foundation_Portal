import React from 'react';
import Button from '../../ui/Button';

const AuditLogFilters = ({ filters, onChange, onClear }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Action
                    </label>
                    <select
                        name="action"
                        value={filters.action}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6900] focus:border-[#FF6900]"
                    >
                        <option value="">All Actions</option>
                        <option value="login">Login</option>
                        <option value="password_change">Password Change</option>
                        <option value="password_reset">Password Reset</option>
                        <option value="volunteer_approved">Volunteer Approved</option>
                        <option value="volunteer_rejected">Volunteer Rejected</option>
                        <option value="volunteer_invited">Volunteer Invited</option>
                        <option value="trustee_created">Trustee Created</option>
                        <option value="trustee_deleted">Trustee Deleted</option>
                        <option value="course_created">Course Created</option>
                        <option value="course_updated">Course Updated</option>
                        <option value="course_deleted">Course Deleted</option>
                        <option value="post_created">Post Created</option>
                        <option value="post_updated">Post Updated</option>
                        <option value="post_deleted">Post Deleted</option>
                        <option value="admin_created">Admin Created</option>
                        <option value="admin_deleted">Admin Deleted</option>
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

export default AuditLogFilters;
