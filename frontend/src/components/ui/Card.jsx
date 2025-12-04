import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
