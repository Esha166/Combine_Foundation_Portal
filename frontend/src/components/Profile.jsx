import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './layout/DashboardLayout';
import api from '../services/api';
import ProfileHeader from './profile/ProfileHeader';
import ProfileImage from './profile/ProfileImage';
import ProfileForm from './profile/ProfileForm';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleImageUpdate = async (file, onSuccess) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await api.put('/user/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser({ profileImage: response.data.data.profileImage });
      if (onSuccess) onSuccess();

      setMessage('Profile image updated successfully!');
      setMessageType('success');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to upload image');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (data) => {
    try {
      setLoading(true);
      console.log('Submitting profile update:', data);
      const response = await api.put('/user/profile', data);

      const updatedUserData = response.data.data;
      updateUser(updatedUserData);

      setEditing(false);
      setMessage('Profile updated successfully!');
      setMessageType('success');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(error.response?.data?.message || 'Failed to update profile');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ProfileHeader />

          {message && (
            <div className={`px-8 py-3 ${messageType === 'success' ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
              <p className={`text-sm ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
            </div>
          )}

          <div className="p-6 sm:p-8">
            <ProfileImage
              user={user}
              onImageUpdate={handleImageUpdate}
              isLoading={loading}
            />

            <ProfileForm
              user={user}
              onSubmit={handleProfileUpdate}
              isLoading={loading}
              isEditing={editing}
              onToggleEdit={() => {
                setEditing(true);
                setMessage('');
              }}
              onCancel={() => {
                setEditing(false);
                setMessage('');
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
