import api from '../services/api';

// Lectures API service
export const getLectures = (params = {}) => {
  return api.get('/lectures', { params });
};

export const getLecture = (id) => {
  return api.get(`/lectures/${id}`);
};

export const createLecture = (data, isFormData = false) => {
  const config = isFormData ? { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  } : {};
  return api.post('/lectures', data, config);
};

export const updateLecture = (id, data, isFormData = false) => {
  const config = isFormData ? { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  } : {};
  return api.put(`/lectures/${id}`, data, config);
};

export const deleteLecture = (id) => {
  return api.delete(`/lectures/${id}`);
};

export const toggleLectureStatus = (id) => {
  return api.patch(`/lectures/${id}/toggle-status`);
};

export const getLecturesByAuthor = (authorId, params = {}) => {
  return api.get(`/lectures/author/${authorId}`, { params });
};

export const getLecturesByCategory = (category, params = {}) => {
  return api.get(`/lectures/category/${category}`, { params });
};