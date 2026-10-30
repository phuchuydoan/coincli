#!/usr/bin/env node
import { fetchTopCoins } from './src/api.js';
import { parseCount } from './src/args.js';
import { renderCoinTable } from './src/table.js';

async function main() {
  try {
    const count = parseCount(process.argv[2]);
    const coins = await fetchTopCoins(count);
    console.log(`\nTop ${count} cryptocurrencies by market cap\n`);
    console.log(renderCoinTable(coins));
    console.log(`\nData provided by CoinGecko · ${new Date().toLocaleString()}\n`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
