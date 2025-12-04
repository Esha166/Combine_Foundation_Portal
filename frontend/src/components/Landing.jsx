import React from "react";
import { Link } from "react-router-dom";
import Footer from "./shared/Footer";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Container from "./ui/Container";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <Container>
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Combine Foundation"
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Combine <span className="text-[#FF6900]">Foundation</span>
              </span>
            </div>
            <Button to="/login" variant="primary" size="md">
              Login
            </Button>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
          <Container className="relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8">
              Empowering Communities <br />
              <span className="text-[#FF6900] relative inline-block">
                Through Action
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#FF6900] opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our network of volunteers, access resources, and make a lasting
              impact in communities across Pakistan. Together, we can build a better future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button to="/volunteer/apply" size="xl" className="shadow-xl shadow-orange-500/20">
                Become a Volunteer
              </Button>
              <Button to="/login" variant="outline" size="xl">
                Member Login
              </Button>
            </div>
          </Container>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>
        </div>

        {/* Role Cards Section */}
        <div className="py-20 bg-white">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Whether you're looking to volunteer, manage operations, or oversee the foundation's growth, we have the tools you need.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Volunteer Card */}
              <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-[#FF6900]">
                <div className="h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-[#FF6900]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Volunteer
                </h3>
                <p className="text-gray-600 mb-8 min-h-[48px]">
                  Access courses, view posts, and track your volunteer journey with our dedicated portal.
                </p>
                <Button to="/login" variant="ghost" className="w-full group">
                  Login as Volunteer 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Card>

              {/* Admin Card */}
              <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-blue-600">
                <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Admin</h3>
                <p className="text-gray-600 mb-8 min-h-[48px]">
                  Manage volunteers, courses, and posts. Approve applications and oversee operations.
                </p>
                <Button to="/login" variant="ghost" className="w-full group">
                  Login as Admin
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Card>

              {/* Trustee Card */}
              <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-indigo-600">
                <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Trustee</h3>
                <p className="text-gray-600 mb-8 min-h-[48px]">
                  View analytics, statistics, and organizational insights to make informed decisions.
                </p>
                <Button to="/login" variant="ghost" className="w-full group">
                  Login as Trustee
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Card>
            </div>
          </Container>
        </div>
      </main>

      <Footer/>
    </div>
  );
};

export default Landing;

