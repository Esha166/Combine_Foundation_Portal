import React from 'react';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const sizes = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const loader = (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-[#FF6900] ${sizes[size]}`}></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;