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

  const [submissionModal, setSubmissionModal] = useState({ open: false, taskId: null, title: '' });
  const [submissionText, setSubmissionText] = useState('');

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

  const openSubmissionModal = (task) => {
    setSubmissionModal({ open: true, taskId: task._id || task.id, title: task.title });
    setSubmissionText('');
  };

  const closeSubmissionModal = () => {
    setSubmissionModal({ open: false, taskId: null, title: '' });
    setSubmissionText('');
  };

  const handleSubmitTask = async () => {
    if (!submissionText.trim()) {
      alert("Please enter submission details.");
      return;
    }

    try {
      const response = await taskService.submitTask(submissionModal.taskId, submissionText);
      const updatedTask = response.data.data || response.data;

      setTasks(tasks.map(task =>
        (task._id || task.id) === submissionModal.taskId ? updatedTask : task
      ));
      setMessage('Task submitted for review');
      setMessageType('success');

      closeSubmissionModal();

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      console.error('Error submitting task:', error);
      setMessage('Failed to submit task: ' + (error.response?.data?.message || error.message));
      setMessageType('error');

      closeSubmissionModal();

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
              <p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-orange-500">{tasks.filter(t => t.status === 'pending').length}</p>
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
            {tasks.map((task) => {
              const daysUntilDue = getDaysUntilDue(task.dueDate);
              // If status isn't set, fallback to completed boolean logic (migration handling)
              const status = task.status || (task.completed ? 'completed' : 'pending');

              return (
                <div
                  key={task._id || task.id}
                  className={`bg-white rounded-xl shadow p-6 border-l-4 ${status === 'completed' ? 'border-green-500 opacity-75' :
                    status === 'submitted' ? 'border-blue-500' :
                      task.priority === 'high' ? 'border-red-500' :
                        task.priority === 'medium' ? 'border-yellow-500' :
                          'border-green-500'
                    }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-semibold ${status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                          {task.title}
                        </h3>
                        {status === 'submitted' && (
                          <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 border border-blue-200 font-medium">
                            Pending Review
                          </span>
                        )}
                        {status === 'completed' && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 border border-green-200 font-bold">
                            COMPLETED
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className={`mt-1 ${status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-600'}`}>{task.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {task.dueDate && status !== 'completed' && (
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
                        {status === 'completed' && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded border border-gray-300">
                            Completed on {new Date(task.updatedAt || Date.now()).toLocaleDateString()}
                          </span>
                        )}
                        {task.submissionDetails && (status === 'completed' || status === 'submitted') && (
                          <div className="mt-2 text-xs text-gray-600 italic bg-gray-50 p-2 rounded">
                            <strong>Submission Note:</strong> {task.submissionDetails}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {status === 'pending' ? (
                        <button
                          onClick={() => openSubmissionModal(task)}
                          className="w-full sm:w-auto px-4 py-2 bg-white border border-[#FF6900] text-[#FF6900] text-sm font-medium rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6900] transition-colors"
                        >
                          Submit Task
                        </button>
                      ) : status === 'submitted' ? (
                        <button
                          disabled
                          className="w-full sm:w-auto px-4 py-2 bg-gray-100 border border-gray-300 text-gray-400 text-sm font-medium rounded-md cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Under Review
                        </button>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submission Modal */}
        {submissionModal.open && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Task: {submissionModal.title}</h3>
              <p className="text-sm text-gray-600 mb-4">Please provide details about the work you have completed (required).</p>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 h-32 focus:ring-[#FF6900] focus:border-[#FF6900] mb-4"
                placeholder="Enter submission details here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeSubmissionModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTask}
                  className="px-4 py-2 bg-[#FF6900] text-white rounded hover:bg-[#e65e00]"
                >
                  Submit Result
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerTasks;