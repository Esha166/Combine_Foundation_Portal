import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from './shared/Navbar';
import GoBackButton from './shared/GoBackButton';
import { getLectures, getLecturesByCategory } from '../services/lectureService';

const Lectures = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLectures, setTotalLectures] = useState(0);

  const categories = [
    'all',
    'technology',
    'education',
    'health',
    'business',
    'science',
    'arts',
    'sports'
  ];

  useEffect(() => {
    fetchLectures();
  }, [selectedCategory, searchTerm, currentPage]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      const params = {
        page: currentPage,
        limit: 12
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      if (selectedCategory !== 'all' && !searchTerm) {
        response = await getLecturesByCategory(selectedCategory, { ...params, page: currentPage });
      } else {
        response = await getLectures(params);
      }
      
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const canManageLectures = ['admin', 'superadmin', 'developer'].includes(user?.role);

  const openLectureLink = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (loading && lectures.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-6 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Lectures</h1>
              <GoBackButton className="text-white" />
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
          <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-white">Lectures</h1>
              <p className="text-white opacity-80 mt-1">
                {totalLectures} {totalLectures === 1 ? 'Lecture' : 'Lectures'} available
              </p>
            </div>
            <div className="flex space-x-3">
              {canManageLectures && (
                <button className="px-4 py-2 bg-white text-[#FF6900] rounded-lg hover:bg-gray-100 transition">
                  <a href="/admin/lectures" className="font-medium">
                    Add New Lecture
                  </a>
                </button>
              )}
              <GoBackButton className="text-white" />
            </div>
          </div>

          {error && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="p-6">
            {/* Filters */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search lectures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition"
                >
                  Search
                </button>
              </form>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedCategory === category
                        ? 'bg-[#FF6900] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Lectures Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-200 animate-pulse rounded-xl h-64"></div>
                ))}
              </div>
            ) : lectures.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No lectures found</p>
                {selectedCategory !== 'all' && (
                  <p className="text-gray-400 mt-2">Try selecting a different category</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      {!lecture.isPublic && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Private
                        </div>
                      )}
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
                      <button
                        onClick={() => openLectureLink(lecture.watchLink)}
                        className="w-full bg-[#FF6900] text-white py-2 rounded-lg hover:bg-[#ff6a00d6] transition font-medium"
                      >
                        Watch Now
                      </button>
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

export default Lectures;