import React from 'react';

const EducationInformation = ({ formData, onChange }) => {
    return (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#FF6900]">Education</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education Level */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Highest Level of Education
                    </label>
                    <select
                        name="education"
                        value={formData.education}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select Education Level</option>
                        <option value="Matric">Matric</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                {/* Institute Name */}
                <div>
                    <label htmlFor="institute" className="block text-sm font-medium text-gray-700 mb-2">
                        Institute Name
                    </label>
                    <input
                        id="institute"
                        name="institute"
                        type="text"
                        placeholder="Name of school/college/university"
                        value={formData.institute}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Social Media Profile */}
                <div className="md:col-span-2">
                    <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700 mb-2">
                        Social Media Profile Link
                    </label>
                    <input
                        id="socialMedia"
                        name="socialMedia"
                        type="text"
                        placeholder="e.g., LinkedIn, GitHub profile link"
                        value={formData.socialMedia}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
};

export default EducationInformation;
