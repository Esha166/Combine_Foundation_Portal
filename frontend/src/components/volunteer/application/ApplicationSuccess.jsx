import React from 'react';

const ApplicationSuccess = ({ onReset }) => {
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
                    onClick={onReset}
                    className="px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6]"
                >
                    Submit Another Application
                </button>
            </div>
        </div>
    );
};

export default ApplicationSuccess;
