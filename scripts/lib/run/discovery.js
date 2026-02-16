import fs from 'node:fs';
import path from 'node:path';
import { PROJECT_ROOT } from '../../utils/constants.js';

export const isYearFolder = (dirent) => dirent.isDirectory() && /^\d{4}$/.test(dirent.name);
export const isDayFolder = (dirent) => dirent.isDirectory() && /^day_\d{2}$/.test(dirent.name);
export const formatDayFolder = (d) => `day_${String(d).padStart(2, '0')}`;

export function listYearFolders(root = PROJECT_ROOT) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter(isYearFolder)
    .map((d) => d.name)
    .sort();
}

export function listDayFolders(yearDir) {
  return fs
    .readdirSync(yearDir, { withFileTypes: true })
    .filter(isDayFolder)
    .map((d) => d.name)
    .sort();
}

export function resolveDayDir(root, year, dayFolder) {
  return path.join(root, year, dayFolder);
}
