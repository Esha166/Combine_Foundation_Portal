import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./shared/Sidebar";
import { getLectures } from '../services/lectureService';
import { taskService } from '../services/taskService';
import { courseService } from '../services/courseService';
import api from '../services/api';

const DashboardWithSidebar = () => {
  const { user } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (user?.role === 'volunteer') {
          // Fetch volunteer-specific data
          const [lecturesResponse, tasksResponse, coursesResponse] = await Promise.allSettled([
            getLectures({ limit: 5 }),
            taskService.getTasks(),
            courseService.getAllCourses()
          ]);

          const volunteerData = {};
          
          if (lecturesResponse.status === 'fulfilled') {
            volunteerData.lectures = lecturesResponse.value.data.data?.lectures || lecturesResponse.value.data;
          }

          if (tasksResponse.status === 'fulfilled') {
            volunteerData.tasks = tasksResponse.value.data.data || tasksResponse.value.data;
          }

          if (coursesResponse.status === 'fulfilled') {
            volunteerData.courses = coursesResponse.value.data || [];
          }
          
          setData(volunteerData);
        } else if (user?.role === 'trustee') {
          // Fetch trustee-specific data (stats)
          const statsResponse = await api.get('/trustee/stats');
          
          if (statsResponse.data.success) {
            setData(statsResponse.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Volunteer dashboard view
  if (user?.role === 'volunteer') {
    // Sort lectures by date to get latest ones (most recent first)
    const latestLectures = data.lectures?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3) || [];
    // For volunteers, we assume they are enrolled in all available courses
    const currentCourses = data.courses?.slice(0, 3) || [];
    const pendingTasks = data.tasks?.filter(task => !task.completed).slice(0, 3) || [];

    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar role={user?.role} />
        
        <main className="flex-1 ml-64 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#FF6900]">
                {user?.name}'s Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Latest Lectures Card */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold text-[#FF6900] mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Latest Lectures
                  </h3>
                  {latestLectures.length > 0 ? (
                    <div className="space-y-3">
                      {latestLectures.map((lecture) => (
                        <div key={lecture._id || lecture.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                          <h4 className="font-medium text-gray-900 truncate">{lecture.title}</h4>
                          <p className="text-sm text-gray-600 truncate">{lecture.author?.name || 'Unknown'}</p>
                          {lecture.createdAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(lecture.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No recent lectures</p>
                  )}
                  <Link 
                    to="/lectures" 
                    className="mt-4 inline-block text-[#FF6900] hover:underline text-sm font-medium"
                  >
                    View All Lectures →
                  </Link>
                </div>

                {/* Current Courses Card */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold text-[#FF6900] mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Current Courses
                  </h3>
                  {currentCourses.length > 0 ? (
                    <div className="space-y-3">
                      {currentCourses.map((course) => (
                        <div key={course._id || course.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                          <h4 className="font-medium text-gray-900 truncate">{course.title}</h4>
                          <p className="text-sm text-gray-600 truncate">{course.instructor || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No available courses</p>
                  )}
                  <Link 
                    to="/volunteer/my-courses" 
                    className="mt-4 inline-block text-[#FF6900] hover:underline text-sm font-medium"
                  >
                    View All Courses →
                  </Link>
                </div>

                {/* Current Tasks Card */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold text-[#FF6900] mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Current Tasks
                  </h3>
                  {pendingTasks.length > 0 ? (
                    <div className="space-y-3">
                      {pendingTasks.map((task) => (
                        <div key={task._id || task.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                          <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                          {task.dueDate && (
                            <p className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                          <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority} priority
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No pending tasks</p>
                  )}
                  <Link 
                    to="/volunteer/tasks" 
                    className="mt-4 inline-block text-[#FF6900] hover:underline text-sm font-medium"
                  >
                    View All Tasks →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
  // Trustee dashboard view
  else if (user?.role === 'trustee') {
    // Extract stats data for trustees
    const { volunteers, courses, posts } = data;

    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar role={user?.role} />
        
        <main className="flex-1 ml-64 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#FF6900]">
                Trustee Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Overview of organizational metrics</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
              </div>
            ) : (
              <div>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Total Volunteers"
                    value={volunteers?.total || 0}
                    icon="users"
                    color="blue"
                  />
                  <StatCard
                    title="Pending Applications"
                    value={volunteers?.pending || 0}
                    icon="clock"
                    color="yellow"
                  />
                  <StatCard
                    title="Total Courses"
                    value={courses?.total || 0}
                    icon="book"
                    color="green"
                  />
                  <StatCard
                    title="Total Posts"
                    value={posts?.total || 0}
                    icon="newspaper"
                    color="purple"
                  />
                </div>

                {/* Additional Summary Cards */}
                <div className="grid md:grid-cols-6 gap-6 mb-8">
                  <StatCard
                    title="Total Volunteers"
                    value={volunteers?.total || 0}
                    icon="users"
                    color="blue"
                  />
                  <StatCard
                    title="Active (30d)"
                    value={volunteers?.active || 0}
                    icon="activity"
                    color="green"
                  />
                  <StatCard
                    title="Pending Apps"
                    value={volunteers?.pending || 0}
                    icon="clock"
                    color="yellow"
                  />
                  <StatCard
                    title="Total Courses"
                    value={courses?.total || 0}
                    icon="book"
                    color="indigo"
                  />
                  <StatCard
                    title="Completed"
                    value={courses?.completed || 0}
                    icon="check-circle"
                    color="purple"
                  />
                  <StatCard
                    title="Avg/Course"
                    value={courses?.avgPerVolunteer || 0}
                    icon="trending-up"
                    color="orange"
                  />
                </div>

                {/* Volunteer Activity Overview */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Volunteer Activity Overview
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Total Volunteers</span>
                      <span className="text-xl font-bold text-[#FF6900]">{volunteers?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Active in 30 days</span>
                      <span className="text-xl font-bold text-green-600">{volunteers?.active || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Course Completion Rate</span>
                      <span className="text-xl font-bold text-blue-600">
                        {volunteers?.total > 0
                          ? Math.round(((courses?.completed || 0) / volunteers?.total) * 100) + '%'
                          : '0%'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
  
  return null;
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800', 
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    orange: 'bg-orange-100 text-orange-800'
  };

  const icons = {
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    newspaper: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />,
    activity: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    "check-circle": <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    "trending-up": <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#FF6900]">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icons[icon]}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardWithSidebar;