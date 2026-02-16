/**
 * Advent of Code – Day 8, Part 2
 * https://adventofcode.com/2025/day/8
 */

/**
 * Kruskal-style circuit merging until fully connected
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

function main() {
  const tStart = performance.now();

  const positions = parsePositions(LINES);
  const sortedPairs = getAllPairsSortedByDistance(positions);

  const answer = findDistanceFromWall(sortedPairs, positions);

  const tEnd = performance.now();
  console.log('Answer:', answer);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function parsePositions(lines) {
  return lines.map((line) => line.split(',').map(Number));
}

function getAllPairsSortedByDistance(positions) {
  const pairs = [];
  const n = positions.length;

  for (let a = 0; a < n - 1; a++) {
    const [x1, y1, z1] = positions[a];

    for (let b = a + 1; b < n; b++) {
      const [x2, y2, z2] = positions[b];

      const dx = x1 - x2;
      const dy = y1 - y2;
      const dz = z1 - z2;

      const distance2 = dx * dx + dy * dy + dz * dz;

      pairs.push({ distance2, a, b });
    }
  }

  pairs.sort((p, q) => p.distance2 - q.distance2);
  return pairs;
}

function findDistanceFromWall(sortedPairs, positions) {
  const n = positions.length;

  const { connect } = makeUnionFind(n);

  let connectedComponents = n;

  for (const { a, b } of sortedPairs) {
    const merged = connect(a, b);
    if (!merged) continue;

    connectedComponents -= 1;

    // When there's only 1 component left, everything is connected
    if (connectedComponents === 1) {
      return positions[a][0] * positions[b][0];
    }
  }
}

function makeUnionFind(n) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = Array.from({ length: n }, () => 1);

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
    if (rootA === rootB) return false;

    // Attach smaller group to larger one
    if (size[rootA] < size[rootB]) {
      [rootA, rootB] = [rootB, rootA];
    }

    parent[rootB] = rootA;
    size[rootA] += size[rootB];
    return true;
  }

  return { connect };
}
