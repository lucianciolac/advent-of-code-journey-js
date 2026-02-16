import { describe, it, expect } from 'vitest';
import path from 'node:path';

import { runCli } from '../helpers/run-cli.js';
import { withTempRoot, writeJsFile } from '../helpers/tmp-root.js';

const repoRoot = process.cwd();
const runDayScript = path.join(repoRoot, 'scripts', 'run-day.js');

describe('scripts/run-day.js (e2e)', () => {
  it('prints usage and exits 0 when no args', async () => {
    const res = await runCli({
      cwd: repoRoot,
      args: [runDayScript],
    });

    expect(res.code).toBe(0);
    expect(res.output).toContain('Usage: <day> [year] [part]');
  });

  it('runs part1 and part2 for a given day/year', async () => {
    await withTempRoot(async (tmpRoot) => {
      const dayDir = path.join(tmpRoot, '2025', 'day_01');
      await writeJsFile(path.join(dayDir, 'part1.js'), "console.log('PART1 OK');\n");
      await writeJsFile(path.join(dayDir, 'part2.js'), "console.log('PART2 OK');\n");

      const res = await runCli({
        cwd: repoRoot,
        args: [runDayScript, '1', '2025'],
        env: { AOC_PROJECT_ROOT: tmpRoot },
      });

      expect(res.code).toBe(0);
      expect(res.output).toContain('PART1 OK');
      expect(res.output).toContain('PART2 OK');
      expect(res.output).toContain('Running');
      expect(res.output).toContain('part1.js');
      expect(res.output).toContain('part2.js');
    });
  });

  it('defaults to latest discovered year when year is omitted', async () => {
    await withTempRoot(async (tmpRoot) => {
      await writeJsFile(
        path.join(tmpRoot, '2024', 'day_01', 'part1.js'),
        "console.log('2024 OK');\n"
      );
      await writeJsFile(
        path.join(tmpRoot, '2025', 'day_01', 'part1.js'),
        "console.log('2025 OK');\n"
      );

      const res = await runCli({
        cwd: repoRoot,
        args: [runDayScript, '1'],
        env: { AOC_PROJECT_ROOT: tmpRoot },
      });

      expect(res.code).toBe(0);
      expect(res.output).toContain('2025 OK');
      expect(res.output).not.toContain('2024 OK');
    });
  });

  it('runs only the selected part when part is provided', async () => {
    await withTempRoot(async (tmpRoot) => {
      const dayDir = path.join(tmpRoot, '2025', 'day_01');
      await writeJsFile(path.join(dayDir, 'part1.js'), "console.log('PART1 ONLY');\n");
      await writeJsFile(path.join(dayDir, 'part2.js'), "console.log('PART2 ONLY');\n");

      const res = await runCli({
        cwd: repoRoot,
        args: [runDayScript, '1', '2025', '2'],
        env: { AOC_PROJECT_ROOT: tmpRoot },
      });

      expect(res.code).toBe(0);
      expect(res.output).toContain('PART2 ONLY');
      expect(res.output).not.toContain('PART1 ONLY');
    });
  });

  it('exits with error code when day is invalid', async () => {
    await withTempRoot(async (tmpRoot) => {
      const res = await runCli({
        cwd: repoRoot,
        args: [runDayScript, '30'],
        env: { AOC_PROJECT_ROOT: tmpRoot },
      });

      expect(res.code).toBe(2);
      expect(res.output).toContain('A valid day number must be provided');
    });
  });

  it('exits with error code when year is invalid', async () => {
    await withTempRoot(async (tmpRoot) => {
      const res = await runCli({
        cwd: repoRoot,
        args: [runDayScript, '1', 'abc'],
        env: { AOC_PROJECT_ROOT: tmpRoot },
      });

      expect(res.code).toBe(2);
      expect(res.output).toContain('Year argument must be a valid year');
    });
  });

  it('exits with error code when day directory is missing', async () => {
    await withTempRoot(async (tmpRoot) => {
      await writeJsFile(path.join(tmpRoot, '2025', 'day_01', 'part1.js'), "console.log('OK');\n");

      const res = await runCli({
        cwd: repoRoot,
        args: [runDayScript, '2', '2025'],
        env: { AOC_PROJECT_ROOT: tmpRoot },
      });

      expect(res.code).toBe(2);
      expect(res.output).toContain('Day directory not found');
    });
  });
});
