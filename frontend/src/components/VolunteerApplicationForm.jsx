import React from 'react';
import GoBackButton from './shared/GoBackButton';
import { useVolunteerForm } from '../hooks/useVolunteerForm';
import ApplicationSuccess from './volunteer/application/ApplicationSuccess';
import PersonalInformation from './volunteer/application/PersonalInformation';
import EducationInformation from './volunteer/application/EducationInformation';
import SkillsExperience from './volunteer/application/SkillsExperience';
import AvailabilityTerms from './volunteer/application/AvailabilityTerms';

const VolunteerApplicationForm = () => {
  const {
    formData,
    loading,
    success,
    error,
    handleInputChange,
    updateFormData,
    handleSkillChange,
    handleDayChange,
    submitApplication,
    resetForm
  } = useVolunteerForm();

  if (success) {
    return <ApplicationSuccess onReset={resetForm} />;
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
          <form onSubmit={submitApplication} className="space-y-6">
            <PersonalInformation
              formData={formData}
              onChange={handleInputChange}
            />

            <EducationInformation
              formData={formData}
              onChange={handleInputChange}
            />

            <SkillsExperience
              formData={formData}
              onSkillChange={handleSkillChange}
              onUpdateFormData={updateFormData}
            />

            <AvailabilityTerms
              formData={formData}
              onDayChange={handleDayChange}
              onChange={handleInputChange}
            />

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