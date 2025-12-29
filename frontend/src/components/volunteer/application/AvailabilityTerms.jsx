import React from 'react';

const AvailabilityTerms = ({ formData, onDayChange, onChange }) => {
    return (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#FF6900]">Availability and Terms</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    When will you be available to volunteer?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <label key={day} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.availabilityDays.includes(day)}
                                onChange={() => onDayChange(day)}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{day}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many hours are you available to volunteer each week?
                </label>
                <select
                    name="availabilityHours"
                    value={formData.availabilityHours}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select Hours</option>
                    <option value="2–4 hours per week">2–4 hours per week</option>
                    <option value="5–7 hours per week">5–7 hours per week</option>
                    <option value="8–10 hours per week">8–10 hours per week</option>
                    <option value="10+ hours per week">10+ hours per week</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.termsAgreed}
                        onChange={onChange}
                        name="termsAgreed"
                        required
                        className="mt-1 w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700">
                        I agree to follow the policies and code of conduct of Combine Foundation. I understand this is a voluntary, unpaid role with no financial compensation.
                    </span>
                </label>
            </div>
        </div>
    );
};

export default AvailabilityTerms;
