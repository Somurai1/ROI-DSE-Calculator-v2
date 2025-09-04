import React from 'react';
import HabitusLogo from './HabitusLogo';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <HabitusLogo />
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <h2 className="text-lg font-semibold text-[#036665]">
                DSE ROI Calculator
              </h2>
              <p className="text-sm text-gray-600">
                Calculate your return on investment
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
