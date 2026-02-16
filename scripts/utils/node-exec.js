import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PROJECT_ROOT } from './constants.js';

export function runNodeScriptSync(scriptFilename, workingDirectory, contextLabel, logger) {
  const scriptPath = path.join(workingDirectory, scriptFilename);
  const scriptPathRelative = path.relative(PROJECT_ROOT, scriptPath);
  logger.info(`Running ${scriptPathRelative}`);

  const result = spawnSync(process.execPath, [scriptFilename], {
    cwd: workingDirectory,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(
      `Script failed in ${contextLabel}\n` + `File: ${scriptPath}\n` + `Exit code: ${result.status}`
    );
  }

  process.stdout.write('\n');
  return result;
}
