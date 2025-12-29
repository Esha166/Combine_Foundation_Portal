import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import Loader from '../shared/Loader';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import VolunteerStats from './tasks/VolunteerStats';
import TaskCard from './tasks/TaskCard';
import TaskSubmissionModal from './tasks/TaskSubmissionModal';

const VolunteerTasks = () => {
  const { user } = useAuth();
  // If user is logged in, we fetch their tasks.
  // The useTasks hook has been updated to take { userId: user._id } if we want specific user tasks, 
  // OR the previous code used getTasks() without args which relied on backend user from token.
  // taskService.getTasks(userId) sends params { userId }.
  // If we want "my tasks", likely we don't send userId if backend uses token, 
  // OR we send user._id. Let's assume sending user._id is safer if useTasks supports it.

  // Wait, the hook I updated: taskService.getTasks(params?.userId).
  // If I pass { userId: user._id }, it calls getTasks(user._id).

  const { data: tasksData, isLoading, error } = useTasks(user ? { userId: user._id } : null);
  const tasks = tasksData?.data?.data || tasksData?.data || [];

  const [submissionModal, setSubmissionModal] = useState({ open: false, task: null });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const openSubmissionModal = (task) => {
    setSubmissionModal({ open: true, task });
  };

  const closeSubmissionModal = () => {
    setSubmissionModal({ open: false, task: null });
  };

  // Error handling effect
  useEffect(() => {
    if (error) {
      setMessage('Failed to load tasks');
      setMessageType('error');
      const timer = setTimeout(() => { setMessage(''); setMessageType(''); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

        {isLoading ? (
          <div className="flex justify-center my-12">
            <Loader size="large" />
          </div>
        ) : tasks.length > 0 ? (
          <>
            <VolunteerStats tasks={tasks} />
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id || task.id}
                  task={task}
                  onAction={openSubmissionModal}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <svg className="w-16 h-16 text-[#FF6900] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks assigned</h3>
            <p className="text-gray-600 mb-6">You have no pending tasks at the moment.</p>
          </div>
        )}

        <TaskSubmissionModal
          isOpen={submissionModal.open}
          task={submissionModal.task}
          onClose={closeSubmissionModal}
        />
      </div>
    </div>
  );
};

export default VolunteerTasks;