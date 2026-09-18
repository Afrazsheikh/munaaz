'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <Compass className="w-16 h-16 text-[#A85F43] mx-auto stroke-[1.2] animate-pulse" />
        <span className="text-xs font-bold tracking-[0.3em] text-[#806B5D] uppercase block">
          404 ERROR
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#35251E]">
          PIECE NOT FOUND
        </h1>
        <p className="text-xs sm:text-sm text-[#806B5D] leading-relaxed">
          The page or silhouette you are seeking may have been moved or is currently unavailable in our atelier.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="bg-[#A85F43] hover:bg-[#C18A60] text-white text-xs font-semibold px-8 py-3.5 tracking-widest uppercase transition-colors"
          >
            EXPLORE CATALOG
          </Link>
          <Link
            href="/"
            className="border border-[#35251E] text-[#35251E] hover:bg-[#35251E] hover:text-white text-xs font-semibold px-8 py-3.5 tracking-widest uppercase transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
