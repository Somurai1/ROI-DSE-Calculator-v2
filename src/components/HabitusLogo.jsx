import React from 'react';

const HabitusLogo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "h-8",
    default: "h-12", 
    large: "h-16"
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Symbol - Exact match from brand guidelines */}
      <svg 
        className={`${sizeClasses[size]} w-auto mr-3`}
        viewBox="0 0 60 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central vertical spine (dark teal #036665) */}
        <circle cx="30" cy="12" r="6" fill="#036665"/>
        <rect x="27" y="18" width="6" height="12" fill="#036665"/>
        <circle cx="30" cy="36" r="6" fill="#036665"/>
        
        {/* Horizontal elements (gold #cfb382) */}
        <circle cx="18" cy="30" r="5" fill="#cfb382"/>
        <rect x="13" y="28" width="10" height="4" fill="#cfb382"/>
        <circle cx="42" cy="30" r="5" fill="#cfb382"/>
        <rect x="37" y="28" width="10" height="4" fill="#cfb382"/>
        
        {/* Side circles (dark teal #036665) */}
        <circle cx="8" cy="30" r="3" fill="#036665"/>
        <circle cx="52" cy="30" r="3" fill="#036665"/>
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
