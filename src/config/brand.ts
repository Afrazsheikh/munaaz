export interface RegionConfig {
  code: 'IN' | 'US';
  name: string;
  currency: string;
  symbol: string;
  flag: string;
  exchangeRateFromINR: number; // 1 INR = X USD
  freeShippingThreshold: number;
  flatShippingRate: number;
  taxRate: number; // e.g., 0.05 for 5% GST or 0.08 for 8% US state sales tax average
}

export const BRAND_CONFIG = {
  name: "MUNAAZ",
  tagline: "EVERYDAY, ELEVATED.",
  subheading: "Thoughtfully designed clothing for a life well lived.",
  announcementText: {
    IN: "Complimentary express shipping across India on orders over ₹2,999",
    US: "Complimentary standard shipping across the United States on orders over $150"
  },
  contact: {
    email: "concierge@munaazfashion.com",
    phoneIN: "+91 (0) 80 4912 8800",
    phoneUS: "+1 (800) 555-0199",
    whatsapp: "+91 98765 43210",
    addressIN: "MUNAAZ Atelier, Bandra West, Mumbai, Maharashtra 400050, India",
    addressUS: "MUNAAZ Flagship, 452 West Broadway, Soho, New York, NY 10012, USA",
  },
  social: {
    instagram: "https://instagram.com/auren.official",
    facebook: "https://facebook.com/aurenofficial",
    pinterest: "https://pinterest.com/aurenstudio",
    youtube: "https://youtube.com/@aurenofficial"
  },
  regions: {
    IN: {
      code: 'IN',
      name: 'India',
      currency: 'INR',
      symbol: '₹',
      flag: '🇮🇳',
      exchangeRateFromINR: 1,
      freeShippingThreshold: 2999,
      flatShippingRate: 199,
      taxRate: 0.12 // 12% GST average
    } as RegionConfig,
    US: {
      code: 'US',
      name: 'United States',
      currency: 'USD',
      symbol: '$',
      flag: '🇺🇸',
      exchangeRateFromINR: 0.012, // 1 INR ~ 0.012 USD
      freeShippingThreshold: 150,
      flatShippingRate: 15,
      taxRate: 0.08 // 8% sales tax
    } as RegionConfig
  }
};
