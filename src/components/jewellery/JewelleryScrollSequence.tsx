'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Gem } from 'lucide-react';

interface JewelleryScrollSequenceProps {
  onExploreClick?: () => void;
}

// Convert number to ordinal string: 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", 21 -> "21st", etc.
const getOrdinalString = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const JewelleryScrollSequence: React.FC<JewelleryScrollSequenceProps> = ({ onExploreClick }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [totalFrames, setTotalFrames] = useState<number>(5); // default fallback, probes dynamically
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Floating Silver Dust Particles for Canvas overlay
  const particlesRef = useRef<
    { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[]
  >([]);

  // 1. Dynamic Image Sequence Preloader (Parallel load for 1st-5th, then probe higher)
  useEffect(() => {
    let isMounted = true;

    const loadInitialFrames = async () => {
      const initialOrdinals = ['1st', '2nd', '3rd', '4th', '5th'];
      
      // Load initial 5 frames in parallel for instant rendering
      const initialPromises = initialOrdinals.map((ord) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.src = `/jewScene/${ord}.jpeg`;
          img.onload = () => resolve(img);
          img.onerror = () => {
            // fallback attempt with .jpg
            const fallback = new window.Image();
            fallback.src = `/jewScene/${ord}.jpg`;
            fallback.onload = () => resolve(fallback);
            fallback.onerror = () => reject();
          };
        });
      });

      try {
        const loadedInitial = await Promise.all(initialPromises);
        if (isMounted) {
          setImages(loadedInitial);
          setTotalFrames(loadedInitial.length);
          setIsLoaded(true);
        }

        // Probing for 6th, 7th, 8th... if available
        const extraImgs: HTMLImageElement[] = [...loadedInitial];
        for (let i = 6; i <= 100; i++) {
          const ordinal = getOrdinalString(i);
          const possiblePaths = [
            `/jewScene/${ordinal}.jpeg`,
            `/jewScene/${ordinal}.jpg`,
            `/jewScene/${ordinal}.png`,
            `/jewScene/${ordinal}.webp`,
          ];

          let extraImg: HTMLImageElement | null = null;
          for (const path of possiblePaths) {
            try {
              extraImg = await new Promise<HTMLImageElement>((res, rej) => {
                const img = new window.Image();
                img.src = path;
                img.onload = () => res(img);
                img.onerror = () => rej();
              });
              break;
            } catch {
              // try next extension
            }
          }

          if (extraImg) {
            extraImgs.push(extraImg);
          } else {
            break;
          }
        }

        if (isMounted && extraImgs.length > loadedInitial.length) {
          setImages(extraImgs);
          setTotalFrames(extraImgs.length);
        }
      } catch (err) {
        console.warn('Initial frame loading notice:', err);
      }
    };

    loadInitialFrames();

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize Silver Particle Physics
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.0003,
        speedY: (Math.random() - 0.5) * 0.0004 - 0.0001,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }
    particlesRef.current = particles;
  }, []);

  // 2. High-Performance Canvas Rendering Loop
  const renderCanvas = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas || images.length === 0) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = images[frameIndex] || images[0];
      if (!img) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Handle Device Pixel Ratio for crisp retina displays
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Enable maximum sharpness bicubic smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const imgAspect = (img.naturalWidth && img.naturalHeight)
        ? img.naturalWidth / img.naturalHeight
        : 1;

      let renderW = width;
      let renderH = height;

      if (width < 768) {
        // Mobile layout: Fit contained
        renderH = height * 0.90;
        renderW = renderH * imgAspect;
        if (renderW > width * 0.95) {
          renderW = width * 0.95;
          renderH = renderW / imgAspect;
        }
      } else {
        // Desktop layout: Fit contained
        renderH = height * 0.92;
        renderW = renderH * imgAspect;
        if (renderW > width * 0.95) {
          renderW = width * 0.95;
          renderH = renderW / imgAspect;
        }
      }

      const offsetX = (width - renderW) / 2;
      const offsetY = (height - renderH) / 2;

      // Draw Main Frame Image
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

      // Draw Floating Silver Particles
      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        const px = p.x * width;
        const py = p.y * height;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${p.opacity * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#C0C0C0';
        ctx.fill();
      });

      ctx.restore();
    },
    [images]
  );

  // 3. Scroll Progress Listener & Frame Mapping
  useEffect(() => {
    let animFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Calculate relative scroll inside container
      const totalScrollable = rect.height - windowH;
      if (totalScrollable <= 0) return;

      const currentScroll = Math.max(0, -rect.top);
      const rawProgress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

      setProgress(rawProgress);

      if (images.length > 0) {
        // Map 0 -> 1 progress smoothly across available frames
        const frameIdx = Math.min(images.length - 1, Math.floor(rawProgress * images.length));
        setCurrentFrameIndex(frameIdx);

        animFrameId = requestAnimationFrame(() => renderCanvas(frameIdx));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [images, renderCanvas]);

  return (
    <div ref={containerRef} className="relative min-h-[350vh] bg-[#050505]">
      {/* Sticky Full-Viewport Camera Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#050505]">
        
        {/* Canvas Render Layer */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain transition-transform duration-100"
        />

        {/* Ambient Radial Rim Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050505_95%)] pointer-events-none" />

        {/* --- STAGE OVERLAYS BASED ON SCROLL PROGRESS --- */}

        {/* 1. BEGINNING (0% - 25% Scroll): TIMELESS CRAFTSMANSHIP */}
        <div
          className="absolute inset-x-0 top-1/4 max-w-4xl mx-auto px-4 text-center space-y-4 pointer-events-none transition-all duration-700"
          style={{
            opacity: progress < 0.28 ? Math.max(0, 1 - progress * 4) : 0,
            transform: `translateY(${progress * -50}px)`,
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C0C0C0]/10 border border-[#C0C0C0]/30 text-[#E2E8F0] text-[10px] font-mono tracking-[0.3em] uppercase">
            <Gem className="w-3.5 h-3.5 text-[#C0C0C0] animate-pulse" />
            <span>MUNAAZ HAUTE JOAILLERIE</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#F5F1E8] via-[#E2E8F0] to-[#94A3B8]">
            TIMELESS CRAFTSMANSHIP
          </h2>

          <p className="text-xs sm:text-sm text-[#D8C7AD]/70 font-light tracking-widest max-w-md mx-auto uppercase">
            Solid 925 Sterling Silver Forged into Fluid Architectural Art
          </p>

          <div className="pt-6 flex justify-center items-center gap-2 text-[10px] font-mono tracking-widest text-[#C0C0C0]/60 uppercase">
            <span>SCROLL TO EXPLORE CAMPAIGN</span>
            <div className="w-4 h-4 border border-[#C0C0C0]/40 rounded-full flex items-center justify-center animate-bounce">
              ↓
            </div>
          </div>
        </div>

        {/* 2. MIDDLE DETAILS CALLOUTS (30% - 70% Scroll) */}
        <div
          className="absolute bottom-16 left-6 sm:left-12 max-w-sm space-y-2 pointer-events-none transition-all duration-700"
          style={{
            opacity: progress >= 0.28 && progress < 0.75 ? 1 : 0,
            transform: `translateY(${(progress - 0.5) * -30}px)`,
          }}
        >
          <div className="flex items-center gap-2 text-[#C0C0C0] text-[10px] font-mono tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C0C0C0]" />
            <span>FRAME {currentFrameIndex + 1} OF {totalFrames}</span>
          </div>
          <h3 className="font-serif text-2xl text-[#F5F1E8] font-light tracking-wider">
            {currentFrameIndex === 0 && 'DISTANT PERFECTION'}
            {currentFrameIndex === 1 && 'RHODIUM MIRROR SHIEN'}
            {currentFrameIndex === 2 && 'MACRO PRECISION'}
            {currentFrameIndex === 3 && 'SILVER LIQUID CURVES'}
            {currentFrameIndex >= 4 && 'HAUTE JOAILLERIE REVEAL'}
          </h3>
          <p className="text-xs text-[#D8C7AD]/70 font-light tracking-wide">
            Every contour is hand-polished with micro-suede to achieve a high-reflectivity mirror surface.
          </p>
        </div>

        {/* 3. FINAL HERO FRAME & CTAS (75% - 100% Scroll) */}
        <div
          className="absolute inset-x-0 bottom-16 max-w-2xl mx-auto px-6 text-center space-y-6 transition-all duration-700"
          style={{
            opacity: progress >= 0.75 ? Math.min(1, (progress - 0.75) * 4) : 0,
            transform: `translateY(${Math.max(0, (1 - progress) * 60)}px)`,
            pointerEvents: progress >= 0.75 ? 'auto' : 'none',
          }}
        >
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#C0C0C0] uppercase block">
              DISCOVER THE CREATION
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.15em] text-[#F5F1E8]">
              DISCOVER THE COLLECTION
            </h2>
            <p className="text-xs text-[#D8C7AD]/80 font-light tracking-wide max-w-md mx-auto">
              Explore our full Haute Joaillerie boutique featuring solid 925 sterling silver solitaire pendants, signet rings, and sculpted cuffs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/jewellery"
              onClick={onExploreClick}
              className="w-full sm:w-auto bg-gradient-to-r from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8] hover:from-white hover:to-[#E2E8F0] text-[#050505] text-xs font-semibold px-10 py-4 tracking-[0.25em] uppercase transition-all shadow-2xl shadow-[#CBD5E1]/20 flex items-center justify-center gap-3 group"
            >
              <span>EXPLORE JEWELLERY</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/collections/haute-joaillerie"
              className="w-full sm:w-auto border border-[#C0C0C0]/40 hover:border-[#C0C0C0] text-[#F5F1E8] text-xs font-semibold px-8 py-4 tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
            >
              <span>VIEW HAUTE EDIT</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#D8C7AD]/50 tracking-widest uppercase pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C0C0C0]" />
            <span>Lifetime Authenticity Guarantee & Hallmark Certified</span>
          </div>
        </div>

      </div>
    </div>
  );
};
