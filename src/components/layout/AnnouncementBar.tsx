'use client';

import React from 'react';
import { useRegion } from '@/context/RegionContext';
import { Globe } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenRegionModal?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenRegionModal }) => {
  const { announcementText, config } = useRegion();

  return (
    <div className="bg-[#2A1D18] text-[#F3E5D0] px-4 py-2 text-xs tracking-wider uppercase font-medium flex justify-between items-center z-50 relative border-b border-[#35251E]">
      <div className="flex-1 text-center sm:text-left truncate">
        <span>{announcementText}</span>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={onOpenRegionModal}
          className="flex items-center gap-1.5 hover:text-[#C18A60] transition-colors focus:outline-none"
          title="Change Country & Currency"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{config.flag} {config.name} ({config.currency} {config.symbol})</span>
        </button>
      </div>
    </div>
  );
};
