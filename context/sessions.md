# Sessions

## 2026-10-30 — Split coincli into ES modules under `src/`

**Goal:** Refactor `coincli/index.js` (single-file script printing the top 5
coins from CoinGecko) for readability and maintainability. Split it into
focused ES modules, keep the output identical, and add no dependencies.

**Starting point:** The split had already been drafted (uncommitted) into
`coincli/lib/`, with `coincli/package.json` set to `"type": "module"`.

**What changed:**

- Moved `coincli/lib/` to `coincli/src/` and updated the imports in
  `coincli/index.js`.
- Module layout:
  - `src/api.js`: `fetchTopCoins()`, the CoinGecko `/coins/markets` request
  - `src/format.js`: `formatPrice`, `formatChange`, `colorizeChange`
  - `src/table.js`: `renderCoinTable()`, which builds the rows and draws the box table
  - `src/config.js`: shared `TOP_N` and `CURRENCY` defaults (used by `api` and `format`)
- `index.js` is now only the entry point: fetch, print the heading, table and footer, and handle errors.

**Verification:** Ran the original `index.js` from `HEAD` and the new version
with a stubbed `fetch` and a fixed date. The output was byte-for-byte identical,
including null prices and changes, small prices and negative changes. The error
path (HTTP 429) prints the same message and exits with code 1 in both. ANSI
colouring only applies on a TTY, so the comparison didn't cover it, but that
code is unchanged.

**State at end of session:**

- Nothing committed. Uncommitted: `coincli/index.js` (modified), and
  `coincli/src/` and `coincli/package.json` (new).
- An untracked root `package.json` (an `npm init` default) exists. It isn't
  part of this change.
- Run with `cd coincli && npm start` (Node >= 18 for global `fetch`).
