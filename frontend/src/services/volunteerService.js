import api from './api';

export const volunteerService = {
  applyVolunteer: async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      if (typeof value === 'boolean') {
        formData.append(key, String(value));
        return;
      }

      formData.append(key, value);
    });

    const response = await api.post('/volunteers/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getPendingVolunteers: async () => {
    const response = await api.get('/volunteers/pending');
    return response.data;
  },

  getAllVolunteers: async (status) => {
    const response = await api.get('/volunteers', {
      params: { status }
    });
    return response.data;
  },

  approveVolunteer: async (id) => {
    const response = await api.post(`/volunteers/${id}/approve`);
    return response.data;
  },

  rejectVolunteer: async (id, reason) => {
    const response = await api.post(`/volunteers/${id}/reject`, { reason });
    return response.data;
  },

  deleteVolunteer: async (id) => {
    const response = await api.delete(`/volunteers/${id}`);
    return response.data;
  },

  inviteVolunteer: async (data) => {
    const response = await api.post('/volunteers/invite', data);
    return response.data;
  },

  completeVolunteer: async (id) => {
    const response = await api.post(`/volunteers/${id}/complete`);
    return response.data;
  },

  getVolunteerCount: async () => {
    const response = await api.get('/volunteers/count');
    return response.data;
  }
};
