import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatsWidget from '../dashboard/StatsWidget';
import RecentActivityWidget from '../dashboard/RecentActivityWidget';
import api from '../../services/api';
import { getLectures } from '../../services/lectureService';
import { courseService } from '../../services/courseService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    posts: 0,
    lectures: 0,
    volunteers: 0,
    trustees: 0,
    admins: 0
  });
  const [recentData, setRecentData] = useState({
    courses: [],
    lectures: [],
    volunteers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // In a real app, you might have a dedicated dashboard stats endpoint
        // For now, we'll fetch what we can or mock the counts if endpoints aren't ready
        
        // Fetch recent items for "glimpses"
        const [coursesRes, lecturesRes, volunteersRes] = await Promise.allSettled([
          courseService.getAllCourses(),
          getLectures({ limit: 5 }),
          api.get('/admin/volunteers?limit=5') // Assuming this endpoint exists or similar
        ]);

        const newRecentData = {
          courses: [],
          lectures: [],
          volunteers: []
        };

        if (coursesRes.status === 'fulfilled') {
          const courses = coursesRes.value.data || [];
          newRecentData.courses = courses.slice(0, 5);
          setStats(prev => ({ ...prev, courses: courses.length }));
        }

        if (lecturesRes.status === 'fulfilled') {
          const lectures = lecturesRes.value.data.data?.lectures || lecturesRes.value.data || [];
          newRecentData.lectures = lectures.slice(0, 5);
          setStats(prev => ({ ...prev, lectures: lectures.length }));
        }

        // Mocking other stats if endpoints fail or don't return counts directly
        // In a production app, you'd want a specific /admin/stats endpoint
        
        setRecentData(newRecentData);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAdminData();
    }
  }, [user]);

  // Check if user has permission to access admin features
  if (!['admin', 'superadmin', 'developer'].includes(user?.role)) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-lg">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  const adminCards = [
    {
      title: 'Courses',
      description: 'Manage training courses',
      count: stats.courses,
      icon: '📚',
      path: '/admin/courses',
      color: 'blue'
    },
    {
      title: 'Posts',
      description: 'Manage blog posts',
      count: stats.posts,
      icon: '📰',
      path: '/admin/posts',
      color: 'green'
    },
    {
      title: 'Lectures',
      description: 'Manage lectures',
      count: stats.lectures,
      icon: '🎥',
      path: '/admin/lectures',
      color: 'purple'
    },
    {
      title: 'Volunteers',
      description: 'Manage volunteers',
      count: stats.volunteers,
      icon: '👥',
      path: '/admin/volunteers',
      color: 'orange'
    },
    {
      title: 'Trustees',
      description: 'Manage trustees',
      count: stats.trustees,
      icon: '👔',
      path: '/admin/trustees',
      color: 'red'
    }
  ];

  if (['superadmin', 'developer'].includes(user?.role)) {
    adminCards.push({
      title: 'Admins',
      description: 'Manage other admins',
      count: stats.admins,
      icon: '⚙️',
      path: '/admin/manage-admins',
      color: 'yellow'
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage all aspects of the platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminCards.map((card, index) => (
          <Link
            key={index}
            to={card.path}
            className="block group"
          >
            <StatsWidget
              title={card.title}
              value={card.count > 0 ? card.count : 'Manage'}
              icon={<span className="text-2xl">{card.icon}</span>}
              color={card.color}
              trendLabel={card.description}
            />
          </Link>
        ))}
      </div>

      {/* Glimpses / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityWidget
          title="Recent Courses"
          viewAllLink="/admin/courses"
          items={recentData.courses.map(course => ({
            title: course.title,
            description: `Instructor: ${course.instructor || 'N/A'}`,
            timestamp: course.createdAt ? new Date(course.createdAt).toLocaleDateString() : null,
            icon: (
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )
          }))}
          emptyMessage="No courses found."
        />

        <RecentActivityWidget
          title="Recent Lectures"
          viewAllLink="/admin/lectures"
          items={recentData.lectures.map(lecture => ({
            title: lecture.title,
            description: `Author: ${lecture.author?.name || 'Unknown'}`,
            timestamp: lecture.createdAt ? new Date(lecture.createdAt).toLocaleDateString() : null,
            icon: (
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )
          }))}
          emptyMessage="No lectures found."
        />
      </div>
    </div>
  );
};

export default AdminDashboard;