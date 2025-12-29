import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyRegistrationsChart = ({ monthlyRegistrations }) => {
    const monthlyData = monthlyRegistrations.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        volunteers: item.count
    }));

    return (
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
    );
};

export default MonthlyRegistrationsChart;
