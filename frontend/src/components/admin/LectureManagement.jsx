import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import Loader from '../shared/Loader';
import { useLectures, useDeleteLecture, useToggleLectureStatus } from '../../hooks/useLectures';
import { useDebounce } from '../../hooks/useDebounce';
import LectureManagementList from './lectures/LectureManagementList';
import LecturePagination from '../lectures/LecturePagination';
import LectureFilter from '../lectures/LectureFilter';

const LectureManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [error, setError] = useState(null);

  // Queries and Mutations
  const params = {
    page: currentPage,
    limit: 10,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(selectedCategory !== 'all' && { category: selectedCategory })
  };

  const { data, isLoading: loading, error: queryError } = useLectures(params);
  const lectures = data?.data?.data?.lectures || [];
  const pagination = data?.data?.data?.pagination || { totalPages: 1, totalLectures: 0 };

  const deleteMutation = useDeleteLecture();
  const toggleStatusMutation = useToggleLectureStatus();

  useEffect(() => {
    if (queryError) {
      setError(queryError.response?.data?.message || 'Failed to fetch lectures');
    }
  }, [queryError]);

  // Handlers
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lecture');
      }
    }
  };

  const handleToggleStatus = async (lecture) => {
    try {
      await toggleStatusMutation.mutateAsync(lecture._id || lecture.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lecture status');
    }
  };

  // Permission Check
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

  if (loading && lectures.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 flex justify-center">
            <Loader size="large" />
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
                Manage lectures ({pagination.totalLectures} total)
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
            <LectureFilter
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onSearchSubmit={handleSearchSubmit}
            />

            <LectureManagementList
              lectures={lectures}
              loading={loading}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />

            <LecturePagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureManagement;