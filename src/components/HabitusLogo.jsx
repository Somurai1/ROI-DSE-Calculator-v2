import React from 'react';

const HabitusLogo = ({ className = "", size = "default" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Image - 120px height */}
      <img 
        src="/habitus-logo.png" 
        alt="Habitus Health Logo"
        className="h-[120px] w-auto mr-4"
        onError={(e) => {
          console.error('Logo failed to load:', e);
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default HabitusLogo;
