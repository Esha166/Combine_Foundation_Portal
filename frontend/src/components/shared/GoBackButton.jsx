import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const GoBackButton = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  return (
    <button
      onClick={handleGoBack}
      className={`flex items-center text-gray-600 cursor-pointer transition-colors ${className}`}
    >
      <ArrowLeftIcon className="h-5 w-5 mr-1" />
      <span>Go Back</span>
    </button>
  );
};

export default GoBackButton;