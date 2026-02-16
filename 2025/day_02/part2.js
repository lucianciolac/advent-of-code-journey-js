/**
 * Advent of Code – Day 02, Part 2
 * https://adventofcode.com/2025/day/2
 *
 * Recursively detect repeated digit groups within numeric IDs
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

function main() {
  const tStart = performance.now();

  const ranges = parseRanges(LINES[0]);

  let sumOfInvalidIds = 0;

  for (const { start, end } of ranges) {
    for (let id = start; id <= end; id++) {
      if (isInvalidId(id)) {
        sumOfInvalidIds += id;
      }
    }
  }

  const tEnd = performance.now();

  console.log('Answer:', sumOfInvalidIds);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function parseRanges(line) {
  return line.split(',').map(parseRange);
}

function parseRange(rangeText) {
  const [startText, endText] = rangeText.split('-');
  return {
    start: Number(startText),
    end: Number(endText),
  };
}

function isInvalidId(id, groupSize = 1, groupOffset = 1) {
  const idString = String(id);
  const idLength = idString.length;

  const start = groupSize * groupOffset;
  const leftGroup = idString.slice(0, groupSize);
  const rightGroup = idString.slice(start, start + groupSize);

  const reachedEnd = start >= idLength - groupSize;

  if (leftGroup === rightGroup) {
    if (reachedEnd) return true;
    return isInvalidId(id, groupSize, groupOffset + 1);
  }

  if (reachedEnd) return false;

  return isInvalidId(id, groupSize + 1, 1);
}
