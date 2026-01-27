# DEMO_MOCK_MODE.md

## Mock Mode Demo Verification

This document confirms that the Dream Pack e-commerce app works in mock mode with full variant and packaging behavior.

### Environment Configuration
- **VITE_USE_MOCKS=true** (default in .env) - Always uses mock data, never calls API
- App runs immediately with: `npm install && npm run dev`
- Debug panel shows filtering status when mock mode is active

### Demo Verification Steps

#### 1. Shop Listing Filter Behavior
**URL**: `/shop`

**Test Color Filter:**
1. Go to `/shop`
2. Select "Color: Red" from filters
3. **Expected Result**: 
   - Product cards show images from RED variants
   - Products without RED variants are hidden
   - "From price" reflects RED variant pricing

**Test Product ID 1 (Bubble Wrap Rolls):**
- Has RED and BLUE variants with different prices
- RED variants: $9.99-$24.99 (sale prices)
- BLUE variants: $11.99-$26.99 (regular prices)
- When Color=Red selected, shows RED variant images and pricing

**Test Product ID 3 (Packing Tape):**
- Has RED variants with 0 stock (out of stock)
- When Color=Red selected, this product should be hidden (no in-stock RED variants)

#### 2. Product Detail Variant Selection
**URL**: `/product/1` (Bubble Wrap Rolls)

**Test Color Switching:**
1. Open product detail page
2. Click "Red" color chip
3. **Expected Result**: 
   - Image gallery changes to RED variant images
   - Price updates to RED variant pricing
   - Stock shows RED variant stock
   - SKU updates to RED variant SKU

4. Click "Blue" color chip
5. **Expected Result**: 
   - Image gallery changes to BLUE variant images
   - Price updates to BLUE variant pricing
   - Stock shows BLUE variant stock
   - SKU updates to BLUE variant SKU

**Test Size and Pack Size Selection:**
1. Change size from "Small" to "Medium"
2. Change pack size from "6" to "12"
3. **Expected Result**: All variant data updates accordingly

#### 3. Image Gallery Modal
**URL**: `/product/1`

**Test Gallery Modal:**
1. Click the main product image
2. **Expected Result**: Modal opens with current variant images
3. Test next/prev buttons - should cycle through images
4. Test thumbnails - clicking should change main image
5. Test keyboard arrows - should navigate images
6. Close modal and change variant - gallery should reset to new variant's first image

#### 4. Cart Variant Behavior
**Test Adding to Cart:**
1. Select "Red" color, "Small" size, "6 pcs" pack size
2. Click "Add to Cart"
3. **Expected Result**: 
   - Cart shows "Red / Small / 6 pcs"
   - Thumbnail matches RED variant image
   - Price matches RED variant price

4. Go to cart page
5. **Expected Result**: Cart displays variant details correctly

#### 5. Query String Synchronization
**Test URL Parameters:**
1. Navigate to: `/shop?colors=red&sizes=Small&packs=6`
2. **Expected Result**: 
   - Filters are applied correctly
   - Product cards show matching variants
   - URL stays in sync with filter selections

### Demo Product IDs for Testing

**Product ID 1: Bubble Wrap Rolls**
- Colors: Red, Blue
- Sizes: Small, Medium  
- Pack Sizes: 6, 12
- Notable: RED variants have sale prices, BLUE variants don't

**Product ID 2: Mailer Pouches**
- Colors: Kraft, White, Blue
- Sizes: Small, Medium
- Pack Sizes: 10, 25
- Notable: Multiple color options with consistent pricing

**Product ID 3: Packing Tape**
- Colors: Clear, Tan, Red
- Sizes: Standard
- Pack Sizes: 50
- Notable: RED variants have 0 stock (out of stock demonstration)

### Mock Mode Features Confirmed

✅ **Multiple Images Per Variant**: Each variant has 4 unique images using Picsum with consistent seeds
✅ **Packaging Options**: Pack sizes clearly displayed (6 pcs, 12 pcs, etc.)
✅ **Color Selection Changes**: Both listing and product pages respond to color selection
✅ **Variant Filtering**: Shop filters work with variant matching
✅ **Gallery Modal**: Full lightbox with navigation and thumbnails
✅ **Cart Variant Support**: Cart stores and displays variant details
✅ **Query String Sync**: All filters maintain URL state
✅ **Stock Management**: Out-of-stock variants are properly handled

### Technical Implementation

- **Types**: Complete Product and ProductVariant interfaces
- **Mock Data**: 12 products with 6+ variants each, 4 images per variant
- **Services**: Mock mode with full filtering support
- **Components**: VariantSelector, ProductGalleryModal, ColorChips, PackSizePills
- **State Management**: Cart and product stores handle variants correctly

The mock mode provides a complete demonstration of variant and packaging behavior without requiring a backend.