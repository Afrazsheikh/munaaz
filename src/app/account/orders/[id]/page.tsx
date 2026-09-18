'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/order';
import { Package, Truck, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const res = orderService.getOrderById(id);
    if (res) setOrder(res);
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-[#806B5D]">
        Order not found. <Link href="/account/orders" className="underline text-[#35251E]">Back to orders</Link>
      </div>
    );
  }

  const symbol = order.currency === 'INR' ? '₹' : '$';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDCBB7]">
        <div>
          <Link href="/account/orders" className="text-xs text-[#806B5D] hover:text-[#35251E] flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Orders</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#35251E]">
            ORDER #{order.orderNumber}
          </h1>
          <p className="text-xs text-[#806B5D] mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} • Estimated Delivery: {order.estimatedDelivery}
          </p>
        </div>

        <div className="bg-[#A85F43]/10 border border-[#A85F43] p-3 text-right">
          <span className="text-[10px] font-bold text-[#806B5D] uppercase block">STATUS</span>
          <span className="text-sm font-bold text-[#A85F43] uppercase">{order.orderStatus}</span>
        </div>
      </div>

      {/* Order Item List */}
      <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#35251E] pb-3 border-b border-[#DDCBB7]">
          ORDERED PIECES ({order.items.length})
        </h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center justify-between text-xs pb-3 border-b border-[#DDCBB7]/50 last:border-0">
              <div className="flex gap-3 items-center">
                <div className="relative w-16 h-20 bg-[#F3E5D0] flex-shrink-0">
                  <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#35251E]">{item.product.name}</h3>
                  <p className="text-[#806B5D] mt-0.5">Color: {item.selectedColor} | Size: {item.selectedSize}</p>
                  <span className="text-[#806B5D]">Qty: {item.quantity}</span>
                </div>
              </div>

              <span className="font-bold text-sm text-[#35251E]">
                {symbol}{(item.unitPriceINR * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 text-xs space-y-2">
          <h3 className="font-serif text-base font-bold text-[#35251E] pb-2 border-b border-[#DDCBB7]">
            SHIPPING DESTINATION
          </h3>
          <p className="font-bold text-[#35251E]">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.street} {order.shippingAddress.apartment}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
          <p>Country: {order.shippingAddress.country === 'IN' ? 'India 🇮🇳' : 'United States 🇺🇸'}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>

        <div className="bg-[#F3E5D0]/40 border border-[#DDCBB7] p-6 text-xs space-y-2.5">
          <h3 className="font-serif text-base font-bold text-[#35251E] pb-2 border-b border-[#DDCBB7]">
            PAYMENT BREAKDOWN
          </h3>
          <div className="flex justify-between text-[#806B5D]">
            <span>Subtotal</span>
            <span className="text-[#35251E] font-semibold">{symbol}{order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#A85F43]">
              <span>Discount</span>
              <span>-{symbol}{order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-[#806B5D]">
            <span>Shipping</span>
            <span>{symbol}{order.shippingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#806B5D]">
            <span>Tax</span>
            <span>{symbol}{order.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#35251E] pt-2 border-t border-[#DDCBB7]">
            <span>TOTAL ({order.paymentMethod.toUpperCase()})</span>
            <span>{symbol}{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
