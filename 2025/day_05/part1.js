/**
 * Advent of Code – Day 05, Part 1
 * https://adventofcode.com/2025/day/5
 *
 * Count values falling within any defined numeric range
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

function main() {
  const tStart = performance.now();

  const rangeLines = LINES.filter((line) => line.includes('-'));
  const ranges = rangeLines.map((line) => {
    const [start, end] = line.split('-').map(Number);
    return { start, end };
  });

  const emptyLineIndex = LINES.indexOf('');
  const ingredientIds = LINES.slice(emptyLineIndex + 1).map(Number);

  const freshCount = countFreshIngredients(ingredientIds, ranges);

  const tEnd = performance.now();

  console.log('Answer:', freshCount);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function isIdInAnyRange(id, ranges) {
  return ranges.some((range) => {
    return id >= range.start && id <= range.end;
  });
}

function countFreshIngredients(ingredientIds, ranges) {
  let count = 0;

  for (const id of ingredientIds) {
    if (isIdInAnyRange(id, ranges)) {
      count++;
    }
  }

  return count;
}
