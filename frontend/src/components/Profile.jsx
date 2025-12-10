import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './layout/DashboardLayout';
import GoBackButton from './shared/GoBackButton';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    cnic: '',
    age: '',
    city: '',
    education: '',
    institute: '',
    socialMedia: '',
    skills: [],
    expertise: [],
    priorExperience: '',
    experienceDesc: '',
    availabilityDays: [],
    availabilityHours: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    if (user) {
      console.log('Loading user data into form:', user);
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        cnic: user.cnic || '',
        age: user.age || '',
        city: user.city || '',
        education: user.education || '',
        institute: user.institute || '',
        socialMedia: user.socialMedia || '',
        skills: Array.isArray(user.skills) ? user.skills : (user.skills ? user.skills.split(',') : []),
        expertise: Array.isArray(user.expertise) ? user.expertise : (user.expertise ? user.expertise.split(',') : []),
        priorExperience: user.priorExperience || '',
        experienceDesc: user.experienceDesc || '',
        availabilityDays: Array.isArray(user.availabilityDays) ? user.availabilityDays : (user.availabilityDays ? user.availabilityDays.split(',') : []),
        availabilityHours: user.availabilityHours || ''
      });
      console.log('Form data updated');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      setLoading(true);
      const response = await api.put('/user/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser({ profileImage: response.data.data.profileImage });
      setImageFile(null);
      setImagePreview(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log('Submitting profile update:', formData);
      const response = await api.put('/user/profile', formData);
      console.log('Profile update response:', response.data);

      // Extract the updated user data from response
      const updatedUserData = response.data.data;
      console.log('Updated user data:', updatedUserData);

      // Update the auth context with new data
      updateUser(updatedUserData);

      // Update local form state to match the saved data
      setFormData({
        name: updatedUserData.name || '',
        phone: updatedUserData.phone || '',
        gender: updatedUserData.gender || '',
        cnic: updatedUserData.cnic || '',
        age: updatedUserData.age || '',
        city: updatedUserData.city || '',
        education: updatedUserData.education || '',
        institute: updatedUserData.institute || '',
        socialMedia: updatedUserData.socialMedia || '',
        skills: Array.isArray(updatedUserData.skills) ? updatedUserData.skills : (updatedUserData.skills ? updatedUserData.skills.split(',') : []),
        expertise: Array.isArray(updatedUserData.expertise) ? updatedUserData.expertise : (updatedUserData.expertise ? updatedUserData.expertise.split(',') : []),
        priorExperience: updatedUserData.priorExperience || '',
        experienceDesc: updatedUserData.experienceDesc || '',
        availabilityDays: Array.isArray(updatedUserData.availabilityDays) ? updatedUserData.availabilityDays : (updatedUserData.availabilityDays ? updatedUserData.availabilityDays.split(',') : []),
        availabilityHours: updatedUserData.availabilityHours || ''
      });

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
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
            </div>
            <div className="flex space-x-3">
              <Link to="/id-card" className="px-4 py-2 bg-white text-[#FF6900] rounded-lg hover:bg-gray-100 transition whitespace-nowrap">
                View ID Card
              </Link>
              <GoBackButton className="text-white bg-transparent hover:bg-white/10" />
            </div>
          </div>

          {message && (
            <div className={`px-8 py-3 ${messageType === 'success' ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
              <p className={`text-sm ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Profile Image Section */}
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
                <p className="text-sm text-[#FF6900] capitalize mt-1 border border-[#FF6900] rounded-full px-3 py-0.5 inline-block">{user?.role}</p>
              </div>

              <div className="flex flex-col items-center sm:items-end space-y-2">
                <label className="cursor-pointer px-4 py-2 bg-[#FF6900] text-white rounded-lg hover:bg-primary-700 transition w-full sm:w-auto text-center">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imageFile && (
                  <button
                    onClick={handleImageUpload}
                    disabled={loading}
                    className="px-4 py-2 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition disabled:opacity-50 w-full sm:w-auto"
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>

            {/* Profile Details Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editing && !loading) {
                handleSubmit(e);
              }
            }}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fields... (Rest same as before but ensured responsive classes) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        placeholder={editing ? "Enter your full name" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[48px] flex items-center break-all">
                      {user?.email || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        placeholder={editing ? "Enter your phone number" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[48px] flex items-center capitalize">
                      {user?.role?.toUpperCase() || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <select
                        value={formData.gender || ''}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNIC
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <input
                        type="text"
                        value={formData.cnic || ''}
                        onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        placeholder={editing ? "Enter CNIC / B-Form" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <input
                        type="number"
                        min="13"
                        max="100"
                        value={formData.age || ''}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        placeholder={editing ? "Enter age" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        placeholder={editing ? "Enter city" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <input
                        type="text"
                        value={formData.education || ''}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        placeholder={editing ? "Enter education level" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institute
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <input
                        type="text"
                        value={formData.institute || ''}
                        onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        placeholder={editing ? "Enter institute name" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media Profile
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <input
                        type="text"
                        value={formData.socialMedia || ''}
                        onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        placeholder={editing ? "Enter social media profile link" : ""}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <textarea
                        value={formData.skills ? formData.skills.join(', ') : ''}
                        onChange={(e) => {
                          const skillsArray = e.target.value ? e.target.value.split(',').map(item => item.trim()) : [];
                          setFormData({ ...formData, skills: skillsArray });
                        }}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        rows="3"
                        placeholder={editing ? "Enter skills separated by commas" : ""}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expertise
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <textarea
                        value={formData.expertise ? formData.expertise.join(', ') : ''}
                        onChange={(e) => {
                          const expertiseArray = e.target.value ? e.target.value.split(',').map(item => item.trim()) : [];
                          setFormData({ ...formData, expertise: expertiseArray });
                        }}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        rows="3"
                        placeholder={editing ? "Enter expertise areas separated by commas" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prior Experience
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <select
                        value={formData.priorExperience || ''}
                        onChange={(e) => setFormData({ ...formData, priorExperience: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Details
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <input
                        type="text"
                        value={formData.experienceDesc || ''}
                        onChange={(e) => setFormData({ ...formData, experienceDesc: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        placeholder={editing ? "Briefly describe your experience" : ""}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Days
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <textarea
                        value={formData.availabilityDays ? formData.availabilityDays.join(', ') : ''}
                        onChange={(e) => {
                          const daysArray = e.target.value ? e.target.value.split(',').map(item => item.trim()) : [];
                          setFormData({ ...formData, availabilityDays: daysArray });
                        }}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                        rows="2"
                        placeholder={editing ? "Enter available days separated by commas (e.g., Monday, Tuesday)" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Hours
                    </label>
                    <div className={`${editing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                      <select
                        value={formData.availabilityHours || ''}
                        onChange={(e) => setFormData({ ...formData, availabilityHours: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editing
                          ? 'bg-white border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-gray-300 cursor-not-allowed'
                          }`}
                      >
                        <option value="">Select Hours</option>
                        <option value="2–4 hours per week">2–4 hours per week</option>
                        <option value="5–7 hours per week">5–7 hours per week</option>
                        <option value="8–10 hours per week">8–10 hours per week</option>
                        <option value="10+ hours per week">10+ hours per week</option>
                      </select>
                    </div>
                  </div>


                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                  {editing ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit(e);
                        }}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            // ... (This part requires the user object to complete correctly, but I'm replacing the whole block anyway)
                            name: user?.name || '',
                            phone: user?.phone || '',
                            gender: user?.gender || '',
                            cnic: user?.cnic || '',
                            age: user?.age || '',
                            city: user?.city || '',
                            education: user?.education || '',
                            institute: user?.institute || '',
                            socialMedia: user?.socialMedia || '',
                            skills: Array.isArray(user?.skills) ? user.skills : (user?.skills ? user.skills.split(',') : []),
                            expertise: Array.isArray(user?.expertise) ? user.expertise : (user?.expertise ? user.expertise.split(',') : []),
                            priorExperience: user?.priorExperience || '',
                            experienceDesc: user?.experienceDesc || '',
                            availabilityDays: Array.isArray(user?.availabilityDays) ? user.availabilityDays : (user?.availabilityDays ? user.availabilityDays.split(',') : []),
                            availabilityHours: user?.availabilityHours || ''
                          });
                          setEditing(false);
                          setMessage('');
                          setMessageType('');
                        }}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(true);
                        setMessage('');
                        setMessageType('');
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
