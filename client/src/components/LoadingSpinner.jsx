import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full border-slate-200 border-t-rose-600 animate-spin mb-3`}
      ></div>
      {message && <p className="text-sm font-medium text-slate-500 animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
