import React from 'react';

const VolunteerActivity = ({ volunteers, courses }) => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Volunteer Activity Overview
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Total Volunteers</span>
                    <span className="text-xl font-bold text-[#FF6900]">{volunteers.total}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Active in 30 days</span>
                    <span className="text-xl font-bold text-green-600">{volunteers.active}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Course Completion Rate</span>
                    <span className="text-xl font-bold text-blue-600">
                        {volunteers.total > 0
                            ? Math.round((courses.completed / volunteers.total) * 100) + '%'
                            : '0%'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VolunteerActivity;
