import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import api from '../../services/api';

const ErrorLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    level: '',
    startDate: '',
    endDate: '',
    source: ''
  });
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    fetchErrorLogs();
    if (showStats) {
      fetchErrorStats();
    }
  }, [filters]);

  useEffect(() => {
    if (showStats) {
      fetchErrorStats();
    }
  }, [showStats]);

  const fetchErrorLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          params.append(key, value);
        }
      }

      const response = await api.get(`/logs/errors?${params.toString()}`);
      setLogs(response.data.data.logs);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError('Failed to fetch error logs');
      console.error('Error fetching error logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchErrorStats = async () => {
    try {
      const response = await api.get('/logs/errors/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching error stats:', err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      level: '',
      startDate: '',
      endDate: '',
      source: ''
    });
  };

  const toggleLogDetails = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  if (user?.role !== 'developer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600">Only developers can access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#FF6900]">Error Logs</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <GoBackButton />
          </div>
        </div>

        {/* Stats Panel */}
        {showStats && stats && (
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
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
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
                onChange={handleFilterChange}
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
                onChange={handleFilterChange}
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
                onChange={handleFilterChange}
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
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6900] focus:border-[#FF6900]"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
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
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            log.level === 'error' 
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

            {/* Pagination */}
            {pagination.totalLogs > filters.limit && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.currentPage - 1) * filters.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.currentPage * filters.limit, pagination.totalLogs)}
                      </span> of{' '}
                      <span className="font-medium">{pagination.totalLogs}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === pagination.currentPage
                                ? 'z-10 bg-[#FF6900] border-[#FF6900] text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorLogs;