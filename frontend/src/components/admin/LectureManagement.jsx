import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import { getLectures, deleteLecture, toggleLectureStatus } from '../../services/lectureService';

const LectureManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLectures, setTotalLectures] = useState(0);

  useEffect(() => {
    fetchLectures();
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      const response = await getLectures(params);
      setLectures(response.data.data.lectures);
      setTotalPages(response.data.data.pagination.totalPages);
      setTotalLectures(response.data.data.pagination.totalLectures);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lectures');
      console.error('Error fetching lectures:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission to manage lectures
  if (!['admin', 'superadmin', 'developer'].includes(user?.role)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Lecture Management</h1>
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture? This action cannot be undone.')) {
      try {
        await deleteLecture(id);
        fetchLectures(); // Refresh the list
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lecture');
        console.error('Error deleting lecture:', err);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleLectureStatus(id);
      fetchLectures(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lecture status');
      console.error('Error updating lecture status:', err);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const categories = [
    'all', 'technology', 'education', 'health', 'business', 
    'science', 'arts', 'sports'
  ];

  if (loading && lectures.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Lecture Management</h1>
              <div className="flex space-x-3">
                <Link to="/admin/lectures/new" className="px-4 py-2 bg-white text-[#FF6900] rounded-lg hover:bg-gray-100 transition">
                  Add New Lecture
                </Link>
                <GoBackButton className="text-white" />
              </div>
            </div>
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white">Lecture Management</h1>
              <p className="text-white opacity-80 mt-1">
                Manage lectures ({totalLectures} total)
              </p>
            </div>
            <div className="flex space-x-3">
              <Link to="/admin/lectures/new" className="px-4 py-2 bg-white text-[#FF6900] rounded-lg hover:bg-gray-100 transition font-medium">
                Add New Lecture
              </Link>
              <GoBackButton className="text-white" />
            </div>
          </div>

          {error && (
            <div className="px-8 py-3 bg-red-50 border-b border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="p-8">
            {/* Filters */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search lectures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lectures Cards */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-200 animate-pulse rounded-xl h-64"></div>
                ))}
              </div>
            ) : lectures.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No lectures found</p>
                <button
                  onClick={() => navigate('/admin/lectures/new')}
                  className="mt-4 px-4 py-2 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition"
                >
                  Create Your First Lecture
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lectures.map((lecture) => (
                  <div key={lecture._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="relative">
                      <img
                        src={lecture.thumbnail}
                        alt={lecture.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'; // Default placeholder
                        }}
                      />
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        lecture.isActive 
                          ? (lecture.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800') 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {lecture.isActive ? (lecture.isPublic ? 'Public' : 'Private') : 'Inactive'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {lecture.title}
                      </h3>
                      {lecture.subtitle && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {lecture.subtitle}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>By {lecture.author?.name || 'Unknown'}</span>
                        <span>{lecture.views || 0} views</span>
                      </div>
                      {lecture.category && (
                        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-3">
                          {lecture.category}
                        </span>
                      )}
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/lectures/edit/${lecture._id}`}
                          className="flex-1 text-center px-3 py-2 bg-[#FF6900] text-white text-sm rounded-lg hover:bg-[#ff6a00d6]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(lecture._id)}
                          className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          {lecture.isActive ? 'Deact' : 'Act'}
                        </button>
                        <button
                          onClick={() => handleDelete(lecture._id)}
                          className="flex-1 text-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#FF6900] text-white hover:bg-[#ff6a00d6]'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-[#FF6900] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#FF6900] text-white hover:bg-[#ff6a00d6]'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureManagement;