import React from 'react';

const AuditLogStats = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Audit Log Statistics</h2>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-[#FF6900]">{stats.totalLogs}</p>
                    <p className="text-gray-600">Total Logs</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-[#FF6900]">
                        {stats.recentLogs?.length || 0}
                    </p>
                    <p className="text-gray-600">Recent Logs</p>
                </div>
            </div>

            {stats.actionStats && stats.actionStats.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Action Distribution</h3>
                    <div className="space-y-2">
                        {stats.actionStats.map((stat, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-700 capitalize">{stat._id.replace(/_/g, ' ')}</span>
                                <span className="text-gray-900 font-medium">{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogStats;
