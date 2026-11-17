'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/order';
import { Package, Truck, CheckCircle2, ChevronRight, ArrowLeft, AlertCircle, RefreshCw, XCircle, RotateCcw } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed my mind');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSyncingTracking, setIsSyncingTracking] = useState(false);

  useEffect(() => {
    const res = orderService.getOrderById(id);
    if (res) setOrder(res);
  }, [id]);

  const handleSyncTracking = async () => {
    if (!order) return;
    setIsSyncingTracking(true);
    try {
      const res = await orderService.trackShiprocketShipment({
        orderId: order.id,
        awb: order.shiprocketAwb || order.trackingNumber
      });
      if (res.success && res.data?.order) {
        setOrder(res.data.order);
        setActionMessage({ type: 'success', text: 'Live tracking synchronized with Shiprocket.' });
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Tracking scans up to date.' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Could not refresh tracking at this moment.' });
    } finally {
      setIsSyncingTracking(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    setActionMessage(null);

    const res = await orderService.cancelOrder(order.id, cancelReason, 'customer');
    if (res.success && res.data) {
      setOrder(res.data);
      setActionMessage({
        type: 'success',
        text: res.message || 'Order cancelled successfully.'
      });
      setCancelModalOpen(false);
    } else {
      setActionMessage({
        type: 'error',
        text: res.message || 'Failed to cancel order.'
      });
    }
    setCancelling(false);
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-[#806B5D]">
        Order not found. <Link href="/account/orders" className="underline text-[#35251E]">Back to orders</Link>
      </div>
    );
  }

  const symbol = order.currency === 'INR' ? '₹' : '$';
  const canCancel = order.orderStatus === 'placed' || order.orderStatus === 'processing';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Action Notification */}
      {actionMessage && (
        <div className={`p-4 text-xs font-medium border flex items-center gap-2 ${actionMessage.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionMessage.text}</span>
        </div>
      )}

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

        <div className="flex items-center gap-3">
          <div className="bg-[#A85F43]/10 border border-[#A85F43] p-3 text-right">
            <span className="text-[10px] font-bold text-[#806B5D] uppercase block">STATUS</span>
            <span className="text-sm font-bold text-[#A85F43] uppercase">{order.orderStatus.replace('_', ' ')}</span>
          </div>

          {canCancel && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="border border-red-300 hover:bg-red-50 text-red-700 text-xs font-semibold px-4 py-3 uppercase tracking-wider transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* RTO Banner if applicable */}
      {(order.orderStatus === 'rto_initiated' || order.orderStatus === 'rto_delivered') && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded text-xs space-y-1">
          <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wider">
            <RotateCcw className="w-4 h-4 text-amber-700" />
            <span>Return to Origin (RTO) Active</span>
          </div>
          <p className="text-amber-800 text-[11px]">
            {order.orderStatus === 'rto_initiated'
              ? 'Delivery could not be completed. The courier has initiated return of this parcel to the MUNAAZ atelier.'
              : 'The parcel has been received back at the MUNAAZ atelier.'}
            {order.rtoDetails?.rtoReason && ` (Reason: ${order.rtoDetails.rtoReason})`}
          </p>
          {order.refundStatus === 'success' && (
            <p className="text-emerald-800 font-semibold text-[11px] pt-1">
              ✓ Refund of {symbol}{order.rtoDetails?.refundAmount || order.total} processed via Cashfree to your original payment method.
            </p>
          )}
        </div>
      )}

      {/* Cancelled Banner if cancelled */}
      {order.orderStatus === 'cancelled' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-xs space-y-1">
          <div className="flex items-center gap-2 text-red-900 font-bold uppercase tracking-wider">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>Order Cancelled</span>
          </div>
          <p className="text-red-700 text-[11px]">
            Reason: {order.cancellationReason || 'Requested by customer'}
          </p>
          {order.refundStatus === 'success' && (
            <p className="text-emerald-800 font-semibold text-[11px] pt-1">
              ✓ Cashfree Refund Initiated. Amount will reflect in your account within 3-5 business days.
            </p>
          )}
        </div>
      )}

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

          <div className="pt-2 text-[11px] text-[#806B5D] border-t border-[#DDCBB7]/60 space-y-1">
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-bold uppercase text-[#35251E]">{order.paymentStatus}</span>
            </div>
            {order.paymentMethod === 'cashfree' && (
              <div className="flex justify-between">
                <span>Cashfree Gateway:</span>
                <span className="font-mono text-[10px] text-[#A85F43] truncate max-w-[160px]">
                  {order.cashfreePaymentId || order.cashfreeOrderId || 'Verified'}
                </span>
              </div>
            )}
            {order.refundStatus && order.refundStatus !== 'none' && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Refund Status:</span>
                <span className="uppercase">{order.refundStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shiprocket Live Tracking Box */}
      {(order.shiprocketAwb || order.trackingNumber) && (
        <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-5 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#A85F43]" />
                <h3 className="font-serif text-base font-bold text-[#35251E]">
                  SHIPROCKET LIVE LOGISTICS
                </h3>
                {order.shiprocketStatus && (
                  <span className="text-[10px] font-bold uppercase bg-[#A85F43]/15 text-[#A85F43] px-2 py-0.5 rounded">
                    {order.shiprocketStatus}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#806B5D] mt-1">
                Courier: <strong className="text-[#35251E]">{order.courierCarrier || order.shiprocketCourier || 'Shiprocket Partner'}</strong> • AWB: <strong className="font-mono text-[#A85F43]">{order.shiprocketAwb || order.trackingNumber}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncTracking}
                disabled={isSyncingTracking}
                className="border border-[#A85F43] text-[#A85F43] hover:bg-[#A85F43]/10 text-[11px] font-semibold px-3 py-1.5 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncingTracking ? 'animate-spin' : ''}`} />
                <span>{isSyncingTracking ? 'Syncing...' : 'Refresh Status'}</span>
              </button>

              <a
                href={`https://shiprocket.co/tracking/${order.shiprocketAwb || order.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#A85F43] hover:bg-[#8A4A32] text-white text-[11px] font-semibold px-3 py-1.5 flex items-center gap-1.5 transition-colors"
              >
                <span>Track on Shiprocket</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Timeline */}
      {order.trackingHistory && order.trackingHistory.length > 0 && (
        <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 text-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-[#35251E] pb-2 border-b border-[#DDCBB7]">
            TRACKING TIMELINE
          </h3>
          <div className="space-y-4">
            {order.trackingHistory.map((event, index) => (
              <div key={event.id || index} className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-[#A85F43] mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#35251E]">{event.status}</span>
                    <span className="text-[10px] text-[#806B5D]">{event.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#806B5D] mt-0.5">{event.description}</p>
                  <span className="text-[10px] text-[#A85F43]">{event.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#35251E]">
              Cancel Order #{order.orderNumber}
            </h3>
            <p className="text-xs text-[#806B5D]">
              Are you sure you wish to cancel this order?
              {order.paymentMethod === 'cashfree' && order.paymentStatus === 'paid' && (
                <span className="block mt-1 font-semibold text-emerald-800">
                  Since you paid via Cashfree, a full refund of {symbol}{order.total.toLocaleString()} will be automatically credited to your original payment method.
                </span>
              )}
            </p>

            <div>
              <label className="block text-xs font-bold text-[#35251E] mb-1">CANCELLATION REASON</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-2.5 focus:outline-none focus:border-[#A85F43]"
              >
                <option value="Changed my mind">Changed my mind</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found alternative product">Found alternative product</option>
                <option value="Delivery time too long">Delivery time too long</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="w-1/2 border border-[#35251E] text-[#35251E] text-xs font-semibold py-2.5 uppercase"
              >
                Back
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="w-1/2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold py-2.5 uppercase tracking-wider"
              >
                {cancelling ? 'Processing...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
