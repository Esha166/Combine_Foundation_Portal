import React from 'react';
import { Controller } from 'react-hook-form';
import FormField from '../../forms/FormField';
import FileUpload from '../../forms/FileUpload';

const LectureMedia = ({ register, errors, control, thumbnailPreview }) => {
    return (
        <div className="space-y-6">
            <div>
                <Controller
                    name="thumbnail"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FileUpload
                            label="Thumbnail *"
                            error={error}
                            onChange={onChange}
                            previewUrl={typeof value === 'string' ? value : thumbnailPreview}
                        />
                    )}
                />
            </div>

            <FormField
                label="Watch Link *"
                type="url"
                error={errors.watchLink}
                registration={register('watchLink', {
                    required: 'Watch link is required',
                    pattern: {
                        value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/,
                        message: 'Please enter a valid YouTube or Vimeo URL'
                    }
                })}
                placeholder="Enter watch link URL (YouTube, Vimeo, etc.)"
            />
        </div>
    );
};

export default LectureMedia;
