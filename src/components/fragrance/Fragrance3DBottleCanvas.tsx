'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Fragrance3DBottleCanvasProps {
  accentColor?: string;
  className?: string;
}

export const Fragrance3DBottleCanvas: React.FC<Fragrance3DBottleCanvasProps> = ({
  accentColor = '#D6A35D',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [targetRot, setTargetRot] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Track cursor movement for 3D gyro tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      setTargetRot({
        x: deltaY * -18, // tilt up/down
        y: deltaX * 22   // rotate left/right
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth lerp interpolation for 3D spring dynamics
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setRot((prev) => ({
        x: prev.x + (targetRot.x - prev.x) * 0.08,
        y: prev.y + (targetRot.y - prev.y) * 0.08
      }));
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [targetRot]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTargetRot({ x: 0, y: 0 });
      }}
      className={`relative flex items-center justify-center select-none pointer-events-auto transition-transform duration-300 ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Rotating Glass Bottle Vessel */}
      <div
        className="relative w-48 sm:w-64 h-72 sm:h-96 transition-transform duration-100 ease-out transform-gpu flex flex-col items-center justify-center"
        style={{
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) translateZ(40px) scale(${isHovered ? 1.05 : 1.0})`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Ambient 3D Backlight Glow */}
        <div
          className="absolute inset-0 rounded-3xl blur-3xl opacity-50 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, rgba(23, 20, 17, 0) 70%)`,
            transform: 'translateZ(-50px)'
          }}
        />

        {/* 1. Metallic Gold Cap */}
        <div
          className="relative w-16 sm:w-20 h-12 sm:h-14 bg-gradient-to-r from-[#D6A35D] via-[#FFF5D6] to-[#9A5C24] rounded-t-sm shadow-2xl border-b border-[#3A2418] overflow-hidden"
          style={{ transform: 'translateZ(35px)' }}
        >
          {/* Specular Highlight Glint */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-300"
            style={{ transform: `translateX(${rot.y * 3.5}px)` }}
          />
        </div>

        {/* 2. Glass Neck Lip Ring */}
        <div
          className="w-12 sm:w-16 h-3 bg-gradient-to-r from-white/40 via-white/80 to-white/30 border-x border-white/60"
          style={{ transform: 'translateZ(30px)' }}
        />

        {/* 3. Crystal Glass Bottle Body */}
        <div
          className="relative w-40 sm:w-56 h-52 sm:h-72 bg-gradient-to-b from-white/15 via-white/5 to-black/40 border-2 border-white/40 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-end p-2 overflow-hidden"
          style={{
            transform: 'translateZ(25px)',
            borderRadius: '12px 12px 28px 28px'
          }}
        >
          {/* Glass Beveled Edges Refraction (Left & Right Facets) */}
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/50 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-white/50 to-transparent pointer-events-none" />

          {/* Dynamic Liquid Cavity Fill */}
          <div
            className="relative w-full h-[75%] rounded-b-2xl overflow-hidden transition-all duration-500"
            style={{
              background: `linear-gradient(180deg, ${accentColor}CC 0%, #9A5C24EE 60%, #3A2418 100%)`,
              boxShadow: `inset 0 0 40px ${accentColor}99`
            }}
          >
            {/* Liquid Surface Meniscus Wave Motion */}
            <div
              className="absolute top-0 inset-x-0 h-4 bg-white/40 rounded-full animate-pulse blur-[1px]"
              style={{
                transform: `scaleY(0.7) translateY(${rot.x * -0.5}px)`
              }}
            />

            {/* Rising Inner Liquid Bubbles */}
            <div className="absolute inset-0 pointer-events-none opacity-80">
              <div className="absolute bottom-4 left-6 w-2.5 h-2.5 bg-white/70 rounded-full blur-[0.5px] animate-bounce" />
              <div className="absolute bottom-10 right-8 w-3 h-3 bg-amber-200/80 rounded-full blur-[0.5px] animate-pulse" />
              <div className="absolute bottom-16 left-12 w-2 h-2 bg-white/60 rounded-full" />
            </div>

            {/* Embossed Gold Branding Label */}
            <div
              className="absolute inset-x-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 backdrop-blur-md border border-[#D6A35D]/60 text-center shadow-2xl"
              style={{ transform: 'translateZ(45px)' }}
            >
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.3em] text-[#D6A35D] uppercase block">
                EAU DE PARFUM
              </span>
              <span className="font-serif text-xs sm:text-sm font-bold text-[#F4EFE7] tracking-[0.2em] uppercase block">
                MUNAAZ ESSENCE
              </span>
            </div>
          </div>

          {/* Exterior Moving Specular Glass Reflections */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent pointer-events-none transition-transform duration-200"
            style={{
              transform: `translateX(${rot.y * 4}px) translateY(${rot.x * 4}px)`
            }}
          />
        </div>

        {/* Bottle Base Shadow */}
        <div
          className="w-36 sm:w-48 h-4 bg-black/80 rounded-full blur-md"
          style={{ transform: 'translateZ(-20px) translateY(10px) scaleY(0.4)' }}
        />
      </div>
    </div>
  );
};
