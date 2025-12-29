import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExpertiseDistributionChart = ({ expertiseDistribution }) => {
    if (!expertiseDistribution || expertiseDistribution.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Volunteer Expertise Areas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={expertiseDistribution}
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
    );
};

export default ExpertiseDistributionChart;
