/**
 * Advent of Code – Day 01, Part 2
 * https://adventofcode.com/2025/day/1
 *
 * Simulate circular dial movement and count boundary crossings
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const DIAL_SIZE = 100;
const MIN_POSITION = 0;
const MAX_POSITION = DIAL_SIZE - 1;
const START_POSITION = 50;

const DIRECTION_LEFT = 'L';
const DIRECTION_RIGHT = 'R';

function main() {
  const tStart = performance.now();

  let position = START_POSITION;
  let boundaryCrossCount = 0;

  for (let i = 0; i < LINES.length; i++) {
    const instruction = LINES[i];

    const direction = instruction[0];
    const steps = Number(instruction.slice(1));

    for (let step = 0; step < steps; step++) {
      if (direction === DIRECTION_LEFT) position--;
      else if (direction === DIRECTION_RIGHT) position++;

      if (position < MIN_POSITION || position > MAX_POSITION) {
        boundaryCrossCount++;
      }

      position = wrapDial(position);
    }
  }

  const tEnd = performance.now();

  console.log('Answer:', boundaryCrossCount);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function wrapDial(position) {
  if (position < MIN_POSITION) return MAX_POSITION;
  if (position > MAX_POSITION) return MIN_POSITION;
  return position;
}
