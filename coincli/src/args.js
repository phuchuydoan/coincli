import { MAX_N, TOP_N } from './config.js';

export function parseCount(arg) {
  if (arg === undefined) return TOP_N;

  const count = Number(arg);
  if (!/^\d+$/.test(arg) || count < 1 || count > MAX_N) {
    throw new Error(`Number of coins must be a whole number between 1 and ${MAX_N} (got "${arg}")`);
  }

  return count;
}
