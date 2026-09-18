'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { useRegion } from '@/context/RegionContext';
import { User, Package, MapPin, Heart, LogOut, ChevronRight } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { formatPrice } = useRegion();

  const orders = orderService.getOrders();
  const recentOrder = orders[0];

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#35251E]">PLEASE SIGN IN</h1>
        <p className="text-xs text-[#806B5D] mt-2 mb-6">You must be logged in to view your account dashboard.</p>
        <Link href="/login" className="bg-[#A85F43] text-white text-xs font-semibold px-6 py-3 uppercase">
          SIGN IN NOW
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Account Header */}
      <div className="mb-8 pb-6 border-b border-[#DDCBB7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block">
            CUSTOMER PORTAL
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35251E] mt-1">
            WELCOME, {user.name.toUpperCase()}
          </h1>
          <p className="text-xs text-[#806B5D] mt-1">Logged in as {user.email}</p>
        </div>

        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="inline-flex items-center gap-2 border border-[#35251E] text-[#35251E] hover:bg-[#35251E] hover:text-[#FFF9F1] text-xs font-semibold px-4 py-2.5 transition-colors w-fit"
        >
          <LogOut className="w-4 h-4" />
          <span>LOGOUT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="bg-[#F3E5D0]/40 border border-[#DDCBB7] p-4 space-y-1">
          <Link
            href="/account"
            className="flex items-center justify-between p-3 bg-[#A85F43] text-white text-xs font-bold uppercase tracking-wider"
          >
            <span className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/account/orders"
            className="flex items-center justify-between p-3 text-[#35251E] hover:bg-[#F3E5D0] text-xs font-semibold uppercase tracking-wider"
          >
            <span className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-[#A85F43]" />
              <span>My Orders ({orders.length})</span>
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/account/addresses"
            className="flex items-center justify-between p-3 text-[#35251E] hover:bg-[#F3E5D0] text-xs font-semibold uppercase tracking-wider"
          >
            <span className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#A85F43]" />
              <span>Address Book</span>
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center justify-between p-3 text-[#35251E] hover:bg-[#F3E5D0] text-xs font-semibold uppercase tracking-wider"
          >
            <span className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-[#A85F43]" />
              <span>Saved Wishlist</span>
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dashboard Overview Main Content */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Recent Order Banner */}
          <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDCBB7] pb-3">
              <h2 className="font-serif text-lg font-bold text-[#35251E]">MOST RECENT ORDER</h2>
              <Link href="/account/orders" className="text-xs font-semibold text-[#A85F43] hover:underline">
                View All Orders →
              </Link>
            </div>

            {recentOrder ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-4">
                <div>
                  <span className="font-bold text-sm text-[#35251E]">#{recentOrder.orderNumber}</span>
                  <p className="text-[#806B5D] mt-0.5">Placed on {new Date(recentOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="bg-[#A85F43]/10 text-[#A85F43] px-2.5 py-1 font-bold border border-[#A85F43] uppercase text-[10px]">
                    STATUS: {recentOrder.orderStatus}
                  </span>
                  <span className="block font-bold text-[#35251E] mt-1">
                    {recentOrder.currency === 'INR' ? '₹' : '$'}{recentOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#806B5D]">No order history found yet.</p>
            )}
          </div>

          {/* Saved Default Address Overview */}
          <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDCBB7] pb-3">
              <h2 className="font-serif text-lg font-bold text-[#35251E]">DEFAULT ADDRESS</h2>
              <Link href="/account/addresses" className="text-xs font-semibold text-[#A85F43] hover:underline">
                Manage Address Book →
              </Link>
            </div>

            {user.addresses.length > 0 ? (
              <div className="text-xs text-[#806B5D] space-y-1">
                <p className="font-bold text-[#35251E] text-sm">{user.addresses[0].fullName}</p>
                <p>{user.addresses[0].street} {user.addresses[0].apartment}</p>
                <p>{user.addresses[0].city}, {user.addresses[0].state} {user.addresses[0].postalCode}</p>
                <p>Phone: {user.addresses[0].phone}</p>
              </div>
            ) : (
              <p className="text-xs text-[#806B5D]">No saved shipping addresses.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
