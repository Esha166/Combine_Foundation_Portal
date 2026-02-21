import api from './api';

export const courseService = {
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourse: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (formData) => {
    const response = await api.post('/courses', formData);
    return response.data;
  },

  updateCourse: async (id, formData) => {
    const response = await api.put(`/courses/${id}`, formData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};
