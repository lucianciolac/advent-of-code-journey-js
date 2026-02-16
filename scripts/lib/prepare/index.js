import { join } from 'node:path';

import { AOC_PART_FILENAMES, PROJECT_ROOT } from '../../utils/constants.js';
import { formatDay } from './aoc.js';
import { parseOptions, assertValidOptions } from './prepare-cli.js';
import { downloadPuzzleInput } from './fetch-input.js';
import { ensureDir, writeTextFile } from '../../utils/fs-utils.js';
import { renderSolutionTemplate } from './templates.js';

export async function bootstrapAocDay({ year, day, sessionCookie, userAgent }, logger) {
  const projectRoot = PROJECT_ROOT;
  const dayPadded = formatDay(day);
  const dayDir = join(projectRoot, String(year), `day_${dayPadded}`);

  await ensureDir(dayDir);

  const puzzleInput = await downloadPuzzleInput({ year, day, sessionCookie, userAgent });
  await writeTextFile(join(dayDir, 'input.txt'), puzzleInput);

  logger.ok(`Puzzle input ready at ${year}/day_${dayPadded}/input.txt`);

  const createdFiles = [];
  for (const partFile of AOC_PART_FILENAMES) {
    const match = partFile.match(/^part(\d+)\.js$/);
    const partNum = Number(match[1]);

    const created = await writeTextFile(
      join(dayDir, partFile),
      renderSolutionTemplate({ year, day, part: partNum }),
      { ifAbsent: true }
    );

    createdFiles.push({ partFile, created });
  }

  const status = (created) => (created ? 'created' : 'already exists');

  logger.ok(
    `Templates ready → ${createdFiles
      .map(({ partFile, created }) => `${partFile} (${status(created)})`)
      .join(', ')}`
  );
  logger.ok(
    `All set! Cheers! Day ${formatDay(day)} (${year}) is ready at ${year}/day_${dayPadded}/`
  );
}

export async function runPrepare(positionals, logger) {
  const opts = parseOptions(positionals);
  assertValidOptions(opts);
  await bootstrapAocDay(opts, logger);
}
