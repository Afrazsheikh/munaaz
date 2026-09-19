'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Search,
  User,
  Info,
  Check,
  Star,
  Award,
  Droplet,
  ShieldCheck
} from 'lucide-react';
import { FragranceScrollSequence } from '@/components/fragrance/FragranceScrollSequence';
import { FragranceNotesModal } from '@/components/fragrance/FragranceNotesModal';
import { Fragrance3DOrbitingHero } from '@/components/fragrance/Fragrance3DOrbitingHero';
import { fragranceService } from '@/services/fragranceService';
import { FragranceProduct } from '@/types/fragrance';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';

export default function FragranceViewPage() {
  const [selectedProduct, setSelectedProduct] = useState<FragranceProduct | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const collectionRef = useRef<HTMLDivElement>(null);
  const { addItem, totalItems, openCart } = useCart();

  const storeData = fragranceService.getFragranceData();
  const products = storeData.products && storeData.products.length > 0 ? storeData.products : [
    {
      id: 'frag-noir-07',
      slug: 'munaaz-noir-07',
      name: 'MUNAAZ ESSENCE NO. 07',
      subtitle: 'Extrait de Parfum',
      description: 'An intoxicating blend of smoked cedarwood, midnight black amber, and Madagascar bourbon vanilla macerated for 6 weeks in Grasse.',
      notes: { top: ['Black Pepper', 'Bergamot'], heart: ['Smoked Cedar', 'Damask Rose'], base: ['Black Amber', 'Bourbon Vanilla'] },
      priceINR: 12500,
      priceUSD: 150,
      size: '100ml / 3.4 fl. oz.',
      images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2400&auto=format&fit=crop'],
      accentColor: '#C9A46A',
      rating: 4.9,
      reviewCount: 88,
      story: 'Distilled in Grasse, France.'
    }
  ];

  // Scroll listener for sticky luxury navbar transition
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCollection = () => {
    if (collectionRef.current) {
      collectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product: FragranceProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const cartProduct: Product = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: 'MUNAAZ Essence',
      category: 'accessories',
      collections: ['everyday-essentials'],
      shortDescription: product.description,
      description: product.story || product.description,
      fabricCare: [`Size: ${product.size}`, `Concentration: ${product.subtitle}`],
      features: [
        `Top Notes: ${product.notes.top.join(', ')}`,
        `Heart Notes: ${product.notes.heart.join(', ')}`,
        `Base Notes: ${product.notes.base.join(', ')}`
      ],
      priceINR: product.priceINR,
      compareAtPriceINR: product.compareAtPriceINR,
      priceUSD: product.priceUSD,
      compareAtPriceUSD: product.compareAtPriceUSD,
      images: product.images,
      colors: [{ name: 'Amber Gold', hex: '#D6A35D', image: product.images[0] }],
      sizes: [product.size],
      variants: [{ id: `${product.id}-default`, color: 'Amber Gold', size: product.size, sku: `SKU-${product.id}`, stock: 50 }],
      isNewArrival: true,
      isBestSeller: true,
      isSale: false,
      rating: product.rating || 4.9,
      reviewCount: product.reviewCount || 88,
      createdAt: new Date().toISOString()
    };

    addItem(cartProduct, 'Amber Gold', product.size, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F1E8] selection:bg-[#C9A46A] selection:text-[#050505] font-sans antialiased">
      {/* 1. ULTRA-PREMIUM MINIMALIST LUXURY NAVIGATION */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#050505]/85 backdrop-blur-xl border-b border-[#C9A46A]/20 py-3.5 shadow-2xl'
            : 'bg-gradient-to-b from-[#050505]/90 via-[#050505]/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Luxury Brand Identity */}
          <Link href="/" className="group flex flex-col">
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.25em] text-[#F5F1E8] uppercase transition-colors group-hover:text-[#C9A46A]">
              MUNAAZ
            </span>
            <span className="text-[8px] font-mono tracking-[0.35em] text-[#C9A46A] uppercase">
              HAUTE PARFUMERIE
            </span>
          </Link>

          {/* Center: Minimalist Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-[0.2em] text-[#D8C7AD] uppercase">
            <Link href="/" className="hover:text-[#C9A46A] transition-colors">
              HOME
            </Link>
            <Link href="/collections/fragrance" className="text-[#C9A46A] font-bold">
              COLLECTIONS
            </Link>
            <Link href="/shop?category=men" className="hover:text-[#C9A46A] transition-colors">
              MEN
            </Link>
            <Link href="/shop?category=women" className="hover:text-[#C9A46A] transition-colors">
              WOMEN
            </Link>
            <Link href="/shop?category=unisex" className="hover:text-[#C9A46A] transition-colors">
              UNISEX
            </Link>
            <Link href="/shop?sort=bestsellers" className="hover:text-[#C9A46A] transition-colors">
              BEST SELLERS
            </Link>
            <Link href="/about" className="hover:text-[#C9A46A] transition-colors">
              ABOUT
            </Link>
          </nav>

          {/* Right: User Actions */}
          <div className="flex items-center gap-4 sm:gap-6 text-[#F5F1E8]">
            <Link href="/search" className="p-1.5 hover:text-[#C9A46A] transition-colors" aria-label="Search">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link href="/wishlist" className="p-1.5 hover:text-[#C9A46A] transition-colors hidden sm:block" aria-label="Wishlist">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link href="/account" className="p-1.5 hover:text-[#C9A46A] transition-colors hidden sm:block" aria-label="Account">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            <button
              onClick={openCart}
              className="relative p-1.5 hover:text-[#C9A46A] transition-colors flex items-center"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#C9A46A] text-[#050505] text-[9px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. CINEMATIC SCROLL-DRIVEN 5-STAGE FRAME SEQUENCE HERO */}
      <FragranceScrollSequence
        onShopClick={scrollToCollection}
        onExploreClick={scrollToCollection}
      />

      {/* 3. 360-DEGREE VOLUMETRIC ORBIT HERO SHOWCASE */}
      <section className="bg-[#17120E] border-t border-[#C9A46A]/20 py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="text-xs font-mono tracking-[0.35em] text-[#C9A46A] uppercase block">
              360° INTERACTIVE FLACON EXPLORATION
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide text-[#F5F1E8] uppercase">
              THE ART OF CRYSTAL & SCENT
            </h2>
            <p className="text-sm font-light text-[#D8C7AD] leading-relaxed">
              Drag left or right to orbit around the 3D flacon. Experience the anamorphic 50mm lens optics, liquid depth, and warm tungsten reflections.
            </p>
          </div>

          <div className="relative w-full h-[550px] sm:h-[650px] bg-[#050505] border border-[#C9A46A]/30 rounded-2xl overflow-hidden shadow-2xl">
            <Fragrance3DOrbitingHero accentColor="#C9A46A" />
          </div>
        </div>
      </section>

      {/* 4. EDITORIAL PRODUCT COLLECTION SECTION */}
      <section ref={collectionRef} className="bg-[#050505] py-24 sm:py-32 border-t border-[#C9A46A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono tracking-[0.35em] text-[#C9A46A] uppercase block mb-2">
                MUNAAZ HAUTE COLLECTION
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide text-[#F5F1E8] uppercase">
                THE SIGNATURE FRAGRANCES
              </h2>
            </div>
            <p className="text-xs text-[#D8C7AD] font-light max-w-md leading-relaxed">
              Each fragrance is crafted in France, macerated for 6 weeks, and formulated to leave an indelible impression.
            </p>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {products.map((p) => {
              const isAdded = addedProductId === p.id;
              return (
                <div
                  key={p.id}
                  className="group relative bg-[#17120E] border border-[#C9A46A]/30 hover:border-[#C9A46A] transition-all duration-500 rounded-xl overflow-hidden flex flex-col justify-between shadow-2xl transform-gpu hover:-translate-y-2"
                >
                  {/* Rating & Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#050505]/85 backdrop-blur-md border border-[#C9A46A]/50 text-[9px] font-mono tracking-[0.2em] text-[#C9A46A] uppercase shadow-lg">
                      EXTRAIT DE PARFUM
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white flex items-center gap-1 border border-white/10 shadow-lg">
                    <Star className="w-3 h-3 text-[#C9A46A] fill-current" />
                    <span>{p.rating || 4.9}</span>
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-[3/4] w-full bg-[#050505] overflow-hidden">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17120E] via-transparent to-transparent opacity-80" />

                    {/* Hover Explore Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-[2px] p-4">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="px-6 py-3 bg-[#F5F1E8] hover:bg-[#C9A46A] text-[#050505] hover:text-[#050505] text-xs font-semibold tracking-[0.2em] uppercase shadow-2xl transition-all duration-300 flex items-center gap-2"
                      >
                        <Info className="w-4 h-4" />
                        <span>EXPLORE NOTES</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-[#C9A46A] font-mono tracking-widest uppercase mb-1.5">
                        <span>{p.subtitle}</span>
                        <span>{p.size}</span>
                      </div>

                      <h3 className="font-serif text-2xl font-normal tracking-wide text-[#F5F1E8] group-hover:text-[#C9A46A] transition-colors">
                        {p.name}
                      </h3>

                      <p className="text-xs text-[#D8C7AD]/80 font-light line-clamp-2 mt-2 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Notes Pills */}
                      <div className="pt-4 flex flex-wrap gap-1.5">
                        {p.notes.top.slice(0, 2).map((n) => (
                          <span key={n} className="px-2.5 py-0.5 bg-[#050505] text-[10px] text-[#D8C7AD] border border-[#C9A46A]/30">
                            {n}
                          </span>
                        ))}
                        {p.notes.heart.slice(0, 1).map((n) => (
                          <span key={n} className="px-2.5 py-0.5 bg-[#C9A46A]/20 text-[10px] text-[#C9A46A] border border-[#C9A46A]/60">
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-[#C9A46A]/20 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-serif font-bold text-xl text-[#F5F1E8]">
                          ₹{p.priceINR.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-mono text-[#C9A46A]">
                          ${p.priceUSD} USD
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(p, e)}
                        className={`px-5 py-3 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 ${
                          isAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#C9A46A] hover:bg-[#D8C7AD] text-[#050505] shadow-lg'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>ADDED</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>ADD TO BAG</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FRAGRANCE NOTES VISUALIZATION PYRAMID */}
      <section className="bg-[#17120E] border-t border-[#C9A46A]/20 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-mono tracking-[0.35em] text-[#C9A46A] uppercase block">
              THE OLFACTORY PYRAMID
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide text-[#F5F1E8] uppercase">
              STRUCTURE OF PERFUMERY
            </h2>
            <p className="text-sm font-light text-[#D8C7AD] leading-relaxed">
              Every MUNAAZ fragrance is composed of three distinct temporal phases—unfolding gracefully over 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Top Notes */}
            <div className="bg-[#050505] border border-[#C9A46A]/30 p-8 rounded-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C9A46A] tracking-[0.25em] uppercase">01 · FIRST 15 MINS</span>
                <Droplet className="w-5 h-5 text-[#C9A46A]" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#F5F1E8] uppercase">TOP NOTES</h3>
              <p className="text-xs text-[#D8C7AD] font-light leading-relaxed">
                The immediate sensory impression. Radiant Calabrian bergamot, sunlit lemon zest, and crisp pink pepper.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 bg-[#17120E] text-[10px] text-[#C9A46A] border border-[#C9A46A]/30">Bergamot</span>
                <span className="px-2.5 py-1 bg-[#17120E] text-[10px] text-[#C9A46A] border border-[#C9A46A]/30">Lemon Zest</span>
                <span className="px-2.5 py-1 bg-[#17120E] text-[10px] text-[#C9A46A] border border-[#C9A46A]/30">Pink Pepper</span>
              </div>
            </div>

            {/* Heart Notes */}
            <div className="bg-[#050505] border border-[#C9A46A]/50 p-8 rounded-xl space-y-4 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 px-3 py-1 bg-[#C9A46A] text-[#050505] text-[9px] font-mono font-bold tracking-widest uppercase">
                THE SOUL
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C9A46A] tracking-[0.25em] uppercase">02 · 15 MINS - 4 HOURS</span>
                <Sparkles className="w-5 h-5 text-[#C9A46A]" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#F5F1E8] uppercase">HEART NOTES</h3>
              <p className="text-xs text-[#D8C7AD] font-light leading-relaxed">
                The true character of the fragrance. Velvet Damask rose, wild grandiflorum jasmine, and smoked cedarwood.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 bg-[#C9A46A]/20 text-[10px] text-[#C9A46A] border border-[#C9A46A]/60">Damask Rose</span>
                <span className="px-2.5 py-1 bg-[#C9A46A]/20 text-[10px] text-[#C9A46A] border border-[#C9A46A]/60">Wild Jasmine</span>
                <span className="px-2.5 py-1 bg-[#C9A46A]/20 text-[10px] text-[#C9A46A] border border-[#C9A46A]/60">Smoked Cedar</span>
              </div>
            </div>

            {/* Base Notes */}
            <div className="bg-[#050505] border border-[#C9A46A]/30 p-8 rounded-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C9A46A] tracking-[0.25em] uppercase">03 · 4 - 24 HOURS</span>
                <Award className="w-5 h-5 text-[#C9A46A]" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#F5F1E8] uppercase">BASE NOTES</h3>
              <p className="text-xs text-[#D8C7AD] font-light leading-relaxed">
                The deep lingering sillage. Midnight black amber, Madagascar bourbon vanilla, tonka bean, and Cambodian oud.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 bg-[#17120E] text-[10px] text-[#C9A46A] border border-[#C9A46A]/30">Black Amber</span>
                <span className="px-2.5 py-1 bg-[#17120E] text-[10px] text-[#C9A46A] border border-[#C9A46A]/30">Bourbon Vanilla</span>
                <span className="px-2.5 py-1 bg-[#17120E] text-[10px] text-[#C9A46A] border border-[#C9A46A]/30">Cambodian Oud</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL BRAND STORY */}
      <section className="bg-[#050505] py-24 sm:py-32 border-t border-[#C9A46A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono tracking-[0.35em] text-[#C9A46A] uppercase block">
                THE GRASSE ATELIER HERITAGE
              </span>

              <h2 className="font-serif text-4xl sm:text-6xl font-normal tracking-wide text-[#F5F1E8] uppercase leading-tight">
                MORE THAN A FRAGRANCE.
              </h2>

              <p className="text-sm text-[#D8C7AD] font-light leading-relaxed">
                An expression of identity, crafted through scent. Formulated in collaboration with master perfumers in Grasse, France. Every bottle is cold-macerated for 6 weeks to achieve unmatched depth and longevity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#C9A46A]/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#C9A46A]">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">22%+ EXTRAIT</span>
                  </div>
                  <p className="text-[11px] text-[#D8C7AD]/70">Pure Extrait strength concentration.</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#C9A46A]">
                    <Droplet className="w-4 h-4" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">GRASSE ESSENCES</span>
                  </div>
                  <p className="text-[11px] text-[#D8C7AD]/70">Ethically harvested natural oils.</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#C9A46A]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">SAMPLE GUARANTEE</span>
                  </div>
                  <p className="text-[11px] text-[#D8C7AD]/70">Complimentary 2ml sample with 100ml.</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-[#17120E] border border-[#C9A46A]/40 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=2400&auto=format&fit=crop"
                alt="Grasse Perfumery Atelier"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-70" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. FRAGRANCE NOTES DETAIL MODAL */}
      {selectedProduct && (
        <FragranceNotesModal
          fragrance={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
