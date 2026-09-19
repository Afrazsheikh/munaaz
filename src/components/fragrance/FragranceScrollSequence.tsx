'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, ArrowDown, ShoppingBag, ChevronRight } from 'lucide-react';

interface FragranceScrollSequenceProps {
  onShopClick?: () => void;
  onExploreClick?: () => void;
}

interface StageConfig {
  folder: string;
  frameCount: number;
  stageName: string;
  chapterTitle: string;
  headline: string;
  subtext: string;
  notes?: string[];
  ctaType?: 'hero' | 'middle' | 'final';
}

const STAGES: StageConfig[] = [
  {
    folder: '1st',
    frameCount: 300,
    stageName: 'STAGE 1 · HERO REVEAL',
    chapterTitle: 'MUNAAZ ESSENCE · HAUTE PARFUMERIE',
    headline: 'SCENT, ELEVATED.',
    subtext: 'An unforgettable fragrance, created for those who leave an impression.',
    ctaType: 'hero'
  },
  {
    folder: '2nd',
    frameCount: 300,
    stageName: 'STAGE 2 · CRAFTSMANSHIP',
    chapterTitle: 'CHAPTER I · THE BOTTLE',
    headline: 'CRAFTED TO BE REMEMBERED.',
    subtext: 'Every detail is designed to turn fragrance into an experience.',
    ctaType: 'middle'
  },
  {
    folder: '3rd',
    frameCount: 300,
    stageName: 'STAGE 3 · SCENT STORY',
    chapterTitle: 'CHAPTER II · THE INGREDIENTS',
    headline: 'WHERE EVERY NOTE HAS A PURPOSE.',
    subtext: 'From the first impression to the final lingering trail, every layer is carefully composed.',
    notes: ['CALABRIAN BERGAMOT', 'DAMASK ROSE', 'SMOKED CEDAR', 'MADAGASCAR VANILLA', 'BLACK AMBER'],
    ctaType: 'middle'
  },
  {
    folder: '4th',
    frameCount: 300,
    stageName: 'STAGE 4 · TRANSITION',
    chapterTitle: 'CHAPTER III · EVOLUTION & SILLAGE',
    headline: 'FIRST IMPRESSION. LASTING MEMORY.',
    subtext: 'A fragrance that evolves naturally on skin and fabric, revealing new depth with every moment.',
    ctaType: 'middle'
  },
  {
    folder: '5th',
    frameCount: 300,
    stageName: 'STAGE 5 · FINAL REVEAL',
    chapterTitle: 'CHAPTER IV · HAUTE PARFUMERIE',
    headline: 'LEAVE YOUR SIGNATURE.',
    subtext: 'Discover your next signature fragrance from our bespoke collection of Eau de Parfum & Extrait strength perfumes.',
    ctaType: 'final'
  }
];

