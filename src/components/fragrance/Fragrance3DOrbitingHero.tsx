'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface AnamorphicBokeh {
  x: number;
  y: number;
  z: number;
  radius: number;
  angle: number;
  speed: number;
  opacity: number;
  color: string;
}

interface Fragrance3DOrbitingHeroProps {
  accentColor?: string;
  activeSceneId?: string;
  onOrbitChange?: (angleDeg: number) => void;
  className?: string;
}

export const Fragrance3DOrbitingHero: React.FC<Fragrance3DOrbitingHeroProps> = ({
  accentColor = '#D6A35D',
  activeSceneId = 'scene-1',
  onOrbitChange,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 360° Orbit Angle State (in radians)
  const [orbitAngle, setOrbitAngle] = useState(0);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);
  const velocityRef = useRef(0.005);

  // Mouse / Touch Drag 360° Orbit Physics
  const handlePointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    lastMouseXRef.current = clientX;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - lastMouseXRef.current;
    lastMouseXRef.current = clientX;

    const dragSensitivity = 0.008;
    velocityRef.current = deltaX * dragSensitivity;
    targetAngleRef.current += velocityRef.current;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) handlePointerMove(e.clientX);
    };
    const handleWindowMouseUp = () => handlePointerUp();
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches[0]) {
        handlePointerMove(e.touches[0].clientX);
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  // Continuous 360° Orbit & Anamorphic Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const setupCanvasResolution = () => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const displayWidth = canvas.parentElement?.clientWidth || window.innerWidth;
      const displayHeight = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);

      return { width: displayWidth, height: displayHeight };
    };

    let { width, height } = setupCanvasResolution();

    const handleResize = () => {
      const res = setupCanvasResolution();
      width = res.width;
      height = res.height;
    };
    window.addEventListener('resize', handleResize);

    // Generate 50mm Anamorphic Oval Bokeh Particles
    const bokehCount = width < 768 ? 20 : 45;
    const bokehs: AnamorphicBokeh[] = Array.from({ length: bokehCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.2,
      y: (Math.random() - 0.5) * height * 1.2,
      z: Math.random() * 400 - 200,
      radius: Math.random() * 16 + 8,
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      opacity: Math.random() * 0.5 + 0.2,
      color:
        Math.random() > 0.4
          ? 'rgba(214, 163, 93, '  // Warm Tungsten Amber
          : Math.random() > 0.5
          ? 'rgba(255, 245, 214, ' // Warm Cream Gold
          : 'rgba(168, 95, 67, '    // Deep Wood Amber
    }));

    const render = () => {
      // Smooth orbit rotation with inertia
      if (!isDraggingRef.current) {
        velocityRef.current *= 0.96; // Smooth deceleration
        if (Math.abs(velocityRef.current) < 0.002) {
          velocityRef.current = 0.003; // Gentle auto orbit
        }
        targetAngleRef.current += velocityRef.current;
      }

      currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * 0.08;
      const angle = currentAngleRef.current;
      setOrbitAngle(angle);

      if (onOrbitChange) {
        const deg = Math.round((((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI));
        onOrbitChange(deg);
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Orbiting Ribbon of Warm Tungsten Light
      ctx.save();
      ctx.translate(centerX, centerY);

      const ribbonPoints = 120;
      const ribbonRadius = width < 768 ? 160 : 320;

      ctx.beginPath();
      for (let i = 0; i <= ribbonPoints; i++) {
        const theta = (i / ribbonPoints) * Math.PI * 2 + angle;
        const rx = Math.cos(theta) * ribbonRadius;
        const ry = Math.sin(theta) * (ribbonRadius * 0.35) + Math.sin(theta * 2) * 20;

        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }

      const ribbonGrad = ctx.createLinearGradient(-ribbonRadius, 0, ribbonRadius, 0);
      ribbonGrad.addColorStop(0, 'rgba(214, 163, 93, 0)');
      ribbonGrad.addColorStop(0.3, 'rgba(255, 235, 185, 0.45)');
      ribbonGrad.addColorStop(0.5, 'rgba(214, 163, 93, 0.7)');
      ribbonGrad.addColorStop(0.7, 'rgba(168, 95, 67, 0.45)');
      ribbonGrad.addColorStop(1, 'rgba(214, 163, 93, 0)');

      ctx.strokeStyle = ribbonGrad;
      ctx.lineWidth = width < 768 ? 8 : 16;
      ctx.shadowColor = '#D6A35D';
      ctx.shadowBlur = 30;
      ctx.stroke();
      ctx.restore();

      // 2. Draw 50mm Anamorphic Oval Bokeh Particles
      if (Array.isArray(bokehs) && bokehs.length > 0) {
        bokehs.forEach((b) => {
          if (!b) return;
          b.angle += b.speed + velocityRef.current * 0.5;

          // Orbit around Y-axis
          const rotX = b.x * Math.cos(angle) - b.z * Math.sin(angle);
          const rotZ = b.x * Math.sin(angle) + b.z * Math.cos(angle);

          // 3D Perspective Projection
          const perspective = 500;
          const scale = perspective / (perspective + rotZ + 250);
          const projX = centerX + rotX * scale;
          const projY = centerY + b.y * scale;

          const ovalWidth = Math.max(b.radius * scale * 2.2, 1);  // Anamorphic horizontal stretch
          const ovalHeight = Math.max(b.radius * scale * 0.85, 0.5); // Oval lens squeeze

          ctx.save();
          ctx.translate(projX, projY);
          ctx.rotate(-0.15); // Slight anamorphic lens tilt
          ctx.globalAlpha = Math.min(Math.max(b.opacity * scale, 0.05), 0.85);

          ctx.beginPath();
          ctx.ellipse(0, 0, ovalWidth, ovalHeight, 0, 0, Math.PI * 2);

          const bokehGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, ovalWidth);
          bokehGrad.addColorStop(0, b.color + '0.95)');
          bokehGrad.addColorStop(0.6, b.color + '0.4)');
          bokehGrad.addColorStop(1, b.color + '0)');

          ctx.fillStyle = bokehGrad;
          ctx.fill();

          // Anamorphic Specular Glint Center
          ctx.beginPath();
          ctx.ellipse(0, 0, ovalWidth * 0.3, ovalHeight * 0.3, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fill();

          ctx.restore();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [onOrbitChange]);

  const degVal = Math.round((((orbitAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI));

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onTouchStart={(e) => e.touches[0] && handlePointerDown(e.touches[0].clientX)}
      className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {/* Dynamic 50mm Anamorphic Bokeh & Light Ribbon Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full z-10"
      />

      {/* Center 360-Degree Revolving Luxury Perfume Bottle Axis */}
      <div
        className="relative z-20 w-48 sm:w-72 aspect-[3/4] flex items-center justify-center transition-transform duration-100 ease-out transform-gpu pointer-events-none"
        style={{
          transform: `perspective(1000px) rotateY(${degVal}deg) scale(1.05)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* 3D Bottle Silhouette / Anamorphic Render Vessel */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          
          {/* Metallic Gold Cap */}
          <div className="w-16 sm:w-24 h-10 sm:h-14 bg-gradient-to-r from-[#D6A35D] via-[#FFF5D6] to-[#9A5C24] rounded-t-sm shadow-2xl border-b border-[#3A2418] relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-75"
              style={{ transform: `translateX(${((degVal % 180) - 90) * 1.5}px)` }}
            />
          </div>

          {/* Glass Neck Lip Ring */}
          <div className="w-12 sm:w-18 h-3 bg-gradient-to-r from-white/40 via-white/80 to-white/30 border-x border-white/60" />

          {/* Crystal Glass Body with Warm Amber Liquid */}
          <div
            className="relative w-44 sm:w-64 h-56 sm:h-80 bg-gradient-to-b from-white/20 via-white/5 to-black/50 border-2 border-white/40 backdrop-blur-md shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col justify-end p-3 overflow-hidden"
            style={{ borderRadius: '14px 14px 32px 32px' }}
          >
            {/* Beveled Facet Edge Refractions */}
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/60 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-white/60 to-transparent" />

            {/* Liquid Amber Reservoir */}
            <div
              className="relative w-full h-[78%] rounded-b-2xl overflow-hidden transition-all duration-300"
              style={{
                background: `linear-gradient(180deg, ${accentColor}DD 0%, #9A5C24EE 60%, #3A2418 100%)`,
                boxShadow: `inset 0 0 50px ${accentColor}AA`
              }}
            >
              {/* Liquid Wave Line */}
              <div
                className="absolute top-0 inset-x-0 h-4 bg-white/50 rounded-full animate-pulse blur-[1px]"
                style={{ transform: `scaleY(0.7) translateY(${Math.sin(degVal * 0.05) * 6}px)` }}
              />

              {/* Embossed Branding Plate */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 backdrop-blur-md border border-[#D6A35D]/70 text-center shadow-2xl">
                <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.3em] text-[#D6A35D] uppercase block">
                  EAU DE PARFUM
                </span>
                <span className="font-serif text-xs sm:text-sm font-bold text-[#F4EFE7] tracking-[0.2em] uppercase block">
                  MUNAAZ ESSENCE
                </span>
              </div>
            </div>

            {/* Orbiting Specular Glint Refraction */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none transition-transform duration-75"
              style={{ transform: `translateX(${((degVal % 180) - 90) * 3}px)` }}
            />
          </div>

        </div>
      </div>

      {/* Orbit Indicator & Drag Prompt */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 border border-[#D6A35D]/40 text-[9px] font-mono text-[#D6A35D] uppercase tracking-widest pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#D6A35D] animate-ping" />
        <span>360° ORBITING AXIS · {degVal}°</span>
      </div>
    </div>
  );
};
