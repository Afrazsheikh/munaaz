import { FragranceDataStore, FragranceProduct, FragranceHeroConfig, FragranceScene } from '@/types/fragrance';

export const DEFAULT_FRAGRANCE_HERO: FragranceHeroConfig = {
  title: 'MUNAAZ ESSENCE',
  tagline: '"THE SCENT OF PRESENCE"',
  subtitle: 'Discover fragrances crafted to leave a lasting impression.',
  ctaText: 'DISCOVER THE COLLECTION',
  badge: 'EAU DE PARFUM · MUNAAZ',
  bottleImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2400&auto=format&fit=crop',
  bgImage: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=2400&auto=format&fit=crop',
};

export const DEFAULT_FRAGRANCE_SCENES: FragranceScene[] = [
  {
    id: 'scene-1',
    sceneNumber: '01',
    name: 'THE SIGNATURE BOTTLE',
    subtitle: 'EAU DE PARFUM · MUNAAZ',
    title: 'MUNAAZ ESSENCE',
    tagline: '"THE SCENT OF PRESENCE"',
    description: 'Discover fragrances crafted to leave a lasting impression. Photorealistic transparent glass bottle holding golden amber liquid.',
    ctaText: 'DISCOVER THE COLLECTION',
    badge: 'SCENE 01 · LUXURY BOTTLE',
    desktopImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2400&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop',
    notes: ['Amber Liquid', 'Crystal Glass', 'Light Refraction'],
    accentColor: '#D6A35D',
    particleType: 'pure'
  },
  {
    id: 'scene-2',
    sceneNumber: '02',
    name: 'BOTTLE NECK OPENING',
    subtitle: 'CAMERA ZOOMING INSIDE GLASS',
    title: 'BOTTLE OPENING',
    tagline: '"INSIDE THE CRYSTAL BOTTLE MOUTH"',
    description: 'Camera zooms directly into the transparent glass bottle neck lip. Amber liquid shimmers inside the bottle opening.',
    ctaText: 'TRAVEL INSIDE BOTTLE',
    badge: 'SCENE 02 · BOTTLE OPENING NECK',
    desktopImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2400&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop',
    notes: ['Glass Bottle Neck', 'Gold Cap Rim', 'Shimmering Liquid'],
    accentColor: '#E6C594',
    particleType: 'bubbles'
  },
  {
    id: 'scene-3',
    sceneNumber: '03',
    name: 'INSIDE BOTTLE (CITRUS)',
    subtitle: 'SUNLIT BERGAMOT & ZEST',
    title: 'SUBMERGED CITRUS',
    tagline: '"INSIDE THE BOTTLE LIQUID"',
    description: 'Travelling inside the transparent glass bottle. Oversized Calabrian bergamot slices float suspended in golden fluid with rising bubbles.',
    ctaText: 'EXPLORE CITRUS NOTES',
    badge: 'SCENE 03 · INSIDE BOTTLE CITRUS',
    desktopImage: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?q=80&w=2400&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?q=80&w=1200&auto=format&fit=crop',
    notes: ['Calabrian Bergamot', 'Submerged Lemon', 'Luminous Bubbles'],
    accentColor: '#E6C594',
    particleType: 'citrus'
  },
  {
    id: 'scene-4',
    sceneNumber: '04',
    name: 'INSIDE BOTTLE (PETALS)',
    subtitle: 'FLUID FLORAL HARMONY',
    title: 'FLOATING PETALS',
    tagline: '"ROSE DEW INSIDE THE GLASS"',
    description: 'Deep inside the bottle container. Velvet rose and white jasmine petals drift slowly through golden amber liquid.',
    ctaText: 'EXPLORE FLORAL NOTES',
    badge: 'SCENE 04 · INSIDE BOTTLE PETALS',
    desktopImage: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=2400&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=1200&auto=format&fit=crop',
    notes: ['Velvet Rose', 'Grandiflorum Jasmine', 'Silk Petals'],
    accentColor: '#C18A60',
    particleType: 'petals'
  },
  {
    id: 'scene-5',
    sceneNumber: '05',
    name: 'INSIDE BOTTLE (DARK WOOD)',
    subtitle: 'DEEP NOCTURNAL COMPOSITION',
    title: 'DARK WOOD SPICES',
    tagline: '"SMOKED CEDAR & SPICED VANILLA"',
    description: 'A deep, mysterious blend inside the bottle. Cinnamon bark, roasted tonka bean, and smoked cedarwood rotate gently in rich amber liquid.',
    ctaText: 'EXPLORE SPICED OUD',
    badge: 'SCENE 05 · INSIDE BOTTLE SPICES',
    desktopImage: 'https://images.unsplash.com/photo-1509358217973-895746a4966b?q=80&w=2400&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1509358217973-895746a4966b?q=80&w=1200&auto=format&fit=crop',
    notes: ['Smoked Cedar', 'Bourbon Vanilla', 'Cinnamon Bark'],
    accentColor: '#9A5C24',
    particleType: 'spices'
  }
];

