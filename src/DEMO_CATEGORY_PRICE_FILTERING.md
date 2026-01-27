# Category & Price Filter Testing Guide

## Testing the Packaging Industry Categories & Price Range Filters

This document provides step-by-step instructions for testing the new category and price filtering functionality.

## 🧪 A. Category Filtering Tests

### A.1 Test Category Navigation
1. Navigate to `/shop` page
2. Verify side navigation shows these parent categories:
   - Flexible Packaging
   - Rigid Packaging  
   - Bottles & Containers
   - Protective Packaging
   - Shelf-ready & Retail Packaging

3. Click each category and verify:
   - Products filter to show only items from that parent category
   - URL updates to `?category=Category Name` (encoded)
   - Active category is highlighted in side navigation
   - Product count updates correctly

### Expected URLs for Category Testing:
```
/shop?category=Flexible%20Packaging
/shop?category=Rigid%20Packaging
/shop?category=Bottles%20%26Containers
/shop?category=Protective%20Packaging
/shop?category=Shelf-ready%20%26Retail%20Packaging
```

## 🧪 B. Price Range Filtering Tests

### B.1 Test Price Range Controls
1. Navigate to `/shop` page
2. Locate price range filter in left sidebar:
   - Min Price input field
   - Max Price input field
   - Apply button
   - Clear button

3. Test Price Scenarios:
   - Min only: `?min=10` → Should show products >= ₱10.00
   - Max only: `?max=50` → Should show products <= ₱50.00
   - Range: `?min=10&max=50` → Should show products 10-50
   - Invalid: `?min=abc&max=xyz` → Should handle gracefully, show all products
   - Mixed with category: `?category=Flexible Packaging&min=5&max=25`

### B.2 Price Filter Logic Verification
**Important:** Price filtering must use VARIANT prices:
- If ANY variant price is within range, product is shown
- Use `salePrice` if valid and lower than `price`
- Ignore variants with no valid price (NaN, 0, etc.)

### B.3 Expected Results for Price Testing:
| Product Type | Min Price (₱) | Max Price (₱) | Products Shown |
|-------------|----------------|-------------|-------------|
| Bubble Wrap | 15.00 | 20.00 | All with price 15-20 |
| Stretch Film | 8.00 | 25.00 | Products 8-25 (none shown) |
| Boxes | 10.00 | 50.00 | All with price 10-50 |
| Bottles | 20.00 | 40.00 | Products 20-40 |

## 🧪 C. Combined Category + Price Testing

### C.1 Test Combined Filtering
1. Test `?category=Rigid Packaging&min=10&max=30`
   Expected: Only rigid packaging products priced 10-30

2. Test `?category=Flexible Packaging&min=20&max=35`
   Expected: Only flexible packaging products priced 20-35

3. Test switching between categories
   Should clear price range when category changes
   Should preserve price range when navigating back to previous category

### C.2 URL Encoding & Edge Cases
- Test special characters in category names are encoded properly
- Test empty values and edge cases:
  `?category=&min=` (should show all products with min filter)
  `?category=&max=` (should show all products with max filter)
  `?min=0` (should handle min=0 gracefully)
  `?max=0` (should handle max=0 gracefully)

## 🧪 D. Visual Testing Checklist

### D.1 Responsive Design
- Side navigation works on mobile (accordion/collapsible)
- Category buttons are properly sized and accessible
- Price inputs work on touch devices
- Grid layout adapts to different screen sizes

### D.2 Performance Testing
- Large product lists (100+ products) load quickly
- Filtering responds immediately to user input
- No flickering when updating results

### D.3 Accessibility Testing
- Category navigation is keyboard navigable
- Price inputs have proper labels
- Screen reader compatibility
- High contrast ratio maintained

## 🧪 E. Debug Mode Testing

**Debug Panel Visibility:**
- Only visible when `VITE_USE_MOCKS=true`
- Shows current filters applied
- Displays product counts accurately
- Helps verify filtering logic

## 🧪 F. Acceptance Criteria

✅ **Category Filtering:**
- [ ] All 5 parent categories appear in navigation
- [ ] Clicking category filters products correctly
- [ ] URL updates with category parameter
- [ ] Product count reflects active filter
- [ ] "All Categories" option works correctly

✅ **Price Range Filtering:**
- [ ] Min/max inputs accept valid numbers
- [ ] Apply button triggers filtering
- [ ] Clear button resets price range
- [ ] Filtering uses variant prices (not product base prices)
- [ ] Invalid input handled gracefully
- [ ] Price range preserved across page navigation

✅ **Combined Filtering:**
- [ ] Category and price filters work together
- [ ] No conflicts between filter types
- [ ] URL correctly encodes complex category names
- [ ] Results match expected products for each filter combination

✅ **UX/Performance:**
- [ ] No page reload when applying filters
- [ ] Instant visual feedback for active filters
- [ ] Responsive design works on all devices
- [ ] Loading states work properly

✅ **Data Integrity:**
- [ ] Products match their assigned parent categories
- [ ] Price calculations use correct variant values
- [ ] No duplicate products across categories
- [ ] Category names are consistent and properly formatted

## 🧪 G. Implementation Notes

### **Files Successfully Modified:**
1. `/src/types/index.ts` - Updated Product interface with category structure
2. `/src/mocks/products.ts` - Complete rewrite with real packaging categories
3. `/src/components/CategorySideNav.vue` - New category navigation component
4. `/src/pages/ShopPage.vue` - Updated to use CategorySideNav and enhanced filtering
5. `/src/services/productService.ts` - Enhanced with parent category matching
6. `/src/stores/products.ts` - Updated filtering logic and state management

### **New Product Structure:**
```typescript
interface Product {
  // ... existing fields
  category: ProductCategory;  // NEW
  parent?: string;              // NEW
  tag?: string;                 // NEW
  // ... rest of existing fields
}
```

### **Key Features Implemented:**
- Real packaging industry categories
- Parent category-based filtering
- Variant-based price range filtering
- Responsive category navigation
- URL state management
- NaN protection in price calculations
- Mock data with 100+ realistic products

This testing guide ensures all new category and price filtering functionality works as expected.