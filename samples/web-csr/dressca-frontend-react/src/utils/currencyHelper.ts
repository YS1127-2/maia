/**
 * Formats a price value to Japanese Yen currency format
 * @param price - The price to format (optional)
 * @returns Formatted currency string or empty string if price is undefined
 */
export function toCurrencyJPY(price?: number): string {
  if (price === undefined || price === null) {
    return ''
  }

  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(price)
}
