import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Check if user has permission to access admin features
  if (!['admin', 'superadmin', 'developer'].includes(user?.role)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
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

  const adminCards = [
    {
      title: 'Courses',
      description: 'Manage training courses',
      count: 0, // This would come from an API
      icon: '📚',
      path: '/admin/courses',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Posts',
      description: 'Manage blog posts',
      count: 0, // This would come from an API
      icon: '📰',
      path: '/admin/posts',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Lectures',
      description: 'Manage lectures',
      count: 0, // This would come from an API
      icon: '🎥',
      path: '/admin/lectures',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Volunteers',
      description: 'Manage volunteers',
      count: 0, // This would come from an API
      icon: '👥',
      path: '/admin/volunteers',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Trustees',
      description: 'Manage trustees',
      count: 0, // This would come from an API
      icon: '👔',
      path: '/admin/trustees',
      color: 'from-red-500 to-red-600'
    }
  ];

  if (['superadmin', 'developer'].includes(user?.role)) {
    adminCards.push({
      title: 'Admins',
      description: 'Manage other admins',
      count: 0, // This would come from an API
      icon: '⚙️',
      path: '/admin/manage-admins',
      color: 'from-gray-500 to-gray-600'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white opacity-80 mt-1">
                Manage all aspects of the platform
              </p>
            </div>
            <GoBackButton className="text-white" />
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminCards.map((card, index) => (
                <Link
                  key={index}
                  to={card.path}
                  className="block group"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform group-hover:-translate-y-1 h-full">
                    <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">{card.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {card.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {card.description}
                          </p>
                        </div>
                      </div>
                      
                      {card.count > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-2xl font-bold text-[#FF6900]">
                            {card.count} {card.title.toLowerCase()}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <span className="text-[#FF6900] font-medium text-sm inline-flex items-center">
                          Manage {card.title.toLowerCase()}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;