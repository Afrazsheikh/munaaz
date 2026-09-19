'use client';

import React, { useEffect, useRef, useState } from 'react';

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

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Project2D {
  px: number;
  py: number;
  rz: number;
  scale: number;
}

interface Face3D {
  id: string;
  points: Point3D[];
  type: 'cap' | 'body-front' | 'body-back' | 'body-side' | 'body-top' | 'body-bottom' | 'neck';
  normal?: Point3D;
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

  const accentColorRef = useRef(accentColor);
  const onOrbitChangeRef = useRef(onOrbitChange);

  useEffect(() => {
    accentColorRef.current = accentColor;
    onOrbitChangeRef.current = onOrbitChange;
  });

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

      if (onOrbitChangeRef.current) {
        const deg = Math.round((((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI));
        onOrbitChangeRef.current(deg);
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Orbiting Ribbon of Warm Tungsten Light
      ctx.save();
      ctx.translate(centerX, centerY);

      const ribbonPoints = 120;
      const ribbonRadius = width < 768 ? 170 : 330;

      ctx.beginPath();
      for (let i = 0; i <= ribbonPoints; i++) {
        const theta = (i / ribbonPoints) * Math.PI * 2 + angle;
        const rx = Math.cos(theta) * ribbonRadius;
        const ry = Math.sin(theta) * (ribbonRadius * 0.32) + Math.sin(theta * 2) * 18;

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

          const rotX = b.x * Math.cos(angle) - b.z * Math.sin(angle);
          const rotZ = b.x * Math.sin(angle) + b.z * Math.cos(angle);

          const perspective = 500;
          const denom = perspective + rotZ + 250;
          if (denom <= 20) return; // Prevent division by zero or negative perspective
          const scale = perspective / denom;
          if (scale <= 0 || !isFinite(scale)) return;

          const projX = centerX + rotX * scale;
          const projY = centerY + b.y * scale;

          const ovalWidth = Math.max(Math.abs(b.radius * scale * 2.2), 1);
          const ovalHeight = Math.max(Math.abs(b.radius * scale * 0.85), 0.5);

          ctx.save();
          ctx.translate(projX, projY);
          ctx.rotate(-0.15);
          ctx.globalAlpha = Math.min(Math.max(b.opacity * scale, 0.05), 0.85);

          ctx.beginPath();
          ctx.ellipse(0, 0, ovalWidth, ovalHeight, 0, 0, Math.PI * 2);

          const bokehGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, ovalWidth);
          bokehGrad.addColorStop(0, b.color + '0.95)');
          bokehGrad.addColorStop(0.6, b.color + '0.4)');
          bokehGrad.addColorStop(1, b.color + '0)');

          ctx.fillStyle = bokehGrad;
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(0, 0, Math.max(ovalWidth * 0.3, 0.5), Math.max(ovalHeight * 0.3, 0.5), 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fill();

          ctx.restore();
        });
      }

      // 3. Draw 3D Volumetric Photorealistic Perfume Bottle in Canvas
      draw3DCanvasBottle(ctx, centerX, centerY, width, height, angle, accentColorRef.current);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const degVal = Math.round((((orbitAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI));

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onTouchStart={(e) => e.touches[0] && handlePointerDown(e.touches[0].clientX)}
      className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {/* Photorealistic 3D Canvas Engine (Bokeh, Ribbon & Solid 3D Bottle) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full z-10"
      />

      {/* Orbit Indicator & Drag Prompt */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 border border-[#D6A35D]/40 text-[9px] font-mono text-[#D6A35D] uppercase tracking-widest pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#D6A35D] animate-ping" />
        <span>360° VOLUMETRIC BOTTLE · {degVal}°</span>
      </div>
    </div>
  );
};

// PHOTOREALISTIC 3D CANVAS BOTTLE RENDER ENGINE
function draw3DCanvasBottle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  canvasWidth: number,
  canvasHeight: number,
  angle: number,
  accentColor: string
) {
  const isMobile = canvasWidth < 768;

  // Geometry dimensions
  const bw = isMobile ? 54 : 76; // Body half-width
  const bh = isMobile ? 150 : 200; // Body height
  const bd = isMobile ? 26 : 34; // Body half-depth (Total depth = 52px / 68px)

  const cw = isMobile ? 24 : 32; // Cap half-width
  const ch = isMobile ? 36 : 46; // Cap height
  const cd = isMobile ? 18 : 24; // Cap half-depth

  const yBodyTop = isMobile ? -50 : -70;
  const yBodyBottom = yBodyTop + bh;

  const yNeckTop = yBodyTop - 12;
  const yCapBottom = yNeckTop;
  const yCapTop = yCapBottom - ch;

  const perspective = 700;

  // 3D Projection Helper
  const project = (x: number, y: number, z: number): Project2D => {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const rx = x * cosA + z * sinA;
    const ry = y;
    const rz = -x * sinA + z * cosA;

    const scale = perspective / (perspective + rz + 150);
    return {
      px: centerX + rx * scale,
      py: centerY + ry * scale,
      rz,
      scale
    };
  };

  // Pedestal Ambient Shadow
  ctx.save();
  const shadowScale = project(0, yBodyBottom + 20, 0);
  ctx.beginPath();
  ctx.ellipse(shadowScale.px, shadowScale.py, bw * 1.3 * shadowScale.scale, bd * 0.8 * shadowScale.scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.filter = 'blur(12px)';
  ctx.fill();
  ctx.restore();

  // Define 3D Faces
  const faces: Face3D[] = [];

  // CAP FACES
  faces.push({
    id: 'cap-front',
    type: 'cap',
    points: [
      { x: -cw, y: yCapTop, z: cd },
      { x: cw, y: yCapTop, z: cd },
      { x: cw, y: yCapBottom, z: cd },
      { x: -cw, y: yCapBottom, z: cd }
    ]
  });

  faces.push({
    id: 'cap-back',
    type: 'cap',
    points: [
      { x: cw, y: yCapTop, z: -cd },
      { x: -cw, y: yCapTop, z: -cd },
      { x: -cw, y: yCapBottom, z: -cd },
      { x: cw, y: yCapBottom, z: -cd }
    ]
  });

  faces.push({
    id: 'cap-left',
    type: 'cap',
    points: [
      { x: -cw, y: yCapTop, z: -cd },
      { x: -cw, y: yCapTop, z: cd },
      { x: -cw, y: yCapBottom, z: cd },
      { x: -cw, y: yCapBottom, z: -cd }
    ]
  });

  faces.push({
    id: 'cap-right',
    type: 'cap',
    points: [
      { x: cw, y: yCapTop, z: cd },
      { x: cw, y: yCapTop, z: -cd },
      { x: cw, y: yCapBottom, z: -cd },
      { x: cw, y: yCapBottom, z: cd }
    ]
  });

  faces.push({
    id: 'cap-top',
    type: 'cap',
    points: [
      { x: -cw, y: yCapTop, z: -cd },
      { x: cw, y: yCapTop, z: -cd },
      { x: cw, y: yCapTop, z: cd },
      { x: -cw, y: yCapTop, z: cd }
    ]
  });

  // BODY FACES
  faces.push({
    id: 'body-front',
    type: 'body-front',
    points: [
      { x: -bw, y: yBodyTop, z: bd },
      { x: bw, y: yBodyTop, z: bd },
      { x: bw, y: yBodyBottom, z: bd },
      { x: -bw, y: yBodyBottom, z: bd }
    ]
  });

  faces.push({
    id: 'body-back',
    type: 'body-back',
    points: [
      { x: bw, y: yBodyTop, z: -bd },
      { x: -bw, y: yBodyTop, z: -bd },
      { x: -bw, y: yBodyBottom, z: -bd },
      { x: bw, y: yBodyBottom, z: -bd }
    ]
  });

  faces.push({
    id: 'body-left',
    type: 'body-side',
    points: [
      { x: -bw, y: yBodyTop, z: -bd },
      { x: -bw, y: yBodyTop, z: bd },
      { x: -bw, y: yBodyBottom, z: bd },
      { x: -bw, y: yBodyBottom, z: -bd }
    ]
  });

  faces.push({
    id: 'body-right',
    type: 'body-side',
    points: [
      { x: bw, y: yBodyTop, z: bd },
      { x: bw, y: yBodyTop, z: -bd },
      { x: bw, y: yBodyBottom, z: -bd },
      { x: bw, y: yBodyBottom, z: bd }
    ]
  });

  faces.push({
    id: 'body-top',
    type: 'body-top',
    points: [
      { x: -bw, y: yBodyTop, z: -bd },
      { x: bw, y: yBodyTop, z: -bd },
      { x: bw, y: yBodyTop, z: bd },
      { x: -bw, y: yBodyTop, z: bd }
    ]
  });

  faces.push({
    id: 'body-bottom',
    type: 'body-bottom',
    points: [
      { x: -bw, y: yBodyBottom, z: bd },
      { x: bw, y: yBodyBottom, z: bd },
      { x: bw, y: yBodyBottom, z: -bd },
      { x: -bw, y: yBodyBottom, z: -bd }
    ]
  });

  // Sort Faces by Z-Depth (Painter's Algorithm)
  const renderedFaces = faces.map((face) => {
    const projPoints = face.points.map((pt) => project(pt.x, pt.y, pt.z));
    const avgRz = projPoints.reduce((sum, p) => sum + p.rz, 0) / projPoints.length;

    // Calculate face normal vector in 3D
    const p0 = face.points[0];
    const p1 = face.points[1];
    const p2 = face.points[2];

    const v1 = { x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z };
    const v2 = { x: p2.x - p0.x, y: p2.y - p0.y, z: p2.z - p0.z };

    const nx = v1.y * v2.z - v1.z * v2.y;
    const ny = v1.z * v2.x - v1.x * v2.z;
    const nz = v1.x * v2.y - v1.y * v2.x;

    const len = Math.hypot(nx, ny, nz) || 1;
    const norm = { x: nx / len, y: ny / len, z: nz / len };

    // Rotate normal to world space
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const worldNx = norm.x * cosA + norm.z * sinA;
    const worldNz = -norm.x * sinA + norm.z * cosA;

    return {
      face,
      projPoints,
      avgRz,
      worldNx,
      worldNz,
      worldNy: norm.y
    };
  });

  renderedFaces.sort((a, b) => b.avgRz - a.avgRz);

  // Draw Glass Neck Ring
  const drawNeck = () => {
    const topNeck = project(0, yNeckTop, 0);
    const botNeck = project(0, yBodyTop, 0);
    const neckR = (isMobile ? 14 : 18) * topNeck.scale;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(topNeck.px, (topNeck.py + botNeck.py) / 2, neckR, 8 * topNeck.scale, 0, 0, Math.PI * 2);

    const neckGrad = ctx.createLinearGradient(topNeck.px - neckR, 0, topNeck.px + neckR, 0);
    neckGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    neckGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
    neckGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

    ctx.fillStyle = neckGrad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  // Light Direction Vector
  const lightDir = { x: 0.5, y: -0.6, z: 0.6 };

  // Draw Each Face
  renderedFaces.forEach(({ face, projPoints, worldNx, worldNy, worldNz }) => {
    // Only render front-facing polygons (culling back-facing normals)
    if (worldNz < -0.05 && face.id !== 'body-top' && face.id !== 'body-bottom') return;

    // Light Intensity calculation
    const dotLight = Math.max(0.15, worldNx * lightDir.x + worldNy * lightDir.y + worldNz * lightDir.z);

    ctx.save();
    ctx.beginPath();
    projPoints.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.px, p.py);
      else ctx.lineTo(p.px, p.py);
    });
    ctx.closePath();

    if (face.type === 'cap') {
      // Metallic Gold Cap Face
      const goldGrad = ctx.createLinearGradient(
        projPoints[0].px, projPoints[0].py,
        projPoints[2].px, projPoints[2].py
      );
      const intensity = Math.min(Math.max(dotLight * 1.3, 0.3), 1);

      goldGrad.addColorStop(0, `rgba(214, 163, 93, ${intensity})`);
      goldGrad.addColorStop(0.5, `rgba(255, 245, 214, ${Math.min(intensity * 1.2, 1)})`);
      goldGrad.addColorStop(1, `rgba(154, 92, 36, ${intensity * 0.8})`);

      ctx.fillStyle = goldGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 245, 214, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (face.id === 'body-back') {
      // Dark Smoked Glass Back Wall
      ctx.fillStyle = 'rgba(26, 16, 12, 0.95)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(58, 36, 24, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (face.type === 'body-side') {
      // Glass Side Wall with Fluid Core (Visible at 90° & 270°)
      const sideGrad = ctx.createLinearGradient(
        projPoints[0].px, projPoints[0].py,
        projPoints[1].px, projPoints[1].py
      );
      sideGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      sideGrad.addColorStop(0.2, accentColor + 'CC');
      sideGrad.addColorStop(0.8, '#3A2418EE');
      sideGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

      ctx.fillStyle = sideGrad;
      ctx.fill();

      // Specular Glass Edge Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (face.id === 'body-top' || face.id === 'body-bottom') {
      // Glass Shoulder / Base Facet
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (face.id === 'body-front') {
      // Crystal Clear Front Glass Face with Liquid & Gold Label
      const pTopL = projPoints[0];
      const pTopR = projPoints[1];
      const pBotR = projPoints[2];
      const pBotL = projPoints[3];

      // Glass Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fill();

      // Liquid Amber Reservoir
      const fluidTopY = pTopL.py + (pBotL.py - pTopL.py) * 0.22;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pTopL.px, fluidTopY);
      ctx.lineTo(pTopR.px, fluidTopY);
      ctx.lineTo(pBotR.px, pBotR.py);
      ctx.lineTo(pBotL.px, pBotL.py);
      ctx.closePath();

      const liquidGrad = ctx.createLinearGradient(pTopL.px, fluidTopY, pBotL.px, pBotL.py);
      liquidGrad.addColorStop(0, accentColor + 'F0');
      liquidGrad.addColorStop(0.6, '#9A5C24EE');
      liquidGrad.addColorStop(1, '#2A150CFF');

      ctx.fillStyle = liquidGrad;
      ctx.fill();
      ctx.restore();

      // Glass Bevel Borders
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Embossed Luxury Label Plate (Only drawn if facing camera)
      if (worldNz > 0.2) {
        const labelCenterX = (pTopL.px + pTopR.px + pBotR.px + pBotL.px) / 4;
        const labelCenterY = (pTopL.py + pTopR.py + pBotR.py + pBotL.py) / 4;
        const labelW = (pTopR.px - pTopL.px) * 0.72;
        const labelH = (pBotL.py - pTopL.py) * 0.32;

        ctx.save();
        ctx.translate(labelCenterX, labelCenterY);

        // Label Outer Gold Border
        ctx.fillStyle = 'rgba(15, 12, 10, 0.92)';
        ctx.strokeStyle = '#D6A35D';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.rect(-labelW / 2, -labelH / 2, labelW, labelH);
        ctx.fill();
        ctx.stroke();

        // Label Typography
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Subtitle
        ctx.fillStyle = '#D6A35D';
        ctx.font = `${Math.max(7, Math.round(9 * pTopL.scale))}px monospace`;
        ctx.fillText('HAUTE PARFUMERIE', 0, -labelH * 0.25);

        // Main Title
        ctx.fillStyle = '#F4EFE7';
        ctx.font = `bold ${Math.max(10, Math.round(13 * pTopL.scale))}px Georgia, serif`;
        ctx.fillText('MUNAAZ ESSENCE', 0, 0);

        // Concentration
        ctx.fillStyle = 'rgba(214, 163, 93, 0.85)';
        ctx.font = `${Math.max(6, Math.round(8 * pTopL.scale))}px sans-serif`;
        ctx.fillText('EXTRAIT DE PARFUM', 0, labelH * 0.28);

        ctx.restore();
      }

      // Dynamic Specular Glare Reflection Streak
      const glintX = pTopL.px + (pTopR.px - pTopL.px) * (0.3 + Math.sin(angle) * 0.3);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(glintX, pTopL.py);
      ctx.lineTo(glintX + 15, pTopL.py);
      ctx.lineTo(glintX - 10, pBotL.py);
      ctx.lineTo(glintX - 25, pBotL.py);
      ctx.closePath();

      const glintGrad = ctx.createLinearGradient(glintX - 25, pTopL.py, glintX + 15, pBotL.py);
      glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

      ctx.fillStyle = glintGrad;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  });

  // Render Neck Ring at exact 3D neck position
  drawNeck();
}
