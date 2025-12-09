import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import Loader from '../shared/Loader';

const VolunteerTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Load tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskService.getTasks();
        setTasks(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setMessage('Failed to load tasks');
        setMessageType('error');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId || t.id === taskId);
      const response = await taskService.toggleTaskCompletion(taskId, !task.completed);
      const updatedTask = response.data.data || response.data;

      setTasks(tasks.map(task =>
        (task._id || task.id) === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task completion:', error);
      setMessage('Failed to update task: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTasksByStatus = (completed) => {
    return tasks.filter(task => task.completed === completed);
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#FF6900]">My Tasks</h1>
              <p className="text-gray-600 mt-2">View tasks assigned to you by administrators</p>
            </div>
            <GoBackButton />
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
          </div>
        )}

        {/* Stats Summary */}
        {loading ? (
          <div className="flex justify-center my-12">
            <Loader size="large" />
          </div>
        ) : tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Tasks</h3>
              <p className="text-3xl font-bold text-[#FF6900]">{tasks.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{getTasksByStatus(true).length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-orange-500">{getTasksByStatus(false).length}</p>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <svg className="w-16 h-16 text-[#FF6900] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks assigned</h3>
            <p className="text-gray-600 mb-6">You have no pending tasks at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pending Tasks */}
            {getTasksByStatus(false).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Tasks</h2>
                {getTasksByStatus(false).map((task) => {
                  const daysUntilDue = getDaysUntilDue(task.dueDate);
                  return (
                    <div
                      key={task._id || task.id}
                      className={`bg-white rounded-xl shadow p-6 border-l-4 ${task.priority === 'high' ? 'border-red-500' :
                          task.priority === 'medium' ? 'border-yellow-500' :
                            'border-green-500'
                        }`}
                    >
                      <div className="flex items-start justify-between ">
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task._id || task.id)}
                            className="mt-1 h-5 w-5 text-[#FF6900] rounded focus:ring-[#FF6900]"
                          />
                          <div>
                            <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-gray-600 mt-1">{task.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              {task.dueDate && (
                                <span className={`px-2 py-1 text-xs rounded border ${daysUntilDue < 0 ? 'bg-red-100 text-red-800 border-red-200' :
                                    daysUntilDue <= 1 ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                      'bg-blue-100 text-blue-800 border-blue-200'
                                  }`}>
                                  Due: {formatDueDate(task.dueDate)}
                                  {daysUntilDue !== null && daysUntilDue <= 1 && daysUntilDue >= 0 && (
                                    <span className="ml-1">(in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''})</span>
                                  )}
                                  {daysUntilDue < 0 && (
                                    <span className="ml-1">(overdue)</span>
                                  )}
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs rounded border ${getPriorityClass(task.priority)}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </span>
                              {task.assignedBy && (
                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded border border-purple-200">
                                  Assigned by: {task.assignedBy.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Completed Tasks */}
            {getTasksByStatus(true).length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  Completed Tasks
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {getTasksByStatus(true).length}
                  </span>
                </h2>
                {getTasksByStatus(true).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="bg-white rounded-xl shadow p-6 opacity-75"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task._id || task.id)}
                          className="mt-1 h-5 w-5 text-[#FF6900] rounded focus:ring-[#FF6900]"
                        />
                        <div>
                          <h3 className="text-lg font-semibold line-through text-gray-500">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-gray-500 mt-1 line-through">{task.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded border border-gray-300">
                              Completed on {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerTasks;