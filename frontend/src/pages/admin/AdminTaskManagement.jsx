import React, { useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import GoBackButton from '../../components/shared/GoBackButton';
import VolunteerSelect from '../../components/admin/tasks/VolunteerSelect';
import TaskAssignForm from '../../components/admin/tasks/TaskAssignForm';
import VolunteerTaskList from '../../components/admin/tasks/VolunteerTaskList';

const AdminTaskManagement = () => {
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const showMsg = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
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
                    <div className="lg:col-span-1 space-y-6">
                        <VolunteerSelect
                            selectedVolunteerId={selectedVolunteer?._id}
                            onSelect={setSelectedVolunteer}
                        />

                        <TaskAssignForm
                            selectedVolunteer={selectedVolunteer}
                            onSuccess={() => showMsg('Task assigned successfully')}
                        />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <VolunteerTaskList selectedVolunteer={selectedVolunteer} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTaskManagement;
