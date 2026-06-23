import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin`} />
      {text && (
        <p className="text-slate-400 text-xs font-semibold animate-pulse tracking-wide uppercase">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
