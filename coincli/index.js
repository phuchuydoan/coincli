#!/usr/bin/env node
'use strict';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const TOP_N = 5;
const CURRENCY = 'usd';

// ---------- Data ----------

async function fetchTopCoins(limit = TOP_N, currency = CURRENCY) {
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

// ---------- Formatting ----------

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: CURRENCY.toUpperCase(),
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

function formatPrice(value) {
  return value == null ? 'N/A' : priceFormatter.format(value);
}

function formatChange(value) {
  if (value == null) return 'N/A';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function colorizeChange(text, value) {
  if (!process.stdout.isTTY || value == null) return text;
  const color = value >= 0 ? 32 : 31; // green / red
  return `\x1b[${color}m${text}\x1b[0m`;
}

// ---------- Table rendering ----------

const COLUMNS = [
  { header: '#', align: 'right' },
  { header: 'Name', align: 'left' },
  { header: 'Price', align: 'right' },
  { header: '24h Change', align: 'right' },
];

function toRows(coins) {
  return coins.map((coin, index) => ({
    cells: [
      String(index + 1),
      `${coin.name} (${coin.symbol.toUpperCase()})`,
      formatPrice(coin.current_price),
      formatChange(coin.price_change_percentage_24h),
    ],
    change: coin.price_change_percentage_24h,
  }));
}

function pad(text, width, align) {
  return align === 'right' ? text.padStart(width) : text.padEnd(width);
}

function renderTable(rows) {
  const widths = COLUMNS.map((col, i) =>
    Math.max(col.header.length, ...rows.map((row) => row.cells[i].length))
  );

  const border = (left, mid, right) =>
    left + widths.map((w) => '─'.repeat(w + 2)).join(mid) + right;

  const line = (cells) =>
    '│' + cells.map((cell) => ` ${cell} `).join('│') + '│';

  const header = line(COLUMNS.map((col, i) => pad(col.header, widths[i], col.align)));

  const body = rows.map((row) =>
    line(
      row.cells.map((cell, i) => {
        const padded = pad(cell, widths[i], COLUMNS[i].align);
        // Colorize after padding so ANSI codes don't skew column widths.
        return i === COLUMNS.length - 1 ? colorizeChange(padded, row.change) : padded;
      })
    )
  );

  return [
    border('┌', '┬', '┐'),
    header,
    border('├', '┼', '┤'),
    ...body,
    border('└', '┴', '┘'),
  ].join('\n');
}

// ---------- Entry point ----------

async function main() {
  try {
    const coins = await fetchTopCoins();
    console.log(`\nTop ${TOP_N} cryptocurrencies by market cap\n`);
    console.log(renderTable(toRows(coins)));
    console.log(`\nData provided by CoinGecko · ${new Date().toLocaleString()}\n`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
