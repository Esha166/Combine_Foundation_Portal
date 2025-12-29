import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { categoryService } from '../../../services/categoryService';

const CategoryModal = ({ isOpen, onClose, onCategoryCreated }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setLoading(true);
            setError('');
            const response = await categoryService.createCategory({
                name: name.trim(),
                type: 'lecture'
            });

            onCategoryCreated(response.data.data);
            setName('');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Category">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <p className="text-sm text-gray-600 mb-4">Enter a name for the new lecture category</p>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Technology, Health, Education"
                        error={error}
                        autoFocus
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                    >
                        Create Category
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CategoryModal;
