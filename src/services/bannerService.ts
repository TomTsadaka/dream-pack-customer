import type { Banner, HomeBanner } from '@/types';
import { mockBanners } from '@/mocks/banners';
import { api } from './apiClient';

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));

/**
 * Transform API Banner to HomeBanner for backward compatibility
 */
const transformBanner = (banner: Banner): HomeBanner => ({
  id: banner.id,
  name: banner.name,
  title: banner.title,
  subtitle: banner.subtitle,
  link_url: banner.link_url,
  sort_order: banner.sort_order,
  images: banner.image_url ? [{ url: banner.image_url }] : [],
  image_url: banner.image_url ?? undefined
});

class BannerService {
  /**
   * Get banners for home page
   * Returns mock data when VITE_USE_MOCKS=true, otherwise fetches from API
   */
  async getBanners(): Promise<HomeBanner[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      return [...mockBanners].sort((a, b) => a.sort_order - b.sort_order);
    }

    try {
      const response = await api.get<any>('/api/banners');
      const payload = response?.data ?? response;
      
      if (Array.isArray(payload)) {
        return payload.map(transformBanner).sort((a, b) => a.sort_order - b.sort_order);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch banners from API:', error);
      return [];
    }
  }

  /**
   * Get banners sorted by sort_order
   */
  async fetchBanners(): Promise<Banner[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      const mock: Banner[] = mockBanners.map(b => ({
        id: b.id,
        name: b.name,
        title: b.title,
        subtitle: b.subtitle,
        link_url: b.link_url,
        image: null,
        image_url: b.images[0]?.url || null,
        sort_order: b.sort_order
      }));
      return mock.sort((a, b) => a.sort_order - b.sort_order);
    }

    try {
      const response = await api.get<any>('/api/banners');
      const payload = response?.data ?? response;
      
      if (Array.isArray(payload)) {
        return payload.sort((a: Banner, b: Banner) => {
          if (a.sort_order !== b.sort_order) {
            return a.sort_order - b.sort_order;
          }
          return a.id - b.id;
        });
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      return [];
    }
  }

  /**
   * Get a single banner by ID
   */
  async getBannerById(id: number): Promise<HomeBanner | null> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      return mockBanners.find(banner => banner.id === id) || null;
    }

    try {
      const response = await api.get<any>(`/api/banners/${id}`);
      const payload = response?.data ?? response;
      return transformBanner(payload);
    } catch (error) {
      console.error(`Failed to fetch banner ${id} from API:`, error);
      return null;
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