import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import Loader from './shared/Loader';
import { useAuth } from '../context/AuthContext';
import { useLectures } from '../hooks/useLectures';
import LectureHeader from './lectures/LectureHeader';
import LectureFilter from './lectures/LectureFilter';
import LectureList from './lectures/LectureList';
import LecturePagination from './lectures/LecturePagination';
import { useDebounce } from '../hooks/useDebounce';

const Lectures = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Construct params for useLectures hook
  const params = {
    page: currentPage,
    limit: 12,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(selectedCategory !== 'all' && { category: selectedCategory })
  };

  const { data, isLoading, error } = useLectures(params);

  const lectures = data?.data?.data?.lectures || [];
  const pagination = data?.data?.data?.pagination || { totalPages: 1, totalLectures: 0 };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    // Debounce handles the API call, but we might want to reset page on typing?
    // If we reset page here, it might be jarring if typing fast. 
    // But usually search results should start from page 1.
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const openLectureLink = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const canManageLectures = ['admin', 'superadmin', 'developer'].includes(user?.role);

  if (isLoading && lectures.length === 0) {
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

          <LectureHeader
            totalLectures={pagination.totalLectures}
            canManage={canManageLectures}
          />

          {error && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-200">
              <p className="text-red-700">{error.response?.data?.message || 'Failed to fetch lectures'}</p>
            </div>
          )}

          <div className="p-6">
            <LectureFilter
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onSearchSubmit={handleSearchSubmit}
            />

            <LectureList
              lectures={lectures}
              loading={isLoading}
              onOpenLink={openLectureLink}
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

export default Lectures;