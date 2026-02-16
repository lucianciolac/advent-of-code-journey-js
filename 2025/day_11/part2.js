/**
 * Advent of Code – Day 11, Part 2
 * https://adventofcode.com/2025/day/11
 *
 * Depth-first search (DFS) with a bitmask to count distinct paths from the start device to the target device
 * ensuring all required devices are visited at least once.
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

const DEVICE_START_LABEL = 'svr';
const DEVICE_END_LABEL = 'out';
const REQUIRED_DEVICES = ['dac', 'fft'];

function main() {
  const tStart = performance.now();

  const graph = buildGraph(LINES);

  const pathCount = countPathsThatVisitAllRequired(
    graph,
    DEVICE_START_LABEL,
    DEVICE_END_LABEL,
    REQUIRED_DEVICES
  );

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
    for (const neighbor of connections) addDirectedEdge(graph, device, neighbor);
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

function countPathsThatVisitAllRequired(graph, start, target, requiredDevices) {
  const bitForDevice = new Map(requiredDevices.map((name, i) => [name, 1 << i]));
  const allRequiredMask = (1 << requiredDevices.length) - 1;

  return countWithMemoOnDAG(graph, start, target, bitForDevice, allRequiredMask);
}

function countWithMemoOnDAG(graph, start, target, bitForDevice, allRequiredMask) {
  const memo = new Map();
  return dfs(start, 0);

  function dfs(current, mask) {
    const bit = bitForDevice.get(current) ?? 0;
    const nextMask = mask | bit;

    if (current === target) {
      return nextMask === allRequiredMask ? 1 : 0;
    }

    const key = `${current}|${nextMask}`;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    let count = 0;
    for (const neighbor of graph[current] ?? []) {
      count += dfs(neighbor, nextMask);
    }

    memo.set(key, count);
    return count;
  }
}
