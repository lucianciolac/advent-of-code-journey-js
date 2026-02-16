/**
 * Advent of Code – Day 07, Part 1
 * https://adventofcode.com/2025/day/7
 *
 * Memoized recursive path counting through splitter grid
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const CELL = {
  SOURCE: 'S',
  EMPTY: '.',
  SPLITTER: '^',
};

function main() {
  const tStart = performance.now();

  const grid = makeGrid(LINES);
  const sources = findSources(grid);

  const memo = new Map();
  let total = 0;

  for (const s of sources) {
    total += countTimelines(grid, s.row + 1, s.col, memo);
  }

  const tEnd = performance.now();

  console.log('Answer:', total);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function makeGrid(lines) {
  const grid = lines.map((line) => line.split(''));
  return {
    grid,
    height: grid.length,
    width: grid[0].length,
  };
}

function isInside(grid, row, col) {
  return row >= 0 && col >= 0 && row < grid.height && col < grid.width;
}

function findSources(grid) {
  const sources = [];
  for (let row = 0; row < grid.height; row++) {
    for (let col = 0; col < grid.width; col++) {
      if (grid.grid[row][col] === CELL.SOURCE) sources.push({ row, col });
    }
  }

  return sources;
}

function dropThroughEmpty(grid, startRow, col) {
  let row = startRow;
  while (isInside(grid, row, col) && grid.grid[row][col] === CELL.EMPTY) {
    row += 1;
  }

  return row;
}

function countTimelines(grid, row, col, memo) {
  if (!isInside(grid, row, col)) return 1;

  const key = `${row},${col}`;
  if (memo.has(key)) return memo.get(key);

  const cell = grid.grid[row][col];
  let timelines = 0;

  if (cell === CELL.EMPTY) {
    const nextRow = dropThroughEmpty(grid, row, col);
    timelines = countTimelines(grid, nextRow, col, memo);
  }

  if (cell === CELL.SPLITTER) {
    const left = countTimelines(grid, row + 1, col - 1, memo);
    const right = countTimelines(grid, row + 1, col + 1, memo);
    timelines = left + right;
  }

  memo.set(key, timelines);

  return timelines;
}
