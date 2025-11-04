import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Charts = ({ stats }) => {
  const genderData = [
    { name: 'Male', value: stats.volunteers.male, color: '#3b82f6' },
    { name: 'Female', value: stats.volunteers.female, color: '#ec4899' },
    { name: 'Other', value: stats.volunteers.other, color: '#6b7280' }
  ];

  const monthlyData = stats.monthlyRegistrations.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    volunteers: item.count
  }));

  const COLORS = ['#3b82f6', '#ec4899', '#6b7280'];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Gender Distribution Pie Chart */}
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

      {/* Monthly Registrations Bar Chart */}
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
  );
};

export default Charts;