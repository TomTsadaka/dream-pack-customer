import type { Currency, Locale } from '@/stores/settings';

/**
 * Convert amount from ILS (base currency) to target currency
 * @param amountILS - Amount in ILS (base currency)
 * @param currency - Target currency code
 * @param rates - Exchange rates object (base ILS)
 * @returns Converted amount in target currency
 */
export function convertFromILS(
  amountILS: number, 
  currency: Currency, 
  rates: Record<string, number>
): number {
  if (!amountILS || isNaN(amountILS)) return 0;
  
  const rate = rates[currency];
  if (!rate || isNaN(rate)) return 0;
  
  return amountILS * rate;
}

/**
 * Format money amount with proper currency symbol and locale formatting
 * @param amountILS - Amount in ILS (base currency)
 * @param currency - Target currency code
 * @param locale - Locale for formatting
 * @param rates - Exchange rates object (base ILS)
 * @returns Formatted money string
 */
export function formatMoney(
  amountILS: number,
  currency: Currency,
  locale: Locale,
  rates: Record<string, number>
): string {
  const convertedAmount = convertFromILS(amountILS, currency, rates);
  
  // Configure locale for number formatting
  const numberLocale = locale === 'he' ? 'he-IL' : 'en-US';
  
  // Create formatter with currency
  const formatter = new Intl.NumberFormat(numberLocale, {
    style: 'currency',
    currency: getCurrencyCode(currency),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(convertedAmount);
}

/**
 * Get proper currency code for Intl.NumberFormat
 * @param currency - Currency code
 * @returns ISO currency code
 */
function getCurrencyCode(currency: Currency): string {
  switch (currency) {
    case 'ILS':
      return 'ILS';
    case 'USD':
      return 'USD';
    case 'PHP':
      return 'PHP';
    default:
      return 'ILS';
  }
}

/**
 * Get currency symbol for display
 * @param currency - Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'ILS':
      return '₪';
    case 'USD':
      return '$';
    case 'PHP':
      return '₱';
    default:
      return '₪';
  }
}

/**
 * Calculate discount percentage (always based on base ILS prices)
 * @param originalPriceILS - Original price in ILS
 * @param salePriceILS - Sale price in ILS
 * @returns Discount percentage (0-100)
 */
export function calculateDiscountPercent(
  originalPriceILS: number,
  salePriceILS: number
): number {
  if (!originalPriceILS || !salePriceILS || originalPriceILS <= salePriceILS) {
    return 0;
  }
  
  const discount = originalPriceILS - salePriceILS;
  return Math.round((discount / originalPriceILS) * 100);
}