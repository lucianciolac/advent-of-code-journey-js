/**
 * Advent of Code – Day 07, Part 1
 * https://adventofcode.com/2025/day/7
 *
 * Recursive beam propagation through grid with splitter counting
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const CELL = {
  SOURCE: 'S',
  EMPTY: '.',
  SPLITTER: '^',
  BEAM: '|',
};

function main() {
  const tStart = performance.now();

  const grid = makeGrid(LINES);
  const source = findSource(grid);

  let splitterCount = 0;
  splitterCount = propagateBeamDown(grid, source.row + 1, source.col);

  const tEnd = performance.now();

  console.log('Answer:', splitterCount);
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

function isInside(world, row, col) {
  return row >= 0 && col >= 0 && row < world.height && col < world.width;
}

function findSource(world) {
  for (let row = 0; row < world.height; row++) {
    for (let col = 0; col < world.width; col++) {
      if (world.grid[row][col] === CELL.SOURCE) return { row, col };
    }
  }
}

function propagateBeamDown(world, startRow, startCol) {
  let row = startRow;
  let col = startCol;

  while (isInside(world, row, col)) {
    const cell = world.grid[row][col];

    if (cell === CELL.EMPTY) {
      world.grid[row][col] = CELL.BEAM;
      row += 1;
      continue;
    }

    if (cell === CELL.SPLITTER) {
      if (isInside(world, row, col - 1)) world.grid[row][col - 1] = CELL.BEAM;
      if (isInside(world, row, col + 1)) world.grid[row][col + 1] = CELL.BEAM;

      const leftSplits = propagateBeamDown(world, row + 1, col - 1);
      const rightSplits = propagateBeamDown(world, row + 1, col + 1);

      return 1 + leftSplits + rightSplits;
    }

    return 0;
  }

  return 0;
}
