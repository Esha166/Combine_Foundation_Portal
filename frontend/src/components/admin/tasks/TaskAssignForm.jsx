import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateTask } from '../../../hooks/useTasks';
import FormField from '../../forms/FormField';
import FormSelect from '../../forms/FormSelect';
import Button from '../../ui/Button';

const TaskAssignForm = ({ selectedVolunteer, onSuccess }) => {
    const createTaskMutation = useCreateTask();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium'
        }
    });

    const onSubmit = async (data) => {
        if (!selectedVolunteer) return;

        try {
            await createTaskMutation.mutateAsync({
                ...data,
                assignedTo: selectedVolunteer._id
            });
            reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Assign Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    label="Title"
                    error={errors.title}
                    registration={register('title', { required: 'Title is required' })}
                    placeholder="Task title"
                    disabled={!selectedVolunteer}
                />

                <FormField
                    label="Description"
                    textarea
                    rows={3}
                    error={errors.description}
                    registration={register('description')}
                    placeholder="Task description"
                    disabled={!selectedVolunteer}
                />

                <FormField
                    label="Due Date"
                    type="datetime-local"
                    error={errors.dueDate}
                    registration={register('dueDate')}
                    disabled={!selectedVolunteer}
                />

                <FormSelect
                    label="Priority"
                    error={errors.priority}
                    registration={register('priority')}
                    options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' }
                    ]}
                    disabled={!selectedVolunteer}
                />

                <Button
                    type="submit"
                    disabled={!selectedVolunteer}
                    isLoading={createTaskMutation.isPending}
                    className="w-full"
                >
                    Assign Task
                </Button>
            </form>
        </div>
    );
};

export default TaskAssignForm;
