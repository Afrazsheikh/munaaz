'use client';

import React, { useState } from 'react';
import { BRAND_CONFIG } from '@/config/brand';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block">
          ATELIER CONCIERGE
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#35251E] mt-1">
          GET IN TOUCH
        </h1>
        <p className="text-xs sm:text-sm text-[#806B5D] mt-3">
          Our client advisory team is available to assist with sizing advice, order tracking, and custom inquiries across India and the USA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column Contact Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#35251E]">INDIA ATELIER</h3>
            <div className="space-y-2 text-xs text-[#806B5D]">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A85F43] flex-shrink-0 mt-0.5" />
                <span>{BRAND_CONFIG.contact.addressIN}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A85F43] flex-shrink-0" />
                <span>{BRAND_CONFIG.contact.phoneIN}</span>
              </p>
            </div>
          </div>

          <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#35251E]">UNITED STATES ATELIER</h3>
            <div className="space-y-2 text-xs text-[#806B5D]">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A85F43] flex-shrink-0 mt-0.5" />
                <span>{BRAND_CONFIG.contact.addressUS}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A85F43] flex-shrink-0" />
                <span>{BRAND_CONFIG.contact.phoneUS}</span>
              </p>
            </div>
          </div>

          <div className="bg-[#F3E5D0]/50 border border-[#DDCBB7] p-6 space-y-2">
            <h4 className="font-serif text-base font-bold text-[#35251E]">DIRECT EMAIL CONCIERGE</h4>
            <p className="text-xs text-[#806B5D]">
              Write to us directly at <strong className="text-[#35251E]">{BRAND_CONFIG.contact.email}</strong>
            </p>
            <p className="text-[11px] text-[#806B5D] pt-2">
              Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST / EST
            </p>
          </div>

        </div>

        {/* Right Column Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#FFF9F1] border border-[#DDCBB7] p-6 sm:p-10">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#A85F43] mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-[#35251E]">MESSAGE RECEIVED</h3>
              <p className="text-xs text-[#806B5D] max-w-sm mx-auto">
                Thank you for reaching out to AUREN Atelier. A member of our client concierge team will respond within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-serif text-2xl font-bold text-[#35251E] mb-6">
                SEND AN ADVISORY MESSAGE
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#35251E] mb-1 uppercase tracking-wider">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                    placeholder="Aria Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#35251E] mb-1 uppercase tracking-wider">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#35251E] mb-1 uppercase tracking-wider">
                  SUBJECT *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                  placeholder="Sizing Advice / Order Query / General Inquiry"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#35251E] mb-1 uppercase tracking-wider">
                  MESSAGE *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                  placeholder="How can our atelier assist you today?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold py-4 uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2"
              >
                <span>SEND MESSAGE</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
