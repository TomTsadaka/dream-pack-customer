import type { Product, ProductVariant } from '@/types';

/**
 * Resolve thumbnail image for a product variant
 * Priority: variant images -> product default variant -> placeholder
 */
export function resolveVariantThumbnail(
  product: Product | undefined,
  variant: ProductVariant | undefined,
  variantId?: string
): string {
  // If we have a variant, use its images
  if (variant && variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
    const firstImage = variant.images[0];
    if (firstImage && typeof firstImage === 'string' && firstImage.length > 0) {
      return firstImage;
    }
  }
  
  // If we only have variantId, try to find the variant
  if (variantId && product && product.variants && Array.isArray(product.variants)) {
    const foundVariant = product.variants.find(v => v.variantId === variantId);
    if (foundVariant && foundVariant.images && Array.isArray(foundVariant.images) && foundVariant.images.length > 0) {
      const firstImage = foundVariant.images[0];
      if (firstImage && typeof firstImage === 'string' && firstImage.length > 0) {
        return firstImage;
      }
    }
  }
  
  // Fallback to first variant of the product
  if (product && product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    const firstVariant = product.variants[0];
    if (firstVariant && firstVariant.images && Array.isArray(firstVariant.images) && firstVariant.images.length > 0) {
      const firstImage = firstVariant.images[0];
      if (firstImage && typeof firstImage === 'string' && firstImage.length > 0) {
        return firstImage;
      }
    }
  }
  
  // Ultimate fallback to placeholder
  return '/images/placeholder-product.svg';
}

/**
 * Handle image load error by setting placeholder
 */
export function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target.src !== '/images/placeholder-product.svg') {
    target.src = '/images/placeholder-product.svg';
  }
}