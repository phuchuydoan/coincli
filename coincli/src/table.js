import { colorizeChange, formatChange, formatPrice } from './format.js';

const COLUMNS = [
  { header: '#', align: 'right' },
  { header: 'Name', align: 'left' },
  { header: 'Price', align: 'right' },
  { header: '24h Change', align: 'right' },
];

const CHANGE_COLUMN = COLUMNS.length - 1;

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

function columnWidths(rows) {
  return COLUMNS.map((col, i) =>
    Math.max(col.header.length, ...rows.map((row) => row.cells[i].length))
  );
}

function border(widths, left, mid, right) {
  return left + widths.map((w) => '─'.repeat(w + 2)).join(mid) + right;
}

function line(cells) {
  return '│' + cells.map((cell) => ` ${cell} `).join('│') + '│';
}

function renderRow(row, widths) {
  return line(
    row.cells.map((cell, i) => {
      const padded = pad(cell, widths[i], COLUMNS[i].align);
      // Colorize after padding so ANSI codes don't skew column widths.
      return i === CHANGE_COLUMN ? colorizeChange(padded, row.change) : padded;
    })
  );
}

export function renderCoinTable(coins) {
  const rows = toRows(coins);
  const widths = columnWidths(rows);
  const header = line(COLUMNS.map((col, i) => pad(col.header, widths[i], col.align)));

  return [
    border(widths, '┌', '┬', '┐'),
    header,
    border(widths, '├', '┼', '┤'),
    ...rows.map((row) => renderRow(row, widths)),
    border(widths, '└', '┴', '┘'),
  ].join('\n');
}
