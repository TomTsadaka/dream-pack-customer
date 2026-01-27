import type { Product, ProductCategory } from '@/types';
import type { ProductVariant, ProductAttribute } from '@/types';

// Packaging Industry Category Structure
const PACKAGING_CATEGORIES: ProductCategory[] = [
  {
    id: 1,
    categoryName: 'Flexible Packaging',
    description: 'Versatile packaging solutions for various product types',
    parent: 'Flexible Packaging',
    tag: 'Flexible Packaging'
  },
  {
    id: 2,
    categoryName: 'Rigid Packaging',
    description: 'Durable and sturdy packaging for shipping and storage',
    parent: 'Rigid Packaging',
    tag: 'Rigid Packaging'
  },
  {
    id: 3,
    categoryName: 'Bottles & Containers',
    description: 'Various bottles and containers for liquids and storage',
    parent: 'Bottles & Containers',
    tag: 'Bottles & Containers'
  },
  {
    id: 4,
    categoryName: 'Protective Packaging',
    description: 'Cushioning and protective materials for fragile items',
    parent: 'Protective Packaging',
    tag: 'Protective Packaging'
  },
  {
    id: 5,
    categoryName: 'Shelf-ready & Retail Packaging',
    description: 'Display-ready packaging for retail environments',
    parent: 'Shelf-ready & Retail Packaging',
    tag: 'Shelf-ready & Retail Packaging'
  }
];

// Helper to generate deterministic image paths
const generateProductImages = (tagSlug: string, color: string, index: number): string[] => {
  return Array.from({ length: 3 }, (_, i) => 
    `/images/products/${tagSlug}/${color.toLowerCase()}/${i + 1}.jpg`
  );
};

// Helper to get hex color from name
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'Red': '#EF4444',
    'Blue': '#3B82F6',
    'Green': '#22C55E',
    'Yellow': '#FDE047',
    'Orange': '#F97316',
    'Purple': '#8B5CF6',
    'Pink': '#EC4899',
    'Brown': '#92400E',
    'Gray': '#6B7280',
    'Black': '#000000',
    'White': '#FFFFFF',
    'Clear': '#F3F4F6',
    'Tan': '#D2B48C',
    'Kraft': '#D4A574'
  };
  return colorMap[colorName] || '#6B7280';
};

// Create variant helper
const createVariant = (
  productId: number,
  tagSlug: string,
  color: string,
  size: string,
  packSize: number,
  price: number,
  stock: number,
  salePrice?: number,
  colorHex?: string
): ProductVariant => ({
  variantId: `${tagSlug}-${color.toLowerCase()}-${size}-${packSize}`,
  color,
  colorHex: colorHex || getColorHex(color),
  size,
  sizeId: size.toLowerCase(),
  packSize,
  packSizeId: packSize,
  sku: `${tagSlug.toUpperCase()}-${color.toUpperCase()}-${size.toUpperCase()}-${packSize}`,
  price: Number(price) || 0,
  salePrice: salePrice ? Number(salePrice) : undefined,
  stock: Number(stock) || 0,
  images: generateProductImages(tagSlug, color, 1),
  attributes: {
    material: color === 'Red' ? 'Premium' : 'Standard',
    weight: `${packSize * 50}g`
  }
});

