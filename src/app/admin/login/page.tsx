'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, Key, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { adminAuthService } from '@/services/adminAuthService';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@munaaz.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect straight to admin dashboard
    if (adminAuthService.isLoggedIn()) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const success = await adminAuthService.loginAsync(password);
      if (success) {
        router.push('/admin');
      } else {
        setErrorMsg('Invalid password. Default demo password is "munaaz2026".');
        setLoading(false);
      }
    } catch {
      setErrorMsg('Error authenticating with admin server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F1E8] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Ambient Radial Lighting & Subtle Luxury Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C9A46A]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-[#A85F43]/15 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#C9A46A_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-4xl sm:text-5xl tracking-[0.25em] text-[#F5F1E8] font-light">
              MUNAAZ
            </h1>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#17120E] border border-[#C9A46A]/40 rounded-full text-[10px] font-mono tracking-[0.3em] text-[#C9A46A] uppercase shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A46A]" />
            <span>ORGANISATION ATELIER PORTAL</span>
          </div>
          
          <p className="text-xs text-[#D8C7AD]/70 font-light tracking-wide">
            Secure admin authentication portal to post products & track customer orders.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#17120E]/90 backdrop-blur-xl border border-[#C9A46A]/30 p-8 shadow-2xl space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 bg-red-950/60 border border-red-800/60 text-red-200 text-xs font-mono rounded flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-[0.2em] text-[#C9A46A] uppercase block">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8C7AD]/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#050505] border border-[#C9A46A]/30 focus:border-[#C9A46A] text-xs font-mono text-[#F5F1E8] pl-10 pr-4 py-3.5 outline-none transition-colors"
                  placeholder="admin@munaaz.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono tracking-[0.2em] text-[#C9A46A] uppercase block">
                  ADMIN PASSWORD
                </label>
                <span className="text-[10px] font-mono text-[#D8C7AD]/50">Default: munaaz2026</span>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8C7AD]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050505] border border-[#C9A46A]/30 focus:border-[#C9A46A] text-xs font-mono text-[#F5F1E8] pl-10 pr-10 py-3.5 outline-none transition-colors"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D8C7AD]/50 hover:text-[#C9A46A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#C9A46A] to-[#B38F55] hover:from-[#D4B37B] hover:to-[#C9A46A] text-[#050505] text-xs font-semibold tracking-[0.2em] uppercase py-4 transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'ENTER ADMIN PORTAL'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Info Box */}
          <div className="pt-4 border-t border-[#C9A46A]/20 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#D8C7AD]/70 font-mono">
              <Key className="w-3.5 h-3.5 text-[#C9A46A]" />
              <span>Demo Admin Passcode: <strong className="text-[#C9A46A]">munaaz2026</strong></span>
            </div>
            <p className="text-[10px] text-[#D8C7AD]/50 font-light">
              You can update the admin passcode anytime inside Admin Settings.
            </p>
          </div>

        </div>

        {/* Back to main storefront link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-mono text-[#D8C7AD]/60 hover:text-[#C9A46A] tracking-wider uppercase transition-colors"
          >
            ← Back to MUNAAZ Storefront
          </Link>
        </div>

      </div>

    </div>
  );
}
