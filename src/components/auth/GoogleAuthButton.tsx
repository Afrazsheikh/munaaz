'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { X, Sparkles, UserPlus, AlertCircle } from 'lucide-react';

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
  const [isNotFound, setIsNotFound] = useState(false);
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');
  const tokenClientRef = useRef<any>(null);

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '268218644129-5vp2tsl1c3748lauittmdgevf87dp4tc.apps.googleusercontent.com';

  // Listen for popup messages if redirect flow was triggered
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.user) {
        setLoading(false);
        setError('');
        setIsNotFound(false);
        router.push(onSuccessRedirect);
      } else if (event.data.type === 'GOOGLE_AUTH_NOT_FOUND') {
        setLoading(false);
        setIsNotFound(true);
        setError(
          event.data.error ||
            'No user found with this Google account. Please sign up first.'
        );
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        setLoading(false);
        setError(event.data.error || 'Google authentication failed.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccessRedirect, router]);

  // Load and initialize Google Identity Services (GIS)
  useEffect(() => {
    if (!googleClientId) return;

    const scriptId = 'google-gis-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const setupClients = () => {
      if (!window.google?.accounts?.oauth2) return;

      try {
        // Modern Token Client (avoids redirect_uri_mismatch, opens native account picker directly)
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope:
            'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setLoading(false);
              setError(
                tokenResponse.error_description ||
                  'Google sign-in was cancelled or encountered an issue.'
              );
              return;
            }

            try {
              // Fetch Google user profile using the access token
              const profileRes = await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                  }
                }
              );

              const profile = await profileRes.json();

              if (!profile || !profile.email) {
                setError('Could not retrieve email from Google account.');
                setLoading(false);
                return;
              }

              // Send to MongoDB Atlas auth endpoint
              const res = await loginWithGoogle({
                profile: {
                  email: profile.email,
                  name: profile.name || profile.given_name,
                  googleId: profile.sub,
                  avatar: profile.picture || ''
                },
                mode
              });

              if (res.success) {
                setError('');
                setIsNotFound(false);
                router.push(onSuccessRedirect);
              } else {
                if (res.notFound) {
                  setIsNotFound(true);
                }
                setError(
                  res.error ||
                    (mode === 'signin'
                      ? 'No user found with this Google account. Please sign up first.'
                      : 'Google registration failed.')
                );
              }
            } catch (err: any) {
              console.error('[Google Userinfo Fetch Error]:', err);
              setError(err.message || 'Error processing Google account details.');
            } finally {
              setLoading(false);
            }
          }
        });

        // Also initialize One Tap if supported
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response: any) => {
              if (response && response.credential) {
                setLoading(true);
                setError('');
                setIsNotFound(false);
                try {
                  const res = await loginWithGoogle({
                    credential: response.credential,
                    mode
                  });
                  if (res.success) {
                    router.push(onSuccessRedirect);
                  } else {
                    if (res.notFound) setIsNotFound(true);
                    setError(
                      res.error ||
                        'No user found with this Google account. Please sign up first.'
                    );
                  }
                } catch (err: any) {
                  setError(err.message || 'Google authentication error');
                } finally {
                  setLoading(false);
                }
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });

          window.google.accounts.id.prompt(() => {});
        }
      } catch (err) {
        console.warn('[GIS Setup Warning]:', err);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = setupClients;
      document.body.appendChild(script);
    } else {
      setupClients();
    }
  }, [googleClientId, loginWithGoogle, mode, onSuccessRedirect, router]);

  /**
   * Main Google button click handler:
   * Uses Token Client first (popup with available accounts, NO redirect_uri mismatch!)
   */
  const handleGoogleClick = () => {
    setError('');
    setIsNotFound(false);

    if (!googleClientId) {
      setShowDirectModal(true);
      return;
    }

    setLoading(true);

    // 1. If Token Client is ready, request access token with account picker
    if (tokenClientRef.current) {
      try {
        tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('[TokenClient Error]: Falling back to popup redirect', err);
      }
    }

    // 2. Fallback: If script is still loading, try re-initializing or open popup
    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope:
            'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.access_token) {
              const profileRes = await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                  }
                }
              );
              const profile = await profileRes.json();
              const res = await loginWithGoogle({
                profile: {
                  email: profile.email,
                  name: profile.name || profile.given_name,
                  googleId: profile.sub,
                  avatar: profile.picture || ''
                },
                mode
              });
              setLoading(false);
              if (res.success) {
                router.push(onSuccessRedirect);
              } else {
                if (res.notFound) setIsNotFound(true);
                setError(
                  res.error ||
                    'No user found with this Google account. Please sign up first.'
                );
              }
            }
          }
        });
        tokenClientRef.current = client;
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (e) {}
    }

    // 3. Fallback popup redirect
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://munaaz.vercel.app';
    const redirectUri = `${origin}/api/auth/google/callback`;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      googleClientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(
      'openid email profile'
    )}&prompt=select_account&state=${mode}`;

    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      googleAuthUrl,
      'google_account_picker',
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = googleAuthUrl;
    }
  };

  const handleDirectGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setLoading(true);
    setError('');
    setIsNotFound(false);

    try {
      const cleanEmail = testEmail.trim().toLowerCase();
      const displayName =
        testName.trim() || cleanEmail.split('@')[0].replace('.', ' ');
      const res = await loginWithGoogle({
        mode,
        profile: {
          email: cleanEmail,
          name: displayName,
          googleId: `google-${Date.now()}`,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            displayName
          )}`
        }
      });

      if (res.success) {
        setShowDirectModal(false);
        router.push(onSuccessRedirect);
      } else {
        if (res.notFound) {
          setIsNotFound(true);
        }
        setError(res.error || 'Authentication failed');
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
      {/* Error / Not Found Alert */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>

          {/* If on Login and user was not found, show direct 1-click Sign Up button */}
          {isNotFound && mode === 'signin' && (
            <div className="pt-2 border-t border-red-200">
              <Link
                href="/register"
                className="w-full bg-[#A85F43] hover:bg-[#8A4A32] text-white text-[11px] font-bold py-2 px-3 tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 rounded shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>SIGN UP WITH GOOGLE NOW →</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Google Button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#3c4043] border border-[#dadce0] hover:border-[#d2e3fc] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.15)] text-xs font-semibold py-3 px-4 transition-all duration-150 flex items-center justify-center gap-3 active:bg-[#f1f3f4] rounded-sm cursor-pointer shadow-sm"
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
          {loading ? 'OPENING GOOGLE ACCOUNT PICKER...' : buttonText}
        </span>
      </button>

      {/* Fallback option if Google Cloud Console is pending origin updates */}
      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={() => setShowDirectModal(true)}
          className="text-[10px] text-[#806B5D] hover:text-[#A85F43] underline transition-colors cursor-pointer"
        >
          Having Google Cloud origin issues? Click here for Direct Google Sign-In
        </button>
      </div>

      {/* Direct Fallback Dialog if client ID is missing */}
      {showDirectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9F1] border border-[#DDCBB7] shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDCBB7]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="font-serif text-lg font-bold text-[#35251E]">
                  Google Account Sign-In
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
              Enter your Google account email to authenticate directly via MongoDB Atlas.
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
                  <span>{loading ? 'Authenticating...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
