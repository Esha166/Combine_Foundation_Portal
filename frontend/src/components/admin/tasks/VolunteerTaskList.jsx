import React from 'react';
import { useUserTasks, useApproveTask, useRejectTask, useDeleteTask } from '../../../hooks/useTasks';
import Loader from '../../shared/Loader';
import Button from '../../ui/Button';

const VolunteerTaskList = ({ selectedVolunteer }) => {
    const { data: tasksData, isLoading, error } = useUserTasks(selectedVolunteer?._id);
    const approveTaskMutation = useApproveTask();
    const rejectTaskMutation = useRejectTask();
    const deleteTaskMutation = useDeleteTask();

    const tasks = tasksData?.data || [];

    const handleApprove = (id) => approveTaskMutation.mutate(id);
    const handleReject = (id) => {
        if (window.confirm("Are you sure you want to reject this task?")) {
            rejectTaskMutation.mutate({ id });
        }
    };
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTaskMutation.mutate(id);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (!selectedVolunteer) {
        return (
            <div className="bg-white rounded-xl shadow p-6 min-h-[500px] flex items-center justify-center text-center">
                <p className="text-gray-500">Please select a volunteer from the list to view and assign tasks.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-6 min-h-[500px]">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tasks for {selectedVolunteer.name}
            </h2>

            {isLoading ? (
                <Loader />
            ) : tasks.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <p>No tasks assigned to this volunteer yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => {
                        const status = task.status || (task.completed ? 'completed' : 'pending');
                        return (
                            <div key={task._id} className={`p-4 rounded-lg border border-l-4 ${status === 'completed' ? 'bg-green-50 border-green-500' : status === 'submitted' ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className={`font-semibold ${status === 'completed' ? 'text-green-800 line-through' : 'text-gray-900'}`}>{task.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            {status === 'completed' && <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-0.5 rounded">COMPLETED</span>}
                                            {status === 'submitted' && <span className="text-blue-600 text-xs font-bold bg-blue-100 px-2 py-0.5 rounded">PENDING REVIEW</span>}
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                        <div className="mt-2 text-xs text-gray-500 flex gap-4 flex-wrap">
                                            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                            {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                            {task.assignedBy && <span>Assigned By: {task.assignedBy.name || 'Admin'}</span>}
                                        </div>

                                        {task.submissionDetails && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700">
                                                <span className="font-semibold block text-gray-900 mb-1">Submission Notes:</span>
                                                {task.submissionDetails}
                                            </div>
                                        )}

                                        {status === 'submitted' && (
                                            <div className="mt-3 flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 py-1 px-3 text-xs"
                                                    onClick={() => handleApprove(task._id)}
                                                    isLoading={approveTaskMutation.isPending && approveTaskMutation.variables === task._id}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-yellow-500 hover:bg-yellow-600 py-1 px-3 text-xs"
                                                    onClick={() => handleReject(task._id)}
                                                    isLoading={rejectTaskMutation.isPending && rejectTaskMutation.variables?.id === task._id}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Delete Task"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </div>
    );
};

export default VolunteerTaskList;
