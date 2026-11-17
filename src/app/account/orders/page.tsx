'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/order';
import { Package, ChevronRight, ArrowRight, Truck } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrdersAsync().then((ords) => {
      setOrders(ords);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 pb-6 border-b border-[#DDCBB7] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block">
            MY ACCOUNT
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35251E] mt-1">
            MY ORDERS ({orders.length})
          </h1>
        </div>
        <Link href="/account" className="text-xs font-semibold text-[#A85F43] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#806B5D]">
          <div className="w-8 h-8 border-2 border-[#A85F43]/30 border-t-[#A85F43] rounded-full animate-spin mx-auto mb-3" />
          <span>LOADING YOUR ORDERS...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center bg-[#FFF9F1] border border-[#DDCBB7] p-8">
          <Package className="w-12 h-12 text-[#806B5D] mx-auto mb-3 stroke-[1.2]" />
          <h3 className="font-serif text-xl font-bold text-[#35251E]">NO ORDERS PLACED YET</h3>
          <p className="text-xs text-[#806B5D] mt-1 mb-6">
            When you complete orders, they will appear here with real-time status and live Shiprocket tracking.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#A85F43] text-white text-xs font-semibold px-8 py-3.5 tracking-widest uppercase"
          >
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 hover:border-[#A85F43] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-base text-[#35251E]">#{ord.orderNumber}</span>
                  <span className="bg-[#A85F43]/10 text-[#A85F43] text-[10px] font-bold px-2.5 py-0.5 border border-[#A85F43] uppercase">
                    {ord.orderStatus.replace('_', ' ')}
                  </span>
                  {ord.paymentMethod === 'cashfree' && (
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-300 uppercase">
                      Cashfree {ord.paymentStatus}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#806B5D]">
                  Placed on {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items
                </p>

                <p className="text-xs font-bold text-[#35251E]">
                  Total: {ord.currency === 'INR' ? '₹' : '$'}{ord.total.toLocaleString()} ({ord.paymentStatus})
                </p>

                {(ord.shiprocketAwb || ord.trackingNumber) && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#A85F43] font-semibold bg-[#A85F43]/10 px-2.5 py-1 rounded">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Courier: {ord.courierCarrier || ord.shiprocketCourier || 'Shiprocket'} ({ord.shiprocketAwb || ord.trackingNumber})</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/account/orders/${ord.id}`}
                  className="bg-[#A85F43] hover:bg-[#8A4A32] text-white text-xs font-semibold px-5 py-2.5 transition-colors uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>TRACK & DETAILS</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
