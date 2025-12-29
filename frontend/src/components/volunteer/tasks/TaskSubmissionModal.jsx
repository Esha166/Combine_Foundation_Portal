import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import FormField from '../../forms/FormField';
import { useSubmitTask } from '../../../hooks/useTasks';

const TaskSubmissionModal = ({ isOpen, onClose, task }) => {
    const submitTaskMutation = useSubmitTask();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (isOpen) {
            reset({ description: '' });
        }
    }, [isOpen, reset]);

    const onSubmit = async (data) => {
        if (!task) return;
        try {
            await submitTaskMutation.mutateAsync({ id: task._id || task.id, data: data.description });
            onClose();
        } catch (error) {
            console.error("Failed to submit task:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Submit Task: ${task?.title || ''}`}
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <p className="text-sm text-gray-600">Please provide details about the work you have completed (required).</p>

                <FormField
                    textarea
                    rows={5}
                    placeholder="Enter submission details here..."
                    error={errors.description}
                    registration={register('description', { required: 'Submission details are required' })}
                />

                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={submitTaskMutation.isPending}
                    >
                        Submit Result
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TaskSubmissionModal;
