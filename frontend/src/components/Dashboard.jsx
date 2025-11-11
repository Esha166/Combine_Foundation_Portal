import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "./shared/Navbar";
import GoBackButton from "./shared/GoBackButton";

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case "volunteer":
        return <VolunteerDashboard />;
      case "admin":
      case "superadmin":
        return <AdminDashboard />;
      case "trustee":
        return <TrusteeDashboard />;
      case "developer":
        return <DeveloperDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getDashboardContent()}
      </div>
    </div>
  );
};

const VolunteerDashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#FF6900]">
          Volunteer Dashboard
        </h1>
        <GoBackButton />
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Link
          to="/volunteer/my-courses"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            My Courses
          </h3>
          <p className="text-gray-600 text-sm">
            Access your training materials
          </p>
        </Link>

        <Link
          to="/volunteer/my-posts"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Posts & Updates
          </h3>
          <p className="text-gray-600 text-sm">Read latest announcements</p>
        </Link>

        <Link
          to="/profile"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            My Profile
          </h3>
          <p className="text-gray-600 text-sm">View and edit your profile</p>
        </Link>

        <Link
          to="/volunteer/tasks"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            My Tasks
          </h3>
          <p className="text-gray-600 text-sm">Manage your tasks and reminders</p>
        </Link>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#FF6900]">Admin Dashboard</h1>
        <GoBackButton />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/admin/volunteers"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Volunteers
          </h3>
          <p className="text-gray-600 text-sm">Approve/reject applications</p>
        </Link>

        <Link
          to="/admin/courses"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Courses
          </h3>
          <p className="text-gray-600 text-sm">Create and edit courses</p>
        </Link>

        <Link
          to="/admin/posts"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Posts
          </h3>
          <p className="text-gray-600 text-sm">Create and publish posts</p>
        </Link>

        <Link
          to="/admin/lectures"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Lectures
          </h3>
          <p className="text-gray-600 text-sm">Create and manage lectures</p>
        </Link>

        <Link
          to="/admin/trustees"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Trustees
          </h3>
          <p className="text-gray-600 text-sm">Add and manage trustees</p>
        </Link>

        {(user?.role === 'superadmin' || user?.role === 'developer') && (
          <Link
            to="/admin/manage-admins"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
              Manage Admins
            </h3>
            <p className="text-gray-600 text-sm">Add and manage admin accounts</p>
          </Link>
        )}

        {(user?.role === 'superadmin') && (
          <Link
            to="/logs/audit"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
              Audit Logs
            </h3>
            <p className="text-gray-600 text-sm">View system audit logs</p>
          </Link>
        )}
      </div>
    </div>
  );
};

const TrusteeDashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#FF6900]">Trustee Dashboard</h1>
        <GoBackButton />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link
          to="/trustee/stats"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            View Statistics
          </h3>
          <p className="text-gray-600 text-sm">Access detailed analytics and reports</p>
        </Link>

        <Link
          to="/trustee/members"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            View Members
          </h3>
          <p className="text-gray-600 text-sm">See all admins and volunteers</p>
        </Link>

        <Link
          to="/trustee/posts"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            View Posts
          </h3>
          <p className="text-gray-600 text-sm">See all published posts</p>
        </Link>

        <Link
          to="/trustee/courses"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            View Courses
          </h3>
          <p className="text-gray-600 text-sm">See all active courses</p>
        </Link>
      </div>
    </div>
  );
};

const DeveloperDashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#FF6900]">Developer Dashboard</h1>
        <GoBackButton />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/admin/volunteers"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Volunteers
          </h3>
          <p className="text-gray-600 text-sm">Approve/reject applications</p>
        </Link>

        <Link
          to="/admin/courses"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Courses
          </h3>
          <p className="text-gray-600 text-sm">Create and edit courses</p>
        </Link>

        <Link
          to="/admin/posts"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Posts
          </h3>
          <p className="text-gray-600 text-sm">Create and publish posts</p>
        </Link>

        <Link
          to="/admin/lectures"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Lectures
          </h3>
          <p className="text-gray-600 text-sm">Create and manage lectures</p>
        </Link>

        <Link
          to="/admin/trustees"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Trustees
          </h3>
          <p className="text-gray-600 text-sm">Add and manage trustees</p>
        </Link>

        <Link
          to="/admin/manage-admins"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Manage Admins
          </h3>
          <p className="text-gray-600 text-sm">Add and manage admin accounts</p>
        </Link>

        <Link
          to="/logs/audit"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Audit Logs
          </h3>
          <p className="text-gray-600 text-sm">View system audit logs</p>
        </Link>

        <Link
          to="/logs/errors"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#FF6900] rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#FF6900] mb-2">
            Error Logs
          </h3>
          <p className="text-gray-600 text-sm">View system error logs</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