export const DEFAULT_FRAGRANCE_PRODUCTS: FragranceProduct[] = [
  {
    id: 'frag-noir',
    slug: 'munaaz-noir',
    name: 'MUNAAZ NOIR NO. 07',
    subtitle: 'Eau de Parfum',
    description: 'An intoxicating blend of smoked cedarwood, midnight black amber, and Madagascar bourbon vanilla.',
    notes: {
      top: ['Black Pepper', 'Bergamot Zest', 'Cardamom'],
      heart: ['Smoked Cedarwood', 'Velvet Rose', 'Incense'],
      base: ['Black Amber', 'Bourbon Vanilla', 'Leather Accord']
    },
    priceINR: 9990,
    compareAtPriceINR: 11990,
    priceUSD: 120,
    compareAtPriceUSD: 145,
    size: '100ml / 3.4 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'SIGNATURE EDITION',
    accentColor: '#3A2418',
    isBestseller: true,
    rating: 4.9,
    reviewCount: 64,
    story: 'Formulated in Grasse, France for MUNAAZ. Noir embodies nocturnal sophistication with deep woody undercurrents and velvet rose petals.'
  },
  {
    id: 'frag-oud',
    slug: 'munaaz-oud',
    name: 'MUNAAZ OUD',
    subtitle: 'Extrait de Parfum',
    description: 'Regal Agarwood infused with Iranian saffron, warm golden amber, and subtle leather notes.',
    notes: {
      top: ['Iranian Saffron', 'Nutmeg', 'Pink Pepper'],
      heart: ['Royal Cambodian Oud', 'Damask Rose', 'Patchouli'],
      base: ['Golden Amber', 'Rich Birch Tar', 'Clean Musk']
    },
    priceINR: 12990,
    compareAtPriceINR: 14990,
    priceUSD: 155,
    compareAtPriceUSD: 180,
    size: '100ml / 3.4 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'ROYAL COLLECTION',
    accentColor: '#D6A35D',
    isBestseller: true,
    rating: 5.0,
    reviewCount: 42,
    story: 'Distilled using aged wild agarwood resins, MUNAAZ Oud leaves an undeniable impression of power, warmth, and timeless luxury.'
  },
  {
    id: 'frag-amber',
    slug: 'munaaz-amber',
    name: 'MUNAAZ AMBER',
    subtitle: 'Eau de Parfum',
    description: 'Enveloping liquid amber combined with roasted tonka bean, white sandalwood, and soft iris.',
    notes: {
      top: ['Golden Mandarin', 'Nutmeg Blossom', 'Honeyed Amber'],
      heart: ['Orris Root', 'Creamy Sandalwood', 'Labdanum'],
      base: ['Liquid Amber', 'Tonka Bean', 'White Cashmere Musk']
    },
    priceINR: 8990,
    compareAtPriceINR: 10490,
    priceUSD: 110,
    compareAtPriceUSD: 130,
    size: '100ml / 3.4 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'ESSENTIAL WARMTH',
    accentColor: '#9A5C24',
    isBestseller: false,
    rating: 4.8,
    reviewCount: 38,
    story: 'Like golden dusk light hitting warm linen. MUNAAZ Amber wraps you in soft, sensual warmth that radiates close to the skin.'
  },
  {
    id: 'frag-blanc',
    slug: 'munaaz-blanc',
    name: 'MUNAAZ BLANC',
    subtitle: 'Eau de Parfum',
    description: 'A crisp, luminous harmony of Italian bergamot, morning jasmine dew, and soft white cashmere.',
    notes: {
      top: ['Calabrian Bergamot', 'White Tea', 'Neroli'],
      heart: ['Grandiflorum Jasmine', 'Lily of the Valley', 'Cotton Flower'],
      base: ['Soft Cashmeran', 'White Musk', 'Transparent Amber']
    },
    priceINR: 8490,
    compareAtPriceINR: 9990,
    priceUSD: 105,
    compareAtPriceUSD: 125,
    size: '100ml / 3.4 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'LUMINOUS FRESH',
    accentColor: '#F4EFE7',
    isBestseller: false,
    rating: 4.9,
    reviewCount: 29,
    story: 'Pristine, airy, and modern. Blanc captures the clean, serene feeling of fresh morning sunlight on white Egyptian cotton.'
  }
];

const FRAGRANCE_STORAGE_KEY = 'munaaz_fragrance_store_v3';

export function getStoredFragranceData(): FragranceDataStore {
  if (typeof window === 'undefined') {
    return {
      hero: DEFAULT_FRAGRANCE_HERO,
      scenes: DEFAULT_FRAGRANCE_SCENES,
      products: DEFAULT_FRAGRANCE_PRODUCTS
    };
  }
  try {
    const raw = localStorage.getItem(FRAGRANCE_STORAGE_KEY);
    if (!raw) {
      return {
        hero: DEFAULT_FRAGRANCE_HERO,
        scenes: DEFAULT_FRAGRANCE_SCENES,
        products: DEFAULT_FRAGRANCE_PRODUCTS
      };
    }
    const parsed = JSON.parse(raw);
    return {
      hero: { ...DEFAULT_FRAGRANCE_HERO, ...(parsed.hero || {}) },
      scenes: Array.isArray(parsed.scenes) && parsed.scenes.length > 0 ? parsed.scenes : DEFAULT_FRAGRANCE_SCENES,
      products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : DEFAULT_FRAGRANCE_PRODUCTS
    };
  } catch (e) {
    console.error('Failed to load stored fragrance data', e);
    return {
      hero: DEFAULT_FRAGRANCE_HERO,
      scenes: DEFAULT_FRAGRANCE_SCENES,
      products: DEFAULT_FRAGRANCE_PRODUCTS
    };
  }
}

export function saveFragranceData(data: FragranceDataStore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FRAGRANCE_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save fragrance data to localStorage', e);
  }
}

export function resetFragranceData(): FragranceDataStore {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(FRAGRANCE_STORAGE_KEY);
  }
  return {
    hero: DEFAULT_FRAGRANCE_HERO,
    scenes: DEFAULT_FRAGRANCE_SCENES,
    products: DEFAULT_FRAGRANCE_PRODUCTS
  };
}
