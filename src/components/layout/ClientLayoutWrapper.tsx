'use client';

import React, { useState } from 'react';
import { RegionProvider } from '@/context/RegionContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileDrawer } from './MobileDrawer';
import { CountryCurrencySelectorModal } from './CountryCurrencySelectorModal';
import { SearchModal } from './SearchModal';
import { MiniBagDrawer } from './MiniBagDrawer';

export const ClientLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <RegionProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-[#FFF9F1] text-[#35251E]">
              <AnnouncementBar onOpenRegionModal={() => setIsRegionModalOpen(true)} />
              
              <Navbar
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                onOpenRegionModal={() => setIsRegionModalOpen(true)}
              />

              <main className="flex-1">{children}</main>

              <Footer onOpenRegionModal={() => setIsRegionModalOpen(true)} />

              {/* Drawers & Modals */}
              <MobileDrawer
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onOpenRegionModal={() => setIsRegionModalOpen(true)}
              />

              <CountryCurrencySelectorModal
                isOpen={isRegionModalOpen}
                onClose={() => setIsRegionModalOpen(false)}
              />

              <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
              />

              <MiniBagDrawer />
            </div>
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </RegionProvider>
  );
};
