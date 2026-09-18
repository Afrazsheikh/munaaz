import { Product } from '@/types/product';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'the-essential-linen-shirt',
    name: 'The Essential Linen Shirt',
    brand: 'MUNAAZ Atelier',
    category: 'men',
    collections: ['new-arrivals', 'best-sellers', 'linen-edit', 'everyday-essentials'],
    shortDescription: 'Tailored from 100% French flax linen with a relaxed, breathable drape.',
    description: 'Crafted from premium 100% European flax linen, The Essential Linen Shirt offers unparalleled breathability and timeless elegance. Pre-washed for a soft feel from day one, it features mother-of-pearl buttons, a refined camp collar, and a slightly relaxed silhouette designed for effortless warm-weather tailoring.',
    fabricCare: [
      '100% Organic European Flax Linen',
      'Machine wash gentle cold inside out',
      'Hang dry away from direct sunlight',
      'Warm iron or tumble dry low for natural relaxed texture'
    ],
    features: [
      'Genuine mother-of-pearl buttons',
      'Reinforced gusset stitching',
      'Pre-shrunk organic fabric',
      'Signature subtle embroidery on cuff'
    ],
    priceINR: 4990,
    compareAtPriceINR: 5990,
    priceUSD: 95,
    compareAtPriceUSD: 115,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Sand Beige', hex: '#D6C5B3', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Terracotta', hex: '#A85F43', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Off-White', hex: '#FAF9F6', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      { id: 'v-1-1', color: 'Sand Beige', size: 'S', sku: 'AUR-MLS-SAN-S', stock: 12 },
      { id: 'v-1-2', color: 'Sand Beige', size: 'M', sku: 'AUR-MLS-SAN-M', stock: 25 },
      { id: 'v-1-3', color: 'Sand Beige', size: 'L', sku: 'AUR-MLS-SAN-L', stock: 8 },
      { id: 'v-1-4', color: 'Terracotta', size: 'M', sku: 'AUR-MLS-TER-M', stock: 15 },
      { id: 'v-1-5', color: 'Off-White', size: 'L', sku: 'AUR-MLS-WHI-L', stock: 20 }
    ],
    isNewArrival: true,
    isBestSeller: true,
    isSale: false,
    discountPercentage: 16,
    rating: 4.9,
    reviewCount: 48,
    createdAt: '2026-08-01'
  },
  {
    id: 'prod-2',
    slug: 'the-relaxed-tailored-trouser',
    name: 'The Relaxed Tailored Trouser',
    brand: 'MUNAAZ Atelier',
    category: 'men',
    collections: ['best-sellers', 'earth-tones', 'everyday-essentials'],
    shortDescription: 'Double-pleated waist with a structured yet flowing wide leg.',
    description: 'Designed for fluid movement and modern proportions, The Relaxed Tailored Trouser combines classical sartorial tailoring with lightweight tropical wool blend fabric. Features subtle elastic side waist tabs for adjustable comfort, horn buttons, and deep slanted side pockets.',
    fabricCare: [
      '65% Wool, 35% Organic Cotton',
      'Dry clean recommended',
      'Steam iron on medium setting'
    ],
    features: [
      'Double forward pleats',
      'Internal adjustable side tabs',
      'Extended tab button closure',
      'Tapered hem finish'
    ],
    priceINR: 6490,
    compareAtPriceINR: 7490,
    priceUSD: 125,
    compareAtPriceUSD: 145,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Espresso', hex: '#2A1D18', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Warm Taupe', hex: '#806B5D', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop' }
    ],
    sizes: ['30', '32', '34', '36'],
    variants: [
      { id: 'v-2-1', color: 'Espresso', size: '32', sku: 'AUR-MTR-ESP-32', stock: 10 },
      { id: 'v-2-2', color: 'Warm Taupe', size: '34', sku: 'AUR-MTR-TAU-34', stock: 14 }
    ],
    isNewArrival: false,
    isBestSeller: true,
    isSale: false,
    rating: 4.8,
    reviewCount: 32,
    createdAt: '2026-07-15'
  },
  {
    id: 'prod-3',
    slug: 'the-textured-everyday-dress',
    name: 'The Textured Everyday Dress',
    brand: 'MUNAAZ Atelier',
    category: 'women',
    collections: ['new-arrivals', 'best-sellers', 'earth-tones'],
    shortDescription: 'An effortless midi dress cut from slub-cotton linen in warm terracotta.',
    description: 'A masterpiece of effortless elegance. The Textured Everyday Dress features an open V-neckline, self-tie cinch belt, elbow-length soft puff sleeves, and hidden side seam pockets. The subtle slub texture catches natural light beautifully.',
    fabricCare: [
      '70% Linen, 30% Cotton Slub',
      'Cold gentle hand wash',
      'Line dry in shade'
    ],
    features: [
      'Functional deep side pockets',
      'Removable waist tie sash',
      'Concealed back zip',
      'Breathable cotton lining'
    ],
    priceINR: 7990,
    compareAtPriceINR: 9200,
    priceUSD: 145,
    compareAtPriceUSD: 170,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Terracotta', hex: '#A85F43', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Sand Cream', hex: '#F3E5D0', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    variants: [
      { id: 'v-3-1', color: 'Terracotta', size: 'S', sku: 'AUR-WDR-TER-S', stock: 18 },
      { id: 'v-3-2', color: 'Sand Cream', size: 'M', sku: 'AUR-WDR-SAN-M', stock: 9 }
    ],
    isNewArrival: true,
    isBestSeller: true,
    isSale: false,
    rating: 5.0,
    reviewCount: 56,
    createdAt: '2026-08-10'
  },
  {
    id: 'prod-4',
    slug: 'the-signature-overshirt',
    name: 'The Signature Overshirt',
    brand: 'MUNAAZ Atelier',
    category: 'men',
    collections: ['earth-tones', 'new-arrivals'],
    shortDescription: 'Heavyweight brushed twill outer piece for refined layering.',
    description: 'Constructed from a 320gsm organic cotton twill with a soft brushed surface, The Signature Overshirt works as a lightweight jacket or standalone statement piece. Features dual flap chest pockets and tortoiseshell pattern buttons.',
    fabricCare: [
      '100% Organic Heavy Twill Cotton',
      'Machine wash cold with like colors',
      'Do not bleach'
    ],
    features: [
      'Dual chest utility pockets',
      'Reinforced collar band',
      'Interior passport stash pocket'
    ],
    priceINR: 5990,
    compareAtPriceINR: 6990,
    priceUSD: 110,
    compareAtPriceUSD: 130,
    images: [
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Caramel Brown', hex: '#C18A60', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Deep Espresso', hex: '#2A1D18', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'v-4-1', color: 'Caramel Brown', size: 'M', sku: 'AUR-MOS-CAR-M', stock: 7 }
    ],
    isNewArrival: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.7,
    reviewCount: 19,
    createdAt: '2026-08-14'
  },
  {
    id: 'prod-5',
    slug: 'the-soft-knit-polo',
    name: 'The Soft Knit Polo',
    brand: 'MUNAAZ Atelier',
    category: 'men',
    collections: ['everyday-essentials', 'sale'],
    shortDescription: 'Fine 16-gauge Pima cotton knit with an open relaxed collar.',
    description: 'Elevate casual wardrobe styling with our fine-gauge knit polo. Made from long-staple Peruvian Pima cotton, it feels silky against the skin while holding its tailored structure wash after wash.',
    fabricCare: [
      '100% Pima Cotton Knit',
      'Hand wash cold or gentle cycle inside out laundry mesh bag',
      'Flat dry only'
    ],
    features: [
      'Buttonless open Johnny collar',
      'Ribbed cuffs and hem line',
      'Ultra-breathable fine knit structure'
    ],
    priceINR: 3990,
    compareAtPriceINR: 4990,
    priceUSD: 75,
    compareAtPriceUSD: 95,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Sand', hex: '#F3E5D0', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Charcoal Espresso', hex: '#2A1D18', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'v-5-1', color: 'Sand', size: 'M', sku: 'AUR-MKP-SAN-M', stock: 11 }
    ],
    isNewArrival: false,
    isBestSeller: false,
    isSale: true,
    discountPercentage: 20,
    rating: 4.8,
    reviewCount: 27,
    createdAt: '2026-06-20'
  },
  {
    id: 'prod-6',
    slug: 'the-modern-wide-leg-trouser',
    name: 'The Modern Wide-Leg Trouser',
    brand: 'MUNAAZ Atelier',
    category: 'women',
    collections: ['new-arrivals', 'best-sellers', 'everyday-essentials'],
    shortDescription: 'High-waisted tailored trousers with a dramatic fluid drape.',
    description: 'Cut high on the waist to elongate the body, these trousers feature clean knife pleats, a wide belt loop band, and lightweight drape fabric that moves gracefully with every step.',
    fabricCare: [
      '75% Viscose, 25% Linen',
      'Dry clean or cold delicate cycle',
      'Hang to dry'
    ],
    features: [
      'High rise fit',
      'Front knife pleats',
      'Clean hook-and-bar closure',
      'Deep functional side pockets'
    ],
    priceINR: 6990,
    compareAtPriceINR: 7990,
    priceUSD: 130,
    compareAtPriceUSD: 150,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Warm Taupe', hex: '#806B5D', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Cream', hex: '#FFF9F1', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    variants: [
      { id: 'v-6-1', color: 'Warm Taupe', size: 'S', sku: 'AUR-WTR-TAU-S', stock: 15 }
    ],
    isNewArrival: true,
    isBestSeller: true,
    isSale: false,
    rating: 4.9,
    reviewCount: 41,
    createdAt: '2026-08-05'
  },
  {
    id: 'prod-7',
    slug: 'the-everyday-oxford-shirt',
    name: 'The Everyday Oxford Shirt',
    brand: 'MUNAAZ Atelier',
    category: 'men',
    collections: ['everyday-essentials', 'best-sellers'],
    shortDescription: 'Classic heavy Oxford cloth tailored for modern comfort.',
    description: 'A true wardrobe anchor. Crafted from 100% combed cotton heavy Oxford weave, garment-washed for broken-in softness without losing its crisp structure.',
    fabricCare: [
      '100% Heavy Combed Cotton Oxford',
      'Warm machine wash',
      'Tumble dry medium'
    ],
    features: [
      'Button-down collar',
      'Single chest patch pocket',
      'Box pleat with locker loop'
    ],
    priceINR: 4290,
    compareAtPriceINR: 4990,
    priceUSD: 85,
    compareAtPriceUSD: 99,
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Sky Cream', hex: '#E8E1D7', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000&auto=format&fit=crop' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'v-7-1', color: 'Sky Cream', size: 'M', sku: 'AUR-MOX-CRM-M', stock: 16 }
    ],
    isNewArrival: false,
    isBestSeller: true,
    isSale: false,
    rating: 4.8,
    reviewCount: 52,
    createdAt: '2026-06-10'
  },
  {
    id: 'prod-8',
    slug: 'the-draped-silk-blend-blouse',
    name: 'The Draped Silk Blend Blouse',
    brand: 'MUNAAZ Atelier',
    category: 'women',
    collections: ['new-arrivals', 'earth-tones', 'sale'],
    shortDescription: 'Luxurious silk-viscose weave with subtle shoulder gathers.',
    description: 'Sensual texture meet tailored detail. Features an elegant soft keyhole collar, mother-of-pearl cuff buttons, and an understated lustre that transition smoothly from work to evening gatherings.',
    fabricCare: [
      '30% Silk, 70% Mulberry Viscose',
      'Dry clean only',
      'Iron on silk setting reverse side'
    ],
    features: [
      'Natural silk lustre finish',
      'Shirred cuffs',
      'Concealed placket'
    ],
    priceINR: 6790,
    compareAtPriceINR: 8500,
    priceUSD: 135,
    compareAtPriceUSD: 165,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Terracotta', hex: '#A85F43', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1000&auto=format&fit=crop' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    variants: [
      { id: 'v-8-1', color: 'Terracotta', size: 'S', sku: 'AUR-WBL-TER-S', stock: 6 }
    ],
    isNewArrival: true,
    isBestSeller: false,
    isSale: true,
    discountPercentage: 20,
    rating: 4.6,
    reviewCount: 14,
    createdAt: '2026-08-01'
  }
];
