import React, { useState } from 'react';
import Button from '../ui/Button';

const ProfileImage = ({ user, onImageUpdate, isLoading }) => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = () => {
        if (imageFile) {
            onImageUpdate(imageFile, () => {
                setImageFile(null);
                setImagePreview(null);
            });
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-8 border-b border-gray-200">
            <div className="relative shrink-0">
                {imagePreview || user?.profileImage ? (
                    <img
                        src={imagePreview || user.profileImage}
                        alt={user?.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center border-4 border-primary-100">
                        <span className="text-3xl font-bold text-[#FF6900]">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 mt-1 break-all">{user?.email}</p>
                <p className="text-sm text-[#FF6900] capitalize mt-1 border border-[#FF6900] rounded-full px-3 py-0.5 inline-block">
                    {user?.role}
                </p>
            </div>

            <div className="flex flex-col items-center sm:items-end space-y-2">
                <label className="cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#FF6900] text-white hover:bg-[#ff6a00d6] focus:ring-[#FF6900] h-10 px-4 py-2 text-sm w-full sm:w-auto text-center">
                    Change Photo
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>
                {imageFile && (
                    <Button
                        onClick={handleUpload}
                        isLoading={isLoading}
                        variant="primary"
                        className="w-full sm:w-auto"
                    >
                        Upload
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProfileImage;
