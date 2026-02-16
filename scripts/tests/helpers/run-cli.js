import { spawn } from 'node:child_process';

export function runCli({ args, cwd, env }) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));

    child.on('close', (code) => {
      resolve({
        code: code ?? -1,
        stdout,
        stderr,
        output: stdout + stderr,
      });
    });
  });
}
