/**
 * Advent of Code – Day 06, Part 2
 * https://adventofcode.com/2025/day/6
 *
 * Parse column blocks and evaluate vertical operands by operator
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8');
const LINES = INPUT_TEXT.split(/\r?\n/);

const OPERATORS = {
  ADD: '+',
  MULTIPLY: '*',
};

function main() {
  const tStart = performance.now();

  const { padded: gridLines, width } = toCharGrid(LINES);
  const blocks = findProblemBlocks(gridLines, width);

  const bottomRow = gridLines.at(-1);

  let grandTotal = 0;

  for (let i = 0; i < blocks.length; i++) {
    const [startCol, endCol] = blocks[i];

    const operator = parseOperator(bottomRow, startCol, endCol);
    const operands = parseOperandsRightToLeft(gridLines, startCol, endCol);

    grandTotal += evaluate(operands, operator);
  }

  const tEnd = performance.now();

  console.log('Answer:', grandTotal);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function toCharGrid(lines) {
  const width = Math.max(...lines.map((l) => l.length));
  const padded = lines.map((l) => l.padEnd(width, ' '));
  return { padded, width };
}

function findProblemBlocks(gridLines, width) {
  const isSeparatorCol = (c) => gridLines.every((row) => row[c] === ' ');

  const blocks = [];
  let start = null;

  for (let c = 0; c <= width; c++) {
    const isSep = c === width || isSeparatorCol(c);

    if (!isSep && start === null) start = c;
    else if (isSep && start !== null) {
      blocks.push([start, c - 1]);
      start = null;
    }
  }

  return blocks;
}

function parseOperator(bottomRow, startCol, endCol) {
  return Array.from(bottomRow.slice(startCol, endCol + 1)).find((ch) => ch !== ' ');
}

function parseOperandsRightToLeft(gridLines, startCol, endCol) {
  const lastRowIdx = gridLines.length - 1;
  const operands = [];

  for (let c = endCol; c >= startCol; c--) {
    const digits = gridLines
      .slice(0, lastRowIdx)
      .map((row) => row[c])
      .join('');

    if (digits) operands.push(Number(digits));
  }

  return operands;
}

function evaluate(operands, operator) {
  switch (operator) {
    case OPERATORS.ADD:
      return operands.reduce((acc, n) => acc + n, 0);

    case OPERATORS.MULTIPLY:
      return operands.reduce((acc, n) => acc * n, 1);
  }
}
