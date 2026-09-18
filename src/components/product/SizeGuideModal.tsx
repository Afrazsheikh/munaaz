'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FFF9F1] w-full max-w-2xl border border-[#DDCBB7] shadow-2xl p-6 sm:p-8 z-10">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#DDCBB7]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#A85F43]" />
            <h3 className="font-serif text-xl font-bold text-[#35251E]">SIZE & FIT GUIDE</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#35251E] hover:text-[#A85F43]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Unit selectors */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
          <div className="flex border border-[#DDCBB7]">
            <button
              onClick={() => setActiveTab('men')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'men' ? 'bg-[#A85F43] text-white' : 'text-[#35251E] hover:bg-[#F3E5D0]'
              }`}
            >
              MEN'S SIZING
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'women' ? 'bg-[#A85F43] text-white' : 'text-[#35251E] hover:bg-[#F3E5D0]'
              }`}
            >
              WOMEN'S SIZING
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#806B5D]">UNITS:</span>
            <button
              onClick={() => setUnit('inches')}
              className={`font-semibold ${unit === 'inches' ? 'text-[#A85F43] underline' : 'text-[#35251E]'}`}
            >
              INCHES
            </button>
            <span>/</span>
            <button
              onClick={() => setUnit('cm')}
              className={`font-semibold ${unit === 'cm' ? 'text-[#A85F43] underline' : 'text-[#35251E]'}`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Measurement Tables */}
        <div className="overflow-x-auto py-2">
          {activeTab === 'men' ? (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#F3E5D0] text-[#35251E] font-semibold border-b border-[#DDCBB7]">
                  <th className="p-3">SIZE</th>
                  <th className="p-3">CHEST</th>
                  <th className="p-3">WAIST</th>
                  <th className="p-3">SHOULDER</th>
                  <th className="p-3">SLEEVE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDCBB7] text-[#35251E]">
                <tr>
                  <td className="p-3 font-bold">S</td>
                  <td className="p-3">{unit === 'inches' ? '36 - 38"' : '91 - 96 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '30 - 31"' : '76 - 79 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '17.5"' : '44.5 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '33"' : '84 cm'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">M</td>
                  <td className="p-3">{unit === 'inches' ? '39 - 41"' : '99 - 104 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '32 - 34"' : '81 - 86 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '18.25"' : '46.5 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '34"' : '86 cm'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">L</td>
                  <td className="p-3">{unit === 'inches' ? '42 - 44"' : '107 - 112 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '35 - 37"' : '89 - 94 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '19"' : '48.5 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '35"' : '89 cm'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XL</td>
                  <td className="p-3">{unit === 'inches' ? '45 - 47"' : '114 - 119 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '38 - 40"' : '96 - 101 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '19.75"' : '50 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '36"' : '91 cm'}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#F3E5D0] text-[#35251E] font-semibold border-b border-[#DDCBB7]">
                  <th className="p-3">SIZE</th>
                  <th className="p-3">BUST</th>
                  <th className="p-3">WAIST</th>
                  <th className="p-3">HIPS</th>
                  <th className="p-3">LENGTH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDCBB7] text-[#35251E]">
                <tr>
                  <td className="p-3 font-bold">XS</td>
                  <td className="p-3">{unit === 'inches' ? '31 - 32"' : '79 - 81 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '24 - 25"' : '61 - 63 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '34 - 35"' : '86 - 89 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '46"' : '117 cm'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">S</td>
                  <td className="p-3">{unit === 'inches' ? '33 - 34"' : '84 - 86 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '26 - 27"' : '66 - 68 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '36 - 37"' : '91 - 94 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '47"' : '119 cm'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">M</td>
                  <td className="p-3">{unit === 'inches' ? '35 - 37"' : '89 - 94 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '28 - 30"' : '71 - 76 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '38 - 40"' : '96 - 101 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '48"' : '122 cm'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">L</td>
                  <td className="p-3">{unit === 'inches' ? '38 - 40"' : '96 - 101 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '31 - 33"' : '79 - 84 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '41 - 43"' : '104 - 109 cm'}</td>
                  <td className="p-3">{unit === 'inches' ? '49"' : '124 cm'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#DDCBB7] text-xs text-[#806B5D]">
          <p className="font-semibold text-[#35251E] mb-1">FIT RECOMMENDATION:</p>
          <p>
            AUREN silhouettes are designed with an editorial, relaxed fit. If you prefer a closer, tailored cut, we recommend sizing down one level.
          </p>
        </div>

      </div>
    </div>
  );
};