export const FragranceScrollSequence: React.FC<FragranceScrollSequenceProps> = ({
  onShopClick,
  onExploreClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0); // 0 to 1 overall progress
  const [isPreloading, setIsPreloading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  // Store loaded images per stage: imagesCache[stageIndex][frameIndex]
  const imagesCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const currentFrameKeyRef = useRef<string>('');

  const getFramePath = useCallback((folder: string, index: number) => {
    const frameNum = String(index + 1).padStart(3, '0');
    return `/sequence/${folder}/ezgif-frame-${frameNum}.jpg`;
  }, []);

  // Progressive Loading Strategy: Folder 1 first, then Folders 2, 3, 4, 5
  useEffect(() => {
    let isMounted = true;
    let totalLoaded = 0;
    const totalAllFrames = STAGES.reduce((acc, s) => acc + s.frameCount, 0);

    const loadStageFrames = async (stageIndex: number) => {
      const stage = STAGES[stageIndex];
      if (!stage) return;

      const promises = [];
      for (let i = 0; i < stage.frameCount; i++) {
        const path = getFramePath(stage.folder, i);
        if (imagesCache.current.has(path)) continue;

        const p = new Promise<void>((resolve) => {
          const img = new Image();
          img.src = path;
          img.onload = () => {
            if (isMounted) {
              imagesCache.current.set(path, img);
              totalLoaded++;
              setLoadedCount(totalLoaded);
              if (stageIndex === 0 && totalLoaded >= 30) {
                setIsPreloading(false); // Enable immediate display once first 30 frames are ready
              }
            }
            resolve();
          };
          img.onerror = () => {
            if (isMounted) {
              totalLoaded++;
              setLoadedCount(totalLoaded);
            }
            resolve();
          };
        });
        promises.push(p);
      }

      await Promise.all(promises);
    };

    // Load Stage 1 first
    loadStageFrames(0).then(() => {
      if (!isMounted) return;
      setIsPreloading(false);
      // Sequentially load remaining stages in background
      loadStageFrames(1)
        .then(() => loadStageFrames(2))
        .then(() => loadStageFrames(3))
        .then(() => loadStageFrames(4));
    });

    const fallbackTimeout = setTimeout(() => {
      if (isMounted) setIsPreloading(false);
    }, 4000);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
    };
  }, [getFramePath]);

  // Canvas drawing routine
  const drawFrame = useCallback((folder: string, frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const path = getFramePath(folder, frameIdx);
    const img = imagesCache.current.get(path);

    // Fallback if image not ready yet: find nearest available frame in cache
    let drawImg = img;
    if (!drawImg || !drawImg.complete || drawImg.naturalWidth === 0) {
      for (let offset = 1; offset < 10; offset++) {
        const prevPath = getFramePath(folder, Math.max(0, frameIdx - offset));
        const candidate = imagesCache.current.get(prevPath);
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          drawImg = candidate;
          break;
        }
      }
    }

    if (!drawImg || !drawImg.complete || drawImg.naturalWidth === 0) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const containerWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    const containerHeight = canvas.parentElement?.clientHeight || window.innerHeight;

    if (canvas.width !== containerWidth * dpr || canvas.height !== containerHeight * dpr) {
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      ctx.scale(dpr, dpr);
    } else {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    ctx.clearRect(0, 0, containerWidth, containerHeight);

    // Maintain aspect ratio with cover/contain behavior
    const imgRatio = drawImg.naturalWidth / drawImg.naturalHeight;
    const containerRatio = containerWidth / containerHeight;

    let drawW = containerWidth;
    let drawH = containerHeight;
    let drawX = 0;
    let drawY = 0;

    if (containerRatio > imgRatio) {
      drawH = containerWidth / imgRatio;
      drawY = (containerHeight - drawH) / 2;
    } else {
      drawW = containerHeight * imgRatio;
      drawX = (containerWidth - drawW) / 2;
    }

    ctx.drawImage(drawImg, drawX, drawY, drawW, drawH);

    // Dark luxury vignette overlay to blend edges seamlessly into #050505
    const gradient = ctx.createRadialGradient(
      containerWidth / 2,
      containerHeight / 2,
      Math.min(containerWidth, containerHeight) * 0.25,
      containerWidth / 2,
      containerHeight / 2,
      Math.max(containerWidth, containerHeight) * 0.75
    );
    gradient.addColorStop(0, 'rgba(5, 5, 5, 0.05)');
    gradient.addColorStop(0.65, 'rgba(5, 5, 5, 0.5)');
    gradient.addColorStop(1, 'rgba(5, 5, 5, 0.96)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, containerWidth, containerHeight);
  }, [getFramePath]);

  // Scroll listener mapped to 5-stage timeline
  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.clientHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

      setCurrentProgress(progress);

      // Determine active stage & local frame index across 5 folders
      const stageCount = STAGES.length; // 5
      const stageSegmentSize = 1 / stageCount; // 0.20

      let stageIdx = Math.min(stageCount - 1, Math.floor(progress / stageSegmentSize));
      const stageProgress = (progress - stageIdx * stageSegmentSize) / stageSegmentSize; // 0 to 1 within stage

      const currentStageConfig = STAGES[stageIdx];
      const frameIdx = Math.min(
        currentStageConfig.frameCount - 1,
        Math.floor(stageProgress * currentStageConfig.frameCount)
      );

      setCurrentStageIdx(stageIdx);

      const frameKey = `${currentStageConfig.folder}-${frameIdx}`;
      if (frameKey !== currentFrameKeyRef.current) {
        currentFrameKeyRef.current = frameKey;
        animId = requestAnimationFrame(() => drawFrame(currentStageConfig.folder, frameIdx));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [drawFrame]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const stage = STAGES[currentStageIdx];
      if (stage) drawFrame(stage.folder, 0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStageIdx, drawFrame]);

  const activeStage = STAGES[currentStageIdx] || STAGES[0];
  const overallPercent = Math.round(currentProgress * 100);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-[#050505]">
      {/* Luxury Loading Transition */}
      {isPreloading && (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#C9A46A]/30 border-t-[#C9A46A] animate-spin mb-2" />
          <div className="text-xs font-mono tracking-[0.35em] text-[#C9A46A] uppercase">
            MUNAAZ ATELIER · INITIALIZING CINEMATIC EXPERIENCE
          </div>
          <p className="text-[11px] text-[#D8C7AD]/70 font-light">Loading 5-stage anamorphic frame sequence...</p>
        </div>
      )}

      {/* Sticky Fullscreen Canvas & Text Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#050505]">
        {/* Render Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

        {/* Dynamic Text Overlay Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto py-12 px-4 transition-all duration-700 ease-out">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            {/* Stage Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#17120E]/85 backdrop-blur-md border border-[#C9A46A]/40 rounded-full text-[10px] font-mono tracking-[0.3em] text-[#C9A46A] uppercase shadow-2xl">
              <Sparkles className="w-3 h-3 text-[#C9A46A]" />
              <span>{activeStage.chapterTitle}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-wide text-[#F5F1E8] uppercase leading-[1.05] drop-shadow-2xl">
              {activeStage.headline}
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base font-light text-[#D8C7AD] max-w-xl mx-auto leading-relaxed tracking-wide">
              {activeStage.subtext}
            </p>

            {/* Ingredient Pills (Stage 3) */}
            {activeStage.notes && (
              <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {activeStage.notes.map((note) => (
                  <span
                    key={note}
                    className="px-3.5 py-1.5 bg-[#17120E]/90 backdrop-blur-md border border-[#C9A46A]/40 text-[10px] font-mono tracking-[0.2em] text-[#F5F1E8] uppercase shadow-lg"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {activeStage.ctaType === 'hero' && (
              <div className="pt-4 flex items-center justify-center">
                <button
                  onClick={onShopClick}
                  className="px-8 py-4 bg-[#C9A46A] hover:bg-[#D8C7AD] text-[#050505] text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_10px_30px_rgba(201,164,106,0.35)] hover:scale-105 flex items-center gap-2"
                >
                  <span>DISCOVER THE COLLECTION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {activeStage.ctaType === 'final' && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onShopClick}
                  className="px-8 py-4 bg-[#C9A46A] hover:bg-[#D8C7AD] text-[#050505] text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_10px_35px_rgba(201,164,106,0.35)] hover:scale-105 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>SHOP NOW</span>
                </button>

                <button
                  onClick={onExploreClick}
                  className="px-8 py-4 bg-transparent hover:bg-[#17120E] text-[#F5F1E8] border border-[#C9A46A]/50 text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 hover:border-[#C9A46A]"
                >
                  <span>EXPLORE COLLECTION</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stage Timeline Counter */}
        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3 bg-[#17120E]/90 backdrop-blur-md px-4 py-2 border border-[#C9A46A]/30 text-[10px] font-mono text-[#C9A46A] uppercase tracking-widest shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#C9A46A] animate-ping" />
          <span>FOLDER {currentStageIdx + 1}/5 · {activeStage.stageName} · {overallPercent}%</span>
        </div>

        {/* Scroll Down Hint */}
        {currentProgress < 0.05 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#D8C7AD]/70 uppercase animate-bounce pointer-events-none">
            <span>SCROLL TO BEGIN FILM</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#C9A46A]" />
          </div>
        )}
      </div>
    </div>
  );
};
