import type { HomeBanner } from '@/types';
import { mockBanners } from '@/mocks/banners';
import apiClient from './apiClient';

class BannerService {
  /**
   * Get banners for home page
   * Returns mock data when VITE_USE_MOCKS=true, otherwise fetches from API
   */
  async getBanners(): Promise<HomeBanner[]> {
    // Check if we should use mock data
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      // Return mock data sorted by sort_order
      return [...mockBanners].sort((a, b) => a.sort_order - b.sort_order);
    }

    try {
      // Fetch from Laravel API
      const response = await apiClient.get('/api/banners');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch banners from API, falling back to mock data:', error);
      // Fallback to mock data if API fails
      return [...mockBanners].sort((a, b) => a.sort_order - b.sort_order);
    }
  }

  /**
   * Get a single banner by ID
   */
  async getBannerById(id: number): Promise<HomeBanner | null> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      return mockBanners.find(banner => banner.id === id) || null;
    }

    try {
      const response = await apiClient.get(`/api/banners/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Failed to fetch banner ${id} from API:`, error);
      return mockBanners.find(banner => banner.id === id) || null;
    }
  }

  /**
   * Get the primary hero banner (first banner by sort_order)
   */
  async getHeroBanner(): Promise<HomeBanner | null> {
    const banners = await this.getBanners();
    return banners.length > 0 ? banners[0] : null;
  }
}

export const bannerService = new BannerService();
export default bannerService;