import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const GenderDistributionChart = ({ volunteers }) => {
    const genderData = [
        { name: 'Male', value: volunteers.male, color: '#3b82f6' },
        { name: 'Female', value: volunteers.female, color: '#ec4899' },
        { name: 'Other', value: volunteers.other, color: '#6b7280' }
    ];

    return (
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
    );
};

export default GenderDistributionChart;
