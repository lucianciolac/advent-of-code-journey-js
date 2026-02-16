#!/usr/bin/env node

import { exit } from 'node:process';
import { parseArgs as parseNodeArgs } from 'node:util';
import { runPrepare } from './lib/prepare/index.js';
import { createLogger, EXIT } from './utils/logger.js';

const logger = createLogger();

try {
  const { positionals } = parseNodeArgs({
    args: process.argv.slice(2),
    strict: true,
    allowPositionals: true,
    options: {},
  });

  await runPrepare(positionals, logger);
} catch (err) {
  logger.error(err);
  exit(EXIT.ERROR);
}
