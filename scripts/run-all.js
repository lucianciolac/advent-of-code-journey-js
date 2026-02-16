#!/usr/bin/env node

import { exit } from 'node:process';
import { createLogger, EXIT } from './utils/logger.js';
import { runAllYears } from './lib/run/index.js';

const logger = createLogger();

try {
  runAllYears(logger);
} catch (err) {
  logger.error(err);
  exit(EXIT.ERROR);
}