// Create product helper
const createProduct = (
  id: number,
  name: string,
  tagSlug: string,
  parentCategory: ProductCategory,
  tag: string,
  baseDescription: string,
  rating: number,
  soldCount: number
): Product => {
  // Generate variants for this product
  const variants: ProductVariant[] = [];
  const colors = parentCategory.parent === 'Flexible Packaging' 
    ? ['Red', 'Blue', 'Green', 'Yellow']
    : parentCategory.parent === 'Rigid Packaging'
    ? ['Brown', 'Gray', 'Black']
    : parentCategory.parent === 'Bottles & Containers'
    ? ['Clear', 'Green', 'Blue']
    : parentCategory.parent === 'Protective Packaging'
    ? ['Pink', 'Purple', 'Orange']
    : ['White', 'Black', 'Gray']; // Shelf-ready & Retail Packaging

  const sizes = parentCategory.parent === 'Flexible Packaging' 
    ? ['Small', 'Medium', 'Large']
    : parentCategory.parent === 'Rigid Packaging'
    ? ['Standard', 'Heavy Duty']
    : parentCategory.parent === 'Bottles & Containers'
    ? ['500ml', '1L', '2L']
    : parentCategory.parent === 'Protective Packaging'
    ? ['A4', 'A3', 'A5']
    : ['Small', 'Medium', 'Large']; // Shelf-ready & Retail Packaging

  const packSizes = parentCategory.parent === 'Flexible Packaging' 
    ? [6, 12, 24]
    : parentCategory.parent === 'Rigid Packaging'
    ? [10, 25, 50]
    : parentCategory.parent === 'Bottles & Containers'
    ? [1, 6, 12]
    : [1, 5, 10]; // Protective Packaging

  // Generate all variant combinations
  let variantIdCounter = 1;
  colors.forEach(color => {
    sizes.forEach(size => {
      packSizes.forEach(packSize => {
        const priceMultiplier = size === 'Large' || size === 'Heavy Duty' || size === '2L' ? 1.5 : 
                              size === 'Medium' || size === 'Standard' || size === '1L' || size === 'A3' ? 1.2 : 1;
        const basePrice = Math.round((Math.random() * 50 + 10) * priceMultiplier);
        const stock = Math.floor(Math.random() * 100) + 5;
        const hasSale = Math.random() > 0.3;
        const salePrice = hasSale ? basePrice * 0.8 : undefined;

        variants.push(createVariant(
          id,
          tagSlug,
          color,
          size,
          packSize,
          basePrice,
          stock,
          salePrice,
          getColorHex(color)
        ));
        variantIdCounter++;
      });
    });
  });

  // Create options structure
  const options = {
    colors: colors.map((color, index) => ({
      id: `${parentCategory.parent.toLowerCase()}-${color.toLowerCase()}`,
      name: color,
      value: color,
      hex: getColorHex(color)
    })),
    sizes: sizes.map((size, index) => ({
      id: `${parentCategory.parent.toLowerCase()}-${size.toLowerCase()}`,
      name: size,
      value: size
    })),
    pcsPerPack: packSizes.map((packSize, index) => ({
      id: `${parentCategory.parent.toLowerCase()}-${packSize}`,
      name: packSize.toString(),
      value: packSize,
      label: `${packSize} pcs/pack`
    }))
  };

  return {
    id,
    name,
    slug: tagSlug,
    baseDescription,
    category: parentCategory,
    rating,
    soldCount,
    image: variants[0]?.images[0],
    price: variants[0]?.price,
    salePrice: variants[0]?.salePrice,
    options,
    variants,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent: parentCategory.parent,
    tag: parentCategory.tag
  };
};

