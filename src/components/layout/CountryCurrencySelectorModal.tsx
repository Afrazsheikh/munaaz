'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { useRegion } from '@/context/RegionContext';
import { BRAND_CONFIG } from '@/config/brand';

interface CountryCurrencySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CountryCurrencySelectorModal: React.FC<CountryCurrencySelectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { region, setRegion } = useRegion();

  if (!isOpen) return null;

  const regions = Object.values(BRAND_CONFIG.regions);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FFF9F1] w-full max-w-md border border-[#DDCBB7] shadow-2xl p-6 sm:p-8 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-[#DDCBB7]">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#35251E]">SELECT YOUR REGION</h3>
            <p className="text-xs text-[#806B5D] mt-0.5">Prices, shipping rates, and taxes update dynamically.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#35251E] hover:text-[#A85F43] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4">
          {regions.map((r) => {
            const isSelected = r.code === region;
            return (
              <button
                key={r.code}
                onClick={() => {
                  setRegion(r.code as 'IN' | 'US');
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 border transition-all text-left ${
                  isSelected
                    ? 'border-[#A85F43] bg-[#F3E5D0]/60'
                    : 'border-[#DDCBB7] hover:border-[#C18A60] bg-[#FFF9F1]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{r.flag}</span>
                  <div>
                    <h4 className="font-semibold text-sm text-[#35251E]">{r.name}</h4>
                    <p className="text-xs text-[#806B5D]">
                      Currency: {r.currency} ({r.symbol}) • Free Shipping over {r.symbol}{r.freeShippingThreshold.toLocaleString()}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#A85F43] text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#DDCBB7] text-center">
          <p className="text-[11px] text-[#806B5D]">
            Duties and local taxes calculated automatically at checkout.
          </p>
        </div>
      </div>
    </div>
  );
};
