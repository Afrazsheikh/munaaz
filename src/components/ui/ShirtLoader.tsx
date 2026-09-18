'use client';

import React from 'react';

interface ShirtLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  label?: string;
}

export const ShirtLoader: React.FC<ShirtLoaderProps> = ({
  size = 'md',
  label = 'CURATING ATELIER...'
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    full: 'w-40 h-40'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className={`relative ${sizeClasses[size]}`}>
        
        {/* Animated Tailored Shirt SVG */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#A85F43]"
        >
          {/* Hanger Hook Top */}
          <path
            d="M50 12 C 50 5, 58 5, 58 10 C 58 15, 50 18, 50 22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-[dash_2s_ease-in-out_infinite]"
          />

          {/* Collar Line */}
          <path
            d="M38 24 L50 32 L62 24 L56 22 L50 25 L44 22 Z"
            stroke="#35251E"
            strokeWidth="2"
            fill="#F3E5D0"
          />

          {/* Shirt Outer Contour (Shoulders, Sleeves, Torso) */}
          <path
            d="M38 24 L18 32 L24 48 L32 44 L32 86 L68 86 L68 44 L76 48 L82 32 L62 24 Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />

          {/* Placket & Buttons Line */}
          <path
            d="M50 32 L50 86"
            stroke="#35251E"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Placket Buttons */}
          <circle cx="50" cy="42" r="1.5" fill="#35251E" />
          <circle cx="50" cy="54" r="1.5" fill="#35251E" />
          <circle cx="50" cy="66" r="1.5" fill="#35251E" />
          <circle cx="50" cy="78" r="1.5" fill="#35251E" />

          {/* Left Pocket Contour */}
          <path
            d="M36 44 L44 44 L44 54 L40 57 L36 54 Z"
            stroke="#806B5D"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>

        {/* Shimmer Ring Halo */}
        <div className="absolute inset-0 rounded-full border border-[#C18A60]/30 animate-ping" />
      </div>

      {label && (
        <span className="font-serif text-xs font-semibold tracking-[0.25em] text-[#35251E] uppercase mt-4 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};
