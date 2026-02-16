/**
 * Advent of Code – Day 03, Part 2
 * https://adventofcode.com/2025/day/3
 *
 * Greedy selection of maximum digits to form highest value
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const DIGITS_TO_PICK = 12;

function main() {
  const tStart = performance.now();

  let total = 0;

  for (const line of LINES) {
    const pickedDigits = pickMaxDigitsGreedy(line, DIGITS_TO_PICK);
    const value = Number(pickedDigits.join(''));
    total += value;
  }

  const tEnd = performance.now();
  console.log('Answer:', total);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function pickMaxDigitsGreedy(bank, count) {
  const chosen = [];

  let startIndex = 0;

  for (let chosenSoFar = 0; chosenSoFar < count; chosenSoFar++) {
    const remainingToPick = count - chosenSoFar - 1;
    const endIndex = bank.length - 1 - remainingToPick;

    const { maxDigit, nextStartIndex } = findMaxDigitInRange(bank, startIndex, endIndex);

    chosen.push(maxDigit);
    startIndex = nextStartIndex;
  }

  return chosen;
}

function findMaxDigitInRange(bank, start, end) {
  let bestIndex = start;
  let bestDigit = bank[start];

  for (let i = start + 1; i <= end; i++) {
    if (bank[i] > bestDigit) {
      bestDigit = bank[i];
      bestIndex = i;
    }
  }

  return { maxDigit: bestDigit, nextStartIndex: bestIndex + 1 };
}
