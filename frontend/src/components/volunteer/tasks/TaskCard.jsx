import React from 'react';
import { format } from 'date-fns';
import Button from '../../ui/Button';

const TaskCard = ({ task, onAction }) => {
    const daysUntilDue = task.dueDate ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
    const status = task.status || (task.completed ? 'completed' : 'pending');

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'PP p') : '';

    return (
        <div className={`bg-white rounded-xl shadow p-6 border-l-4 ${status === 'completed' ? 'border-green-500 opacity-75' :
                status === 'submitted' ? 'border-blue-500' :
                    task.priority === 'high' ? 'border-red-500' :
                        task.priority === 'medium' ? 'border-yellow-500' :
                            'border-green-500'
            }`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-semibold ${status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
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
                                Due: {formattedDueDate}
                                {daysUntilDue !== null && daysUntilDue <= 1 && daysUntilDue >= 0 && (
                                    <span className="ml-1">(in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''})</span>
                                )}
                                {daysUntilDue < 0 && <span className="ml-1">(overdue)</span>}
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
                                Completed on {format(new Date(task.updatedAt || Date.now()), 'PP')}
                            </span>
                        )}

                        {task.submissionDetails && (status === 'completed' || status === 'submitted') && (
                            <div className="mt-2 text-xs text-gray-600 italic bg-gray-50 p-2 rounded w-full sm:w-auto">
                                <strong>Submission Note:</strong> {task.submissionDetails}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0">
                    {status === 'pending' ? (
                        <Button
                            variant="outline"
                            onClick={() => onAction(task)}
                            className="w-full sm:w-auto text-[#FF6900] border-[#FF6900] hover:bg-orange-50"
                        >
                            Submit Task
                        </Button>
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
};

export default TaskCard;
