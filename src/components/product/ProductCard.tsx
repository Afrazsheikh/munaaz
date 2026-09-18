'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { useRegion } from '@/context/RegionContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice } = useRegion();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const activeColor = product.colors[selectedColorIndex] || product.colors[0];
  const activeImage = activeColor?.image || product.images[0];
  const hoverImage = product.images[1] || activeImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick add default color & default first size
    const defaultSize = product.sizes[0] || 'M';
    addItem(product, activeColor.name, defaultSize, 1);
  };

  return (
    <>
      <div
        className="group relative bg-[#FFF9F1] border border-[#DDCBB7] hover:border-[#A85F43] transition-all duration-300 flex flex-col justify-between"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Box */}
        <div className="relative aspect-[3/4] w-full bg-[#F3E5D0] overflow-hidden">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <Image
              src={isHovered ? hoverImage : activeImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {product.isNewArrival && (
              <span className="bg-[#2A1D18] text-[#F3E5D0] text-[9px] font-bold tracking-widest px-2 py-1 uppercase">
                NEW EDIT
              </span>
            )}
            {product.isSale && (
              <span className="bg-[#A85F43] text-white text-[9px] font-bold tracking-widest px-2 py-1 uppercase">
                {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'SALE'}
              </span>
            )}
          </div>

          {/* Wishlist Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-[#FFF9F1]/80 hover:bg-[#FFF9F1] text-[#35251E] hover:text-[#A85F43] shadow-md transition-all z-10"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                inWishlist ? 'fill-[#A85F43] text-[#A85F43]' : ''
              }`}
            />
          </button>

          {/* Hover Overlay Action Bar */}
          <div className="absolute inset-x-2 bottom-2 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="flex-1 bg-[#FFF9F1]/95 hover:bg-[#35251E] hover:text-[#FFF9F1] text-[#35251E] text-[11px] font-semibold py-2.5 px-3 tracking-wider uppercase backdrop-blur-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>QUICK VIEW</span>
            </button>

            <button
              onClick={handleQuickAdd}
              className="bg-[#A85F43] hover:bg-[#C18A60] text-white p-2.5 transition-colors shadow-sm"
              title="Quick Add to Bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#806B5D] uppercase block mb-1">
              {product.brand}
            </span>

            <Link
              href={`/products/${product.slug}`}
              className="font-serif text-sm font-semibold text-[#35251E] hover:text-[#A85F43] transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
          </div>

          <div className="mt-3 pt-2 border-t border-[#DDCBB7]/50 flex items-center justify-between">
            {/* Color Swatches */}
            <div className="flex items-center gap-1.5">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColorIndex(i)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    selectedColorIndex === i ? 'scale-125 border-[#35251E] ring-1 ring-[#A85F43]' : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            {/* Prices */}
            <div className="text-right">
              <span className="font-semibold text-xs text-[#35251E]">
                {formatPrice(product.priceINR, product.priceUSD)}
              </span>
              {product.compareAtPriceINR && (
                <span className="text-[10px] text-[#806B5D] line-through ml-1.5">
                  {formatPrice(product.compareAtPriceINR, product.compareAtPriceUSD || 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
