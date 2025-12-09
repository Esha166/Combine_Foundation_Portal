import api from './api';

export const taskService = {
  // Get tasks for the current user
  // Get tasks for the current user (or filtered by userId for admins)
  getTasks: async (userId) => {
    const params = userId ? { userId } : {};
    const response = await api.get('/tasks', { params });
    return response;
  },

  // Create a new task for the current user
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response;
  },

  // Update an existing task
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response;
  },

  // Delete a task
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response;
  },

  // Toggle task completion status
  toggleTaskCompletion: async (taskId, completed) => {
    const response = await api.patch(`/tasks/${taskId}/toggle`, { completed });
    return response;
  }
};