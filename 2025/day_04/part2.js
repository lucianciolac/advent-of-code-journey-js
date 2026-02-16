/**
 * Advent of Code – Day 04, Part 2
 * https://adventofcode.com/2025/day/4
 *
 * Iteratively remove cells with fewer than four matching neighbors
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const ROLL_CHAR = '@';
const EMPTY_CHAR = '.';
const MIN_NEIGHBORS_TO_SURVIVE = 4;

const NEIGHBOR_OFFSETS = [
  [-1, 0], // up
  [1, 0], // down
  [0, -1], // left
  [0, 1], // right
  [-1, -1], // up-left
  [-1, 1], // up-right
  [1, -1], // down-left
  [1, 1], // down-right
];

function main() {
  const tStart = performance.now();

  const grid = parseGrid(LINES);
  const answer = countTotalRemovedCells(grid);

  const tEnd = performance.now();
  console.log('Answer:', answer);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

function parseGrid(lines) {
  return lines.map((line) => line.split(''));
}

function countTotalRemovedCells(grid) {
  let totalRemoved = 0;

  while (true) {
    const toRemove = computeRemovalMask(grid);
    const removedThisStep = applyRemovalMask(grid, toRemove);
    totalRemoved += removedThisStep;

    if (removedThisStep === 0) break;
  }

  return totalRemoved;
}

function computeRemovalMask(grid) {
  const rowCount = grid.length;
  const colCount = grid[0].length;

  const mask = Array.from({ length: rowCount }, () => Array(colCount).fill(false));

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (grid[row][col] !== ROLL_CHAR) continue;

      const neighbors = countMatchingNeighbors(grid, row, col, ROLL_CHAR);

      if (neighbors < MIN_NEIGHBORS_TO_SURVIVE) {
        mask[row][col] = true;
      }
    }
  }

  return mask;
}

function countMatchingNeighbors(grid, row, col, targetChar) {
  const rowCount = grid.length;
  const colCount = grid[0].length;

  let count = 0;

  for (const [dRow, dCol] of NEIGHBOR_OFFSETS) {
    const nRow = row + dRow;
    const nCol = col + dCol;

    if (!isInsideGrid(nRow, nCol, rowCount, colCount)) continue;
    if (grid[nRow][nCol] !== targetChar) continue;

    count++;
  }

  return count;
}

function isInsideGrid(row, col, rowCount, colCount) {
  return row >= 0 && row < rowCount && col >= 0 && col < colCount;
}

function applyRemovalMask(grid, mask) {
  const rowCount = grid.length;
  const colCount = grid[0].length;

  let removed = 0;

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (!mask[row][col]) continue;

      grid[row][col] = EMPTY_CHAR;
      removed++;
    }
  }

  return removed;
}

main();