// Generate all products for each category
export const mockProducts: Product[] = [
  // Flexible Packaging Products
  createProduct(
    1,
    'Bubble Wrap Rolls',
    'bubble-wrap',
    PACKAGING_CATEGORIES[0],
    'Bubble Wrap',
    'Premium bubble wrap rolls for protecting fragile items during shipping and storage. Available in various sizes and colors for all your packaging needs.',
    4.5,
    234
  ),
  createProduct(
    2,
    'Stretch Film',
    'stretch-film',
    PACKAGING_CATEGORIES[0],
    'Stretch Film',
    'High-clarity stretch film for pallet wrapping and securing loads. Excellent elasticity and puncture resistance for professional shipping.',
    4.6,
    189
  ),
  createProduct(
    3,
    'Poly Mailers',
    'poly-mailers',
    PACKAGING_CATEGORIES[0],
    'Poly Mailers',
    'Durable polyethylene mailers with self-sealing adhesive closure. Perfect for shipping documents, electronics, and small items.',
    4.3,
    156
  ),
  createProduct(
    4,
    'Foam Sheets',
    'foam-sheets',
    PACKAGING_CATEGORIES[0],
    'Foam Sheets',
    'Lightweight foam sheets for cushioning and protecting delicate items. Easy to cut and customize for specific packaging requirements.',
    3.9,
    98
  ),

  // Rigid Packaging Products
  createProduct(
    5,
    'Corrugated Boxes',
    'corrugated-boxes',
    PACKAGING_CATEGORIES[1],
    'Corrugated Boxes',
    'Strong corrugated cardboard boxes for shipping and storage. Various sizes available with different wall thicknesses.',
    4.7,
    312
  ),
  createProduct(
    6,
    'Mailer Boxes',
    'mailer-boxes',
    PACKAGING_CATEGORIES[1],
    'Mailer Boxes',
    'Rigid mailer boxes with integrated closure mechanisms. Ideal for shipping small to medium-sized items securely.',
    4.4,
    267
  ),
  createProduct(
    7,
    'Folding Cartons',
    'folding-cartons',
    PACKAGING_CATEGORIES[1],
    'Folding Cartons',
    'Space-saving folding cartons that assemble quickly. Perfect for retail packaging and temporary storage solutions.',
    4.2,
    145
  ),
  createProduct(
    8,
    'Plastic Containers',
    'plastic-containers',
    PACKAGING_CATEGORIES[1],
    'Plastic Containers',
    'Reusable plastic containers with secure lids. Various sizes for food storage, organization, and shipping.',
    4.8,
    201
  ),

  // Bottles & Containers Products
  createProduct(
    9,
    'PET Bottles',
    'pet-bottles',
    PACKAGING_CATEGORIES[2],
    'PET Bottles',
    'Clear PET bottles with secure caps. Perfect for beverages, liquids, and bulk storage solutions.',
    4.5,
    423
  ),
  createProduct(
    10,
    'Spray Bottles',
    'spray-bottles',
    PACKAGING_CATEGORIES[2],
    'Spray Bottles',
    'Adjustable spray bottles with fine mist nozzles. Ideal for cleaning solutions, cosmetics, and industrial applications.',
    3.8,
    167
  ),
  createProduct(
    11,
    'Glass Jars',
    'glass-jars',
    PACKAGING_CATEGORIES[2],
    'Glass Jars',
    'Clear glass jars with airtight lids. Perfect for food storage, preserves, and premium products.',
    4.1,
    289
  ),

  // Protective Packaging Products
  createProduct(
    12,
    'Air Pillows',
    'air-pillows',
    PACKAGING_CATEGORIES[3],
    'Air Pillows',
    'Inflatable air pillows for filling void spaces and cushioning items in packages. Lightweight and easy to use.',
    3.6,
    134
  ),
  createProduct(
    13,
    'Foam Edge Protectors',
    'foam-edge-protectors',
    PACKAGING_CATEGORIES[3],
    'Foam Edge Protectors',
    'Adhesive foam edge protectors for furniture corners and edges. Prevents damage during shipping and handling.',
    4.0,
    87
  ),
  createProduct(
    14,
    'Bubble Cushioning',
    'bubble-cushioning',
    PACKAGING_CATEGORIES[3],
    'Bubble Cushioning',
    'Pre-formed bubble cushioning wraps for protecting edges and corners. Convenient peel-and-stick application.',
    4.2,
    112
  ),

  // Shelf-ready & Retail Packaging Products
  createProduct(
    15,
    'Display Trays',
    'display-trays',
    PACKAGING_CATEGORIES[4],
    'Display Trays',
    'Clear plastic display trays for retail presentation. Stackable design with secure fitting.',
    4.3,
    178
  ),
  createProduct(
    16,
    'Counter Display Boxes',
    'counter-display-boxes',
    PACKAGING_CATEGORIES[4],
    'Counter Display Boxes',
    'Cardboard counter display boxes with custom printing options. Perfect for point-of-sale displays.',
    4.6,
    156
  ),
  createProduct(
    17,
    'Retail Display Shippers',
    'retail-display-shippers',
    PACKAGING_CATEGORIES[4],
    'Retail Display Shippers',
    'All-in-one retail display shipping boxes with integrated inserts. Professional presentation for e-commerce.',
    4.8,
    203
  ),
  createProduct(
    18,
    'Shelf-Ready Cartons',
    'shelf-ready-cartons',
    PACKAGING_CATEGORIES[4],
    'Shelf-Ready Cartons',
    'Pre-assembled cartons designed for retail shelving. Quick setup and professional appearance.',
    4.4,
    124
  )
];

// Export categories for navigation
export { PACKAGING_CATEGORIES };