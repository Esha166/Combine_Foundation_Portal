import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import StatsWidget from "./dashboard/StatsWidget";
import RecentActivityWidget from "./dashboard/RecentActivityWidget";
import AdminDashboard from "./admin/AdminDashboard";
import { getLectures } from '../services/lectureService';
import { taskService } from '../services/taskService';
import { courseService } from '../services/courseService';
import api from '../services/api';

const Dashboard = () => {
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

  // Render Admin Dashboard
  if (['admin', 'superadmin', 'developer'].includes(user?.role)) {
    return (
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    );
  }

  // Render Volunteer Dashboard
  if (user?.role === 'volunteer') {
    const latestLectures = data.lectures?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) || [];
    const pendingTasks = data.tasks?.filter(task => !task.completed).slice(0, 5) || [];
    const completedTasksCount = data.tasks?.filter(task => task.completed).length || 0;
    const pendingTasksCount = data.tasks?.filter(task => !task.completed).length || 0;

    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your volunteer activities.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsWidget
                title="Pending Tasks"
                value={pendingTasksCount}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                color="orange"
              />
              <StatsWidget
                title="Completed Tasks"
                value={completedTasksCount}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                color="green"
              />
              <StatsWidget
                title="My Courses"
                value={data.courses?.length || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                color="blue"
              />
              <StatsWidget
                title="Total Lectures"
                value={data.lectures?.length || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                color="purple"
              />
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivityWidget
                title="Pending Tasks"
                viewAllLink="/volunteer/tasks"
                items={pendingTasks.map(task => ({
                  title: task.title,
                  description: `Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}`,
                  icon: (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                  ),
                  action: (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  )
                }))}
                emptyMessage="No pending tasks! Great job."
              />

              <RecentActivityWidget
                title="Latest Lectures"
                viewAllLink="/lectures"
                items={latestLectures.map(lecture => ({
                  title: lecture.title,
                  description: `By ${lecture.author?.name || 'Unknown'}`,
                  timestamp: new Date(lecture.createdAt).toLocaleDateString(),
                  icon: (
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )
                }))}
                emptyMessage="No lectures available yet."
              />
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Render Trustee Dashboard
  if (user?.role === 'trustee') {
    const { volunteers, courses, posts } = data;

    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Trustee Overview
          </h1>
          <p className="text-gray-500 mt-1">Key metrics and organizational insights.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsWidget
                title="Total Volunteers"
                value={volunteers?.total || 0}
                trendLabel={`Male: ${volunteers?.male || 0} | Female: ${volunteers?.female || 0}`}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                color="blue"
              />
              <StatsWidget
                title="Active Volunteers"
                value={volunteers?.active || 0}
                trend={volunteers?.total > 0 ? Math.round((volunteers.active / volunteers.total) * 100) : 0}
                trendLabel="% of total volunteers"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                color="green"
              />
              <StatsWidget
                title="Total Courses"
                value={courses?.total || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                color="purple"
              />
              <StatsWidget
                title="Total Posts"
                value={posts?.total || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>}
                color="orange"
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsWidget
                title="Approved Volunteers"
                value={volunteers?.approved || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                color="green"
              />
              <StatsWidget
                title="Pending Applications"
                value={volunteers?.pending || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                color="yellow"
              />
              {/* <StatsWidget
                title="Completed Volunteers"
                value={volunteers?.completed || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                color="blue"
              />
              <StatsWidget
                title="Rejected Volunteers"
                value={volunteers?.rejected || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                color="red"
              /> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsWidget
                title="Course Completions"
                value={courses?.completed || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                color="green"
              />
              {/* <StatsWidget
                title="Avg. Completion Rate"
                value={`${courses?.avgPerVolunteer || 0}`}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                color="blue"
              /> */}
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  return null;
};

export default Dashboard;
