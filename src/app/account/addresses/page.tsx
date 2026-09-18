'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function AddressBookPage() {
  const { user, addAddress, deleteAddress } = useAuth();

  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState<'IN' | 'US'>('IN');
  const [phone, setPhone] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !street || !city || !state || !postalCode) return;

    addAddress({
      fullName,
      street,
      apartment,
      city,
      state,
      postalCode,
      country,
      phone
    });

    setShowAddForm(false);
    setFullName('');
    setStreet('');
    setApartment('');
    setCity('');
    setState('');
    setPostalCode('');
    setPhone('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDCBB7]">
        <div>
          <Link href="/account" className="text-xs text-[#806B5D] hover:text-[#35251E] flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#35251E]">
            ADDRESS BOOK
          </h1>
          <p className="text-xs text-[#806B5D] mt-1">
            Manage your saved shipping addresses for India and the United States.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#A85F43] hover:bg-[#C18A60] text-white text-xs font-semibold px-5 py-3 tracking-wider uppercase transition-colors flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW ADDRESS</span>
        </button>
      </div>

      {/* Add New Address Form Modal / Box */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-[#FFF9F1] border border-[#A85F43] p-6 space-y-4 shadow-lg">
          <h3 className="font-serif text-lg font-bold text-[#35251E]">ADD NEW SHIPPING ADDRESS</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#35251E] mb-1">FULL NAME *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#35251E] mb-1">PHONE NUMBER *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#35251E] mb-1">STREET ADDRESS *</label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#35251E] mb-1">CITY *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#35251E] mb-1">STATE *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#35251E] mb-1">POSTAL / PIN CODE *</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#35251E] mb-1">COUNTRY *</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as 'IN' | 'US')}
              className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
            >
              <option value="IN">India 🇮🇳</option>
              <option value="US">United States 🇺🇸</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#A85F43] text-white text-xs font-semibold px-6 py-3 uppercase"
            >
              SAVE ADDRESS
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="border border-[#35251E] text-[#35251E] text-xs font-semibold px-6 py-3 uppercase"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Saved Addresses List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {user?.addresses.map((addr) => (
          <div key={addr.id} className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 space-y-2 relative">
            {addr.isDefault && (
              <span className="bg-[#2A1D18] text-[#F3E5D0] text-[9px] font-bold tracking-widest px-2 py-0.5 uppercase">
                DEFAULT ADDRESS
              </span>
            )}
            <h3 className="font-bold text-sm text-[#35251E]">{addr.fullName}</h3>
            <p className="text-xs text-[#806B5D]">{addr.street} {addr.apartment}</p>
            <p className="text-xs text-[#806B5D]">{addr.city}, {addr.state} {addr.postalCode}</p>
            <p className="text-xs text-[#806B5D]">Country: {addr.country === 'IN' ? 'India' : 'United States'}</p>
            <p className="text-xs text-[#806B5D]">Phone: {addr.phone}</p>

            <button
              onClick={() => deleteAddress(addr.id)}
              className="text-xs text-red-700 hover:underline flex items-center gap-1 pt-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Address</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
