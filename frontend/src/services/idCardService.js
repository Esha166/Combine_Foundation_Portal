import api from '../services/api';

// ID Card API calls
export const getIdCard = () => {
  return api.get('/idcard');
};

export const generateIdCard = () => {
  return api.post('/idcard/generate');
};

export const updateIdCardValidity = (idCardId, data) => {
  return api.patch(`/idcard/${idCardId}`, data);
};