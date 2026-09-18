'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setError(res.error || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-[#FFF9F1] border border-[#DDCBB7] shadow-xl p-6 sm:p-10 space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block">
            MUNAAZ ATELIER
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35251E] mt-1">
            SIGN IN
          </h1>
          <p className="text-xs text-[#806B5D] mt-1">
            Sign in to access your orders, address book, and saved wishlist.
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-[#35251E] uppercase tracking-wider">
                PASSWORD *
              </label>
              <Link href="/forgot-password" className="text-xs text-[#A85F43] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs px-3.5 py-3 pl-10 pr-10 focus:outline-none focus:border-[#A85F43]"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-[#806B5D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#806B5D] hover:text-[#35251E]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold py-4 uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#DDCBB7] text-center text-xs text-[#806B5D]">
          <span>Don't have an account? </span>
          <Link href="/register" className="font-bold text-[#A85F43] hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
