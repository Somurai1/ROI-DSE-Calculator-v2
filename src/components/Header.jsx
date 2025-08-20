import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">
                Habitus Health
              </h1>
              <p className="text-sm text-gray-500">
                Workplace Health Solutions
              </p>
            </div>
          </div>
          

          
          <div className="flex items-center space-x-4">
            <button className="btn-primary">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
