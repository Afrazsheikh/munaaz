'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowDown, ArrowRight, ShieldCheck, Gem } from 'lucide-react';
import {
  CINEMATIC_FRAMES,
  CINEMATIC_SCENES,
  preloadInitialFrames,
  loadFrameProgressive,
} from './cinematicSequence';

interface MunaazCinematicHeroProps {
  onDiscoverClick?: () => void;
}

export const MunaazCinematicHero: React.FC<MunaazCinematicHeroProps> = ({ onDiscoverClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeSceneName, setActiveSceneName] = useState('SCENE 01: OPENING SILHOUETTE');

  // Gold dust micro-particles for canvas overlay
  const particlesRef = useRef<
    { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[]
  >([]);

  // 1. Preload Initial Key Frames & Progressive Background Load
  useEffect(() => {
    let isMounted = true;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }

    const loadAllFrames = async () => {
      // Step A: Load initial 3 frames in parallel for instant display
      const initialImgs = await preloadInitialFrames(3);

      if (isMounted && initialImgs.length > 0) {
        // Fill initial array with frame 1 as fallback placeholder
        const fullArray: HTMLImageElement[] = new Array(39).fill(initialImgs[0]);
        initialImgs.forEach((img, idx) => {
          fullArray[idx] = img;
        });

        setImages([...fullArray]);
        setIsInitialLoaded(true);

        // Step B: Progressively load remaining frames 4 to 39
        for (let i = 3; i < CINEMATIC_FRAMES.length; i++) {
          if (!isMounted) break;
          try {
            const loadedImg = await loadFrameProgressive(CINEMATIC_FRAMES[i]);
            if (isMounted) {
              setImages((prev) => {
                const next = [...prev];
                next[i] = loadedImg;
                return next;
              });
            }
          } catch (err) {
            // keep fallback frame
          }
        }
      }
    };

    loadAllFrames();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize Micro Gold Dust Particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2.0 + 0.6,
        speedX: (Math.random() - 0.5) * 0.0003,
        speedY: (Math.random() - 0.5) * 0.0004 - 0.0001,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }
    particlesRef.current = particles;
  }, []);

  // 3. High-Performance Canvas Rendering Engine
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

      // Handle Device Pixel Ratio for crisp retina screens
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep Charcoal / Black luxury environment background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Enable maximum sharpness bicubic smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Aspect Ratio Math: Preserve complete 9:16 frame without zooming/cropping
      const imgAspect = (img.naturalWidth && img.naturalHeight)
        ? img.naturalWidth / img.naturalHeight
        : 9 / 16;

      let renderW = width;
      let renderH = height;

      if (width >= 768) {
        // Desktop / Laptop: Fit full height so model, garment, and lighting are 100% visible
        renderH = height * 0.96;
        renderW = renderH * imgAspect;

        if (renderW > width) {
          renderW = width * 0.95;
          renderH = renderW / imgAspect;
        }
      } else {
        // Mobile / Tablet: Fit vertical composition comfortably within viewport
        renderH = height * 0.92;
        renderW = renderH * imgAspect;

        if (renderW > width * 0.98) {
          renderW = width * 0.98;
          renderH = renderW / imgAspect;
        }
      }

      const offsetX = (width - renderW) / 2;
      const offsetY = (height - renderH) / 2;

      // Draw active frame image with high-precision rendering
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

      // Draw Subtle Warm Radial Vignette Gradient
      const vignetteGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.max(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      vignetteGrad.addColorStop(0, 'rgba(5, 5, 5, 0)');
      vignetteGrad.addColorStop(1, 'rgba(5, 5, 5, 0.65)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Floating Micro Gold Dust Particles
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
        ctx.fillStyle = `rgba(201, 164, 106, ${p.opacity * 0.5})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#C9A46A';
        ctx.fill();
      });

      ctx.restore();
    },
    [images]
  );

  // 4. Scroll Mapping & Intro Autoplay Handler
  useEffect(() => {
    let animFrameId: number;
    let introTimer: NodeJS.Timeout;

    // Subtle intro advance for initial 3-4 frames if user hasn't scrolled yet
    if (isInitialLoaded && !prefersReducedMotion) {
      let introStep = 0;
      introTimer = setInterval(() => {
        if (window.scrollY < 50 && introStep < 4) {
          introStep++;
          setCurrentFrameIndex(introStep);
          renderCanvas(introStep);
        } else {
          clearInterval(introTimer);
        }
      }, 700);
    }

    const handleScroll = () => {
      if (!containerRef.current || prefersReducedMotion) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      const totalScrollable = rect.height - windowH;
      if (totalScrollable <= 0) return;

      const currentScroll = Math.max(0, -rect.top);
      const rawProgress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

      setProgress(rawProgress);

      if (images.length > 0) {
        const frameIdx = Math.min(
          images.length - 1,
          Math.floor(rawProgress * images.length)
        );
        setCurrentFrameIndex(frameIdx);

        // Active scene resolution
        const scene = CINEMATIC_SCENES.find(
          (s) => frameIdx >= s.startFrame && frameIdx <= s.endFrame
        );
        if (scene) {
          setActiveSceneName(scene.name);
        }

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
      if (introTimer) clearInterval(introTimer);
    };
  }, [images, renderCanvas, isInitialLoaded, prefersReducedMotion]);

  const handleSmoothScrollDown = () => {
    if (onDiscoverClick) {
      onDiscoverClick();
    } else if (containerRef.current) {
      const nextTarget = containerRef.current.nextElementSibling;
      if (nextTarget) {
        nextTarget.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
      }
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-[250vh] bg-[#050505]">
      {/* Sticky Full-Viewport Cinematic Viewport */}
      <div className="sticky top-0 h-screen h-[100svh] min-h-[100vh] w-full overflow-hidden flex items-center justify-center bg-[#050505]">
        
        {/* Canvas Render Surface */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Ambient Top & Bottom Lighting Gradients */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505]/80 via-[#050505]/30 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none z-10" />

        {/* --- HTML / CSS EDITORIAL TYPOGRAPHY OVERLAY --- */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto pointer-events-none">
          
          {/* Top Editorial Scene Badge */}
          <div className="pt-16 sm:pt-20 flex justify-between items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17120E]/80 backdrop-blur-md border border-[#C9A46A]/30 text-[#C9A46A] text-[10px] font-mono tracking-[0.3em] uppercase shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A46A] animate-pulse" />
              <span>{activeSceneName}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#D8C7AD]/60 uppercase">
              <span>FRAME {currentFrameIndex + 1} / 39</span>
            </div>
          </div>

          {/* Center-Bottom Main Editorial Brand Typography */}
          <div className="space-y-4 max-w-xl pb-10 sm:pb-12 pointer-events-auto">
            <div className="space-y-1">
              <span className="text-xs font-medium tracking-[0.35em] text-[#C9A46A] uppercase block">
                MUNAAZ HAUTE FASHION
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.15em] text-[#F5F1E8] leading-[1.05]">
                MUNAAZ
              </h1>
              <p className="font-serif italic text-xl sm:text-3xl text-[#D8C7AD] font-normal tracking-wide">
                THE ART OF DRESSING
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#D8C7AD]/80 font-light tracking-wide leading-relaxed max-w-md">
              Discover sartorial silhouettes, French flax linens, and bespoke fragrances crafted to leave an unforgettable impression.
            </p>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleSmoothScrollDown}
                className="bg-gradient-to-r from-[#C9A46A] to-[#B38F55] hover:from-[#D4B37B] hover:to-[#C9A46A] text-[#050505] text-xs font-semibold px-8 py-4 tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#C9A46A]/10 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>DISCOVER COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/collections/new-arrivals"
                className="bg-[#17120E]/80 backdrop-blur-md border border-[#C9A46A]/40 hover:border-[#C9A46A] text-[#F5F1E8] text-xs font-semibold px-8 py-4 tracking-[0.2em] uppercase transition-all flex items-center justify-center text-center min-h-[44px]"
              >
                NEW ARRIVALS
              </Link>
            </div>
          </div>

          {/* Bottom Scroll Indicator */}
          <div className="pb-4 flex justify-between items-center text-[10px] font-mono text-[#D8C7AD]/50 tracking-widest uppercase pointer-events-auto">
            <button
              onClick={handleSmoothScrollDown}
              className="flex items-center gap-2 hover:text-[#C9A46A] transition-colors"
            >
              <span>SCROLL TO PROGRESS FILM</span>
              <div className="w-4 h-4 border border-[#C9A46A]/40 rounded-full flex items-center justify-center animate-bounce">
                ↓
              </div>
            </button>

            <span className="hidden sm:inline-block">AUTUMN / WINTER EDITION</span>
          </div>

        </div>

      </div>
    </section>
  );
};
