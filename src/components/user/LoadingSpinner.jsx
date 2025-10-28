import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-secondary-600 font-medium">Loading NCIP System...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
