/**
 * Advent of Code – Day 06, Part 1
 * https://adventofcode.com/2025/day/6
 *
 * Transpose token grid and evaluate each column expression
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const OPERATORS = {
  ADD: '+',
  MULTIPLY: '*',
};

function main() {
  const tStart = performance.now();

  const tokenGrid = parseTokenGrid(LINES);
  const columns = transposeMatrix(tokenGrid);

  const result = columns.reduce((total, column) => total + evaluate(column), 0);

  const tEnd = performance.now();

  console.log('Answer:', result);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function parseTokenGrid(inputLines) {
  return inputLines.map((line) => line.trim().split(/\s+/));
}

function transposeMatrix(matrix) {
  return matrix[0].map((_, col) => matrix.map((row) => row[col]));
}

function evaluate(columnTokens) {
  const operator = columnTokens.at(-1);
  const operands = columnTokens.slice(0, -1).map(Number);

  switch (operator) {
    case OPERATORS.ADD:
      return operands.reduce((acc, n) => acc + n, 0);

    case OPERATORS.MULTIPLY:
      return operands.reduce((acc, n) => acc * n, 1);
  }
}
