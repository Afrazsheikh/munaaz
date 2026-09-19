'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Sparkles, ShoppingBag, Info, Edit, Check, Star, ChevronRight, RotateCcw } from 'lucide-react';
import { FragranceDataStore, FragranceProduct, FragranceScene } from '@/types/fragrance';
import { fragranceService } from '@/services/fragranceService';
import { FragranceNotesModal } from './FragranceNotesModal';
import { FragranceAdminModal } from './FragranceAdminModal';
import { Fragrance3DOrbitingHero } from './Fragrance3DOrbitingHero';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';

interface ProductCard3DProps {
  fragrance: FragranceProduct;
  onExploreNotes: (p: FragranceProduct) => void;
  onAddToCart: (p: FragranceProduct, e: React.MouseEvent) => void;
  isAdded: boolean;
}

const Fragrance3DProductCard: React.FC<ProductCard3DProps> = ({
  fragrance,
  onExploreNotes,
  onAddToCart,
  isAdded
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-[#1E1916] border border-[#3A2418] hover:border-[#D6A35D]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl transform-gpu select-none"
      style={{
        perspective: '1000px',
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 3D Dynamic Glare Sheen Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.6) 0%, rgba(214,163,93,0.15) 40%, transparent 70%)`
        }}
      />

      {/* Badge Overlay */}
      {fragrance.badge && (
        <div
          className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#171411]/90 backdrop-blur-md border border-[#D6A35D]/40 text-[9px] font-bold tracking-[0.2em] text-[#D6A35D] uppercase shadow-lg"
          style={{ transform: 'translateZ(25px)' }}
        >
          {fragrance.badge}
        </div>
      )}

      {/* Rating Badge */}
      <div
        className="absolute top-3 right-3 z-10 px-2 py-1 bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white flex items-center gap-1 border border-white/10 shadow-lg"
        style={{ transform: 'translateZ(25px)' }}
      >
        <Star className="w-3 h-3 text-[#D6A35D] fill-current" />
        <span>{fragrance.rating}</span>
      </div>

      {/* Image Container with 3D Hover Zoom */}
      <div className="relative aspect-[3/4] w-full bg-[#171411] overflow-hidden">
        <img
          src={fragrance.images[0]}
          alt={fragrance.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1916] via-transparent to-transparent opacity-80" />

        {/* "EXPLORE NOTES" Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-[2px] p-4">
          <button
            onClick={() => onExploreNotes(fragrance)}
            className="px-5 py-2.5 bg-[#F4EFE7] hover:bg-[#D6A35D] text-[#171411] hover:text-white text-xs font-semibold tracking-[0.15em] uppercase shadow-2xl transition-all duration-300 flex items-center gap-2 transform group-hover:translate-z-10"
            style={{ transform: 'translateZ(30px)' }}
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
            onClick={(e) => onAddToCart(fragrance, e)}
            className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all flex items-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#9A5C24] hover:bg-[#D6A35D] text-white shadow-md'
            }`}
          >
            {isAdded ? (
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
  );
};

export const FragranceSection: React.FC = () => {
  // Synchronous state initialization to prevent initial null render / blank flash
  const [storeData, setStoreData] = useState<FragranceDataStore>(() => fragranceService.getFragranceData());
  const [selectedNotesProduct, setSelectedNotesProduct] = useState<FragranceProduct | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Cinematic Camera & Slideshow Engine State
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isZoomingIn, setIsZoomingIn] = useState(false);
  const [textKey, setTextKey] = useState(0);

  const { addItem } = useCart();

  const scenes = storeData.scenes && storeData.scenes.length > 0 ? storeData.scenes : fragranceService.getFragranceData().scenes;
  const activeScene: FragranceScene = scenes[currentSceneIndex] || scenes[0];
  const products = storeData.products && storeData.products.length > 0 ? storeData.products : fragranceService.getFragranceData().products;

  // Macro Camera Zoom Travel Engine
  const changeScene = useCallback((newIndex: number) => {
    if (newIndex === currentSceneIndex || isZoomingIn || scenes.length === 0) return;

    setIsZoomingIn(true);

    setTimeout(() => {
      setCurrentSceneIndex(newIndex);
      setTextKey((prev) => prev + 1);

      setTimeout(() => {
        setIsZoomingIn(false);
      }, 400);
    }, 450);
  }, [currentSceneIndex, isZoomingIn, scenes.length]);

  const nextScene = useCallback(() => {
    if (scenes.length === 0) return;
    const nextIdx = (currentSceneIndex + 1) % scenes.length;
    changeScene(nextIdx);
  }, [currentSceneIndex, scenes.length, changeScene]);

  // Auto-play slideshow every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextScene();
    }, 7000);
    return () => clearInterval(timer);
  }, [nextScene]);

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
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1.5 bg-black/80 hover:bg-[#9A5C24] text-[#F4EFE7] text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-widest uppercase backdrop-blur-md border border-[#D6A35D]/40 transition-all shadow-2xl"
        >
          <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D6A35D]" />
          <span>EDIT SCENES</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. 100DVH 360-DEGREE ANAMORPHIC ORBITING HERO SECTION     */}
      {/* ========================================================= */}
      <div className="relative w-full h-[100dvh] min-h-[500px] sm:min-h-[620px] flex items-center justify-between overflow-hidden transform-gpu">
        
        {/* Background Full-Bleed Anamorphic Macro Visual Layer */}
        <div className="absolute inset-0 z-0">
          <div
            className={`relative w-full h-full transition-transform duration-700 ease-out ${
              isZoomingIn ? 'scale-135 blur-sm' : 'scale-100 blur-none'
            }`}
          >
            {/* Desktop 4K Macro Image */}
            <img
              src={activeScene.desktopImage}
              alt={activeScene.name}
              className="hidden sm:block w-full h-full object-cover object-center transition-opacity duration-700 brightness-95 filter contrast-[1.08] saturate-[1.08]"
            />
            {/* Mobile Portrait 4K Macro Image */}
            <img
              src={activeScene.mobileImage || activeScene.desktopImage}
              alt={activeScene.name}
              className="block sm:hidden w-full h-full object-cover object-center transition-opacity duration-700 brightness-95 filter contrast-[1.08] saturate-[1.08]"
            />
          </div>

          {/* Golden Amber Refraction Lighting Shader */}
          <div className="absolute inset-0 opacity-80 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(214,163,93,0.3)_0%,_rgba(23,20,17,0.85)_65%,_rgba(23,20,17,0.98)_100%)]" />

          {/* Left Dark Gradient Overlay for Maximum Text Readability */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 bg-gradient-to-r from-[#171411]/95 via-[#171411]/85 sm:via-[#171411]/70 to-transparent pointer-events-none" />
        </div>

        {/* 360-Degree Anamorphic Orbiting Hero Canvas Engine */}
        <div className="absolute inset-0 z-10 w-full h-full">
          <Fragrance3DOrbitingHero
            accentColor={activeScene.accentColor}
            activeSceneId={activeScene.id}
          />
        </div>

        {/* LEFT SIDE CONTENT OVERLAY */}
        <div className="relative z-20 max-w-7xl mx-auto px-3 xs:px-6 sm:px-10 lg:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6 sm:pt-0 pointer-events-none">
          
          <div key={textKey} className="lg:col-span-7 space-y-3 sm:space-y-6 text-left max-w-xl sm:max-w-none pointer-events-auto">
            
            {/* Category Pill Badge */}
            <div className="animate-fadeInUp">
              <span className="inline-flex items-center gap-1 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-black/70 backdrop-blur-md border border-[#D6A35D]/50 text-[8px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.25em] text-[#D6A35D] uppercase">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{activeScene.badge}</span>
              </span>
            </div>

            {/* Editorial Heading */}
            <div className="animate-fadeInUp delay-100">
              <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl lg:text-7xl font-bold tracking-[0.05em] xs:tracking-[0.1em] uppercase text-[#F4EFE7] leading-[1.12] sm:leading-[1.05] drop-shadow-2xl break-words">
                {activeScene.title} <br />
                <span className="text-[#D6A35D] font-light">{activeScene.subtitle}</span>
              </h1>
            </div>

            {/* Description Paragraph */}
            <p className="animate-fadeInUp delay-200 text-xs sm:text-sm text-[#F4EFE7]/90 font-light leading-relaxed max-w-md tracking-wide line-clamp-3 sm:line-clamp-none">
              {activeScene.description}
            </p>

            {/* Action Buttons */}
            <div className="animate-fadeInUp delay-300 pt-1 sm:pt-2 flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedNotesProduct(primaryProduct)}
                className="bg-[#211815]/90 hover:bg-[#9A5C24] text-[#F4EFE7] text-[10px] sm:text-xs font-semibold px-4 py-2.5 sm:px-6 sm:py-3.5 tracking-[0.12em] sm:tracking-[0.18em] uppercase transition-all duration-300 border border-[#D6A35D]/50 backdrop-blur-md shadow-lg flex items-center justify-center gap-2"
              >
                <Info className="w-3.5 h-3.5 text-[#D6A35D]" />
                <span>{activeScene.ctaText || 'DISCOVER NO. 07'}</span>
              </button>

              <button
                onClick={(e) => handleAddToCart(primaryProduct, e)}
                className="bg-[#9A5C24] hover:bg-[#D6A35D] text-white text-[10px] sm:text-xs font-semibold px-5 py-2.5 sm:px-7 sm:py-3.5 tracking-[0.12em] sm:tracking-[0.18em] uppercase transition-all duration-300 shadow-xl border border-white/10 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>SHOP NOW</span>
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE VERTICAL LABEL */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:block tracking-[0.4em] font-serif text-[11px] text-[#F4EFE7]/60 uppercase select-none pointer-events-none [writing-mode:vertical-rl] rotate-180">
          MUNAAZ ESSENCE
        </div>

        {/* FLOATING BUTTON: NEXT SCENE > */}
        <div className="absolute bottom-16 right-3 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:right-16 z-30">
          <button
            onClick={nextScene}
            className="group px-2.5 py-1.5 sm:px-5 sm:py-3 bg-black/80 hover:bg-[#9A5C24] text-[#F4EFE7] text-[9px] sm:text-xs font-bold tracking-[0.12em] sm:tracking-[0.2em] uppercase backdrop-blur-md border border-[#D6A35D]/50 transition-all shadow-2xl flex items-center gap-1 sm:gap-2 hover:scale-105"
          >
            <span>NEXT SCENE</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#D6A35D] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* BOTTOM CENTER NUMERICAL SLIDE INDICATORS (01  02  03  04) */}
        <div className="absolute bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-5 bg-black/80 backdrop-blur-md px-3 py-1.5 sm:px-6 sm:py-2.5 border border-white/15 shadow-2xl max-w-[95vw]">
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => changeScene(idx)}
              className={`text-[9px] sm:text-xs font-mono font-bold tracking-widest transition-all duration-300 relative py-0.5 sm:py-1 px-1 ${
                idx === currentSceneIndex
                  ? 'text-[#D6A35D] scale-110'
                  : 'text-[#F4EFE7]/50 hover:text-white'
              }`}
              aria-label={`Go to scene ${idx + 1}`}
            >
              <span>{scene.sceneNumber || `0${idx + 1}`}</span>
              {idx === currentSceneIndex && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6A35D] shadow-[0_0_8px_#D6A35D]" />
              )}
            </button>
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

          {/* 4 Cards 3D Interactive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((fragrance) => (
              <Fragrance3DProductCard
                key={fragrance.id}
                fragrance={fragrance}
                onExploreNotes={setSelectedNotesProduct}
                onAddToCart={handleAddToCart}
                isAdded={addedProductId === fragrance.id}
              />
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
