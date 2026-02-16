/**
 * Advent of Code – Day 9, Part 2
 * https://adventofcode.com/2025/day/9
 *
 * Brute-force AABB (Axis-Aligned Bounding Boxes) rectangle search with collision rejection.
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

function main() {
  const tStart = performance.now();

  const path = LINES.map(parsePoint);
  const maxArea = findMaxValidRectangleArea(path);

  const tEnd = performance.now();
  console.log('Answer:', maxArea);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function parsePoint(line) {
  const [x, y] = line.split(',');
  return [Number(x), Number(y)];
}

function findMaxValidRectangleArea(path) {
  let best = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];

    for (let j = i + 1; j < path.length; j++) {
      const b = path[j];

      const candidate = makeAabb(a, b);

      if (!candidateOverlapsAnySegmentAabb(candidate, path, i, j)) {
        const area = rectangleAreaInclusive(a, b);
        if (area > best) best = area;
      }
    }
  }

  return best;
}

function rectangleAreaInclusive(a, b) {
  const width = inclusiveDistance(a[0], b[0]);
  const height = inclusiveDistance(a[1], b[1]);
  return width * height;
}

function inclusiveDistance(p1, p2) {
  return Math.abs(p1 - p2) + 1;
}

function makeAabb(a, b) {
  return {
    left: Math.min(a[0], b[0]),
    right: Math.max(a[0], b[0]),
    top: Math.min(a[1], b[1]),
    bottom: Math.max(a[1], b[1]),
  };
}

function candidateOverlapsAnySegmentAabb(candidate, path, skipIndexA, skipIndexB) {
  for (let k = 0; k < path.length; k++) {
    if (k === skipIndexA || k === skipIndexB) continue;

    const nextIndex = (k + 1) % path.length;
    const segmentBox = makeAabb(path[k], path[nextIndex]);

    if (boxesOverlap(candidate, segmentBox)) {
      return true;
    }
  }

  return false;
}

function boxesOverlap(a, b) {
  const overlapsX = a.left < b.right && a.right > b.left;
  const overlapsY = a.top < b.bottom && a.bottom > b.top;

  return overlapsX && overlapsY;
}
