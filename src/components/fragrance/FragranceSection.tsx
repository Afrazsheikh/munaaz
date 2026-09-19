'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShoppingBag, Info, Edit, Check, Star, ChevronRight } from 'lucide-react';
import { FragranceDataStore, FragranceProduct, FragranceScene } from '@/types/fragrance';
import { fragranceService } from '@/services/fragranceService';
import { FragranceNotesModal } from './FragranceNotesModal';
import { FragranceAdminModal } from './FragranceAdminModal';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: string;
  wobble: number;
  wobbleSpeed: number;
}

export const FragranceSection: React.FC = () => {
  const [storeData, setStoreData] = useState<FragranceDataStore | null>(null);
  const [selectedNotesProduct, setSelectedNotesProduct] = useState<FragranceProduct | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Cinematic Camera Travel State
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isZoomingIn, setIsZoomingIn] = useState(false);
  const [textKey, setTextKey] = useState(0);

  // Mouse Parallax & Motion
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });

  const { addItem } = useCart();

  useEffect(() => {
    setStoreData(fragranceService.getFragranceData());
  }, []);

  const scenes = storeData?.scenes || [];
  const activeScene: FragranceScene | undefined = scenes[currentSceneIndex] || scenes[0];
  const products = storeData?.products || [];

  // Macro Camera Zoom Travel Engine
  const changeScene = useCallback((newIndex: number) => {
    if (newIndex === currentSceneIndex || isZoomingIn || scenes.length === 0) return;

    // Phase 1: Camera zooms into bottle opening/liquid
    setIsZoomingIn(true);

    setTimeout(() => {
      // Phase 2: Switch scene and re-trigger text entrance
      setCurrentSceneIndex(newIndex);
      setTextKey((prev) => prev + 1);

      setTimeout(() => {
        // Phase 3: Camera pulls back slightly as new scene sharpens inside bottle
        setIsZoomingIn(false);
      }, 400);
    }, 450);
  }, [currentSceneIndex, isZoomingIn, scenes.length]);

  const nextScene = useCallback(() => {
    if (scenes.length === 0) return;
    const nextIdx = (currentSceneIndex + 1) % scenes.length;
    changeScene(nextIdx);
  }, [currentSceneIndex, scenes.length, changeScene]);

  // Mouse Parallax Offset
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTargetMouse({ x, y });
  }, []);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetMouse.x - prev.x) * 0.05,
        y: prev.y + (targetMouse.y - prev.y) * 0.05
      }));
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [targetMouse]);

  // High-DPI 4K Canvas Motion Physics Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeScene) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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

    const count = width < 768 ? 22 : 48;

    const particles: Particle[] = Array.from({ length: count }, () => {
      const pType = activeScene.particleType || 'pure';
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (pType === 'citrus' ? 14 : 6) + 3,
        speedY: -(Math.random() * 0.5 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        color:
          pType === 'citrus'
            ? Math.random() > 0.5 ? '#E6C594' : '#D6A35D'
            : pType === 'petals'
            ? Math.random() > 0.5 ? '#F4EFE7' : '#C18A60'
            : pType === 'spices'
            ? Math.random() > 0.5 ? '#9A5C24' : '#3A2418'
            : '#F4EFE7',
        type: pType
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.5 + mousePos.x * 0.25;
        p.y += p.type === 'petals' ? Math.abs(p.speedY) * 0.7 : p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'citrus') {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, 'rgba(255, 235, 195, 0.95)');
          grad.addColorStop(0.5, p.color);
          grad.addColorStop(1, 'rgba(154, 92, 36, 0)');
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.85, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 248, 235, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

        } else if (p.type === 'petals') {
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 2);
          ctx.bezierCurveTo(p.size * 1.5, -p.size, p.size * 1.5, p.size, 0, p.size * 2);
          ctx.bezierCurveTo(-p.size * 1.5, p.size, -p.size * 1.5, -p.size, 0, -p.size * 2);
          const pGrad = ctx.createLinearGradient(0, -p.size * 2, 0, p.size * 2);
          pGrad.addColorStop(0, 'rgba(244, 239, 231, 0.85)');
          pGrad.addColorStop(1, 'rgba(193, 138, 96, 0.4)');
          ctx.fillStyle = pGrad;
          ctx.fill();

        } else {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, 'rgba(255, 252, 245, 0.95)');
          grad.addColorStop(0.4, p.color);
          grad.addColorStop(1, 'rgba(58, 36, 24, 0)');
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [activeScene, mousePos]);

  if (!storeData || !activeScene) return null;

  const primaryProduct = products[0] || {
    id: 'frag-noir',
    slug: 'munaaz-noir',
    name: 'MUNAAZ ESSENCE NO. 07',
    subtitle: 'Eau de Parfum',
    description: 'An intoxicating blend of smoked cedarwood, midnight black amber, and Madagascar bourbon vanilla.',
    notes: { top: ['Black Pepper', 'Bergamot'], heart: ['Smoked Cedar'], base: ['Black Amber'] },
    priceINR: 9990,
    priceUSD: 120,
    size: '100ml / 3.4 fl. oz.',
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2400&auto=format&fit=crop'],
    accentColor: '#3A2418',
    rating: 4.9,
    reviewCount: 64,
    story: 'Formulated in Grasse, France.'
  };

  const handleAddToCart = (fragrance: FragranceProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const cartAdapterProduct: Product = {
      id: fragrance.id,
      slug: fragrance.slug,
      name: fragrance.name,
      brand: 'MUNAAZ Essence',
      category: 'accessories',
      collections: ['everyday-essentials'],
      shortDescription: fragrance.description,
      description: fragrance.story,
      fabricCare: [`Size: ${fragrance.size}`, `Concentration: ${fragrance.subtitle}`],
      features: [
        `Top Notes: ${fragrance.notes.top.join(', ')}`,
        `Heart Notes: ${fragrance.notes.heart.join(', ')}`,
        `Base Notes: ${fragrance.notes.base.join(', ')}`
      ],
      priceINR: fragrance.priceINR,
      compareAtPriceINR: fragrance.compareAtPriceINR,
      priceUSD: fragrance.priceUSD,
      compareAtPriceUSD: fragrance.compareAtPriceUSD,
      images: fragrance.images,
      colors: [{ name: fragrance.name, hex: fragrance.accentColor, image: fragrance.images[0] }],
      sizes: [fragrance.size],
      variants: [{ id: `v-${fragrance.id}`, color: fragrance.name, size: fragrance.size, sku: `FRAG-${fragrance.slug}`, stock: 50 }],
      isNewArrival: true,
      isBestSeller: !!fragrance.isBestseller,
      isSale: false,
      rating: fragrance.rating,
      reviewCount: fragrance.reviewCount,
      createdAt: '2026-09-01'
    };

    addItem(cartAdapterProduct, fragrance.name, fragrance.size, 1);
    setAddedProductId(fragrance.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <section className="relative w-full bg-[#171411] text-[#F4EFE7] overflow-hidden select-none">
      
      {/* Admin Quick Editor Trigger */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 hover:bg-[#9A5C24] text-[#F4EFE7] text-[10px] font-bold tracking-widest uppercase backdrop-blur-md border border-[#D6A35D]/40 transition-all shadow-2xl"
        >
          <Edit className="w-3.5 h-3.5 text-[#D6A35D]" />
          <span>EDIT SCENES & CATALOG</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. 100VH 4K DIRECT MACRO VISUAL CAMERA TRAVEL HERO        */}
      {/* ========================================================= */}
      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-screen min-h-[620px] flex items-center justify-between overflow-hidden transform-gpu"
      >
        {/* Full-Bleed 4K Edge-to-Edge Macro Visual Layers with Camera Zoom Travel */}
        <div className="absolute inset-0 z-0">
          <div
            className={`relative w-full h-full transition-transform duration-700 ease-out ${
              isZoomingIn ? 'scale-135 blur-sm' : 'scale-100 blur-none'
            }`}
            style={{
              transform: `scale(${isZoomingIn ? 1.35 : 1.04}) translate(${mousePos.x * -12}px, ${mousePos.y * -12}px)`
            }}
          >
            {/* Desktop 4K Macro Image */}
            <Image
              src={activeScene.desktopImage}
              alt={activeScene.name}
              fill
              priority
              quality={95}
              className="hidden sm:block object-cover object-center transition-opacity duration-1000 brightness-95 filter contrast-[1.08] saturate-[1.08]"
            />
            {/* Mobile Portrait 4K Macro Image */}
            <Image
              src={activeScene.mobileImage || activeScene.desktopImage}
              alt={activeScene.name}
              fill
              priority
              quality={95}
              className="block sm:hidden object-cover object-center transition-opacity duration-1000 brightness-95 filter contrast-[1.08] saturate-[1.08]"
            />
          </div>

          {/* Golden Amber Liquid Refraction Overlay */}
          <div
            className="absolute inset-0 opacity-75 pointer-events-none transition-all duration-700"
            style={{
              background: `radial-gradient(circle at ${40 + mousePos.x * 15}% ${50 + mousePos.y * 15}%, rgba(214, 163, 93, 0.28) 0%, rgba(23, 20, 17, 0.75) 65%, rgba(23, 20, 17, 0.95) 100%)`
            }}
          />

          {/* PHASE 2 OVERLAY: BOTTLE NECK & CAP RIM SHIMMER (Shown when at Scene 02 Bottle Opening) */}
          {activeScene.id === 'scene-2' && (
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
              <div className="w-[85vw] h-[85vh] border-[16px] border-[#D6A35D]/30 rounded-full shadow-[inset_0_0_120px_rgba(214,163,93,0.4)] animate-pulse" />
              <div className="absolute top-12 px-6 py-2 bg-black/70 backdrop-blur-md border border-[#D6A35D]/50 text-[10px] font-mono tracking-[0.3em] text-[#D6A35D] uppercase">
                GLASS BOTTLE NECK OPENING · ENTERING LIQUID
              </div>
            </div>
          )}

          {/* PHASES 3, 4, 5 OVERLAY: INSIDE THE GLASS BOTTLE CONTOUR FRAMING */}
          {['scene-3', 'scene-4', 'scene-5'].includes(activeScene.id) && (
            <div className="absolute inset-0 z-10 pointer-events-none border-x-[20px] sm:border-x-[40px] border-white/10 shadow-[inset_0_0_100px_rgba(214,163,93,0.35)]" />
          )}

          {/* Left Dark Gradient Overlay for Maximum Text Contrast */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 bg-gradient-to-r from-[#171411]/95 via-[#171411]/70 to-transparent pointer-events-none" />
        </div>

        {/* High-DPI 4K Canvas Dynamic Motion Overlay (Bubbles, Citrus Orbs, Petals) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 pointer-events-none w-full h-full"
        />

        {/* Cursor Glass Reflection Highlights */}
        <div
          className="absolute inset-0 z-15 pointer-events-none opacity-30 bg-gradient-to-tr from-transparent via-white/10 to-transparent transition-transform duration-500"
          style={{
            transform: `translateX(${mousePos.x * 35}px) translateY(${mousePos.y * 25}px)`
          }}
        />

        {/* LEFT SIDE OVERLAY */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div key={textKey} className="lg:col-span-7 space-y-6 text-left">
            
            {/* Category Pill Badge */}
            <div className="animate-fadeInUp">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-black/60 backdrop-blur-md border border-[#D6A35D]/50 text-[10px] font-bold tracking-[0.25em] text-[#D6A35D] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeScene.badge}</span>
              </span>
            </div>

            {/* Editorial Heading */}
            <div className="animate-fadeInUp delay-100">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[0.12em] uppercase text-[#F4EFE7] leading-[1.05] drop-shadow-2xl">
                MUNAAZ ESSENCE <br />
                <span className="text-[#D6A35D] font-light">NO. 07</span>
              </h1>
            </div>

            {/* Description Paragraph */}
            <p className="animate-fadeInUp delay-200 text-xs sm:text-sm text-[#F4EFE7]/90 font-light leading-relaxed max-w-md tracking-wide">
              {activeScene.description}
            </p>

            {/* Action Buttons */}
            <div className="animate-fadeInUp delay-300 pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedNotesProduct(primaryProduct)}
                className="bg-[#211815]/90 hover:bg-[#9A5C24] text-[#F4EFE7] text-xs font-semibold px-6 py-3.5 tracking-[0.18em] uppercase transition-all duration-300 border border-[#D6A35D]/50 backdrop-blur-md shadow-lg flex items-center gap-2"
              >
                <Info className="w-3.5 h-3.5 text-[#D6A35D]" />
                <span>DISCOVER NO. 07</span>
              </button>

              <button
                onClick={(e) => handleAddToCart(primaryProduct, e)}
                className="bg-[#9A5C24] hover:bg-[#D6A35D] text-white text-xs font-semibold px-7 py-3.5 tracking-[0.18em] uppercase transition-all duration-300 shadow-xl border border-white/10 flex items-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>SHOP NOW</span>
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE FLOATING BUTTON: VIEW SCENE > */}
        <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 z-30">
          <button
            onClick={nextScene}
            className="group px-5 py-3 bg-black/60 hover:bg-[#9A5C24] text-[#F4EFE7] text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md border border-[#D6A35D]/50 transition-all shadow-2xl flex items-center gap-2 hover:scale-105"
          >
            <span>VIEW SCENE</span>
            <ChevronRight className="w-4 h-4 text-[#D6A35D] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* BOTTOM CENTER CAROUSEL INDICATOR DOTS (. o . . .) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md px-5 py-2 border border-white/10">
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => changeScene(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentSceneIndex
                  ? 'w-3 h-3 bg-[#D6A35D] ring-4 ring-[#D6A35D]/30 scale-125'
                  : 'w-2 h-2 bg-[#F4EFE7]/40 hover:bg-white'
              }`}
              aria-label={`Go to scene ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. PRODUCT SECTION ("MUNAAZ ESSENCE - FIND YOUR SIGNATURE") */}
      {/* ========================================================= */}
      <div id="munaaz-essence-collection" className="relative z-20 bg-[#171411] border-t border-[#3A2418] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#D6A35D]">
              MUNAAZ ESSENCE ATELIER
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-wider text-[#F4EFE7] uppercase">
              FIND YOUR SIGNATURE
            </h2>
            <p className="text-xs sm:text-sm text-[#F4EFE7]/80 font-light leading-relaxed">
              Discover fragrances crafted to leave a lasting impression. Formulated in France, macerated to perfection.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((fragrance) => (
              <div
                key={fragrance.id}
                className="group relative bg-[#1E1916] border border-[#3A2418] hover:border-[#D6A35D]/60 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Badge Overlay */}
                {fragrance.badge && (
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#171411]/90 backdrop-blur-md border border-[#D6A35D]/40 text-[9px] font-bold tracking-[0.2em] text-[#D6A35D] uppercase">
                    {fragrance.badge}
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 text-[#D6A35D] fill-current" />
                  <span>{fragrance.rating}</span>
                </div>

                {/* Image Container with Hover Zoom */}
                <div className="relative aspect-[3/4] w-full bg-[#171411] overflow-hidden">
                  <Image
                    src={fragrance.images[0]}
                    alt={fragrance.name}
                    fill
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1916] via-transparent to-transparent opacity-80" />

                  {/* "EXPLORE NOTES" Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-[2px] p-4">
                    <button
                      onClick={() => setSelectedNotesProduct(fragrance)}
                      className="px-5 py-2.5 bg-[#F4EFE7] hover:bg-[#D6A35D] text-[#171411] hover:text-white text-xs font-semibold tracking-[0.15em] uppercase shadow-2xl transition-colors flex items-center gap-2"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>EXPLORE NOTES</span>
                    </button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#D6A35D] font-mono tracking-widest uppercase mb-1">
                      <span>{fragrance.subtitle}</span>
                      <span>{fragrance.size}</span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold tracking-wider text-[#F4EFE7] group-hover:text-[#D6A35D] transition-colors">
                      {fragrance.name}
                    </h3>

                    <p className="text-xs text-[#F4EFE7]/75 font-light line-clamp-2 mt-2 leading-relaxed">
                      {fragrance.description}
                    </p>

                    {/* Notes Pills */}
                    <div className="pt-3 flex flex-wrap gap-1.5">
                      {fragrance.notes.top.slice(0, 2).map((note) => (
                        <span key={note} className="px-2 py-0.5 bg-[#171411] text-[10px] text-[#F4EFE7]/80 border border-[#3A2418]">
                          {note}
                        </span>
                      ))}
                      {fragrance.notes.heart.slice(0, 1).map((note) => (
                        <span key={note} className="px-2 py-0.5 bg-[#9A5C24]/30 text-[10px] text-[#D6A35D] border border-[#9A5C24]/60">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Cart Action */}
                  <div className="pt-4 border-t border-[#3A2418] flex items-center justify-between gap-3">
                    <div>
                      <div className="font-serif font-bold text-lg text-[#F4EFE7]">
                        ₹{fragrance.priceINR.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-sans text-[#D6A35D]">
                        ${fragrance.priceUSD} USD
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(fragrance, e)}
                      className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all flex items-center gap-1.5 ${
                        addedProductId === fragrance.id
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#9A5C24] hover:bg-[#D6A35D] text-white shadow-md'
                      }`}
                    >
                      {addedProductId === fragrance.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>ADD TO BAG</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Olfactory Notes Modal */}
      {selectedNotesProduct && (
        <FragranceNotesModal
          fragrance={selectedNotesProduct}
          onClose={() => setSelectedNotesProduct(null)}
        />
      )}

      {/* Admin Panel Editing Modal */}
      {isAdminOpen && (
        <FragranceAdminModal
          currentStore={storeData}
          onClose={() => setIsAdminOpen(false)}
          onUpdate={(newStore) => setStoreData(newStore)}
        />
      )}

    </section>
  );
};
