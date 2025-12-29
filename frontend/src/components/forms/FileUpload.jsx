import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const FileUpload = ({
    label,
    error,
    onChange,
    accept = "image/*",
    previewUrl = null,
    className = '',
    ...props
}) => {
    const [preview, setPreview] = useState(previewUrl);

    useEffect(() => {
        setPreview(previewUrl);
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create local preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Pass file to parent
            onChange(file);
        }
    };

    const clearFile = () => {
        setPreview(null);
        onChange(null);
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#FF6900] bg-gray-50'
                }`}>
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    {...props}
                />

                {preview ? (
                    <div className="relative z-20 flex justify-center">
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-48 rounded-lg object-contain"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    clearFile();
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-colors"
                                title="Remove file"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                        <Upload className="w-10 h-10 mb-2 text-gray-400" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF</p>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error.message || error}</p>
            )}
        </div>
    );
};

export default FileUpload;
