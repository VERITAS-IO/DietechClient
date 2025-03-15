/**
 * Format a number as currency
 * @param value - The number to format
 * @param locale - The locale to use for formatting (defaults to browser locale)
 * @param currency - The currency code to use (defaults to USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  locale?: string,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a date to a string
 * @param date - The date to format
 * @param locale - The locale to use for formatting (defaults to browser locale)
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(
    locale, 
    options || defaultOptions
  ).format(dateObj);
};

/**
 * Format a number with specified decimal places
 * @param value - The number to format
 * @param decimalPlaces - Number of decimal places to include
 * @param locale - The locale to use for formatting (defaults to browser locale)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  decimalPlaces: number = 2,
  locale?: string
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Format a percentage value
 * @param value - The decimal value to format as percentage (e.g., 0.25 for 25%)
 * @param decimalPlaces - Number of decimal places to include
 * @param locale - The locale to use for formatting (defaults to browser locale)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimalPlaces: number = 1,
  locale?: string
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}; 