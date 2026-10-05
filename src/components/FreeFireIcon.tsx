import React from 'react';

interface FreeFireIconProps {
  className?: string;
  fillColor?: string;
}

export const FreeFireIcon: React.FC<FreeFireIconProps> = ({ 
  className = "h-5 w-5", 
  fillColor = "currentColor" 
}) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill={fillColor}
    >
      <path 
        d="M18 12 L84 12 L76 34 L42 34 L38 46 L70 46 L62 66 L32 66 L24 92 L2 92 Z" 
      />
      <polygon points="56,16 66,16 61,29 51,29" opacity="0.25" fill="#000000" />
    </svg>
  );
};
