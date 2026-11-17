'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Address } from '@/types/order';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (data: { credential?: string; profile?: any }) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => Promise<{ success: boolean; error?: string }>;
  deleteAddress: (addressId: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AUTH_USER_KEY = 'munaaz_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const saveUser = useCallback((u: User | null) => {
    setUser(u);
    if (typeof window !== 'undefined') {
      if (u) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/auth/me?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          saveUser(data.user);
        }
      }
    } catch (err) {
      console.warn('[AuthContext]: Refresh user failed', err);
    }
  }, [user?.email, saveUser]);

  // Restore session from localStorage and re-sync with MongoDB
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        // Sync with MongoDB database in the background
        if (parsed.email) {
          fetch(`/api/auth/me?email=${encodeURIComponent(parsed.email)}`)
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.user) {
                saveUser(d.user);
              }
            })
            .catch(() => {});
        }
      } catch (e) {
        console.error('Failed to restore auth session', e);
      }
    }
  }, [saveUser]);

  /**
   * Real Email + Password Login via MongoDB
   */
  const login = async (email: string, pass: string) => {
    if (!email || !pass) {
      return { success: false, error: 'Please enter both email and password' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.message || 'Login failed. Please check credentials.' };
      }

      saveUser(data.user);
      return { success: true };
    } catch (err: any) {
      console.error('[Auth Login Error]:', err);
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  /**
   * Real Customer Account Creation via MongoDB
   */
  const register = async (name: string, email: string, pass: string) => {
    if (!name || !email || !pass) {
      return { success: false, error: 'Please fill in all required fields' };
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.message || 'Registration failed' };
      }

      saveUser(data.user);
      return { success: true };
    } catch (err: any) {
      console.error('[Auth Register Error]:', err);
      return { success: false, error: err.message || 'Network error during registration' };
    }
  };

  /**
   * Google Sign-In & Sign-Up via MongoDB
   */
  const loginWithGoogle = async (payload: { credential?: string; profile?: any }) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.message || 'Google authentication failed' };
      }

      saveUser(data.user);
      return { success: true, isNewUser: data.isNewUser };
    } catch (err: any) {
      console.error('[Auth Google Error]:', err);
      return { success: false, error: err.message || 'Network error during Google authentication' };
    }
  };

  const logout = () => {
    saveUser(null);
  };

  /**
   * Add / Save Address to MongoDB
   */
  const addAddress = async (newAddrData: Omit<Address, 'id'>) => {
    if (!user) return { success: false, error: 'User not signed in' };

    const newAddress: Address = {
      ...newAddrData,
      id: `addr-${Date.now()}`
    };

    // Optimistic local update
    const updatedUser = {
      ...user,
      addresses: [...user.addresses, newAddress]
    };
    saveUser(updatedUser);

    // Persist to MongoDB
    try {
      const res = await fetch('/api/auth/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          address: newAddress
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        saveUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Delete Address from MongoDB
   */
  const deleteAddress = async (addressId: string) => {
    if (!user) return { success: false, error: 'User not signed in' };

    const updatedUser = {
      ...user,
      addresses: user.addresses.filter((a) => a.id !== addressId)
    };
    saveUser(updatedUser);

    try {
      const res = await fetch('/api/auth/address', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          addressId
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        saveUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
        addAddress,
        deleteAddress,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
