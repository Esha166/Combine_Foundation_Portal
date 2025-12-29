import React from 'react';

const PersonalInformation = ({ formData, onChange }) => {
    return (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#FF6900]">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        required
                        value={formData.name}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Age */}
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                        Age (optional)
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="text"
                        placeholder="e.g., 21"
                        value={formData.age}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        placeholder="+92 3xx xxx xxxx"
                        required
                        value={formData.phone}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={formData.email}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={onChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                </div>

                {/* CNIC */}
                <div>
                    <label htmlFor="cnic" className="block text-sm font-medium text-gray-700 mb-2">
                        CNIC / B-Form
                    </label>
                    <input
                        id="cnic"
                        name="cnic"
                        type="text"
                        placeholder="e.g., 12345-1234567-1"
                        value={formData.cnic}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="mt-6">
                {/* City of Residence */}
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City of Residence
                </label>
                <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select City</option>
                    <option value="karachi">Karachi</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
    );
};

export default PersonalInformation;
