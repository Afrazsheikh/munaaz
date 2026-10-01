'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Truck,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  X,
  ChevronRight,
  Save,
  MapPin,
  Tag,
  Plus,
  Key,
  AlertCircle,
  Check,
  Printer
} from 'lucide-react';

import { adminAuthService } from '@/services/adminAuthService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { couponService } from '@/services/couponService';
import { Product, ProductCategory, CollectionSlug, ProductColor } from '@/types/product';
import { Order, TrackingEvent } from '@/types/order';
import { Coupon } from '@/types/coupon';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add-product' | 'orders' | 'coupons' | 'customers' | 'settings'>('overview');

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Modals & Drawers
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Coupon Form
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 15,
    minOrderAmountINR: 2000,
    minOrderAmountUSD: 30
  });

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    slug: '',
    brand: 'MUNAAZ ATELIER',
    category: 'men' as ProductCategory,
    collections: ['new-arrivals'] as CollectionSlug[],
    shortDescription: '',
    description: '',
    priceINR: 4500,
    compareAtPriceINR: 5500,
    priceUSD: 60,
    compareAtPriceUSD: 75,
    imagesText: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
    sizesText: 'S, M, L, XL',
    colorName: 'Desert Sand',
    colorHex: '#C18A60',
    colorImage: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
    stockCount: 25,
    fabricCareText: '100% French Flax Linen, Dry clean recommended, Iron low heat',
    featuresText: 'Tailored fit, Natural horn buttons, Double-stitched seams',
    isNewArrival: true,
    isBestSeller: false,
    isSale: false
  });

  // Order Tracking Form State inside Modal
  const [trackingForm, setTrackingForm] = useState({
    orderStatus: 'processing' as Order['orderStatus'],
    paymentStatus: 'paid' as Order['paymentStatus'],
    courierCarrier: 'BlueDart Express',
    trackingNumber: '',
    estimatedDelivery: '',
    adminNotes: '',
    eventStatus: '',
    eventLocation: '',
    eventDescription: ''
  });

  // Password Update Form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadAllData = useCallback(async () => {
    setLoadingData(true);
    const prods = await productService.getAllProducts();
    const ords = orderService.getOrders();
    const cpns = await couponService.getCoupons();
    setProducts(prods);
    setOrders(ords);
    setCoupons(cpns);
    setLoadingData(false);
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code) return;

    const created = await couponService.createCoupon({
      code: newCouponForm.code,
      discountType: newCouponForm.discountType,
      discountValue: Number(newCouponForm.discountValue),
      minOrderAmountINR: Number(newCouponForm.minOrderAmountINR),
      minOrderAmountUSD: Number(newCouponForm.minOrderAmountUSD),
      isActive: true
    });

    showNotify('success', `Promo code "${created.code}" created successfully!`);
    setNewCouponForm({ code: '', discountType: 'percentage', discountValue: 15, minOrderAmountINR: 2000, minOrderAmountUSD: 30 });
    loadAllData();
  };

  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    await couponService.toggleCouponActive(id, !currentActive);
    showNotify('success', `Coupon status updated.`);
    loadAllData();
  };

  const handleDeleteCoupon = async (id: string) => {
    await couponService.deleteCoupon(id);
    showNotify('success', `Coupon removed.`);
    loadAllData();
  };

  // 1. Auth Guard & Initial Load
  useEffect(() => {
    if (!adminAuthService.isLoggedIn()) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, [router, loadAllData]);

  const handleLogout = () => {
    adminAuthService.logout();
    router.push('/admin/login');
  };

  // --- PRODUCT MANAGEMENT HANDLERS ---
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.slug) {
      showNotify('error', 'Product name and slug are required.');
      return;
    }

    const images = newProductForm.imagesText.split('\n').map((s) => s.trim()).filter(Boolean);
    const sizes = newProductForm.sizesText.split(',').map((s) => s.trim()).filter(Boolean);
    const fabricCare = newProductForm.fabricCareText.split(',').map((s) => s.trim()).filter(Boolean);
    const features = newProductForm.featuresText.split(',').map((s) => s.trim()).filter(Boolean);

    const colors: ProductColor[] = [
      {
        name: newProductForm.colorName || 'Default',
        hex: newProductForm.colorHex || '#A85F43',
        image: images[0] || newProductForm.colorImage
      }
    ];

    const variants = sizes.map((sz, idx) => ({
      id: `var-${Date.now()}-${idx}`,
      color: colors[0].name,
      size: sz,
      sku: `MNZ-${newProductForm.slug.toUpperCase().slice(0, 6)}-${sz}`,
      stock: newProductForm.stockCount
    }));

    const created = await productService.createProduct({
      slug: newProductForm.slug.toLowerCase().replace(/\s+/g, '-'),
      name: newProductForm.name,
      brand: newProductForm.brand || 'MUNAAZ ATELIER',
      category: newProductForm.category,
      collections: newProductForm.collections,
      shortDescription: newProductForm.shortDescription,
      description: newProductForm.description,
      fabricCare,
      features,
      priceINR: Number(newProductForm.priceINR),
      compareAtPriceINR: newProductForm.compareAtPriceINR ? Number(newProductForm.compareAtPriceINR) : undefined,
      priceUSD: Number(newProductForm.priceUSD),
      compareAtPriceUSD: newProductForm.compareAtPriceUSD ? Number(newProductForm.compareAtPriceUSD) : undefined,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop'],
      colors,
      sizes,
      variants,
      isNewArrival: newProductForm.isNewArrival,
      isBestSeller: newProductForm.isBestSeller,
      isSale: newProductForm.isSale,
      rating: 5.0,
      reviewCount: 1
    });

    showNotify('success', `Product "${created.name}" posted successfully to catalog!`);
    loadAllData();
    setActiveTab('products');
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    await productService.updateProduct(editingProduct.id, editingProduct);
    showNotify('success', `Product "${editingProduct.name}" updated successfully!`);
    setEditingProduct(null);
    loadAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    const success = await productService.deleteProduct(id);
    if (success) {
      showNotify('success', 'Product deleted from catalog.');
      loadAllData();
    }
    setDeleteConfirmId(null);
  };

  // --- ORDER TRACKING HANDLERS ---
  const openOrderTrackingModal = (order: Order) => {
    setTrackingModalOrder(order);
    setTrackingForm({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      courierCarrier: order.courierCarrier || 'BlueDart Express',
      trackingNumber: order.trackingNumber || `MNZ-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: order.estimatedDelivery || '',
      adminNotes: order.adminNotes || '',
      eventStatus: '',
      eventLocation: '',
      eventDescription: ''
    });
  };

  const handleSaveOrderTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder) return;

    const newTrackingEvent = trackingForm.eventStatus.trim() !== ''
      ? {
          status: trackingForm.eventStatus,
          location: trackingForm.eventLocation || 'Atelier Dispatch',
          description: trackingForm.eventDescription || 'Status updated by admin.'
        }
      : undefined;

    const updated = await orderService.updateOrderTracking(trackingModalOrder.id, {
      orderStatus: trackingForm.orderStatus,
      paymentStatus: trackingForm.paymentStatus,
      courierCarrier: trackingForm.courierCarrier,
      trackingNumber: trackingForm.trackingNumber,
      estimatedDelivery: trackingForm.estimatedDelivery,
      adminNotes: trackingForm.adminNotes,
      newTrackingEvent
    });

    if (updated) {
      showNotify('success', `Order ${updated.orderNumber} tracking & status updated successfully!`);
      setTrackingModalOrder(null);
      loadAllData();
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotify('error', 'New passwords do not match.');
      return;
    }
    const res = adminAuthService.updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
    if (res.success) {
      showNotify('success', res.message);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      showNotify('error', res.message);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.slug.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats Metrics
  const totalRevenueINR = orders.reduce((sum, o) => sum + (o.currency === 'INR' ? o.total : o.total * 83), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'placed' || o.orderStatus === 'processing').length;
  const shippedOrdersCount = orders.filter((o) => o.orderStatus === 'shipped').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F1E8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C9A46A]/30 border-t-[#C9A46A] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono tracking-widest text-[#C9A46A] uppercase">VERIFYING ADMIN CREDENTIALS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F1E8] flex flex-col">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3.5 rounded shadow-2xl border flex items-center gap-3 text-xs font-mono tracking-wider transition-all animate-bounce ${
            notification.type === 'success'
              ? 'bg-[#17120E] border-[#C9A46A] text-[#C9A46A]'
              : 'bg-red-950 border-red-700 text-red-200'
          }`}
        >
          {notification.type === 'success' ? <Check className="w-4 h-4 text-[#C9A46A]" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* TOP ATELIER NAVBAR */}
      <header className="bg-[#17120E] border-b border-[#C9A46A]/25 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xl">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-light tracking-[0.2em] text-[#F5F1E8]">MUNAAZ</h1>
            <span className="px-2 py-0.5 bg-[#C9A46A]/15 border border-[#C9A46A]/40 text-[#C9A46A] text-[9px] font-mono tracking-widest uppercase">
              ORGANISATION ADMIN
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#050505] border border-[#C9A46A]/30 text-[11px] font-mono text-[#D8C7AD] hover:text-[#C9A46A] transition-colors uppercase"
          >
            <span>VIEW LIVE STORE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/40 border border-red-800/50 text-[11px] font-mono text-red-300 hover:bg-red-900/60 transition-colors uppercase"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER WITH SIDEBAR */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-[#0F0B09] border-r border-[#C9A46A]/20 p-4 shrink-0 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono tracking-[0.25em] text-[#C9A46A] uppercase font-bold">
            ATELIER CONTROL CENTER
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs font-mono tracking-wider transition-all text-left ${
              activeTab === 'overview'
                ? 'bg-[#C9A46A] text-[#050505] font-bold shadow-lg'
                : 'text-[#D8C7AD]/70 hover:bg-[#17120E] hover:text-[#F5F1E8]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>DASHBOARD OVERVIEW</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs font-mono tracking-wider transition-all text-left justify-between ${
              activeTab === 'products'
                ? 'bg-[#C9A46A] text-[#050505] font-bold shadow-lg'
                : 'text-[#D8C7AD]/70 hover:bg-[#17120E] hover:text-[#F5F1E8]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 shrink-0" />
              <span>PRODUCT CATALOG</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#050505]/40 text-[10px]">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs font-mono tracking-wider transition-all text-left ${
              activeTab === 'add-product'
                ? 'bg-[#C9A46A] text-[#050505] font-bold shadow-lg'
                : 'text-[#D8C7AD]/70 hover:bg-[#17120E] hover:text-[#F5F1E8]'
            }`}
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>POST NEW PRODUCT</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs font-mono tracking-wider transition-all text-left justify-between ${
              activeTab === 'orders'
                ? 'bg-[#C9A46A] text-[#050505] font-bold shadow-lg'
                : 'text-[#D8C7AD]/70 hover:bg-[#17120E] hover:text-[#F5F1E8]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 shrink-0" />
              <span>ORDERS & TRACKING</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[10px] font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs font-mono tracking-wider transition-all text-left justify-between ${
              activeTab === 'coupons'
                ? 'bg-[#C9A46A] text-[#050505] font-bold shadow-lg'
                : 'text-[#D8C7AD]/70 hover:bg-[#17120E] hover:text-[#F5F1E8]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 shrink-0" />
              <span>PROMO COUPONS</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#050505]/40 text-[10px]">{coupons.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs font-mono tracking-wider transition-all text-left ${
              activeTab === 'customers'
                ? 'bg-[#C9A46A] text-[#050505] font-bold shadow-lg'
                : 'text-[#D8C7AD]/70 hover:bg-[#17120E] hover:text-[#F5F1E8]'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>CUSTOMERS</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs font-mono tracking-wider transition-all text-left ${
              activeTab === 'settings'
                ? 'bg-[#C9A46A] text-[#050505] font-bold shadow-lg'
                : 'text-[#D8C7AD]/70 hover:bg-[#17120E] hover:text-[#F5F1E8]'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>ADMIN SETTINGS</span>
          </button>

          <div className="pt-6 border-t border-[#C9A46A]/20 text-[10px] font-mono text-[#D8C7AD]/40 p-2 space-y-1">
            <p>System: MUNAAZ v2.4</p>
            <p>Admin Email: admin@munaaz.com</p>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-6 md:p-8 bg-[#050505] space-y-8 overflow-x-hidden">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Header Title */}
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A46A] uppercase block">
                  ORGANISATION ATELIER METRICS
                </span>
                <h2 className="font-serif text-3xl font-light tracking-wide text-[#F5F1E8]">
                  EXECUTIVE DASHBOARD
                </h2>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Revenue */}
                <div className="bg-[#17120E] border border-[#C9A46A]/30 p-6 space-y-3 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-center text-[#C9A46A]">
                    <span className="text-[10px] font-mono tracking-widest uppercase">TOTAL REVENUE</span>
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-serif font-light text-[#F5F1E8]">
                    ₹{totalRevenueINR.toLocaleString()}
                  </div>
                  <p className="text-[10px] font-mono text-[#D8C7AD]/60">Combined INR & USD sales</p>
                </div>

                {/* Total Orders */}
                <div className="bg-[#17120E] border border-[#C9A46A]/30 p-6 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center text-[#C9A46A]">
                    <span className="text-[10px] font-mono tracking-widest uppercase">TOTAL ORDERS</span>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-serif font-light text-[#F5F1E8]">
                    {totalOrdersCount}
                  </div>
                  <p className="text-[10px] font-mono text-[#D8C7AD]/60">{pendingOrdersCount} require fulfillment</p>
                </div>

                {/* Active Products */}
                <div className="bg-[#17120E] border border-[#C9A46A]/30 p-6 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center text-[#C9A46A]">
                    <span className="text-[10px] font-mono tracking-widest uppercase">CATALOG PRODUCTS</span>
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-serif font-light text-[#F5F1E8]">
                    {products.length}
                  </div>
                  <p className="text-[10px] font-mono text-[#D8C7AD]/60">Across Men, Women, Fine Silver & Perfumes</p>
                </div>

                {/* In Transit */}
                <div className="bg-[#17120E] border border-[#C9A46A]/30 p-6 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center text-[#C9A46A]">
                    <span className="text-[10px] font-mono tracking-widest uppercase">SHIPPED & IN TRANSIT</span>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-serif font-light text-[#F5F1E8]">
                    {shippedOrdersCount}
                  </div>
                  <p className="text-[10px] font-mono text-[#D8C7AD]/60">Live courier tracking enabled</p>
                </div>

              </div>

              {/* Recent Orders Preview Section */}
              <div className="bg-[#17120E] border border-[#C9A46A]/25 p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#C9A46A]/20">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C9A46A]" />
                    <h3 className="font-serif text-xl font-light text-[#F5F1E8]">RECENT ORDERS & FULFILLMENT</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-mono text-[#C9A46A] hover:underline uppercase"
                  >
                    MANAGE ALL ORDERS →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-[#C9A46A]/20 text-[#C9A46A]">
                        <th className="p-3">ORDER #</th>
                        <th className="p-3">CUSTOMER</th>
                        <th className="p-3">ITEMS</th>
                        <th className="p-3">TOTAL</th>
                        <th className="p-3">STATUS</th>
                        <th className="p-3">COURIER TRACKING</th>
                        <th className="p-3">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C9A46A]/10 text-[#D8C7AD]">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#050505]/40 transition-colors">
                          <td className="p-3 text-white font-bold">{ord.orderNumber}</td>
                          <td className="p-3">{ord.customer.name}</td>
                          <td className="p-3">{ord.items.length} item(s)</td>
                          <td className="p-3 font-bold text-[#F5F1E8]">
                            {ord.currency === 'INR' ? `₹${ord.total}` : `$${ord.total}`}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded ${
                                ord.orderStatus === 'delivered'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : ord.orderStatus === 'shipped'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-[11px]">
                            {ord.trackingNumber ? (
                              <span className="text-[#C9A46A] underline">{ord.trackingNumber}</span>
                            ) : (
                              <span className="text-gray-500">Unassigned</span>
                            )}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => openOrderTrackingModal(ord)}
                              className="px-3 py-1 bg-[#C9A46A] hover:bg-[#D8C7AD] text-black text-[10px] font-bold uppercase transition-colors"
                            >
                              TRACK & UPDATE
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A46A] uppercase block">
                    ORGANISATION INVENTORY
                  </span>
                  <h2 className="font-serif text-3xl font-light tracking-wide text-[#F5F1E8]">
                    PRODUCT CATALOG MANAGEMENT
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      productService.resetToDefaultProducts();
                      loadAllData();
                    }}
                    className="px-3.5 py-2 bg-[#17120E] border border-[#C9A46A]/40 text-xs font-mono text-[#D8C7AD] hover:text-[#C9A46A] transition-colors flex items-center gap-2 uppercase"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>RESET TO DEFAULT CATALOG</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('add-product')}
                    className="px-4 py-2 bg-[#C9A46A] hover:bg-[#D8C7AD] text-black text-xs font-mono font-bold uppercase flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>POST NEW PRODUCT</span>
                  </button>
                </div>
              </div>

              {/* Search & Category Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#17120E] border border-[#C9A46A]/25 p-4">
                <div className="sm:col-span-8 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8C7AD]/50" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by product name, slug, or keyword..."
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] pl-9 pr-4 py-2.5 outline-none focus:border-[#C9A46A]"
                  />
                </div>

                <div className="sm:col-span-4 relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8C7AD]/50" />
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] pl-9 pr-4 py-2.5 outline-none focus:border-[#C9A46A]"
                  >
                    <option value="all">ALL CATEGORIES</option>
                    <option value="men">MENSWEAR</option>
                    <option value="women">WOMENSWEAR</option>
                    <option value="jewelry">FINE SILVER JEWELRY</option>
                    <option value="accessories">FRAGRANCE / ACCESSORIES</option>
                  </select>
                </div>
              </div>

              {/* Product Table */}
              <div className="bg-[#17120E] border border-[#C9A46A]/25 shadow-2xl overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[#C9A46A]/20 text-[#C9A46A] bg-[#0F0B09]">
                      <th className="p-3.5">PRODUCT</th>
                      <th className="p-3.5">CATEGORY</th>
                      <th className="p-3.5">PRICE (INR / USD)</th>
                      <th className="p-3.5">COLLECTIONS</th>
                      <th className="p-3.5">BADGES</th>
                      <th className="p-3.5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C9A46A]/10 text-[#D8C7AD]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#050505]/50 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop'}
                            alt={p.name}
                            className="w-12 h-14 object-cover border border-[#C9A46A]/30 bg-black shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{p.name}</p>
                            <p className="text-[10px] text-[#C9A46A] font-mono">/{p.slug}</p>
                          </div>
                        </td>
                        <td className="p-3.5 uppercase font-semibold text-white">{p.category}</td>
                        <td className="p-3.5 font-bold text-[#F5F1E8]">
                          ₹{p.priceINR} / ${p.priceUSD}
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {p.collections && p.collections.map((c) => (
                              <span key={c} className="px-1.5 py-0.5 bg-[#050505] border border-[#C9A46A]/30 text-[9px] uppercase">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {p.isNewArrival && <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 text-[9px]">NEW</span>}
                            {p.isBestSeller && <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 text-[9px]">BESTSELLER</span>}
                            {p.isSale && <span className="px-1.5 py-0.5 bg-red-950 text-red-300 text-[9px]">SALE</span>}
                          </div>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 bg-[#050505] border border-[#C9A46A]/30 text-[#D8C7AD] hover:text-[#C9A46A] inline-block"
                            title="View on site"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 bg-[#C9A46A]/20 border border-[#C9A46A]/50 text-[#C9A46A] hover:bg-[#C9A46A] hover:text-black transition-colors inline-block"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 bg-red-950/40 border border-red-800/60 text-red-300 hover:bg-red-800 hover:text-white transition-colors inline-block"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: POST NEW PRODUCT FORM */}
          {activeTab === 'add-product' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A46A] uppercase block">
                  CREATE NEW CATALOG ITEM
                </span>
                <h2 className="font-serif text-3xl font-light tracking-wide text-[#F5F1E8]">
                  POST NEW PRODUCT TO MUNAAZ
                </h2>
              </div>

              <form onSubmit={handleCreateProduct} className="bg-[#17120E] border border-[#C9A46A]/30 p-8 space-y-6 shadow-2xl">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-[#C9A46A] uppercase block">
                      PRODUCT NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProductForm.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewProductForm({
                          ...newProductForm,
                          name: val,
                          slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                        });
                      }}
                      placeholder="e.g. The Atelier Linen Overshirt"
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] px-4 py-3 outline-none focus:border-[#C9A46A]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-[#C9A46A] uppercase block">
                      PRODUCT SLUG (URL IDENTIFIER) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProductForm.slug}
                      onChange={(e) => setNewProductForm({ ...newProductForm, slug: e.target.value })}
                      placeholder="the-atelier-linen-overshirt"
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] px-4 py-3 outline-none focus:border-[#C9A46A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-[#C9A46A] uppercase block">
                      CATEGORY *
                    </label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as ProductCategory })}
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] px-4 py-3 outline-none focus:border-[#C9A46A]"
                    >
                      <option value="men">MENSWEAR</option>
                      <option value="women">WOMENSWEAR</option>
                      <option value="jewelry">FINE SILVER JEWELRY</option>
                      <option value="accessories">FRAGRANCE / ACCESSORIES</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-[#C9A46A] uppercase block">
                      PRIMARY COLLECTION
                    </label>
                    <select
                      onChange={(e) => setNewProductForm({ ...newProductForm, collections: [e.target.value as CollectionSlug] })}
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] px-4 py-3 outline-none focus:border-[#C9A46A]"
                    >
                      <option value="new-arrivals">NEW ARRIVALS</option>
                      <option value="best-sellers">BEST SELLERS</option>
                      <option value="earth-tones">EARTH TONES EDIT</option>
                      <option value="sale">SALE EDIT</option>
                      <option value="haute-joaillerie">HAUTE JOAILLERIE SILVER</option>
                    </select>
                  </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#0F0B09] border border-[#C9A46A]/20">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#C9A46A]">PRICE (INR ₹)</label>
                    <input
                      type="number"
                      value={newProductForm.priceINR}
                      onChange={(e) => setNewProductForm({ ...newProductForm, priceINR: Number(e.target.value) })}
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-white p-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#C9A46A]">ORIGINAL PRICE (INR ₹)</label>
                    <input
                      type="number"
                      value={newProductForm.compareAtPriceINR}
                      onChange={(e) => setNewProductForm({ ...newProductForm, compareAtPriceINR: Number(e.target.value) })}
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-white p-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#C9A46A]">PRICE (USD $)</label>
                    <input
                      type="number"
                      value={newProductForm.priceUSD}
                      onChange={(e) => setNewProductForm({ ...newProductForm, priceUSD: Number(e.target.value) })}
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-white p-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#C9A46A]">STOCK COUNT</label>
                    <input
                      type="number"
                      value={newProductForm.stockCount}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stockCount: Number(e.target.value) })}
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-white p-2"
                    />
                  </div>
                </div>

                {/* Images & Details */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-widest text-[#C9A46A] uppercase block">
                    IMAGE URLS (ONE PER LINE) *
                  </label>
                  <textarea
                    rows={3}
                    value={newProductForm.imagesText}
                    onChange={(e) => setNewProductForm({ ...newProductForm, imagesText: e.target.value })}
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] p-3 outline-none focus:border-[#C9A46A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-[#C9A46A] uppercase block">
                      AVAILABLE SIZES (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={newProductForm.sizesText}
                      onChange={(e) => setNewProductForm({ ...newProductForm, sizesText: e.target.value })}
                      placeholder="S, M, L, XL"
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] px-4 py-3 outline-none focus:border-[#C9A46A]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-[#C9A46A] uppercase block">
                      COLOR NAME & HEX CODE
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newProductForm.colorName}
                        onChange={(e) => setNewProductForm({ ...newProductForm, colorName: e.target.value })}
                        placeholder="Desert Sand"
                        className="w-1/2 bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] px-3 py-3 outline-none"
                      />
                      <input
                        type="color"
                        value={newProductForm.colorHex}
                        onChange={(e) => setNewProductForm({ ...newProductForm, colorHex: e.target.value })}
                        className="w-1/2 h-11 bg-[#050505] border border-[#C9A46A]/30 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-widest text-[#C9A46A] uppercase block">
                    SHORT DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={newProductForm.shortDescription}
                    onChange={(e) => setNewProductForm({ ...newProductForm, shortDescription: e.target.value })}
                    placeholder="Thoughtfully designed French flax linen shirt..."
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] px-4 py-3 outline-none focus:border-[#C9A46A]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-widest text-[#C9A46A] uppercase block">
                    FULL EDITORIAL DESCRIPTION
                  </label>
                  <textarea
                    rows={4}
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    placeholder="Describe the fabric weave, tailoring craftsmanship, and silhouette details..."
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] p-3 outline-none focus:border-[#C9A46A]"
                  />
                </div>

                {/* Badges Toggles */}
                <div className="flex flex-wrap gap-6 pt-2 border-t border-[#C9A46A]/20">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#D8C7AD]">
                    <input
                      type="checkbox"
                      checked={newProductForm.isNewArrival}
                      onChange={(e) => setNewProductForm({ ...newProductForm, isNewArrival: e.target.checked })}
                      className="accent-[#C9A46A]"
                    />
                    <span>MARK AS NEW ARRIVAL</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#D8C7AD]">
                    <input
                      type="checkbox"
                      checked={newProductForm.isBestSeller}
                      onChange={(e) => setNewProductForm({ ...newProductForm, isBestSeller: e.target.checked })}
                      className="accent-[#C9A46A]"
                    />
                    <span>MARK AS BESTSELLER</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#D8C7AD]">
                    <input
                      type="checkbox"
                      checked={newProductForm.isSale}
                      onChange={(e) => setNewProductForm({ ...newProductForm, isSale: e.target.checked })}
                      className="accent-[#C9A46A]"
                    />
                    <span>MARK AS ON SALE</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C9A46A] hover:bg-[#D8C7AD] text-black font-mono font-bold text-xs py-4 uppercase tracking-[0.2em] transition-all shadow-xl"
                >
                  PUBLISH PRODUCT TO LIVE ATELIER STORE
                </button>

              </form>
            </div>
          )}

          {/* TAB 4: ORDERS & TRACKING MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A46A] uppercase block">
                    FULFILLMENT & LOGISTICS
                  </span>
                  <h2 className="font-serif text-3xl font-light tracking-wide text-[#F5F1E8]">
                    ORDERS & LIVE PRODUCT TRACKING
                  </h2>
                </div>

                <button
                  onClick={() => loadAllData()}
                  className="px-4 py-2 bg-[#17120E] border border-[#C9A46A]/40 text-xs font-mono text-[#D8C7AD] hover:text-[#C9A46A] transition-colors flex items-center gap-2 uppercase shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>REFRESH ORDERS</span>
                </button>
              </div>

              {/* Order Search & Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#17120E] border border-[#C9A46A]/25 p-4">
                <div className="sm:col-span-8 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8C7AD]/50" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order # (e.g. MNZ-892101), Tracking #, or Customer Name..."
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] pl-9 pr-4 py-2.5 outline-none focus:border-[#C9A46A]"
                  />
                </div>

                <div className="sm:col-span-4 relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8C7AD]/50" />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-[#F5F1E8] pl-9 pr-4 py-2.5 outline-none focus:border-[#C9A46A]"
                  >
                    <option value="all">ALL ORDER STATUSES</option>
                    <option value="placed">PLACED</option>
                    <option value="processing">PROCESSING</option>
                    <option value="shipped">SHIPPED</option>
                    <option value="delivered">DELIVERED</option>
                    <option value="cancelled">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#17120E] border border-[#C9A46A]/25 shadow-2xl overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[#C9A46A]/20 text-[#C9A46A] bg-[#0F0B09]">
                      <th className="p-3.5">ORDER # & DATE</th>
                      <th className="p-3.5">CUSTOMER DETAILS</th>
                      <th className="p-3.5">ITEMS ORDERED</th>
                      <th className="p-3.5">TOTAL & METHOD</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5">COURIER TRACKING #</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C9A46A]/10 text-[#D8C7AD]">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#050505]/50 transition-colors">
                        <td className="p-3.5">
                          <p className="font-bold text-white text-sm">{ord.orderNumber}</p>
                          <p className="text-[10px] text-[#D8C7AD]/60">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold text-white">{ord.customer.name}</p>
                          <p className="text-[10px] text-[#C9A46A]">{ord.customer.email}</p>
                          <p className="text-[10px] text-[#D8C7AD]/60">{ord.shippingAddress.city}, {ord.shippingAddress.country}</p>
                        </td>
                        <td className="p-3.5">
                          <div className="space-y-1 max-w-xs">
                            {ord.items.map((item, idx) => (
                              <p key={idx} className="text-[11px] truncate">
                                • {item.product?.name || 'Garment Item'} ({item.selectedSize || 'Std'}) × {item.quantity}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-white text-sm">
                            {ord.currency === 'INR' ? `₹${ord.total}` : `$${ord.total}`}
                          </p>
                          <p className="text-[10px] uppercase text-[#C9A46A]">{ord.paymentMethod} ({ord.paymentStatus})</p>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : ord.orderStatus === 'shipped'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : ord.orderStatus === 'processing'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-gray-800 text-gray-300'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {ord.trackingNumber ? (
                            <div>
                              <p className="font-bold text-[#C9A46A]">{ord.trackingNumber}</p>
                              <p className="text-[10px] text-[#D8C7AD]/60">{ord.courierCarrier || 'Carrier assigned'}</p>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No tracking code</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setInvoiceModalOrder(ord)}
                            className="px-3 py-1.5 bg-[#050505] border border-[#C9A46A]/40 hover:border-[#C9A46A] text-[#C9A46A] text-[11px] font-bold uppercase transition-colors inline-flex items-center gap-1"
                            title="Print Luxury Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>INVOICE</span>
                          </button>
                          <button
                            onClick={() => openOrderTrackingModal(ord)}
                            className="px-3 py-1.5 bg-[#C9A46A] hover:bg-[#D8C7AD] text-black text-[11px] font-bold uppercase transition-colors inline-flex items-center gap-1"
                          >
                            <span>TRACKING & STATUS</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4.5: PROMO COUPONS MANAGEMENT */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A46A] uppercase block">
                  MARKETING & PROMOTIONS
                </span>
                <h2 className="font-serif text-3xl font-light tracking-wide text-[#F5F1E8]">
                  PROMO COUPONS & DISCOUNT CODES
                </h2>
              </div>

              {/* Create New Coupon Form */}
              <form onSubmit={handleCreateCoupon} className="bg-[#17120E] border border-[#C9A46A]/30 p-6 space-y-4 shadow-2xl">
                <h3 className="font-serif text-lg text-white font-light border-b border-[#C9A46A]/20 pb-2">
                  + CREATE NEW PROMO COUPON CODE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#C9A46A] uppercase">COUPON CODE *</label>
                    <input
                      type="text"
                      required
                      value={newCouponForm.code}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. FESTIVE20"
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5 outline-none font-bold uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#C9A46A] uppercase">DISCOUNT TYPE</label>
                    <select
                      value={newCouponForm.discountType}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, discountType: e.target.value as any })}
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5 outline-none"
                    >
                      <option value="percentage">PERCENTAGE (% OFF)</option>
                      <option value="fixed">FIXED AMOUNT (₹ / $ OFF)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#C9A46A] uppercase">VALUE (% OR ₹)</label>
                    <input
                      type="number"
                      required
                      value={newCouponForm.discountValue}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, discountValue: Number(e.target.value) })}
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#C9A46A] uppercase">MIN ORDER AMOUNT (INR)</label>
                    <input
                      type="number"
                      value={newCouponForm.minOrderAmountINR}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrderAmountINR: Number(e.target.value) })}
                      className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C9A46A] hover:bg-[#D8C7AD] text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  SAVE & ACTIVATE PROMO COUPON
                </button>
              </form>

              {/* Coupons List Table */}
              <div className="bg-[#17120E] border border-[#C9A46A]/25 p-6 shadow-2xl overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[#C9A46A]/20 text-[#C9A46A]">
                      <th className="p-3">COUPON CODE</th>
                      <th className="p-3">DISCOUNT</th>
                      <th className="p-3">MIN ORDER</th>
                      <th className="p-3">STATUS</th>
                      <th className="p-3">USAGE COUNT</th>
                      <th className="p-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C9A46A]/10 text-[#D8C7AD]">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-[#050505]/40 transition-colors">
                        <td className="p-3 font-bold text-white text-sm">{c.code}</td>
                        <td className="p-3 text-[#C9A46A] font-bold">
                          {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                        </td>
                        <td className="p-3">₹{c.minOrderAmountINR} / ${c.minOrderAmountUSD}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                              c.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                            }`}
                          >
                            {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="p-3">{c.usageCount} orders</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleToggleCoupon(c.id, c.isActive)}
                            className="px-2.5 py-1 bg-[#050505] border border-[#C9A46A]/30 text-white text-[10px] hover:text-[#C9A46A]"
                          >
                            {c.isActive ? 'DISABLE' : 'ENABLE'}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="px-2.5 py-1 bg-red-950/40 border border-red-800 text-red-300 text-[10px] hover:bg-red-800 hover:text-white"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A46A] uppercase block">
                  CLIENTELE DIRECTORY
                </span>
                <h2 className="font-serif text-3xl font-light tracking-wide text-[#F5F1E8]">
                  MUNAAZ CUSTOMERS & REPEAT BUYERS
                </h2>
              </div>

              <div className="bg-[#17120E] border border-[#C9A46A]/25 p-6 shadow-2xl">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[#C9A46A]/20 text-[#C9A46A]">
                      <th className="p-3">CLIENT NAME</th>
                      <th className="p-3">EMAIL & PHONE</th>
                      <th className="p-3">SHIPPING ADDRESS</th>
                      <th className="p-3">TOTAL ORDERS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C9A46A]/10 text-[#D8C7AD]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#050505]/40 transition-colors">
                        <td className="p-3 font-bold text-white text-sm">{ord.customer.name}</td>
                        <td className="p-3">
                          <p className="text-[#C9A46A]">{ord.customer.email}</p>
                          <p className="text-[10px]">{ord.customer.phone}</p>
                        </td>
                        <td className="p-3 text-[11px]">
                          {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.postalCode}, {ord.shippingAddress.country}
                        </td>
                        <td className="p-3 font-bold text-white">1 order ({ord.currency === 'INR' ? `₹${ord.total}` : `$${ord.total}`})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A46A] uppercase block">
                  SECURITY & CREDENTIALS
                </span>
                <h2 className="font-serif text-3xl font-light tracking-wide text-[#F5F1E8]">
                  ADMIN SECURITY SETTINGS
                </h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="bg-[#17120E] border border-[#C9A46A]/30 p-6 space-y-5 shadow-2xl">
                <div className="flex items-center gap-2 pb-3 border-b border-[#C9A46A]/20 text-[#C9A46A]">
                  <Key className="w-4 h-4" />
                  <h3 className="font-serif text-lg font-light text-white">UPDATE ADMIN PASSCODE</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#C9A46A]">CURRENT PASSCODE</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-white p-3 outline-none"
                    placeholder="Current passcode"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#C9A46A]">NEW PASSCODE</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-white p-3 outline-none"
                    placeholder="New passcode (min 6 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#C9A46A]">CONFIRM NEW PASSCODE</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-xs font-mono text-white p-3 outline-none"
                    placeholder="Re-enter new passcode"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C9A46A] hover:bg-[#D8C7AD] text-black font-mono font-bold text-xs py-3 uppercase tracking-wider transition-colors"
                >
                  SAVE NEW ADMIN PASSCODE
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* --- MODAL 1: EDIT PRODUCT MODAL --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17120E] border border-[#C9A46A]/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-[#C9A46A]/20">
              <h3 className="font-serif text-2xl font-light text-white">EDIT PRODUCT: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-[#C9A46A] text-[10px] uppercase block mb-1">PRODUCT NAME</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#C9A46A] text-[10px] uppercase block mb-1">PRICE INR ₹</label>
                  <input
                    type="number"
                    value={editingProduct.priceINR}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceINR: Number(e.target.value) })}
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5"
                  />
                </div>
                <div>
                  <label className="text-[#C9A46A] text-[10px] uppercase block mb-1">PRICE USD $</label>
                  <input
                    type="number"
                    value={editingProduct.priceUSD}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceUSD: Number(e.target.value) })}
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#C9A46A] text-[10px] uppercase block mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#C9A46A]/20">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-[#050505] border border-[#C9A46A]/30 text-white text-xs uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C9A46A] text-black font-bold text-xs uppercase hover:bg-[#D8C7AD]"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ORDER TRACKING & STATUS UPDATE MODAL --- */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#17120E] border border-[#C9A46A]/50 max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative text-[#F5F1E8]">
            
            <div className="flex justify-between items-start pb-4 border-b border-[#C9A46A]/25">
              <div>
                <div className="inline-flex items-center gap-2 text-[#C9A46A] text-[10px] font-mono tracking-widest uppercase">
                  <Truck className="w-3.5 h-3.5" />
                  <span>LOGISTICS & LIVE TRACKING ENGINE</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-white mt-1">
                  ORDER #{trackingModalOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setTrackingModalOrder(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderTracking} className="space-y-6 font-mono text-xs">
              
              {/* Order Quick Overview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#0F0B09] border border-[#C9A46A]/20">
                <div>
                  <span className="text-[10px] text-[#C9A46A] uppercase block">CUSTOMER</span>
                  <p className="font-bold text-white">{trackingModalOrder.customer.name}</p>
                  <p className="text-[10px] text-[#D8C7AD]/70">{trackingModalOrder.customer.email}</p>
                </div>

                <div>
                  <span className="text-[10px] text-[#C9A46A] uppercase block">TOTAL AMOUNT</span>
                  <p className="font-bold text-white">
                    {trackingModalOrder.currency === 'INR' ? `₹${trackingModalOrder.total}` : `$${trackingModalOrder.total}`}
                  </p>
                  <p className="text-[10px] uppercase text-[#D8C7AD]/70">{trackingModalOrder.paymentMethod}</p>
                </div>

                <div>
                  <span className="text-[10px] text-[#C9A46A] uppercase block">SHIPPING DESTINATION</span>
                  <p className="text-[11px] text-[#D8C7AD]/90 truncate">
                    {trackingModalOrder.shippingAddress.city}, {trackingModalOrder.shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* Status & Carrier Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#C9A46A] uppercase block">ORDER STATUS *</label>
                  <select
                    value={trackingForm.orderStatus}
                    onChange={(e) => setTrackingForm({ ...trackingForm, orderStatus: e.target.value as any })}
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5 outline-none"
                  >
                    <option value="placed">PLACED</option>
                    <option value="processing">PROCESSING</option>
                    <option value="shipped">SHIPPED</option>
                    <option value="delivered">DELIVERED</option>
                    <option value="cancelled">CANCELLED</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#C9A46A] uppercase block">COURIER CARRIER *</label>
                  <input
                    type="text"
                    value={trackingForm.courierCarrier}
                    onChange={(e) => setTrackingForm({ ...trackingForm, courierCarrier: e.target.value })}
                    placeholder="BlueDart Express, DHL, Delhivery..."
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#C9A46A] uppercase block">TRACKING NUMBER *</label>
                  <input
                    type="text"
                    value={trackingForm.trackingNumber}
                    onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                    placeholder="MNZ-TRK-892301"
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5 outline-none font-bold text-[#C9A46A]"
                  />
                </div>
              </div>

              {/* Estimated Delivery & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#C9A46A] uppercase block">ESTIMATED DELIVERY DATE</label>
                  <input
                    type="text"
                    value={trackingForm.estimatedDelivery}
                    onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDelivery: e.target.value })}
                    placeholder="Oct 5, 2026"
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#C9A46A] uppercase block">INTERNAL ADMIN NOTES</label>
                  <input
                    type="text"
                    value={trackingForm.adminNotes}
                    onChange={(e) => setTrackingForm({ ...trackingForm, adminNotes: e.target.value })}
                    placeholder="Special instructions or gift box wrap notes..."
                    className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Add New Tracking Event Timeline Section */}
              <div className="p-4 bg-[#0F0B09] border border-[#C9A46A]/30 space-y-3">
                <span className="text-[10px] text-[#C9A46A] uppercase font-bold tracking-widest block">
                  + ADD LOGISTICS TIMELINE EVENT (CLIENT TRACKING FEED)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={trackingForm.eventStatus}
                    onChange={(e) => setTrackingForm({ ...trackingForm, eventStatus: e.target.value })}
                    placeholder="Status (e.g. In Transit via BlueDart Air)"
                    className="bg-[#050505] border border-[#C9A46A]/30 text-white p-2 text-xs"
                  />

                  <input
                    type="text"
                    value={trackingForm.eventLocation}
                    onChange={(e) => setTrackingForm({ ...trackingForm, eventLocation: e.target.value })}
                    placeholder="Location (e.g. Mumbai Logistics Hub)"
                    className="bg-[#050505] border border-[#C9A46A]/30 text-white p-2 text-xs"
                  />
                </div>

                <input
                  type="text"
                  value={trackingForm.eventDescription}
                  onChange={(e) => setTrackingForm({ ...trackingForm, eventDescription: e.target.value })}
                  placeholder="Detail description (e.g. Package arrived at regional sorting facility)"
                  className="w-full bg-[#050505] border border-[#C9A46A]/30 text-white p-2 text-xs"
                />
              </div>

              {/* Current Tracking Timeline Display */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#C9A46A] uppercase block">CURRENT LOGISTICS TIMELINE HISTORY</span>
                <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-[#050505] border border-[#C9A46A]/20">
                  {trackingModalOrder.trackingHistory && trackingModalOrder.trackingHistory.length > 0 ? (
                    trackingModalOrder.trackingHistory.map((tr) => (
                      <div key={tr.id} className="p-2 border-b border-[#C9A46A]/10 text-[11px] space-y-0.5">
                        <div className="flex justify-between text-[#C9A46A] font-bold">
                          <span>{tr.status}</span>
                          <span className="text-[10px] text-[#D8C7AD]/60 font-normal">{tr.timestamp}</span>
                        </div>
                        <p className="text-[#D8C7AD]/80 text-[10px]">{tr.location} — {tr.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-500 italic">No timeline events recorded yet.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#C9A46A]/20">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2.5 bg-[#050505] border border-[#C9A46A]/30 text-white text-xs uppercase"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C9A46A] hover:bg-[#D8C7AD] text-black font-bold text-xs uppercase shadow-xl"
                >
                  SAVE TRACKING & UPDATE ORDER
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: DELETE CONFIRMATION MODAL --- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17120E] border border-red-800 max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="font-serif text-xl text-white font-light">DELETE PRODUCT FROM CATALOG?</h3>
            <p className="text-xs font-mono text-[#D8C7AD]/70">
              This action will permanently remove the product from the MUNAAZ store catalog.
            </p>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2 bg-[#050505] border border-gray-700 text-white text-xs font-mono uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-mono text-xs font-bold uppercase"
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: PRINTABLE LUXURY INVOICE MODAL --- */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFF9F1] text-[#35251E] max-w-2xl w-full max-h-[95vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative border-2 border-[#C9A46A]">
            
            <div className="flex justify-between items-start pb-4 border-b border-[#DDCBB7]">
              <div>
                <h1 className="font-serif text-3xl font-bold tracking-[0.2em]">MUNAAZ</h1>
                <p className="text-[10px] font-mono tracking-widest text-[#806B5D] uppercase">HAUTE FASHION & FINE JEWELLERY ATELIER</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#A85F43] block">INVOICE #{invoiceModalOrder.orderNumber}</span>
                <span className="text-[10px] font-mono text-[#806B5D] block">Date: {new Date(invoiceModalOrder.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => window.print()}
                  className="mt-2 px-3 py-1 bg-[#35251E] text-white text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1.5 ml-auto"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT / SAVE PDF</span>
                </button>
              </div>
            </div>

            {/* Billed To & Shipping Address */}
            <div className="grid grid-cols-2 gap-6 text-xs font-mono border-b border-[#DDCBB7] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#A85F43] uppercase block mb-1">BILLED & SHIPPED TO</span>
                <p className="font-bold">{invoiceModalOrder.customer.name}</p>
                <p>{invoiceModalOrder.shippingAddress.street}</p>
                <p>{invoiceModalOrder.shippingAddress.city}, {invoiceModalOrder.shippingAddress.state} {invoiceModalOrder.shippingAddress.postalCode}</p>
                <p>{invoiceModalOrder.shippingAddress.country} • {invoiceModalOrder.customer.phone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#A85F43] uppercase block mb-1">LOGISTICS DETAILS</span>
                <p>Status: <strong className="uppercase">{invoiceModalOrder.orderStatus}</strong></p>
                <p>Carrier: {invoiceModalOrder.courierCarrier || 'Express Courier'}</p>
                <p>Tracking #: <strong className="text-[#A85F43]">{invoiceModalOrder.trackingNumber || 'Pending'}</strong></p>
                <p>Payment: {invoiceModalOrder.paymentMethod.toUpperCase()} ({invoiceModalOrder.paymentStatus})</p>
              </div>
            </div>

            {/* Invoice Line Items */}
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#DDCBB7] text-[#806B5D] bg-[#F3E5D0]">
                  <th className="p-2.5">ITEM DESCRIPTION</th>
                  <th className="p-2.5">SIZE</th>
                  <th className="p-2.5 text-center">QTY</th>
                  <th className="p-2.5 text-right">UNIT PRICE</th>
                  <th className="p-2.5 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDCBB7]">
                {invoiceModalOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold">{item.product?.name || 'MUNAAZ Item'}</td>
                    <td className="p-2.5">{item.selectedSize}</td>
                    <td className="p-2.5 text-center">{item.quantity}</td>
                    <td className="p-2.5 text-right">
                      {invoiceModalOrder.currency === 'INR' ? `₹${item.unitPriceINR}` : `$${item.unitPriceUSD}`}
                    </td>
                    <td className="p-2.5 text-right font-bold">
                      {invoiceModalOrder.currency === 'INR' ? `₹${item.unitPriceINR * item.quantity}` : `$${item.unitPriceUSD * item.quantity}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Calculation */}
            <div className="flex justify-between items-end pt-4 border-t border-[#DDCBB7] text-xs font-mono">
              <div className="text-[10px] text-[#806B5D]">
                <p>Thank you for choosing MUNAAZ ATELIER.</p>
                <p>For support, contact support@munaaz.com</p>
              </div>

              <div className="text-right space-y-1">
                <p>Subtotal: {invoiceModalOrder.currency === 'INR' ? `₹${invoiceModalOrder.subtotal}` : `$${invoiceModalOrder.subtotal}`}</p>
                <p>Tax & Duty: {invoiceModalOrder.currency === 'INR' ? `₹${invoiceModalOrder.tax}` : `$${invoiceModalOrder.tax}`}</p>
                <p className="font-bold text-base text-[#35251E] pt-1 border-t border-[#35251E]">
                  TOTAL: {invoiceModalOrder.currency === 'INR' ? `₹${invoiceModalOrder.total}` : `$${invoiceModalOrder.total}`}
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="px-6 py-2 bg-[#35251E] text-white text-xs font-mono font-bold uppercase"
              >
                CLOSE INVOICE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
