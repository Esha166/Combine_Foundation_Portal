import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import api from '../../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trustee/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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

  const genderData = [
    { name: 'Male', value: stats.volunteers.male, color: '#3b82f6' },
    { name: 'Female', value: stats.volunteers.female, color: '#ec4899' },
    { name: 'Other', value: stats.volunteers.other, color: '#6b7280' }
  ];

  const monthlyData = stats.monthlyRegistrations.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    volunteers: item.count
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#FF6900]">Statistics Dashboard</h1>
              <p className="text-gray-600 mt-2">Overview of organizational metrics</p>
            </div>
            <GoBackButton />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Volunteers"
            value={stats.volunteers.total}
            icon="users"
            color="blue"
          />
          <StatCard
            title="Pending Applications"
            value={stats.volunteers.pending}
            icon="clock"
            color="yellow"
          />
          <StatCard
            title="Total Courses"
            value={stats.courses.total}
            icon="book"
            color="green"
          />
          <StatCard
            title="Total Posts"
            value={stats.posts.total}
            icon="newspaper"
            color="purple"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Volunteers"
            value={stats.volunteers.total}
            icon="users"
            color="blue"
          />
          <StatCard
            title="Active (30d)"
            value={stats.volunteers.active}
            icon="activity"
            color="green"
          />
          <StatCard
            title="Pending Apps"
            value={stats.volunteers.pending}
            icon="clock"
            color="yellow"
          />
          <StatCard
            title="Total Courses"
            value={stats.courses.total}
            icon="book"
            color="indigo"
          />
          <StatCard
            title="Completed C"
            value={stats.courses.completed}
            icon="check-circle"
            color="purple"
          />
          <StatCard
            title="Avg/Course"
            value={stats.courses.avgPerVolunteer}
            icon="trending-up"
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Gender Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Volunteer Gender Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {genderData.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Registrations */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Volunteer Registrations
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volunteers" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Expertise Distribution */}
          {stats.expertiseDistribution && stats.expertiseDistribution.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Volunteer Expertise Areas
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.expertiseDistribution}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="_id" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Volunteer Activity */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Volunteer Activity Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Volunteers</span>
                <span className="text-xl font-bold text-[#FF6900]">{stats.volunteers.total}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Active in 30 days</span>
                <span className="text-xl font-bold text-green-600">{stats.volunteers.active}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Course Completion Rate</span>
                <span className="text-xl font-bold text-blue-600">
                  {stats.volunteers.total > 0 
                    ? Math.round((stats.courses.completed / stats.volunteers.total) * 100) + '%' 
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'bg-primary-100 text-primary-800',
    yellow: 'bg-primary-100 text-primary-800',
    green: 'bg-primary-100 text-primary-800',
    purple: 'bg-primary-100 text-primary-800'
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

export default Stats;