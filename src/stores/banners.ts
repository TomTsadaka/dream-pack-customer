import { defineStore } from 'pinia';
import type { Banner } from '@/types';
import { bannerService } from '@/services/bannerService';

interface BannersState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

export const useBannersStore = defineStore('banners', {
  state: (): BannersState => ({
    banners: [],
    loading: false,
    error: null
  }),

  getters: {
    sortedBanners: (state): Banner[] => {
      return [...state.banners].sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        return a.id - b.id;
      });
    },

    heroBanner: (state): Banner | null => {
      const sorted = state.banners.sort((a, b) => a.sort_order - b.sort_order);
      return sorted.length > 0 ? sorted[0] : null;
    },

    hasBanners: (state): boolean => {
      return state.banners.length > 0;
    }
  },

  actions: {
    async fetchBanners(force = false) {
      if (!force && this.banners.length > 0) {
        return;
      }

      try {
        this.loading = true;
        this.error = null;
        this.banners = await bannerService.fetchBanners();
      } catch (error: any) {
        this.error = error?.message || 'Failed to fetch banners';
        console.error('Failed to fetch banners:', error);
      } finally {
        this.loading = false;
      }
    },

    resetBanners() {
      this.banners = [];
      this.error = null;
    }
  }
});
