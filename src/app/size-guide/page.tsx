'use client';

import React, { useState } from 'react';
import { Ruler } from 'lucide-react';

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ruler className="w-6 h-6 text-[#A85F43]" />
          <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase">
            ATELIER SIZING
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#35251E]">
          SIZE GUIDE & FIT ADVICE
        </h1>
        <p className="text-xs sm:text-sm text-[#806B5D] mt-2">
          Find your precise measurements below for AUREN menswear and womenswear collections.
        </p>
      </div>

      <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#DDCBB7]">
          <div className="flex border border-[#DDCBB7]">
            <button
              onClick={() => setActiveTab('men')}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'men' ? 'bg-[#A85F43] text-white' : 'text-[#35251E] hover:bg-[#F3E5D0]'
              }`}
            >
              MEN'S COLLECTION
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'women' ? 'bg-[#A85F43] text-white' : 'text-[#35251E] hover:bg-[#F3E5D0]'
              }`}
            >
              WOMEN'S COLLECTION
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
              CENTIMETERS
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto py-6">
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
      </div>
    </div>
  );
}
