/**
 * Advent of Code – Day 12, Part 1
 * https://adventofcode.com/2025/day/12
 *
 * Checks which regions have enough area to hold the presents. A present is 3x3 in size.
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n\r?\n/);

const PRESENT_SIDE = 3;
const PRESENT_AREA = PRESENT_SIDE * PRESENT_SIDE;

function main() {
  const tStart = performance.now();

  const regionsBlock = LINES[LINES.length - 1];
  const regionLines = regionsBlock.split(/\r?\n/);

  let viableRegionCount = 0;

  for (const line of regionLines) {
    const region = parseRegionLine(line);
    if (isRegionViable(region)) {
      viableRegionCount++;
    }
  }

  const tEnd = performance.now();
  console.log('Answer:', viableRegionCount);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

function extractIntegers(line) {
  return line.match(/\d+/g).map(Number);
}

function parseRegionLine(line) {
  const numbers = extractIntegers(line);

  const width = numbers[0];
  const height = numbers[1];

  const PRESENT_COUNTS_START_INDEX = 3;
  const presentCounts = numbers.slice(PRESENT_COUNTS_START_INDEX);
  const totalPresents = presentCounts.reduce((sum, n) => sum + n, 0);

  return { width, height, totalPresents };
}

function isRegionViable({ width, height, totalPresents }) {
  const regionArea = width * height;
  const requiredArea = totalPresents * PRESENT_AREA;

  return regionArea >= requiredArea;
}

main();
