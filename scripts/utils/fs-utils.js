import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants as FS } from 'node:fs';

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function fileExists(filePath) {
  try {
    await access(filePath, FS.F_OK);
    return true;
  } catch (e) {
    if (e?.code === 'ENOENT') return false;
    throw e;
  }
}

export async function writeTextFile(filePath, content, { ifAbsent = false } = {}) {
  if (ifAbsent && (await fileExists(filePath))) return false;
  await writeFile(filePath, content, 'utf8');
  return true;
}
