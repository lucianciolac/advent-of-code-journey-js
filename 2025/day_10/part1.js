/**
 * Advent of Code – Day 10, Part 1
 * https://adventofcode.com/2025/day/10
 *
 * Breadth-first search (BFS) to find the minimum button presses to reach the target state.
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const OFF = '.';
const ON = '#';

function main() {
  const tStart = performance.now();

  let totalMinPresses = 0;

  for (const line of LINES) {
    const puzzle = parseLine(line);
    totalMinPresses += minPressesBfs(puzzle.start, puzzle.target, puzzle.buttons);
  }

  const tEnd = performance.now();
  console.log('Answer:', totalMinPresses);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function parseLine(line) {
  const target = extractTargetState(line);
  const start = OFF.repeat(target.length);
  const buttons = extractButtons(line);

  return { start, target, buttons };
}

function extractTargetState(line) {
  const openBracket = line.indexOf('[');
  const closeBracket = line.indexOf(']');
  return line.slice(openBracket + 1, closeBracket);
}

function extractButtons(line) {
  const buttons = [];
  const regex = /\(([0-9,]+)\)/g;

  for (const match of line.matchAll(regex)) {
    const indices = match[1].split(',').map(Number);
    buttons.push(indices);
  }

  return buttons;
}

function applyButton(state, toggleIndices) {
  const chars = state.split('');

  for (const idx of toggleIndices) {
    chars[idx] = chars[idx] === ON ? OFF : ON;
  }

  return chars.join('');
}

function minPressesBfs(start, target, buttons) {
  if (start === target) return 0;

  const visited = new Set([start]);
  const queue = [{ state: start, presses: 0 }];
  let queueHead = 0;

  while (queueHead < queue.length) {
    const { state, presses } = queue[queueHead++];

    for (const button of buttons) {
      const nextState = applyButton(state, button);
      if (visited.has(nextState)) continue;

      const nextPresses = presses + 1;
      if (nextState === target) return nextPresses;

      visited.add(nextState);
      queue.push({ state: nextState, presses: nextPresses });
    }
  }
}
