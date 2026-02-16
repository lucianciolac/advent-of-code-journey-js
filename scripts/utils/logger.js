import { styleText } from 'node:util';

export const EXIT = {
  OK: 0,
  ERROR: 2,
};

export const CLI = {
  ERROR_SNIPPET_MAX_CHARS: 200,
};

export function createLogger({ out = process.stdout, err = process.stderr } = {}) {
  const useColor = Boolean(out.isTTY);

  const color = {
    green: (s) => (useColor ? styleText('green', s) : s),
    red: (s) => (useColor ? styleText('red', s) : s),
    blue: (s) => (useColor ? styleText('blue', s) : s),
    dim: (s) => (useColor ? styleText('dim', s) : s),
  };

  return {
    color,
    ok: (msg) => out.write(`${color.green('OK')}   ${msg}\n`),
    info: (msg) => out.write(`${color.blue('INFO')} ${msg}\n`),
    error: (errOrHeadline, details = []) => {
      const message =
        errOrHeadline instanceof Error
          ? errOrHeadline.message
          : String(errOrHeadline ?? 'Unknown error');

      const lines = String(message)
        .split('\n')
        .map((s) => s.trimEnd());

      const headline = lines[0] || 'Unknown error';
      const extraDetails = [...lines.slice(1), ...details].filter(Boolean);

      err.write(`${color.red('ERROR')} ${headline}\n`);
      for (const d of extraDetails) err.write(`      ${color.dim(String(d))}\n`);
    },
  };
}
