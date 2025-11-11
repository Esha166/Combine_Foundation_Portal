import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import { createLecture, updateLecture, getLecture } from '../../services/lectureService';

const LectureForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    thumbnail: '',
    watchLink: '',
    description: '',
    category: '',
    tags: '',
    duration: '',
    isPublic: true
  });

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchLecture();
    }
  }, [id]);

  const fetchLecture = async () => {
    try {
      const response = await getLecture(id);
      const lecture = response.data.data;
      setFormData({
        title: lecture.title,
        subtitle: lecture.subtitle || '',
        thumbnail: lecture.thumbnail,
        watchLink: lecture.watchLink,
        description: lecture.description || '',
        category: lecture.category || '',
        tags: Array.isArray(lecture.tags) ? lecture.tags.join(', ') : lecture.tags || '',
        duration: lecture.duration || '',
        isPublic: lecture.isPublic
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lecture');
      console.error('Error fetching lecture:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      
      // Remove the existing thumbnail URL since we're uploading a new image
      setFormData(prev => ({
        ...prev,
        thumbnail: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create form data object to handle both file uploads and other fields
      const lectureData = new FormData();
      
      // Add all form fields
      lectureData.append('title', formData.title);
      lectureData.append('subtitle', formData.subtitle);
      lectureData.append('watchLink', formData.watchLink);
      lectureData.append('description', formData.description);
      lectureData.append('category', formData.category);
      lectureData.append('tags', formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(','));
      lectureData.append('duration', formData.duration);
      lectureData.append('isPublic', formData.isPublic);
      
      // Append thumbnail file if provided
      if (thumbnailFile) {
        lectureData.append('thumbnail', thumbnailFile);
      } else {
        // If no file is uploaded but we have a thumbnail URL, keep it
        if (formData.thumbnail) {
          lectureData.append('thumbnail', formData.thumbnail);
        }
      }

      if (isEdit) {
        await updateLecture(id, lectureData, true); // Pass isFormData flag
        navigate('/admin/lectures'); // You'll need to create this page
      } else {
        await createLecture(lectureData, true); // Pass isFormData flag
        navigate('/lectures');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lecture');
      console.error('Error saving lecture:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission to manage lectures
  if (!['admin', 'superadmin', 'developer'].includes(user?.role)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6">
              <h1 className="text-3xl font-bold text-white">Lecture Form</h1>
            </div>
            <div className="p-8 text-center">
              <div className="text-red-500 text-lg">
                You do not have permission to access this page.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              {isEdit ? 'Edit Lecture' : 'Create New Lecture'}
            </h1>
            <GoBackButton className="text-white" />
          </div>

          {error && (
            <div className="px-8 py-3 bg-red-50 border-b border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  placeholder="Enter lecture title"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  placeholder="Enter lecture subtitle (optional)"
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail *
                </label>
                <div className="flex flex-col space-y-4">
                  <input
                    type="file"
                    name="thumbnailFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Current thumbnail:</p>
                      <img 
                        src={formData.thumbnail} 
                        alt="Current thumbnail" 
                        className="mt-1 max-h-32 rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  {thumbnailPreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Preview:</p>
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="mt-1 max-h-32 rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Watch Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Watch Link *
                </label>
                <input
                  type="url"
                  name="watchLink"
                  value={formData.watchLink}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  placeholder="Enter watch link URL (YouTube, Vimeo, etc.)"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  placeholder="Enter lecture description (optional)"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  placeholder="Enter category (e.g., technology, education, health)"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  placeholder="Enter tags separated by commas (e.g., react, javascript, tutorial)"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  placeholder="Enter duration (e.g., 5:30 for 5 minutes 30 seconds)"
                />
              </div>

              {/* Is Public */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#FF6900] focus:ring-[#FF6900] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Make this lecture public
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Lecture' : 'Create Lecture'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureForm;