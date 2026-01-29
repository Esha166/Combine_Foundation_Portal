import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoBackButton from './shared/GoBackButton';
import { volunteerService } from '../services/volunteerService';
import { EXPERTISE_AREAS } from '../utils/constants';

const VolunteerApplicationForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    expertise: [],
    age: '',
    cnic: '',
    city: '',
    education: '',
    institute: '',
    socialMedia: '',
    skills: [],
    customSkill: '', // For custom skill when "Other" is selected
    priorExperience: '',
    experienceDesc: '',
    availabilityDays: [],
    availabilityHours: '',
    termsAgreed: false
  });

  const [submitted, setSubmitted] = useState(false);

  // Handle multiple skills selection
  const handleSkillChange = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  // Handle availability days selection
  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availabilityDays: prev.availabilityDays.includes(day)
        ? prev.availabilityDays.filter(d => d !== day)
        : [...prev.availabilityDays, day]
    }));
  };



  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying. We will review your application and contact you via email.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                gender: '',
                expertise: [],
                age: '',
                cnic: '',
                city: '',
                education: '',
                institute: '',
                socialMedia: '',
                skills: [],
                customSkill: '',
                priorExperience: '',
                experienceDesc: '',
                availabilityDays: [],
                availabilityHours: '',
                termsAgreed: false
              });
            }}
            className="px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6]"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-[#FF6900] mb-2">
                  Volunteer Application
                </h1>
                <p className="text-gray-600">
                  Join Combine Foundation and make a difference in your community
                </p>
              </div>
              <GoBackButton />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form to submit directly to our backend API */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setLoading(true);

              try {
                // Map selected skills to expertise areas before submitting
                const skillMapping = {
                  'Full Stack Developer / MERN stack Developer': 'Technology',
                  'Web / App & Software Development': 'Technology',
                  'AI / ML': 'Technology',
                  'UI & UX': 'Technology',
                  'Search Engine Optimization': 'Marketing',
                  'Project Management / Event Management': 'Community Development',
                  'Content Creator': 'Marketing',
                  'Social Media Management & Digital Marketing': 'Marketing',
                  'Graphic Designing': 'Technology',
                  'Video Editing': 'Technology',
                  'Data Engineer / Data Analyst': 'Technology',
                  'Teaching': 'Education',
                  'Research & Development': 'Education',
                  'Accounting / Finance': 'Finance',
                  'Hosting': 'Community Development'
                };

                // Combine standard skills with custom skill to determine expertise
                const allSkills = [...formData.skills];
                if (formData.customSkill.trim() !== '') {
                  allSkills.push(formData.customSkill.trim());
                }

                // Map selected skills to expertise categories, removing duplicates
                const expertiseAreas = [...new Set(
                  allSkills.map(skill => skillMapping[skill] || 'Other') // Use 'Other' for unmapped skills
                )];

                const submissionData = {
                  ...formData,
                  expertise: expertiseAreas,
                  skills: allSkills // Include all selected skills in the submission
                };

                // Remove the customSkill field since it's just for form handling
                delete submissionData.customSkill;

                // Submit to backend API directly
                await volunteerService.applyVolunteer(submissionData);

                setSuccess(true);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  gender: '',
                  expertise: [],
                  age: '',
                  cnic: '',
                  city: '',
                  education: '',
                  institute: '',
                  socialMedia: '',
                  skills: [],
                  customSkill: '',
                  priorExperience: '',
                  experienceDesc: '',
                  availabilityDays: [],
                  availabilityHours: '',
                  termsAgreed: false
                });
                setLoading(false);

              } catch (err) {
                if (err.response?.data?.message) {
                  setError(err.response.data.message);
                } else if (err.response?.data?.errors) {
                  // Handle validation errors from Joi with specific field messages
                  const errorMessages = err.response.data.errors.map(error => error.message);
                  setError(errorMessages.join(', '));
                } else {
                  setError(err.response?.data?.message || 'Failed to submit application. Please check all required fields.');
                }
                setLoading(false);
              }
            }}
            className="space-y-6"
          >
            {/* Page 1 - Personal Information */}
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
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
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select City</option>
                  <option value="karachi">Karachi</option>
                  <option value="lahore">Lahore</option>
                  <option value="islamabad">Islamabad</option>
                  <option value="faisalabad">Faisalabad</option>
                  <option value="rawalpindi">Rawalpindi</option>
                  <option value="multan">Multan</option>
                  <option value="peshawar">Peshawar</option>
                  <option value="quetta">Quetta</option>
                  <option value="other">Other</option>
                </select>
                <div>
                  {formData.city === 'other' && (
                    <input
                      type="text"
                      placeholder="Please specify your city"
                      value={formData.customCity || ''}
                      onChange={(e) => setFormData({ ...formData, customCity: e.target.value })}
                      className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Page 2 - Education */}
            <div className="mb-8 p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-[#FF6900]">Education</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highest Level of Education
                  </label>
                  <select
                    id='education'
                    name="education"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Education Level</option>
                    <option value="Matric">Matric</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Others">Others</option>
                  </select>
                  <div>
                    {formData.education === "Others" && (
                      <input
                        type="text"
                        placeholder="Please specify your education level"
                        value={formData.customEducation || ''}
                        onChange={(e) => setFormData({ ...formData, customEducation: e.target.value })}
                        className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
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
                    onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Page 3 - Skills and Experience */}
            <div className="mb-8 p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-[#FF6900]">Skills and Experience</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Which of your skills would you like to contribute as a volunteer?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
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
                  ].map((skill) => (
                    <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillChange(skill)}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                  <label className="flex items-center space-x-2 cursor-pointer md:col-span-2">
                    <input
                      type="checkbox"
                      checked={formData.customSkill !== ''}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Checkbox checked - we'll add the custom skill when user types in the text field
                        } else {
                          // Checkbox unchecked - remove custom skill
                          setFormData(prev => ({
                            ...prev,
                            customSkill: '',
                            skills: prev.skills.filter(skill =>
                              !['Full Stack Developer / MERN stack Developer',
                                'Web / App & Software Development',
                                'AI / ML',
                                'UI & UX',
                                'Search Engine Optimization',
                                'Project Management / Event Management',
                                'Content Creator',
                                'Social Media Management & Digital Marketing',
                                'Graphic Designing',
                                'Video Editing',
                                'Data Engineer / Data Analyst',
                                'Teaching',
                                'Research & Development',
                                'Accounting / Finance',
                                'Hosting'].includes(skill))
                          }));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      <input
                        type="text"
                        value={formData.customSkill}
                        onChange={(e) => {
                          const customValue = e.target.value;

                          // Update the custom skill in form data
                          setFormData(prev => {
                            const updatedSkills = prev.skills.filter(skill =>
                              !['Full Stack Developer / MERN stack Developer',
                                'Web / App & Software Development',
                                'AI / ML',
                                'UI & UX',
                                'Search Engine Optimization',
                                'Project Management / Event Management',
                                'Content Creator',
                                'Social Media Management & Digital Marketing',
                                'Graphic Designing',
                                'Video Editing',
                                'Data Engineer / Data Analyst',
                                'Teaching',
                                'Research & Development',
                                'Accounting / Finance',
                                'Hosting'].includes(skill));

                            // Add custom skill if there's a value
                            if (customValue.trim() !== '') {
                              updatedSkills.push(customValue.trim());
                            }

                            return {
                              ...prev,
                              customSkill: customValue,
                              skills: [
                                ...prev.skills.filter(skill =>
                                  ['Full Stack Developer / MERN stack Developer',
                                    'Web / App & Software Development',
                                    'AI / ML',
                                    'UI & UX',
                                    'Search Engine Optimization',
                                    'Project Management / Event Management',
                                    'Content Creator',
                                    'Social Media Management & Digital Marketing',
                                    'Graphic Designing',
                                    'Video Editing',
                                    'Data Engineer / Data Analyst',
                                    'Teaching',
                                    'Research & Development',
                                    'Accounting / Finance',
                                    'Hosting'].includes(skill)),
                                ...updatedSkills.filter(skill => skill !== customValue.trim()) // avoid duplicates
                              ]
                            };
                          });
                        }}
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
                        onChange={() => setFormData({ ...formData, priorExperience: "yes" })}
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
                        onChange={() => setFormData({ ...formData, priorExperience: "no" })}
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
                    onChange={(e) => setFormData({ ...formData, experienceDesc: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Page 4 - Availability and Terms */}
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
                        onChange={() => handleDayChange(day)}
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
                  onChange={(e) => setFormData({ ...formData, availabilityHours: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                    required
                    className="mt-1 w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to follow the policies and code of conduct of Combine Foundation. I understand this is a voluntary, unpaid role with no financial compensation.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="actions text-center">
              <button
                type="submit"
                className="w-full bg-[#FF6900] text-white py-3 rounded-lg font-medium hover:bg-[#ff6a00d6] transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <p className="mt-3 text-sm text-gray-600">We will contact you after review.</p>
            </div>
          </form>

          <div className="mt-6 text-sm text-gray-500">
            <p>Note: Your responses will be stored securely in our database.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerApplicationForm;