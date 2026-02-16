/**
 * Advent of Code – Day 10, Part 2
 * https://adventofcode.com/2025/day/10
 *
 * This part turned out to be far more complex than I initially thought.
 * I first tried using BFS as in Part 1, but it quickly became clear that this approach wouldn’t work.
 * After some research, I found that the problem can be modeled as a linear system.
 *
 * Linear system via RREF (Reduced Row Echelon Form) and DFS (Depth-First Search) to minimize button presses
 */

import fs from 'node:fs';

const INPUT_TEXT = fs.readFileSync(new URL('input.txt', import.meta.url), 'utf8').trimEnd();
const LINES = INPUT_TEXT.split(/\r?\n/);

// Floating point tolerance
const EPSILON = 1e-4;

function main() {
  const tStart = performance.now();

  let totalMinPresses = 0;

  for (const line of LINES) {
    const puzzle = parseLine(line);
    totalMinPresses += minPressesLinearSystem(puzzle.target, puzzle.buttons);
  }

  const tEnd = performance.now();
  console.log('Answer:', totalMinPresses);
  console.log('Time:', (tEnd - tStart).toFixed(2), 'ms');
}

main();

function parseLine(line) {
  const target = extractTargetVector(line);
  const buttons = extractButtonVectors(line);

  return { target, buttons };
}

function extractTargetVector(line) {
  const match = line.match(/\{([0-9,]+)\}/);

  return match[1].split(',').map(Number);
}

function extractButtonVectors(line) {
  const buttons = [];

  for (const match of line.matchAll(/\(([0-9,]+)\)/g)) {
    buttons.push(match[1].split(',').map(Number));
  }

  return buttons;
}

function minPressesLinearSystem(targetVector, buttonVectors) {
  const { A, maxPressByButton } = buildLinearSystem(targetVector, buttonVectors);
  const rref = rrefAugmented(A, targetVector);
  return minSolutionByDfs(rref, maxPressByButton);
}

function buildLinearSystem(targetVector, buttonVectors) {
  const rowCount = targetVector.length;
  const colCount = buttonVectors.length;

  const A = Array.from({ length: rowCount }, () => Array(colCount).fill(0));
  const maxPressByButton = Array.from({ length: colCount }, () => Infinity);

  for (let col = 0; col < colCount; col++) {
    for (const row of buttonVectors[col]) {
      if (row < 0 || row >= rowCount) continue;

      A[row][col] = 1;
      maxPressByButton[col] = Math.min(maxPressByButton[col], targetVector[row]);
    }
  }

  return { A, maxPressByButton };
}

function rrefAugmented(matrix, vector) {
  const rowCount = matrix.length;
  const colCount = matrix[0].length;

  const A = matrix.map((row) => row.slice());
  const b = vector.slice();

  const pivotCols = [];
  const pivotRowByCol = Array(colCount).fill(-1);

  let pivotRow = 0;

  for (let col = 0; col < colCount && pivotRow < rowCount; col++) {
    const rowWithPivot = findPivotRow(A, pivotRow, col);
    if (rowWithPivot === -1) continue;

    swapRows(A, b, pivotRow, rowWithPivot);
    normalizePivotRow(A, b, pivotRow, col);
    eliminateColumn(A, b, pivotRow, col);

    pivotCols.push(col);
    pivotRowByCol[col] = pivotRow;
    pivotRow++;
  }

  return { A, b, pivotCols, pivotRowByCol };
}

function findPivotRow(A, startRow, col) {
  for (let r = startRow; r < A.length; r++) {
    if (A[r][col] !== 0) return r;
  }
  return -1;
}

function swapRows(A, b, r1, r2) {
  if (r1 === r2) return;
  [A[r1], A[r2]] = [A[r2], A[r1]];
  [b[r1], b[r2]] = [b[r2], b[r1]];
}

function normalizePivotRow(A, b, row, pivotCol) {
  const pivot = A[row][pivotCol];
  if (pivot === 1) return;

  for (let c = pivotCol; c < A[row].length; c++) {
    A[row][c] /= pivot;
  }
  b[row] /= pivot;
}

function eliminateColumn(A, b, pivotRow, pivotCol) {
  const rowCount = A.length;
  const colCount = A[0].length;

  for (let r = 0; r < rowCount; r++) {
    if (r === pivotRow) continue;

    const factor = A[r][pivotCol];
    if (factor === 0) continue;

    for (let c = pivotCol; c < colCount; c++) {
      A[r][c] -= factor * A[pivotRow][c];
    }
    b[r] -= factor * b[pivotRow];
  }
}

function minSolutionByDfs(rref, maxPressByButton) {
  const { A, b, pivotCols, pivotRowByCol } = rref;
  const colCount = maxPressByButton.length;

  const freeCols = getFreeColumns(colCount, pivotCols);

  let bestTotal = Infinity;
  const x = Array(colCount).fill(0);

  dfsChooseFree(0, 0);
  return bestTotal;

  function dfsChooseFree(freeIndex, pressesSoFar) {
    if (pressesSoFar >= bestTotal) return;

    if (freeIndex === freeCols.length) {
      const total = assignPivotVariables(
        x,
        A,
        b,
        pivotCols,
        pivotRowByCol,
        maxPressByButton,
        pressesSoFar
      );
      if (total !== null) bestTotal = Math.min(bestTotal, total);
      return;
    }

    const col = freeCols[freeIndex];
    const max = maxPressByButton[col];

    for (let value = 0; value <= max; value++) {
      x[col] = value;
      dfsChooseFree(freeIndex + 1, pressesSoFar + value);
    }
  }
}

function getFreeColumns(colCount, pivotCols) {
  const isPivot = Array(colCount).fill(false);
  for (const c of pivotCols) isPivot[c] = true;

  const free = [];
  for (let c = 0; c < colCount; c++) {
    if (!isPivot[c]) free.push(c);
  }
  return free;
}

function assignPivotVariables(x, A, b, pivotCols, pivotRowByCol, maxPressByButton, pressesSoFar) {
  const colCount = x.length;
  let total = pressesSoFar;

  for (let i = pivotCols.length - 1; i >= 0; i--) {
    const pivotCol = pivotCols[i];
    const row = pivotRowByCol[pivotCol];

    let value = b[row];

    for (let c = pivotCol + 1; c < colCount; c++) {
      const coeff = A[row][c];
      if (coeff !== 0) value -= coeff * x[c];
    }

    if (!isNearlyInteger(value)) return null;
    value = Math.round(value);

    const max = maxPressByButton[pivotCol];
    if (value < 0 || value > max) return null;

    x[pivotCol] = value;
    total += value;
  }

  return total;
}

function isNearlyInteger(value) {
  return Math.abs(value - Math.round(value)) <= EPSILON;
}
