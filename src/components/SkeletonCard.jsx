// src/components/SkeletonCard.jsx
import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-colors duration-300 ease-in-out">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse transition-colors duration-300 ease-in-out"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse transition-colors duration-300 ease-in-out"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse transition-colors duration-300 ease-in-out"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;