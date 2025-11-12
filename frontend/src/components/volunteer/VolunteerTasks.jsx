import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import Loader from '../shared/Loader';

const VolunteerTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    completed: false
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null);
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

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const taskData = {
        ...newTask,
        createdAt: new Date().toISOString(),
        completed: false
      };

      const response = await taskService.createTask(taskData);
      const createdTask = response.data.data || response.data;
      
      setTasks([createdTask, ...tasks]);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        completed: false
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      setMessage('Failed to create task: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    try {
      const response = await taskService.updateTask(editingTask._id || editingTask.id, {
        ...editingTask,
        _id: undefined, // Remove _id from the payload to avoid issues
        id: undefined   // Remove id from the payload to avoid issues
      });
      const updatedTask = response.data.data || response.data;
      
      setTasks(tasks.map(task => 
        (task._id || task.id) === (editingTask._id || editingTask.id) ? updatedTask : task
      ));
      
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
      setMessage('Failed to update task: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

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
  
  const deleteTask = (taskId) => {
    setTaskToDelete(taskId);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await taskService.deleteTask(taskToDelete);
        setTasks(tasks.filter(task => (task._id || task.id) !== taskToDelete));
        setTaskToDelete(null);
      } catch (error) {
        console.error('Error deleting task:', error);
        setMessage('Failed to delete task: ' + (error.response?.data?.message || error.message));
        setMessageType('error');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 5000);
      }
    }
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
  };

  const editTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
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
              <h1 className="text-3xl font-bold text-[#FF6900]">My Tasks & Reminders</h1>
              <p className="text-gray-600 mt-2">Manage your volunteer tasks and set reminders</p>
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

        {/* Add Task Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingTask(null);
              setNewTask({
                title: '',
                description: '',
                dueDate: '',
                priority: 'medium',
                completed: false
              });
            }}
            className="px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Task
          </button>
        </div>

        {/* Task Form Modal */}
        <Transition show={showForm || editingTask}>
          <Dialog as="div" className="relative z-50" onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}>
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {editingTask ? 'Edit Task' : 'Create New Task'}
                      </Dialog.Title>
                      <button 
                        onClick={() => {
                          setShowForm(false);
                          setEditingTask(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="mt-2">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Title *
                          </label>
                          <input
                            type="text"
                            value={editingTask ? editingTask.title : newTask.title}
                            onChange={(e) => 
                              editingTask 
                                ? setEditingTask({...editingTask, title: e.target.value})
                                : setNewTask({...newTask, title: e.target.value})
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                            placeholder="Enter task title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={editingTask ? editingTask.description : newTask.description}
                            onChange={(e) => 
                              editingTask 
                                ? setEditingTask({...editingTask, description: e.target.value})
                                : setNewTask({...newTask, description: e.target.value})
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                            rows="3"
                            placeholder="Enter task description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={editingTask ? editingTask.dueDate : newTask.dueDate}
                            onChange={(e) => 
                              editingTask 
                                ? setEditingTask({...editingTask, dueDate: e.target.value})
                                : setNewTask({...newTask, dueDate: e.target.value})
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                          </label>
                          <select
                            value={editingTask ? editingTask.priority : newTask.priority}
                            onChange={(e) => 
                              editingTask 
                                ? setEditingTask({...editingTask, priority: e.target.value})
                                : setNewTask({...newTask, priority: e.target.value})
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            setEditingTask(null);
                          }}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6]"
                        >
                          {editingTask ? 'Update Task' : 'Create Task'}
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Delete Confirmation Modal */}
        <Transition show={!!taskToDelete}>
          <Dialog as="div" className="relative z-50" onClose={cancelDeleteTask}>
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Delete Task
                      </Dialog.Title>
                      <button 
                        onClick={cancelDeleteTask}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-gray-600">
                        Are you sure you want to delete this task? This action cannot be undone.
                      </p>
                    </div>

                    <div className="mt-6 flex space-x-4">
                      <button
                        type="button"
                        onClick={cancelDeleteTask}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmDeleteTask}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <svg className="w-16 h-16 text-[#FF6900] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-6">Create your first task to get started organizing your volunteer work</p>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingTask(null);
                setNewTask({
                  title: '',
                  description: '',
                  dueDate: '',
                  priority: 'medium',
                  completed: false
                });
              }}
              className="px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition"
            >
              Create Your First Task
            </button>
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
                      key={task.id} 
                      className={`bg-white rounded-xl shadow p-6 border-l-4 ${
                        task.priority === 'high' ? 'border-red-500' : 
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
                            <h3 className={`text-lg font-semibold ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-gray-600 mt-1">{task.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              {task.dueDate && (
                                <span className={`px-2 py-1 text-xs rounded border ${
                                  daysUntilDue < 0 ? 'bg-red-100 text-red-800 border-red-200' :
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
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded border border-gray-200">
                                {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editTask(task)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTask(task._id || task.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
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
                    key={task.id} 
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
                            {task.dueDate && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded border border-gray-300 line-through">
                                Due: {formatDueDate(task.dueDate)}
                              </span>
                            )}
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded border border-gray-300 line-through">
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded border border-gray-300">
                              Completed on {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editTask(task)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTask(task._id || task.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
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