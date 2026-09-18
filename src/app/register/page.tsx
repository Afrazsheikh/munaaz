'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the Terms of Service to create an account.');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-[#FFF9F1] border border-[#DDCBB7] shadow-xl p-6 sm:p-10 space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block">
            JOIN MUNAAZ
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35251E] mt-1">
            CREATE AN ACCOUNT
          </h1>
          <p className="text-xs text-[#806B5D] mt-1">
            Enjoy seamless checkout, personal order tracking, and exclusive member edits.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#35251E] mb-1 uppercase tracking-wider">
              FULL NAME *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs px-3.5 py-3 pl-10 focus:outline-none focus:border-[#A85F43]"
                placeholder="Aria Sharma"
              />
              <User className="w-4 h-4 text-[#806B5D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#35251E] mb-1 uppercase tracking-wider">
              EMAIL ADDRESS *
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

          <div>
            <label className="block text-xs font-bold text-[#35251E] mb-1 uppercase tracking-wider">
              PASSWORD *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs px-3.5 py-3 pl-10 focus:outline-none focus:border-[#A85F43]"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-[#806B5D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#35251E] mb-1 uppercase tracking-wider">
              CONFIRM PASSWORD *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs px-3.5 py-3 pl-10 focus:outline-none focus:border-[#A85F43]"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-[#806B5D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <label className="flex items-start gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="accent-[#A85F43] w-4 h-4 mt-0.5"
            />
            <span className="text-xs text-[#806B5D]">
              I agree to the <Link href="/terms" className="underline text-[#35251E]">Terms of Service</Link> and <Link href="/privacy-policy" className="underline text-[#35251E]">Privacy Policy</Link>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold py-4 uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#DDCBB7] text-center text-xs text-[#806B5D]">
          <span>Already have an account? </span>
          <Link href="/login" className="font-bold text-[#A85F43] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
