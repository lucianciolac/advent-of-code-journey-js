/**
 * Advent of Code – Day 9, Part 1
 * https://adventofcode.com/2025/day/9
 *
 * Brute-force maximum rectangle area from all point pairs
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

function main() {
  const tStart = performance.now();

  const points = LINES.map(parsePoint);
  const maxArea = findMaxRectangleArea(points);

  const tEnd = performance.now();
  console.log('Answer:', maxArea);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function parsePoint(line) {
  const [x, y] = line.split(',');
  return [Number(x), Number(y)];
}

function findMaxRectangleArea(points) {
  let best = 0;

  for (let i = 0; i < points.length; i++) {
    const a = points[i];

    for (let j = i + 1; j < points.length; j++) {
      const b = points[j];

      const area = rectangleAreaInclusive(a, b);
      if (area > best) best = area;
    }
  }

  return best;
}

function rectangleAreaInclusive(a, b) {
  const width = inclusiveDistance(a[0], b[0]);
  const height = inclusiveDistance(a[1], b[1]);

  return width * height;
}

/**
 * Inclusive distance between coordinates on a grid.
 * From 3 to 3 => 1 tile, from 3 to 4 => 2 tiles.
 */
function inclusiveDistance(p1, p2) {
  return Math.abs(p1 - p2) + 1;
}
