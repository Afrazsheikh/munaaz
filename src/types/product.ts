export type ProductCategory = 'men' | 'women' | 'accessories';
export type CollectionSlug = 'new-arrivals' | 'best-sellers' | 'earth-tones' | 'sale' | 'linen-edit' | 'everyday-essentials';

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  sku: string;
  stock: number; // real stock count, 0 = out of stock
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  collections: CollectionSlug[];
  shortDescription: string;
  description: string;
  fabricCare: string[];
  features: string[];
  priceINR: number;
  compareAtPriceINR?: number;
  priceUSD: number;
  compareAtPriceUSD?: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  variants: ProductVariant[];
  isNewArrival: boolean;
  isBestSeller: boolean;
  isSale: boolean;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface FilterOptions {
  category?: ProductCategory | 'all';
  collection?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  searchQuery?: string;
}

export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'name-asc';
