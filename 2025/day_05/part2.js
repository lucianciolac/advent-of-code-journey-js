/**
 * Advent of Code – Day 05, Part 2
 * https://adventofcode.com/2025/day/5
 *
 * Merge sorted intervals and count total unique coverage
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

function main() {
  const tStart = performance.now();

  const ranges = parseRanges(LINES);
  const answer = countUniqueCoverage(ranges);

  const tEnd = performance.now();
  console.log('Answer:', answer);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function parseRanges(lines) {
  const rangeLines = lines.filter((line) => line.includes('-'));

  const ranges = rangeLines.map((line) => {
    const [start, end] = line.split('-').map(Number);
    return { start, end };
  });

  // Sort so we can merge in a single pass
  ranges.sort((a, b) => a.start - b.start || a.end - b.end);

  return ranges;
}

function countUniqueCoverage(sortedRanges) {
  let totalCovered = 0;
  let coveredEnd = -Infinity;

  for (const range of sortedRanges) {
    const { start, end } = range;

    // Case 1: Range is completely after what we've covered so far (no overlap)
    if (start > coveredEnd) {
      totalCovered += end - start + 1; // add full range
      coveredEnd = end;
      continue;
    }

    // Case 2: Range overlaps, but extends coverage further to the right
    if (end > coveredEnd) {
      totalCovered += end - coveredEnd; // only count the new part
      coveredEnd = end;
    }
  }

  return totalCovered;
}
