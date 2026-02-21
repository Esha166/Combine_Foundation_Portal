import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import api from '../../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trustee/courses');
      setCourses(response.data.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCourseDetails = async (courseId) => {
    try {
      setDetailsLoading(true);
      setSelectedCourse({ _id: courseId });
      const response = await api.get(`/courses/${courseId}`);
      setSelectedCourse(response.data.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setSelectedCourse(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#FF6900]">Active Courses</h1>
              <p className="text-gray-600 mt-2">View all active courses in the system</p>
            </div>
            <GoBackButton />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {course.courseType || 'General'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description ? `${course.description.substring(0, 100)}...` : 'No description available'}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.duration || 'Duration not specified'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{course.category || 'Uncategorized'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : course.status === 'launched'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(course.status || 'pre-launch').replace('-', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => openCourseDetails(course._id)}
                    className="inline-flex items-center px-3 py-1.5 bg-[#FF6900] text-white text-xs font-medium rounded-md hover:bg-[#e65e00] transition-colors"
                  >
                    More
                  </button>
                </div>

                {course.status === 'completed' && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">
                      Total Participants: {course.totalParticipants || 0}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      Male Participants: {course.maleParticipants || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      Female Participants: {course.femaleParticipants || 0}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No active courses</h3>
            <p className="mt-1 text-gray-500">There are currently no active courses in the system.</p>
          </div>
        )}

        {selectedCourse && (
          <div className="fixed inset-0 bg-[#000000a1] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Course Details</h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>

              {detailsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6900] mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">ID: {selectedCourse._id}</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedCourse.title}</p>
                  {selectedCourse.subtitle && (
                    <p className="text-sm text-gray-700">{selectedCourse.subtitle}</p>
                  )}
                  <p className="text-sm text-gray-500">Status: {(selectedCourse.status || 'pre-launch').replace('-', ' ')}</p>
                  <p className="text-sm text-gray-500">Category: {selectedCourse.category || 'Uncategorized'}</p>
                  <p className="text-sm text-gray-500">Duration: {selectedCourse.duration || 'Not specified'}</p>
                  {selectedCourse.status === 'completed' && (
                    <>
                      <p className="text-sm text-gray-500">Total Participants: {selectedCourse.totalParticipants || 0}</p>
                      <p className="text-sm text-gray-500">Male Participants: {selectedCourse.maleParticipants || 0}</p>
                      <p className="text-sm text-gray-500">Female Participants: {selectedCourse.femaleParticipants || 0}</p>
                    </>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {selectedCourse.description || 'No description available'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
