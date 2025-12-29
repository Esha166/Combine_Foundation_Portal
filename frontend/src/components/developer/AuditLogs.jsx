import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import api from '../../services/api';
import AuditLogStats from './audit/AuditLogStats';
import AuditLogFilters from './audit/AuditLogFilters';
import AuditLogTable from './audit/AuditLogTable';
import LogPagination from './LogPagination';

const AuditLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    action: '',
    startDate: '',
    endDate: ''
  });
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAuditLogs();
    if (showStats) {
      fetchAuditStats();
    }
  }, [filters]);

  useEffect(() => {
    if (showStats) {
      fetchAuditStats();
    }
  }, [showStats]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          params.append(key, value);
        }
      }

      const response = await api.get(`/logs/audit?${params.toString()}`);
      setLogs(response.data.data.logs);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError('Failed to fetch audit logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditStats = async () => {
    try {
      const response = await api.get('/logs/audit/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching audit stats:', err);
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
      action: '',
      startDate: '',
      endDate: ''
    });
  };

  if (user?.role !== 'developer' && user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600">Only developers and superadmins can access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#FF6900]">Audit Logs</h1>
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
        {showStats && <AuditLogStats stats={stats} />}

        {/* Filters */}
        <AuditLogFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

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
          <>
            <AuditLogTable logs={logs} />
            <LogPagination
              pagination={pagination}
              filterLimit={filters.limit}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;