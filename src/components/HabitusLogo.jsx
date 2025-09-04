import React from 'react';

const HabitusLogo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "h-8",
    default: "h-12", 
    large: "h-16"
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Symbol */}
      <svg 
        className={`${sizeClasses[size]} w-auto mr-3`}
        viewBox="0 0 60 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central vertical elements (dark teal) */}
        <circle cx="30" cy="15" r="8" fill="#036665"/>
        <rect x="26" y="23" width="8" height="14" fill="#036665"/>
        <circle cx="30" cy="45" r="8" fill="#036665"/>
        
        {/* Horizontal elements (gold/beige) */}
        <circle cx="15" cy="30" r="6" fill="#cfb382"/>
        <rect x="9" y="28" width="12" height="4" fill="#cfb382"/>
        <circle cx="45" cy="30" r="6" fill="#cfb382"/>
        <rect x="39" y="28" width="12" height="4" fill="#cfb382"/>
        
        {/* Side circles (dark teal) */}
        <circle cx="8" cy="30" r="4" fill="#036665"/>
        <circle cx="52" cy="30" r="4" fill="#036665"/>
      </svg>
      
      {/* Wordmark */}
      <div className="flex items-center">
        <span className="text-2xl font-bold text-[#036665]">habitus</span>
        <span className="text-2xl font-bold text-[#cfb382]">health</span>
      </div>
    </div>
  );
};

export default HabitusLogo;
