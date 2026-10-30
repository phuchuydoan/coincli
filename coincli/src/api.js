import { CURRENCY, TOP_N } from './config.js';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

export async function fetchTopCoins(limit = TOP_N, currency = CURRENCY) {
  const params = new URLSearchParams({
    vs_currency: currency,
    order: 'market_cap_desc',
    per_page: String(limit),
    page: '1',
    price_change_percentage: '24h',
  });

  const response = await fetch(`${API_URL}?${params}`, {
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
