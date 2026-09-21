'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  onOpenRegionModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenMobileMenu,
  onOpenRegionModal,
}) => {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [collectionsHover, setCollectionsHover] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'NEW ARRIVALS', href: '/collections/new-arrivals' },
    { name: 'MEN', href: '/collections/men' },
    { name: 'WOMEN', href: '/collections/women' },
    { name: 'JEWELRY', href: '/jewellery', isSpecial: true },
    { name: 'FRAGRANCE', href: '/fragrance', isSpecial: true },
    {
      name: 'COLLECTIONS',
      href: '/shop',
      hasDropdown: true,
      items: [
        { name: 'Haute Joaillerie Silver Edit', href: '/collections/haute-joaillerie' },
        { name: 'The Linen Edit', href: '/collections/linen-edit' },
        { name: 'Earth Tones Edit', href: '/collections/earth-tones' },
        { name: 'Everyday Essentials', href: '/collections/everyday-essentials' },
        { name: 'Munaaz Essence Fragrances', href: '/fragrance' },
      ]
    },
    { name: 'BEST SELLERS', href: '/collections/best-sellers' },
    { name: 'SALE', href: '/collections/sale', isHighlight: true },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b border-[#DDCBB7]/50 ${
        isScrolled
          ? 'bg-[#FFF9F1]/95 backdrop-blur-md shadow-sm py-3.5'
          : 'bg-[#FFF9F1] py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <div className="flex items-center lg:hidden gap-1.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={onOpenMobileMenu}
              className="p-1.5 sm:p-2 text-[#35251E] hover:text-[#A85F43] transition-colors focus:outline-none"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 text-[#35251E] hover:text-[#A85F43] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Desktop Navigation Left / Main */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-wrap">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative py-2"
                onMouseEnter={() => link.hasDropdown && setCollectionsHover(true)}
                onMouseLeave={() => link.hasDropdown && setCollectionsHover(false)}
              >
                <Link
                  href={link.href}
                  className={`text-xs font-semibold tracking-[0.12em] transition-colors flex items-center gap-1 ${
                    pathname === link.href
                      ? 'text-[#A85F43] font-bold border-b border-[#A85F43]'
                      : link.isSpecial
                      ? 'text-[#2A1D18] hover:text-[#A85F43] bg-[#F3E5D0] border border-[#C18A60]/40 px-2 py-0.5 shadow-xs'
                      : link.isHighlight
                      ? 'text-[#A85F43] hover:text-[#806B5D]'
                      : 'text-[#35251E] hover:text-[#A85F43]'
                  }`}
                >
                  {link.name}
                  {link.isSpecial && (
                    <span className="text-[8px] font-bold tracking-wider text-[#A85F43] bg-[#2A1D18] text-[#FFF9F1] px-1 py-0.2 uppercase">
                      PARFUM
                    </span>
                  )}
                  {link.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </Link>

                {/* Dropdown Menu for Collections */}
                {link.hasDropdown && collectionsHover && (
                  <div className="absolute left-0 top-full pt-2 w-56 z-50">
                    <div className="bg-[#FFF9F1] border border-[#DDCBB7] shadow-xl py-3 rounded-none">
                      {link.items?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-5 py-2.5 text-xs font-medium tracking-wider text-[#35251E] hover:bg-[#F3E5D0] hover:text-[#A85F43] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Centered Brand Logo */}
          <div className="text-center px-1 sm:px-4 flex-1 min-w-0 mx-1">
            <Link href="/" className="inline-block group max-w-full truncate">
              <span className="font-serif text-lg xs:text-2xl sm:text-3xl lg:text-3xl xl:text-4xl tracking-[0.15em] xs:tracking-[0.25em] font-bold text-[#35251E] group-hover:text-[#A85F43] transition-colors block truncate">
                {BRAND_CONFIG.name}
              </span>
              <span className="block text-[8px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#806B5D] -mt-0.5 sm:-mt-1 font-sans">
                ATELIER
              </span>
            </Link>
          </div>

          {/* Action Icons Right */}
          <div className="flex items-center gap-1 xs:gap-3 sm:gap-5 flex-shrink-0">
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex p-2 text-[#35251E] hover:text-[#A85F43] transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href={isAuthenticated ? '/account' : '/login'}
              className="p-1.5 sm:p-2 text-[#35251E] hover:text-[#A85F43] transition-colors"
              aria-label="Customer Account"
              title={isAuthenticated ? 'My Account' : 'Sign In'}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            <Link
              href="/wishlist"
              className="p-1.5 sm:p-2 text-[#35251E] hover:text-[#A85F43] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#A85F43] text-white text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className="p-1.5 sm:p-2 text-[#35251E] hover:text-[#A85F43] transition-colors relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#2A1D18] text-[#F3E5D0] text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
