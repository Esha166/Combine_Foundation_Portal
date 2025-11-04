import api from './api';

export const trusteeService = {
  addTrustee: async (data) => {
    const response = await api.post('/trustee', data);
    return response.data;
  },

  getTrustees: async () => {
    const response = await api.get('/trustee');
    return response.data;
  },

  deleteTrustee: async (id) => {
    const response = await api.delete(`/trustee/${id}`);
    return response.data;
  }
};