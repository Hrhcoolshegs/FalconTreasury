export const safeNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);

  if (isNaN(parsed) || !isFinite(parsed)) {
    return defaultValue;
  }

  return parsed;
};

export const safeInteger = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = typeof value === 'string' ? parseInt(value, 10) : Math.floor(Number(value));

  if (isNaN(parsed) || !isFinite(parsed)) {
    return defaultValue;
  }

  return parsed;
};

export const safeDivide = (numerator: number, denominator: number, defaultValue: number = 0): number => {
  if (denominator === 0 || isNaN(numerator) || isNaN(denominator) || !isFinite(numerator) || !isFinite(denominator)) {
    return defaultValue;
  }

  const result = numerator / denominator;

  if (isNaN(result) || !isFinite(result)) {
    return defaultValue;
  }

  return result;
};

export const formatCurrency = (value: any, currency: 'NGN' | 'USD' = 'NGN', decimals: number = 2): string => {
  const num = safeNumber(value, 0);
  const symbol = currency === 'NGN' ? '₦' : '$';

  return `${symbol}${num.toFixed(decimals)}`;
};

export const formatLargeNumber = (value: any, currency: 'NGN' | 'USD' = 'NGN'): string => {
  const num = safeNumber(value, 0);
  const symbol = currency === 'NGN' ? '₦' : '$';

  if (num >= 1000000000) {
    return `${symbol}${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `${symbol}${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${symbol}${(num / 1000).toFixed(2)}K`;
  }

  return `${symbol}${num.toFixed(2)}`;
};
