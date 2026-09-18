import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { Product, FilterOptions, SortOption } from '@/types/product';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    return MOCK_PRODUCTS;
  },

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return MOCK_PRODUCTS.find((p) => p.slug === slug);
  },

  async getProductsByCollection(collectionSlug: string): Promise<Product[]> {
    if (collectionSlug === 'all') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.collections.includes(collectionSlug as any));
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (category === 'all') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.category === category);
  },

  async filterAndSortProducts(
    options: FilterOptions = {},
    sort: SortOption = 'featured'
  ): Promise<Product[]> {
    let result = [...MOCK_PRODUCTS];

    // Filter by Category
    if (options.category && options.category !== 'all') {
      result = result.filter((p) => p.category === options.category);
    }

    // Filter by Collection
    if (options.collection && options.collection !== 'all') {
      result = result.filter((p) => p.collections.includes(options.collection as any));
    }

    // Filter by Sizes
    if (options.sizes && options.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => options.sizes?.includes(s))
      );
    }

    // Filter by Colors
    if (options.colors && options.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => options.colors?.includes(c.name))
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
    return MOCK_PRODUCTS.filter(
      (p) => p.id !== currentProductId && p.category === category
    ).slice(0, limit);
  }
};
