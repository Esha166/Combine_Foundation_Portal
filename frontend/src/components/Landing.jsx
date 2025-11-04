import React from "react";
import { Link } from "react-router-dom";
import Footer from "./shared/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Combine Foundation"
                className="h-10 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-[#FF6900]">
                Combine Foundation
              </span>
            </div>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-[#FF6900] text-white font-medium hover:bg-[#ff6a00d6] transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#FF6900] mb-6">
            Empowering Communities Through Action
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join our network of volunteers, access resources, and make a lasting
            impact in communities across Pakistan.
          </p>
          
          <div className="mt-8">
            <Link
              to="/volunteer/apply"
              className="inline-block px-8 py-4 bg-[#FF6900] text-white font-medium text-lg rounded-lg hover:bg-[#ff6a00d6] transition shadow-lg"
            >
              Become a Volunteer
            </Link>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
            {/* Volunteer Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-[#FF6900] mb-3">
                Volunteer
              </h3>
              <p className="text-gray-600 mb-6">
                Access courses, view posts, and track your volunteer journey
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-[#FF6900] text-white font-medium rounded-lg hover:bg-[#ff6a00d6] transition"
              >
                Volunteer Login
              </Link>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-[#FF6900] mb-3">Admin</h3>
              <p className="text-gray-600 mb-6">
                Manage volunteers, courses, and posts. Approve applications
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-[#FF6900] text-white font-medium rounded-lg hover:bg-[#ff6a00d6] transition"
              >
                Admin Login
              </Link>
            </div>

            {/* Trustee Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-[#FF6900] mb-3">Trustee</h3>
              <p className="text-gray-600 mb-6">
                View analytics, statistics, and organizational insights
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-[#FF6900] text-white font-medium rounded-lg hover:bg-[#ff6a00d6] transition"
              >
                Trustee Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Landing;
