import api from './api';

export const adminService = {
  // Get all admins
  getAllAdmins: async () => {
    const response = await api.get('/admin');
    return response.data;
  },

  // Create a new admin
  createAdmin: async (adminData) => {
    const response = await api.post('/admin', adminData);
    return response.data;
  },

  // Delete an admin
  deleteAdmin: async (adminId) => {
    const response = await api.delete(`/admin/${adminId}`);
    return response.data;
  },

  // Get audit logs
  getAuditLogs: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/admin/audit-logs${params ? '?' + params : ''}`);
    return response.data;
  }
};