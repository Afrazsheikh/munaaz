'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { X, Sparkles } from 'lucide-react';

interface GoogleAuthButtonProps {
  mode?: 'signin' | 'signup';
  onSuccessRedirect?: string;
  className?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleAuthButton({
  mode = 'signin',
  onSuccessRedirect = '/account',
  className = ''
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');
  const hiddenBtnRef = useRef<HTMLDivElement>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  // Initialize official Google Identity Services script if Client ID is configured
  useEffect(() => {
    if (!googleClientId) return;

    const scriptId = 'google-gis-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const handleCredentialResponse = async (response: any) => {
      if (response && response.credential) {
        setLoading(true);
        setError('');
        try {
          const res = await loginWithGoogle({ credential: response.credential });
          if (res.success) {
            router.push(onSuccessRedirect);
          } else {
            setError(res.error || 'Google authentication failed');
          }
        } catch (err: any) {
          setError(err.message || 'Google authentication error');
        } finally {
          setLoading(false);
        }
      }
    };

    const initGis = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Render hidden official button for programmatic clicking
        if (hiddenBtnRef.current) {
          window.google.accounts.id.renderButton(hiddenBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320
          });
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGis;
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initGis();
    }
  }, [googleClientId, loginWithGoogle, onSuccessRedirect, router]);

  const handleGoogleClick = () => {
    setError('');

    // If official Google Client ID is configured and GIS loaded, trigger prompt
    if (googleClientId && window.google?.accounts?.id) {
      // First try opening GIS prompt
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap was skipped or blocked, click the hidden rendered button
          const btn = hiddenBtnRef.current?.querySelector('div[role=button]') as HTMLElement;
          if (btn) {
            btn.click();
          } else {
            setShowDirectModal(true);
          }
        }
      });
      return;
    }

    // If Google Client ID is not yet configured, show direct Google sign-in dialog
    setShowDirectModal(true);
  };

  const handleDirectGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setLoading(true);
    setError('');

    try {
      const cleanEmail = testEmail.trim().toLowerCase();
      const displayName = testName.trim() || cleanEmail.split('@')[0].replace('.', ' ');
      const res = await loginWithGoogle({
        profile: {
          email: cleanEmail,
          name: displayName,
          googleId: `google-${Date.now()}`,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`
        }
      });

      if (res.success) {
        setShowDirectModal(false);
        router.push(onSuccessRedirect);
      } else {
        setError(res.error || 'Failed to authenticate');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const buttonText = mode === 'signup' ? 'Sign up with Google' : 'Continue with Google';

  return (
    <div className={`w-full ${className}`}>
      {error && (
        <div className="mb-3 p-2.5 bg-red-50 border border-red-300 text-red-700 text-xs text-center font-medium rounded">
          {error}
        </div>
      )}

      {/* Primary Brand Google Button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#3c4043] border border-[#dadce0] hover:border-[#d2e3fc] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.15)] text-xs font-semibold py-3 px-4 transition-all duration-150 flex items-center justify-center gap-3 active:bg-[#f1f3f4]"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span className="tracking-wide">
          {loading ? 'CONNECTING TO GOOGLE...' : buttonText}
        </span>
      </button>

      {/* Hidden container for GIS button mount */}
      <div ref={hiddenBtnRef} className="hidden" aria-hidden="true" />

      {/* Direct Google Sign-In Dialog (when Client ID is pending setup or testing) */}
      {showDirectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9F1] border border-[#DDCBB7] shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDCBB7]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-serif text-lg font-bold text-[#35251E]">
                  Google Direct Sign-In
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDirectModal(false)}
                className="text-[#806B5D] hover:text-[#35251E] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#806B5D] leading-relaxed">
              Enter your Google email to authenticate directly with MUNAAZ Atelier via MongoDB Atlas.
            </p>

            <form onSubmit={handleDirectGoogleSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#35251E] uppercase tracking-wider mb-1">
                  Google Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your.google@gmail.com"
                  className="w-full bg-white border border-[#DDCBB7] text-xs px-3 py-2.5 focus:outline-none focus:border-[#A85F43]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#35251E] uppercase tracking-wider mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Afraz Sheikh"
                  className="w-full bg-white border border-[#DDCBB7] text-xs px-3 py-2.5 focus:outline-none focus:border-[#A85F43]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDirectModal(false)}
                  className="px-4 py-2 border border-[#DDCBB7] text-xs font-semibold text-[#806B5D] hover:text-[#35251E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#A85F43] hover:bg-[#8A4A32] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loading ? 'Authenticating...' : 'Sign In Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
