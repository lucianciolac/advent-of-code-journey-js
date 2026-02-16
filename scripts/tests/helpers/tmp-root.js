import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { mkdir, writeFile, rm } from 'node:fs/promises';

export async function makeTempRoot(prefix = 'aoc-e2e-') {
  const dir = path.join(os.tmpdir(), `${prefix}${crypto.randomUUID()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function removeTempRoot(dir) {
  if (!dir) return;
  await rm(dir, { recursive: true, force: true });
}

export async function withTempRoot(fn, { prefix = 'aoc-e2e-' } = {}) {
  const dir = await makeTempRoot(prefix);
  try {
    return await fn(dir);
  } finally {
    await removeTempRoot(dir);
  }
}

export async function writeJsFile(filePath, source) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, source, 'utf8');
}
