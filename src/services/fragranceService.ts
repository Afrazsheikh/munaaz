import { FragranceDataStore, FragranceProduct, FragranceHeroConfig, FragranceScene } from '@/types/fragrance';
import { getStoredFragranceData, saveFragranceData, resetFragranceData } from '@/data/fragranceData';

export const fragranceService = {
  getFragranceData(): FragranceDataStore {
    return getStoredFragranceData();
  },

  updateFragranceData(newData: FragranceDataStore): FragranceDataStore {
    saveFragranceData(newData);
    return newData;
  },

  resetToDefault(): FragranceDataStore {
    return resetFragranceData();
  },

  updateScenes(scenes: FragranceScene[]): FragranceDataStore {
    const current = getStoredFragranceData();
    const updatedStore = { ...current, scenes };
    saveFragranceData(updatedStore);
    return updatedStore;
  },

  updateProduct(updatedProduct: FragranceProduct): FragranceDataStore {
    const current = getStoredFragranceData();
    const index = current.products.findIndex((p) => p.id === updatedProduct.id);
    let newProducts = [...current.products];
    if (index > -1) {
      newProducts[index] = updatedProduct;
    } else {
      newProducts.push(updatedProduct);
    }
    const updatedStore = { ...current, products: newProducts };
    saveFragranceData(updatedStore);
    return updatedStore;
  },

  updateHeroConfig(updatedHero: FragranceHeroConfig): FragranceDataStore {
    const current = getStoredFragranceData();
    const updatedStore = { ...current, hero: updatedHero };
    saveFragranceData(updatedStore);
    return updatedStore;
  }
};
