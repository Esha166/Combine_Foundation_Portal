import React from 'react';

const VolunteerStats = ({ tasks = [] }) => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Tasks</h3>
                <p className="text-3xl font-bold text-[#FF6900]">{tasks.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
                <p className="text-3xl font-bold text-green-600">{completed}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
                <p className="text-3xl font-bold text-orange-500">{pending}</p>
            </div>
        </div>
    );
};

export default VolunteerStats;
