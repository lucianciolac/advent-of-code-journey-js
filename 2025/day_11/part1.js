/**
 * Advent of Code – Day 11, Part 1
 * https://adventofcode.com/2025/day/11
 *
 * Depth-first search (DFS) to count the number of distinct paths from the start device to the target device.
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const DEVICE_START_LABEL = 'you';
const DEVICE_END_LABEL = 'out';

function main() {
  const tStart = performance.now();

  const graph = buildGraph(LINES);
  const pathCount = countPathsDepthFirst(graph, DEVICE_START_LABEL, DEVICE_END_LABEL);

  const tEnd = performance.now();
  console.log('Answer:', pathCount);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function buildGraph(lines) {
  const graph = {};

  for (const line of lines) {
    const { device, connections } = parseLine(line);

    ensureNode(graph, device);

    for (const neighbor of connections) {
      addDirectedEdge(graph, device, neighbor);
    }
  }

  return graph;
}

function parseLine(line) {
  const match = line.match(/^(\w+):\s*(.*)$/);

  const device = match[1];
  const connections = match[2].split(/\s+/);

  return { device, connections };
}

function ensureNode(graph, label) {
  if (!graph[label]) graph[label] = [];
}

function addDirectedEdge(graph, from, to) {
  ensureNode(graph, from);
  ensureNode(graph, to);
  graph[from].push(to);
}

function countPathsDepthFirst(graph, start, target) {
  const visitedOnPath = new Set();
  return dfsFrom(start);

  function dfsFrom(current) {
    if (current === target) return 1;
    if (visitedOnPath.has(current)) return 0;

    visitedOnPath.add(current);

    let count = 0;

    const neighbors = graph[current];
    for (const next of neighbors) {
      count += dfsFrom(next);
    }

    visitedOnPath.delete(current);
    return count;
  }
}
