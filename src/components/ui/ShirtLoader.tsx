'use client';

import React, { useState, useEffect } from 'react';

interface ShirtLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  label?: string;
  showProgress?: boolean;
}

export const ShirtLoader: React.FC<ShirtLoaderProps> = ({
  size = 'full',
  label = 'MUNAAZ ATELIER',
  showProgress = true
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showProgress) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 20);

    return () => clearInterval(interval);
  }, [showProgress]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    full: 'w-48 h-48'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center select-none">
      
      {/* Outer Floating & Glow Wrapper */}
      <div className="relative flex items-center justify-center">
        
        {/* Ambient Glowing Aura */}
        <div className="absolute w-40 h-40 bg-[#A85F43]/15 rounded-full blur-2xl animate-pulse" />

        {/* Floating Shirt Silhouette SVG Container */}
        <div className={`relative ${sizeClasses[size]} animate-[bounce_3s_ease-in-out_infinite]`}>
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-[#A85F43] drop-shadow-md"
          >
            {/* Elegant Hanger Hook */}
            <path
              d="M60 14 C 60 6, 70 6, 70 12 C 70 18, 60 22, 60 28"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-90"
            />

            {/* Hanger Bar */}
            <path
              d="M20 40 L60 28 L100 40 L20 40 Z"
              fill="#F3E5D0"
              stroke="#806B5D"
              strokeWidth="2"
            />

            {/* Tailored Collar */}
            <path
              d="M46 32 L60 44 L74 32 L66 28 L60 33 L54 28 Z"
              fill="#FFF9F1"
              stroke="#35251E"
              strokeWidth="2.5"
            />

            {/* Main Shirt Body Contour with Drawing Animation */}
            <path
              d="M46 32 L22 42 L28 62 L38 56 L38 104 L82 104 L82 56 L92 62 L98 42 L74 32 Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#FFF9F1"
              className="transition-all duration-300"
            />

            {/* Placket Stitching */}
            <path
              d="M60 44 L60 104"
              stroke="#35251E"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Pearl Buttons with Glowing Pulse */}
            <circle cx="60" cy="54" r="2.5" fill="#35251E" className="animate-ping" />
            <circle cx="60" cy="54" r="2" fill="#C18A60" />

            <circle cx="60" cy="68" r="2" fill="#35251E" />
            <circle cx="60" cy="82" r="2" fill="#35251E" />
            <circle cx="60" cy="96" r="2" fill="#35251E" />

            {/* Left Pocket Outline */}
            <path
              d="M42 58 L52 58 L52 70 L47 74 L42 70 Z"
              stroke="#806B5D"
              strokeWidth="1.5"
              fill="#F3E5D0"
              className="opacity-80"
            />

            {/* Tailored Cuff Creases */}
            <path d="M24 48 L32 44" stroke="#806B5D" strokeWidth="2" />
            <path d="M96 48 L88 44" stroke="#806B5D" strokeWidth="2" />
          </svg>
        </div>

      </div>

      {/* Brand Header */}
      <div className="mt-8 space-y-2">
        <h3 className="font-serif text-lg font-bold tracking-[0.3em] text-[#35251E] uppercase">
          {label}
        </h3>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#806B5D] font-sans">
          EVERYDAY, ELEVATED
        </p>
      </div>

      {/* Progress Bar & Percentage */}
      {showProgress && (
        <div className="w-48 mt-6 space-y-2">
          <div className="w-full bg-[#DDCBB7] h-1 rounded-full overflow-hidden">
            <div
              className="bg-[#A85F43] h-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#A85F43] block">
            {progress}%
          </span>
        </div>
      )}

    </div>
  );
};
