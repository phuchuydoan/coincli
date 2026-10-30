import { CURRENCY } from './config.js';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: CURRENCY.toUpperCase(),
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

export function formatPrice(value) {
  return value == null ? 'N/A' : priceFormatter.format(value);
}

export function formatChange(value) {
  if (value == null) return 'N/A';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function colorizeChange(text, value) {
  if (!process.stdout.isTTY || value == null) return text;
  const color = value >= 0 ? 32 : 31; // green / red
  return `\x1b[${color}m${text}\x1b[0m`;
}
