import type { HomeBanner } from '@/types';

export const mockBanners: HomeBanner[] = [
  {
    id: 1,
    name: "Hero Packaging Banner 1",
    title: "Welcome to Dream Pack",
    subtitle: "Premium Packaging Solutions for Your Business",
    link_url: "/shop",
    sort_order: 1,
    images: [
      { url: "/images/banners/hero-packaging-1.svg" }
    ]
  },
  {
    id: 2,
    name: "Hero Packaging Banner 2",
    title: "Quality Packaging Materials",
    subtitle: "Protect Your Products with Professional Packaging",
    link_url: "/shop?category=Flexible%20Packaging",
    sort_order: 2,
    images: [
      { url: "/images/banners/hero-packaging-2.svg" }
    ]
  },
  {
    id: 3,
    name: "Default Hero Banner",
    title: "Dream Pack",
    subtitle: "Your Trusted Packaging Partner",
    link_url: "/shop",
    sort_order: 3,
    images: [
      { url: "/images/banners/hero-default.svg" }
    ]
  }
];