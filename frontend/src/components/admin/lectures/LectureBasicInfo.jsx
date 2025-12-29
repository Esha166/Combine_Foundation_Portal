import React from 'react';
import FormField from '../../forms/FormField';

const LectureBasicInfo = ({ register, errors }) => {
    return (
        <div className="space-y-6">
            <FormField
                label="Title *"
                error={errors.title}
                registration={register('title', { required: 'Title is required' })}
                placeholder="Enter lecture title"
            />

            <FormField
                label="Subtitle"
                error={errors.subtitle}
                registration={register('subtitle')}
                placeholder="Enter lecture subtitle (optional)"
            />

            <FormField
                label="Description"
                textarea
                rows={4}
                error={errors.description}
                registration={register('description')}
                placeholder="Enter lecture description (optional)"
            />
        </div>
    );
};

export default LectureBasicInfo;
