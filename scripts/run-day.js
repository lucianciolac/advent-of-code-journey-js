#!/usr/bin/env node

import { exit } from 'node:process';
import { parseArgs as parseNodeArgs } from 'node:util';
import { createLogger, EXIT } from './utils/logger.js';
import { runSingleDay } from './lib/run/index.js';

const logger = createLogger();

const usage = () => {
  logger.info('Usage: <day> [year] [part]');
  logger.info('  <day> - day number (1 or 01)');
  logger.info('  [year] - optional year (defaults to latest)');
  logger.info('  [part] - optional part number (1 or 2) to run only that part');
};

try {
  const { positionals } = parseNodeArgs({
    args: process.argv.slice(2),
    strict: true,
    allowPositionals: true,
    options: {},
  });

  if (positionals.length === 0) {
    usage();
    process.exit(0);
  }

  const dayArg = positionals[0];
  const yearArg = positionals[1];
  const partArg = positionals[2];

  if (!/^[0-9]{1,2}$/.test(String(dayArg)) || Number(dayArg) < 1 || Number(dayArg) > 25) {
    throw new Error('A valid day number must be provided. It should be between 1 and 25.');
  }

  if (yearArg && !/^[0-9]{4}$/.test(String(yearArg))) {
    throw new Error('Year argument must be a valid year (4 digits).');
  }

  if (partArg && !/^[0-9]+$/.test(String(partArg))) {
    throw new Error('Part argument must be a valid number (1 or 2).');
  }

  runSingleDay(dayArg, yearArg, partArg, logger);
} catch (err) {
  logger.error(err);
  exit(EXIT.ERROR);
}
