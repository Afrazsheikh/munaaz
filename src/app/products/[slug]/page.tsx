'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { useRegion } from '@/context/RegionContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import {
  Heart,
  ShoppingBag,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  Star,
  ChevronDown,
  Ruler
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const { formatPrice, config } = useRegion();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  // Accordion Toggles
  const [openAccordion, setOpenAccordion] = useState<'desc' | 'fabric' | 'shipping'>('desc');

  useEffect(() => {
    productService.getProductBySlug(slug).then((res) => {
      if (res) {
        setProduct(res);
        setSelectedColor(res.colors[0]?.name || '');
        setSelectedSize(res.sizes[0] || 'M');
        productService.getRelatedProducts(res.id, res.category, 4).then(setRelatedProducts);
      }
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-[#806B5D]">
        Loading product details...
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, selectedColor, selectedSize, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#806B5D] mb-8">
        <Link href="/" className="hover:text-[#35251E]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#35251E]">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/collections/${product.category}`} className="hover:text-[#35251E] capitalize">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#35251E] truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left Column: Image Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          
          {/* Thumbnails Sidebar */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[600px] flex-shrink-0">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`relative w-16 sm:w-20 aspect-[3/4] border transition-all ${
                  selectedImageIndex === i ? 'border-[#A85F43] ring-1 ring-[#A85F43]' : 'border-[#DDCBB7] opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Main Main Image */}
          <div className="relative aspect-[3/4] w-full bg-[#F3E5D0] border border-[#DDCBB7] overflow-hidden">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover transition-all duration-500"
            />
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 bg-[#2A1D18] text-[#F3E5D0] text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase">
                NEW EDIT
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Info & Variant Controls (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header Info */}
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block">
                {product.brand}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#35251E] mt-1">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[#A85F43]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#806B5D] font-medium">
                  {product.rating} ({product.reviewCount} customer reviews)
                </span>
              </div>

              {/* Pricing */}
              <div className="mt-4 flex items-center gap-3">
                <span className="font-bold text-2xl text-[#35251E]">
                  {formatPrice(product.priceINR, product.priceUSD)}
                </span>
                {product.compareAtPriceINR && (
                  <span className="text-sm text-[#806B5D] line-through">
                    {formatPrice(product.compareAtPriceINR, product.compareAtPriceUSD || 0)}
                  </span>
                )}
                {product.isSale && (
                  <span className="bg-[#A85F43]/10 text-[#A85F43] text-xs font-bold px-2.5 py-1 border border-[#A85F43]">
                    SAVE {product.discountPercentage}%
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#806B5D] leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Color Swatches */}
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#35251E] mb-2.5">
                COLOR: <span className="font-normal text-[#806B5D]">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-medium transition-all ${
                      selectedColor === c.name
                        ? 'border-[#A85F43] bg-[#F3E5D0] text-[#35251E] font-bold'
                        : 'border-[#DDCBB7] hover:border-[#C18A60] text-[#806B5D]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold tracking-wider uppercase text-[#35251E]">
                  SIZE: <span className="font-normal text-[#806B5D]">{selectedSize}</span>
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs font-semibold text-[#A85F43] hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>SIZE GUIDE</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 border text-xs font-semibold transition-all ${
                      selectedSize === sz
                        ? 'border-[#A85F43] bg-[#A85F43] text-white shadow-md'
                        : 'border-[#DDCBB7] text-[#35251E] hover:border-[#C18A60]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#DDCBB7] bg-[#FFF9F1] h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 text-[#35251E] hover:bg-[#F3E5D0] h-full"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 font-bold text-xs text-[#35251E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 text-[#35251E] hover:bg-[#F3E5D0] h-full"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] h-12 text-xs font-semibold tracking-[0.15em] uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="w-12 h-12 border border-[#DDCBB7] hover:border-[#A85F43] text-[#35251E] flex items-center justify-center transition-colors"
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#A85F43] text-[#A85F43]' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#2A1D18] hover:bg-[#35251E] text-[#F3E5D0] h-12 text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
              >
                EXPRESS BUY NOW
              </button>
            </div>

            {/* Value Props */}
            <div className="p-4 bg-[#F3E5D0]/40 border border-[#DDCBB7] space-y-2.5 text-xs text-[#806B5D]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#A85F43]" />
                <span>Express dispatch across <strong>{config.name}</strong> within 24-48 hours.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-[#A85F43]" />
                <span>Complimentary 14-day doorstep exchange and returns.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#A85F43]" />
                <span>100% Authentic quality guaranteed by AUREN Atelier.</span>
              </div>
            </div>

            {/* Product Detail Accordions */}
            <div className="border-t border-[#DDCBB7] pt-4 divide-y divide-[#DDCBB7]">
              
              {/* Description */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'desc' ? ('' as any) : 'desc')}
                  className="w-full py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#35251E]"
                >
                  <span>DESCRIPTION & FIT</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'desc' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'desc' && (
                  <div className="pb-4 text-xs text-[#806B5D] leading-relaxed space-y-2">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1 text-[#35251E]">
                      {product.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Fabric & Care */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'fabric' ? ('' as any) : 'fabric')}
                  className="w-full py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#35251E]"
                >
                  <span>FABRIC & CARE INSTRUCTIONS</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'fabric' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'fabric' && (
                  <div className="pb-4 text-xs text-[#806B5D] leading-relaxed">
                    <ul className="list-disc pl-4 space-y-1">
                      {product.fabricCare.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? ('' as any) : 'shipping')}
                  className="w-full py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#35251E]"
                >
                  <span>SHIPPING & RETURNS POLICY</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 text-xs text-[#806B5D] leading-relaxed space-y-2">
                    <p>
                      Free standard shipping on qualifying orders across {config.name}. Delivered in signature reusable cotton dustbags.
                    </p>
                    <p>
                      Returns or exchanges can be initiated online within 14 days of delivery.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[#DDCBB7]">
          <h2 className="font-serif text-2xl font-bold text-[#35251E] text-center mb-8">
            COMPLETE THE LOOK
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
