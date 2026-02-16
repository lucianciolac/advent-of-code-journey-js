import { describe, it, expect } from 'vitest';
import path from 'node:path';

import { runCli } from '../helpers/run-cli.js';
import { withTempRoot, writeJsFile } from '../helpers/tmp-root.js';

const repoRoot = process.cwd();
const runAllScript = path.join(repoRoot, 'scripts', 'run-all.js');

describe('scripts/run-all.js (e2e)', () => {
  it('runs all discovered years/days in order', async () => {
    await withTempRoot(async (tmpRoot) => {
      await writeJsFile(
        path.join(tmpRoot, '2024', 'day_01', 'part1.js'),
        "console.log('2024-01-P1');\n"
      );
      await writeJsFile(
        path.join(tmpRoot, '2025', 'day_01', 'part1.js'),
        "console.log('2025-01-P1');\n"
      );
      await writeJsFile(
        path.join(tmpRoot, '2025', 'day_01', 'part2.js'),
        "console.log('2025-01-P2');\n"
      );

      const res = await runCli({
        cwd: repoRoot,
        args: [runAllScript],
        env: { AOC_PROJECT_ROOT: tmpRoot },
      });

      expect(res.code).toBe(0);
      expect(res.output).toContain('YEAR 2024');
      expect(res.output).toContain('YEAR 2025');
      expect(res.output).toContain('2024-01-P1');
      expect(res.output).toContain('2025-01-P1');
      expect(res.output).toContain('2025-01-P2');
    });
  });

  it('exits with error code when a part fails', async () => {
    await withTempRoot(async (tmpRoot) => {
      await writeJsFile(path.join(tmpRoot, '2025', 'day_01', 'part1.js'), "console.log('OK');\n");
      await writeJsFile(path.join(tmpRoot, '2025', 'day_01', 'part2.js'), 'process.exit(1);\n');

      const res = await runCli({
        cwd: repoRoot,
        args: [runAllScript],
        env: { AOC_PROJECT_ROOT: tmpRoot },
      });

      expect(res.code).toBe(2);
      expect(res.output).toContain('Exit code: 1');
    });
  });
});
