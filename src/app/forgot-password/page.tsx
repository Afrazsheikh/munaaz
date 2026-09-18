'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-[#FFF9F1] border border-[#DDCBB7] shadow-xl p-6 sm:p-10 space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block">
            RECOVER ACCESS
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35251E] mt-1">
            FORGOT PASSWORD
          </h1>
          <p className="text-xs text-[#806B5D] mt-1">
            Enter your account email address and we'll send a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-[#F3E5D0]/50 border border-[#DDCBB7] text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#A85F43] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#35251E]">RESET LINK SENT</h3>
            <p className="text-xs text-[#806B5D]">
              We have sent password reset instructions to <strong>{email}</strong>.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 text-xs font-bold text-[#A85F43] hover:underline"
            >
              RETURN TO SIGN IN
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#35251E] mb-1 uppercase tracking-wider">
                ACCOUNT EMAIL *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs px-3.5 py-3 pl-10 focus:outline-none focus:border-[#A85F43]"
                  placeholder="you@example.com"
                />
                <Mail className="w-4 h-4 text-[#806B5D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold py-4 uppercase tracking-[0.15em] transition-colors"
            >
              SEND RESET INSTRUCTIONS
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#DDCBB7] text-center">
          <Link href="/login" className="text-xs text-[#806B5D] hover:text-[#35251E] inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
