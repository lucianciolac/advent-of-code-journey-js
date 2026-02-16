import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const AOC_PART_FILENAMES = ['part1.js', 'part2.js'];

function findNearestPackageRoot(startDir) {
  let dir = startDir;

  for (;;) {
    const candidate = path.join(dir, 'package.json');
    if (fs.existsSync(candidate)) return dir;

    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

const thisFileDir = path.dirname(fileURLToPath(import.meta.url));

export const PROJECT_ROOT = process.env.AOC_PROJECT_ROOT
  ? path.resolve(process.env.AOC_PROJECT_ROOT)
  : findNearestPackageRoot(thisFileDir);
