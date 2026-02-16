/**
 * Advent of Code – Day 02, Part 1
 * https://adventofcode.com/2025/day/2
 *
 * Sum IDs with identical first and second halves within ranges
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
      if (hasIdenticalHalves(id)) {
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
  const [start, end] = rangeText.split('-');
  return {
    start: Number(start),
    end: Number(end),
  };
}

function hasIdenticalHalves(id) {
  const text = String(id);

  if (text.length % 2 !== 0) return false;

  const halfLength = text.length / 2;
  const firstHalf = text.slice(0, halfLength);
  const secondHalf = text.slice(halfLength);

  return firstHalf === secondHalf;
}
