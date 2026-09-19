export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface FragranceScene {
  id: string;
  sceneNumber: string; // '01', '02', '03', '04', '05'
  name: string; // e.g., 'THE SIGNATURE'
  subtitle: string; // e.g., 'EAU DE PARFUM · MUNAAZ'
  title: string; // e.g., 'MUNAAZ ESSENCE'
  tagline: string; // e.g., '"THE SCENT OF PRESENCE"'
  description: string;
  ctaText: string;
  badge: string;
  desktopImage: string;
  mobileImage: string;
  notes: string[];
  accentColor: string;
  particleType: 'bubbles' | 'citrus' | 'petals' | 'spices' | 'pure';
  bgPosition?: string;
  animationType?: 'zoomIn' | 'liquidRefraction' | 'fadeZoom';
  enabled?: boolean;
}

export interface FragranceProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  notes: FragranceNotes;
  priceINR: number;
  compareAtPriceINR?: number;
  priceUSD: number;
  compareAtPriceUSD?: number;
  size: string;
  images: string[];
  badge?: string;
  accentColor: string;
  isBestseller?: boolean;
  rating: number;
  reviewCount: number;
  story: string;
}

export interface FragranceHeroConfig {
  title: string;
  tagline: string;
  subtitle: string;
  ctaText: string;
  badge: string;
  bottleImage: string;
  bgImage: string;
}

export interface FragranceDataStore {
  hero: FragranceHeroConfig;
  scenes: FragranceScene[];
  products: FragranceProduct[];
}
