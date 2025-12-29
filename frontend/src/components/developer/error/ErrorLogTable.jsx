import React, { useState } from 'react';

const ErrorLogTable = ({ logs }) => {
    const [expandedLog, setExpandedLog] = useState(null);

    const toggleLogDetails = (logId) => {
        setExpandedLog(expandedLog === logId ? null : logId);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Level
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Message
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Source
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <React.Fragment key={log._id}>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${log.level === 'error'
                                                ? 'bg-red-100 text-red-800'
                                                : log.level === 'warn'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : log.level === 'info'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                            {log.message}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {log.userId?.name || 'System'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {log.source}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleLogDetails(log._id)}
                                            className="text-[#FF6900] hover:text-[#002db3] text-sm font-medium"
                                        >
                                            {expandedLog === log._id ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedLog === log._id && (
                                    <tr className="bg-gray-50">
                                        <td colSpan="6" className="px-6 py-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Stack Trace:</h4>
                                                    <pre className="mt-1 p-3 bg-white rounded border text-xs overflow-x-auto max-h-40 overflow-y-auto">
                                                        {log.stack || 'No stack trace available'}
                                                    </pre>
                                                </div>
                                                {log.meta && Object.keys(log.meta).length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Metadata:</h4>
                                                        <pre className="mt-1 p-3 bg-white rounded border text-xs overflow-x-auto">
                                                            {JSON.stringify(log.meta, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                                {log.endpoint && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Endpoint:</h4>
                                                        <p className="text-sm">{log.endpoint}</p>
                                                    </div>
                                                )}
                                                {log.statusCode && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Status Code:</h4>
                                                        <p className="text-sm">{log.statusCode}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ErrorLogTable;
