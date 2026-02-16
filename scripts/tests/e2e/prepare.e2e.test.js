import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';

import { runCli } from '../helpers/run-cli.js';
import { withTempRoot } from '../helpers/tmp-root.js';

const repoRoot = process.cwd();
const prepareScript = path.join(repoRoot, 'scripts', 'prepare.js');
const fetchMock = pathToFileURL(
  path.join(repoRoot, 'scripts', 'tests', 'helpers', 'mock-aoc-fetch.mjs')
).href;

describe('scripts/prepare.js (e2e)', () => {
  it('bootstraps a day folder and writes input + templates (offline fetch)', async () => {
    await withTempRoot(async (tmpRoot) => {
      const input = 'line1\nline2\n';

      const res = await runCli({
        cwd: repoRoot,
        args: ['--import', fetchMock, prepareScript, '1', '2025'],
        env: {
          AOC_PROJECT_ROOT: tmpRoot,
          AOC_SESSION: 'test-session',
          AOC_USER_AGENT: 'test-agent',
          AOC_TEST_INPUT: input,
        },
      });

      expect(res.code).toBe(0);

      const dayDir = path.join(tmpRoot, '2025', 'day_01');
      const written = await readFile(path.join(dayDir, 'input.txt'), 'utf8');
      expect(written).toBe(input);

      const part1 = await readFile(path.join(dayDir, 'part1.js'), 'utf8');
      const part2 = await readFile(path.join(dayDir, 'part2.js'), 'utf8');
      expect(part1).toContain('https://adventofcode.com/2025/day/1');
      expect(part1).toContain('Part 1');
      expect(part2).toContain('https://adventofcode.com/2025/day/1');
      expect(part2).toContain('Part 2');
      expect(res.output).toContain('Puzzle input ready');
    });
  });
});
