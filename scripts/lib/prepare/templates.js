export function renderSolutionTemplate({ year, day, part }) {
  return `/**
 * Advent of Code – Day ${day}, Part ${part}
 * https://adventofcode.com/${year}/day/${Number(day)}
 */

// Uncomment as needed
// import fs from 'node:fs';
// const inputText = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
// const lines = inputText.split(/\\r?\\n/);

function main() {
  const tStart = performance.now();

  // YOUR CODE HERE

  const answer = undefined;

  const tEnd = performance.now();
  console.log('Answer:', answer);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();
`;
}
