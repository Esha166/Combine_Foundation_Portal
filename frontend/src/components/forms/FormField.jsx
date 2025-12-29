import React from 'react';
import Input from '../ui/Input';

const FormField = ({
    label,
    error,
    type = 'text',
    className = '',
    textarea = false,
    rows = 3,
    registration,
    ...props
}) => {
    if (textarea) {
        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <textarea
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent transition-colors ${error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        } disabled:bg-gray-50 disabled:text-gray-500`}
                    rows={rows}
                    {...registration}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error.message}</p>
                )}
            </div>
        );
    }

    return (
        <Input
            label={label}
            type={type}
            error={error?.message}
            className={className}
            {...registration}
            {...props}
        />
    );
};

export default FormField;
