import React from 'react';

const SkillsExperience = ({ formData, onSkillChange, onUpdateFormData }) => {
    const skillsList = [
        "Full Stack Developer / MERN stack Developer",
        "Web / App & Software Development",
        "AI / ML",
        "UI & UX",
        "Search Engine Optimization",
        "Project Management / Event Management",
        "Content Creator",
        "Social Media Management & Digital Marketing",
        "Graphic Designing",
        "Video Editing",
        "Data Engineer / Data Analyst",
        "Teaching",
        "Research & Development",
        "Accounting / Finance",
        "Hosting"
    ];

    const handleCustomSkillToggle = (e) => {
        if (!e.target.checked) {
            // Checkbox unchecked - remove custom skill
            const updatedSkills = formData.skills.filter(skill => skillsList.includes(skill));
            onUpdateFormData({
                customSkill: '',
                skills: updatedSkills
            });
        }
        // If checked, we do nothing until text is typed
    };

    const handleCustomSkillTextChange = (e) => {
        const customValue = e.target.value;

        // Update the custom skill in form data
        const updatedSkills = formData.skills.filter(skill => skillsList.includes(skill));

        // Add custom skill if there's a value
        if (customValue.trim() !== '') {
            updatedSkills.push(customValue.trim());
        }

        onUpdateFormData({
            customSkill: customValue,
            skills: updatedSkills
        });
    };

    return (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#FF6900]">Skills and Experience</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Which of your skills would you like to contribute as a volunteer?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skillsList.map((skill) => (
                        <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.skills.includes(skill)}
                                onChange={() => onSkillChange(skill)}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{skill}</span>
                        </label>
                    ))}
                    <label className="flex items-center space-x-2 cursor-pointer md:col-span-2">
                        <input
                            type="checkbox"
                            checked={formData.customSkill !== ''}
                            onChange={handleCustomSkillToggle}
                            className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700">
                            <input
                                type="text"
                                value={formData.customSkill}
                                onChange={handleCustomSkillTextChange}
                                placeholder="Other (please specify)"
                                className="w-40 inline-block ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                        </span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prior Experience */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Do you have any prior volunteering experience?
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="priorExperience"
                                value="yes"
                                checked={formData.priorExperience === "yes"}
                                onChange={() => onUpdateFormData({ priorExperience: "yes" })}
                                className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="priorExperience"
                                value="no"
                                checked={formData.priorExperience === "no"}
                                onChange={() => onUpdateFormData({ priorExperience: "no" })}
                                className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700">No</span>
                        </label>
                    </div>
                </div>

                {/* Experience Description */}
                <div>
                    <label htmlFor="experienceDesc" className="block text-sm font-medium text-gray-700 mb-2">
                        If yes, briefly describe your role.
                    </label>
                    <input
                        id="experienceDesc"
                        name="experienceDesc"
                        type="text"
                        placeholder="Briefly describe your role"
                        value={formData.experienceDesc}
                        onChange={(e) => onUpdateFormData({ experienceDesc: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
};

export default SkillsExperience;
