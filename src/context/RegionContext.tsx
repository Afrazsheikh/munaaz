'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRAND_CONFIG, RegionConfig } from '@/config/brand';

interface RegionContextType {
  region: 'IN' | 'US';
  setRegion: (region: 'IN' | 'US') => void;
  config: RegionConfig;
  formatPrice: (priceINR: number, priceUSD: number) => string;
  getRawPrice: (priceINR: number, priceUSD: number) => number;
  announcementText: string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const REGION_STORAGE_KEY = 'auren_user_region';

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegionState] = useState<'IN' | 'US'>('IN');

  useEffect(() => {
    const savedRegion = localStorage.getItem(REGION_STORAGE_KEY) as 'IN' | 'US';
    if (savedRegion && (savedRegion === 'IN' || savedRegion === 'US')) {
      setRegionState(savedRegion);
    }
  }, []);

  const setRegion = (newRegion: 'IN' | 'US') => {
    setRegionState(newRegion);
    localStorage.setItem(REGION_STORAGE_KEY, newRegion);
  };

  const currentConfig = BRAND_CONFIG.regions[region];

  const formatPrice = (priceINR: number, priceUSD: number): string => {
    if (region === 'IN') {
      return `${currentConfig.symbol}${priceINR.toLocaleString('en-IN')}`;
    } else {
      return `${currentConfig.symbol}${priceUSD.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
    }
  };

  const getRawPrice = (priceINR: number, priceUSD: number): number => {
    return region === 'IN' ? priceINR : priceUSD;
  };

  const announcementText = BRAND_CONFIG.announcementText[region];

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
        config: currentConfig,
        formatPrice,
        getRawPrice,
        announcementText
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
