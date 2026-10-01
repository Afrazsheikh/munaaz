import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { Product, FilterOptions, SortOption } from '@/types/product';

const PRODUCTS_STORAGE_KEY = 'munaaz_products_db';

const getLocalStorageProducts = (): Product[] => {
  if (typeof window === 'undefined') return MOCK_PRODUCTS;
  const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return MOCK_PRODUCTS;
  }
};

const saveLocalStorageProducts = (products: Product[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }
};

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        saveLocalStorageProducts(data.data);
        return data.data;
      }
    } catch {
      // Fallback to local storage if server route unavailable
    }
    return getLocalStorageProducts();
  },

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const products = await this.getAllProducts();
    return products.find((p) => p.slug === slug);
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getAllProducts();
    return products.find((p) => p.id === id);
  },

  async getProductsByCollection(collectionSlug: string): Promise<Product[]> {
    const products = await this.getAllProducts();
    if (collectionSlug === 'all') return products;
    return products.filter((p) => p.collections && p.collections.includes(collectionSlug as any));
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getAllProducts();
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  },

  async filterAndSortProducts(
    options: FilterOptions = {},
    sort: SortOption = 'featured'
  ): Promise<Product[]> {
    const all = await this.getAllProducts();
    let result = [...all];

    // Filter by Category
    if (options.category && options.category !== 'all') {
      result = result.filter((p) => p.category === options.category);
    }

    // Filter by Collection
    if (options.collection && options.collection !== 'all') {
      result = result.filter((p) => p.collections && p.collections.includes(options.collection as any));
    }

    // Filter by Sizes
    if (options.sizes && options.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes && p.sizes.some((s) => options.sizes?.includes(s))
      );
    }

    // Filter by Colors
    if (options.colors && options.colors.length > 0) {
      result = result.filter((p) =>
        p.colors && p.colors.some((c) => options.colors?.includes(c.name))
      );
    }

    // Filter by On Sale
    if (options.onSaleOnly) {
      result = result.filter((p) => p.isSale);
    }

    // Search Query
    if (options.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.priceINR - b.priceINR);
        break;
      case 'price-high':
        result.sort((a, b) => b.priceINR - a.priceINR);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return result;
  },

  async getRelatedProducts(currentProductId: string, category: string, limit = 4): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.filter(
      (p) => p.id !== currentProductId && p.category === category
    ).slice(0, limit);
  },

  // --- ADMIN ACTIONS (API + LOCAL STORAGE SYNC) ---
  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const local = getLocalStorageProducts();
        saveLocalStorageProducts([data.data, ...local]);
        return data.data;
      }
    } catch {
      // Fallback local save
    }

    const local = getLocalStorageProducts();
    const updated = [newProduct, ...local];
    saveLocalStorageProducts(updated);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const products = getLocalStorageProducts();
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
          products[index] = data.data;
          saveLocalStorageProducts(products);
        }
        return data.data;
      }
    } catch {
      // Fallback
    }

    const products = getLocalStorageProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    saveLocalStorageProducts(products);
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
    const products = getLocalStorageProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveLocalStorageProducts(filtered);
    return true;
  },

  resetToDefaultProducts(): Product[] {
    saveLocalStorageProducts(MOCK_PRODUCTS);
    return MOCK_PRODUCTS;
  }
};
