import React from 'react';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import { useTrusteeStats } from '../../hooks/useTrusteeStats';
import StatCard from './stats/StatCard';
import GenderDistributionChart from './stats/GenderDistributionChart';
import MonthlyRegistrationsChart from './stats/MonthlyRegistrationsChart';
import ExpertiseDistributionChart from './stats/ExpertiseDistributionChart';
import VolunteerActivity from './stats/VolunteerActivity';

const Stats = () => {
  const { stats, loading } = useTrusteeStats();

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

        {/* Detailed Summary Cards */}
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
          <GenderDistributionChart volunteers={stats.volunteers} />
          <MonthlyRegistrationsChart monthlyRegistrations={stats.monthlyRegistrations} />
        </div>

        {/* Additional Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <ExpertiseDistributionChart expertiseDistribution={stats.expertiseDistribution} />
          <VolunteerActivity volunteers={stats.volunteers} courses={stats.courses} />
        </div>
      </div>
    </div>
  );
};

export default Stats;