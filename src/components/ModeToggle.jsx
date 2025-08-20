import React from 'react';

const ModeToggle = ({ mode, onModeChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <div className="flex">
        <button
          onClick={() => onModeChange('quick')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            mode === 'quick'
              ? 'bg-primary-100 text-primary-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>⚡</span>
            <span>Quick Mode</span>
          </div>
          <p className="text-xs mt-1 opacity-75">SME / Telesales</p>
        </button>
        
        <button
          onClick={() => onModeChange('advanced')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            mode === 'advanced'
              ? 'bg-primary-100 text-primary-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>📊</span>
            <span>Advanced Mode</span>
          </div>
          <p className="text-xs mt-1 opacity-75">Corporate / Business Case</p>
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
