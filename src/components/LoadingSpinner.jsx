import React from 'react';
import { FiLoader } from 'react-icons/fi';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}>
        <FiLoader className={`text-blue-500 ${sizeClasses[size]}`} />
      </div>
      {text && (
        <p className="text-gray-400 text-sm md:text-base animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
