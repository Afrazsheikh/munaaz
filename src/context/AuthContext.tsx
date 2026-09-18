'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '@/types/order';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (addressId: string) => void;
}

const AUTH_USER_KEY = 'auren_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to restore auth session', e);
      }
    }
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  };

  const login = async (email: string, pass: string) => {
    if (!email || !pass) {
      return { success: false, error: 'Please enter both email and password' };
    }
    // Simulate user login
    const mockUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email.toLowerCase(),
      phone: '+91 98765 43210',
      addresses: [
        {
          id: 'addr-1',
          fullName: 'Aria Sharma',
          street: '12-A, Altamount Road, Cumballa Hill',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400026',
          country: 'IN',
          phone: '+91 98765 43210',
          isDefault: true
        }
      ]
    };
    saveUser(mockUser);
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string) => {
    if (!name || !email || !pass) {
      return { success: false, error: 'Please fill in all required fields' };
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      addresses: []
    };
    saveUser(newUser);
    return { success: true };
  };

  const logout = () => {
    saveUser(null);
  };

  const addAddress = (newAddrData: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = {
      ...newAddrData,
      id: `addr-${Date.now()}`
    };
    const updatedUser = {
      ...user,
      addresses: [...user.addresses, newAddress]
    };
    saveUser(updatedUser);
  };

  const deleteAddress = (addressId: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      addresses: user.addresses.filter((a) => a.id !== addressId)
    };
    saveUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        addAddress,
        deleteAddress
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
