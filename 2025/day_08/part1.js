/**
 * Advent of Code – Day 8, Part 1
 * https://adventofcode.com/2025/day/8
 */

/**
 * Nearest-neighbor graph merging to find largest connected circuits
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const PAIRS_TO_CONNECT = 1000;
const GROUPS_TO_MULTIPLY = 3;

function main() {
  const tStart = performance.now();

  const positions = parsePositions(LINES);
  const nearestPairs = findNearestPairs(positions, PAIRS_TO_CONNECT);

  const groupSizes = findConnectedGroupSizes(positions.length, nearestPairs);
  groupSizes.sort((a, b) => b - a);

  const answer = groupSizes
    .slice(0, GROUPS_TO_MULTIPLY)
    .reduce((product, size) => product * size, 1);

  const tEnd = performance.now();
  console.log('Answer:', answer);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function parsePositions(lines) {
  return lines.map((line) => line.split(',').map(Number));
}

function findNearestPairs(positions, maxPairs) {
  const pairs = [];

  for (let a = 0; a < positions.length - 1; a++) {
    const [x1, y1, z1] = positions[a];

    for (let b = a + 1; b < positions.length; b++) {
      const [x2, y2, z2] = positions[b];

      const dx = x1 - x2;
      const dy = y1 - y2;
      const dz = z1 - z2;

      const distance2 = dx * dx + dy * dy + dz * dz;

      pairs.push({ distance2, a, b });
    }
  }

  pairs.sort((p, q) => p.distance2 - q.distance2);
  return pairs.slice(0, maxPairs);
}

function findConnectedGroupSizes(nodeCount, pairs) {
  const parent = Array.from({ length: nodeCount }, (_, i) => i);
  const size = Array.from({ length: nodeCount }, () => 1);

  function findRoot(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }

  function connect(a, b) {
    let rootA = findRoot(a);
    let rootB = findRoot(b);
    if (rootA === rootB) return;

    // Attach smaller group to larger one
    if (size[rootA] < size[rootB]) {
      [rootA, rootB] = [rootB, rootA];
    }

    parent[rootB] = rootA;
    size[rootA] += size[rootB];
  }

  for (const { a, b } of pairs) {
    connect(a, b);
  }

  const sizesByRoot = new Map();
  for (let i = 0; i < nodeCount; i++) {
    const root = findRoot(i);
    sizesByRoot.set(root, (sizesByRoot.get(root) ?? 0) + 1);
  }

  return [...sizesByRoot.values()];
}
