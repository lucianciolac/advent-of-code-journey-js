/**
 * Advent of Code – Day 04, Part 1
 * https://adventofcode.com/2025/day/4
 *
 * Count grid cells with fewer than four matching neighbors
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const ROLL_CHAR = '@';
const MIN_MATCHING_NEIGHBORS = 4;

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
  const answer = countCellsWithFewNeighbors(grid);

  const tEnd = performance.now();
  console.log('Answer:', answer);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

function parseGrid(lines) {
  return lines.map((line) => line.split(''));
}

function countCellsWithFewNeighbors(grid) {
  const rowCount = grid.length;
  const colCount = grid[0].length;

  let markedCount = 0;

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (grid[row][col] !== ROLL_CHAR) continue;

      const matchingNeighbors = countMatchingNeighbors(
        grid,
        row,
        col,
        rowCount,
        colCount,
        ROLL_CHAR
      );

      if (matchingNeighbors < MIN_MATCHING_NEIGHBORS) {
        markedCount++;
      }
    }
  }

  return markedCount;
}

function countMatchingNeighbors(grid, row, col, rowCount, colCount, targetChar) {
  let count = 0;

  for (const [dRow, dCol] of NEIGHBOR_OFFSETS) {
    const neighborRow = row + dRow;
    const neighborCol = col + dCol;

    if (!isInsideGrid(neighborRow, neighborCol, rowCount, colCount)) continue;
    if (grid[neighborRow][neighborCol] !== targetChar) continue;

    count++;
  }

  return count;
}

function isInsideGrid(row, col, rowCount, colCount) {
  return row >= 0 && row < rowCount && col >= 0 && col < colCount;
}

main();
