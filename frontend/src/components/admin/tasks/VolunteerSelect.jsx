import React, { useEffect, useState } from 'react';
import { volunteerService } from '../../../services/volunteerService';
import Loader from '../../shared/Loader';

const VolunteerSelect = ({ selectedVolunteerId, onSelect }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const data = await volunteerService.getAllVolunteers('approved');
            setVolunteers(data.data || data);
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader className="h-20" />;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Select Volunteer</h2>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Choose a volunteer</label>
                <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FF6900] focus:border-[#FF6900]"
                    onChange={(e) => {
                        const vol = volunteers.find(v => v._id === e.target.value);
                        onSelect(vol);
                    }}
                    value={selectedVolunteerId || ''}
                >
                    <option value="">-- Select Volunteer --</option>
                    {volunteers.map(vol => (
                        <option key={vol._id} value={vol._id}>
                            {vol.name} ({vol.email})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default VolunteerSelect;
