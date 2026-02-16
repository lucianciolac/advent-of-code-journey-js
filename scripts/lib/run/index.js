import fs from 'node:fs';
import path from 'node:path';

import { AOC_PART_FILENAMES, PROJECT_ROOT } from '../../utils/constants.js';
import { runNodeScriptSync } from '../../utils/node-exec.js';
import { listYearFolders, listDayFolders, formatDayFolder } from './discovery.js';

export function runAllYears(logger) {
  const yearFolders = listYearFolders(PROJECT_ROOT);

  for (const year of yearFolders) {
    const yearDir = path.join(PROJECT_ROOT, year);
    logger.info(`YEAR ${year}\n`);

    const dayFolders = listDayFolders(yearDir);

    for (const day of dayFolders) {
      const dayDir = path.join(yearDir, day);
      const relativeDirLabel = path.join(year, day);

      logger.ok(`Solutions - ${relativeDirLabel}\n`);

      const filesInDayDir = new Set(fs.readdirSync(dayDir));

      for (const partFile of AOC_PART_FILENAMES) {
        if (filesInDayDir.has(partFile)) {
          runNodeScriptSync(partFile, dayDir, relativeDirLabel, logger);
        }
      }
    }
  }
}

export function runSingleDay(dayNum, yearArg, partArg, logger) {
  const dayFolder = formatDayFolder(dayNum);
  const yearFolders = listYearFolders(PROJECT_ROOT);
  const year = yearArg || yearFolders[yearFolders.length - 1];

  if (!year || !/^[0-9]{4}$/.test(year)) {
    throw new Error('No valid year found.');
  }

  const dayDir = path.join(PROJECT_ROOT, year, dayFolder);
  if (!fs.existsSync(dayDir) || !fs.statSync(dayDir).isDirectory()) {
    throw new Error(`Day directory not found: ${path.relative(PROJECT_ROOT, dayDir)}`);
  }

  const filesInDayDir = new Set(fs.readdirSync(dayDir));

  if (partArg) {
    const partNum = Number(partArg);
    const allowedParts = AOC_PART_FILENAMES.map((f) => f.match(/^part(\d+)\.js$/)[1]).map(Number);

    if (!allowedParts.includes(partNum)) {
      throw new Error(`Part must be one of ${allowedParts.join(', ')}`);
    }

    const partFile = `part${partNum}.js`;
    if (!filesInDayDir.has(partFile)) {
      throw new Error(`Part file not found: ${partFile}`);
    }

    runNodeScriptSync(partFile, dayDir, `${year}/${dayFolder}`, logger);
    return;
  }

  for (const partFile of AOC_PART_FILENAMES) {
    if (filesInDayDir.has(partFile)) {
      runNodeScriptSync(partFile, dayDir, `${year}/${dayFolder}`, logger);
    }
  }
}
