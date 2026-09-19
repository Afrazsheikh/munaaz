'use client';

import React from 'react';
import { ShirtLoader } from '@/components/ui/ShirtLoader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#FFF9F1]/95 backdrop-blur-md flex items-center justify-center">
      <ShirtLoader size="full" label="MUNAAZ ATELIER" showProgress={true} />
    </div>
  );
}
