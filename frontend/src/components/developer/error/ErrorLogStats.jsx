import React from 'react';

const ErrorLogStats = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Error Log Statistics</h2>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{stats.totalLogs}</p>
                    <p className="text-gray-600">Total Errors</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                        {stats.recentErrorLogs?.length || 0}
                    </p>
                    <p className="text-gray-600">Recent Errors</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{stats.levelStats?.[0]?.count || 0}</p>
                    <p className="text-gray-600">Most Frequent Level</p>
                </div>
            </div>

            {stats.levelStats && stats.levelStats.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Error Level Distribution</h3>
                    <div className="space-y-2">
                        {stats.levelStats.map((stat, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-700 capitalize">{stat._id}</span>
                                <span className="text-gray-900 font-medium">{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ErrorLogStats;
