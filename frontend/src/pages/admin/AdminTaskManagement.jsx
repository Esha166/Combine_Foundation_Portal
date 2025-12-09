import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { taskService } from '../../services/taskService';
import Navbar from '../../components/shared/Navbar';
import GoBackButton from '../../components/shared/GoBackButton';
import Loader from '../../components/shared/Loader';

const AdminTaskManagement = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [volunteerTasks, setVolunteerTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // New task form state
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
    });

    useEffect(() => {
        fetchVolunteers();
    }, []);

    useEffect(() => {
        if (selectedVolunteer) {
            fetchVolunteerTasks(selectedVolunteer._id);
        } else {
            setVolunteerTasks([]);
        }
    }, [selectedVolunteer]);

    const fetchVolunteers = async () => {
        try {
            // Fetch 'approved' volunteers usually, or all non-admin users? 
            // Assuming 'approved' status is what we want for assigning tasks
            const data = await volunteerService.getAllVolunteers('approved');
            setVolunteers(data.data || data); // Adjust based on API structure
        } catch (error) {
            console.error('Error fetching volunteers:', error);
            showMsg('Failed to fetch volunteers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchVolunteerTasks = async (userId) => {
        try {
            setTasksLoading(true);
            const response = await taskService.getTasks(userId);
            setVolunteerTasks(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showMsg('Failed to fetch tasks', 'error');
        } finally {
            setTasksLoading(false);
        }
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        if (!selectedVolunteer) return;
        if (!newTask.title.trim()) return;

        try {
            await taskService.createTask({
                ...newTask,
                assignedTo: selectedVolunteer._id
            });

            showMsg('Task assigned successfully', 'success');
            setNewTask({
                title: '',
                description: '',
                dueDate: '',
                priority: 'medium',
            });
            // Refresh tasks
            fetchVolunteerTasks(selectedVolunteer._id);
        } catch (error) {
            console.error('Error assigning task:', error);
            showMsg('Failed to assign task: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await taskService.deleteTask(taskId);
            showMsg('Task deleted', 'success');
            // Refresh
            if (selectedVolunteer) {
                fetchVolunteerTasks(selectedVolunteer._id);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            showMsg('Failed to delete task', 'error');
        }
    };

    const showMsg = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Task Assignment</h1>
                        <p className="mt-2 text-gray-600">Assign and manage tasks for volunteers</p>
                    </div>
                    <GoBackButton />
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Volunteer Selection & Create Task Form */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Select Volunteer */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Select Volunteer</h2>
                            {loading ? (
                                <Loader />
                            ) : (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Choose a volunteer</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FF6900] focus:border-[#FF6900]"
                                        onChange={(e) => {
                                            const vol = volunteers.find(v => v._id === e.target.value);
                                            setSelectedVolunteer(vol);
                                        }}
                                        value={selectedVolunteer?._id || ''}
                                    >
                                        <option value="">-- Select Volunteer --</option>
                                        {volunteers.map(vol => (
                                            <option key={vol._id} value={vol._id}>
                                                {vol.name} ({vol.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Create Task Form */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Assign Task</h2>
                            <form onSubmit={handleAssignTask}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FF6900] focus:border-[#FF6900]"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            disabled={!selectedVolunteer}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FF6900] focus:border-[#FF6900]"
                                            rows="3"
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            disabled={!selectedVolunteer}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                        <input
                                            type="datetime-local"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FF6900] focus:border-[#FF6900]"
                                            value={newTask.dueDate}
                                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                            disabled={!selectedVolunteer}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                        <select
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FF6900] focus:border-[#FF6900]"
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                            disabled={!selectedVolunteer}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!selectedVolunteer}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6900] hover:bg-[#e65e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6900] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Assign Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Task List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow p-6 min-h-[500px]">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                {selectedVolunteer ? `Tasks for ${selectedVolunteer.name}` : 'Select a volunteer to view tasks'}
                            </h2>

                            {tasksLoading ? (
                                <Loader />
                            ) : !selectedVolunteer ? (
                                <div className="text-center text-gray-500 py-12">
                                    <p>Please select a volunteer from the list to view and assign tasks.</p>
                                </div>
                            ) : volunteerTasks.length === 0 ? (
                                <div className="text-center text-gray-500 py-12">
                                    <p>No tasks assigned to this volunteer yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {volunteerTasks.map(task => (
                                        <div key={task._id} className={`p-4 rounded-lg border border-l-4 ${task.completed ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className={`font-semibold ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>{task.title}</h3>
                                                        <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                        {task.completed && <span className="text-green-600 text-xs font-bold">COMPLETED</span>}
                                                    </div>
                                                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                                    <div className="mt-2 text-xs text-gray-500 flex gap-4">
                                                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                                        {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                                        {task.assignedBy && <span>Assigned By: {task.assignedBy.name || 'Admin'}</span>}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteTask(task._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Delete Task"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminTaskManagement;
