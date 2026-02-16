import { getAocToday } from './aoc.js';
import { AOC_EVENT, lastDayForYear } from './aoc.js';

export function parseIntOrUndefined(v) {
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isInteger(n) ? n : NaN;
}

export function resolveDayYearFromPositionals(positionals, { year: defaultYear, day: defaultDay }) {
  const [d, y, ...rest] = positionals;
  if (rest.length) {
    throw new Error(
      `Too many arguments: ${positionals.join(' ')}. Expected at most: [day] [year].`
    );
  }
  return {
    day: d == null ? defaultDay : parseIntOrUndefined(d),
    year: y == null ? defaultYear : parseIntOrUndefined(y),
  };
}

export function readEnvConfig(env = process.env) {
  return {
    sessionCookie: env.AOC_SESSION?.trim(),
    userAgent: env.AOC_USER_AGENT?.trim(),
  };
}

export function parseOptions(positionals) {
  const aocToday = getAocToday();
  return { ...resolveDayYearFromPositionals(positionals, aocToday), ...readEnvConfig() };
}

export function assertValidOptions({ year, day, sessionCookie, userAgent }) {
  if (!Number.isInteger(year) || year < AOC_EVENT.MIN_YEAR) {
    throw new Error(
      `Year must be a number >= ${AOC_EVENT.MIN_YEAR} (e.g., ${AOC_EVENT.CUTOFF_YEAR}).`
    );
  }

  const lastDay = lastDayForYear(year);

  if (day === undefined) {
    throw new Error(
      `Day is missing. Provide a day (${AOC_EVENT.FIRST_DAY}–${lastDay}), or run without arguments during Dec ${AOC_EVENT.FIRST_DAY}–${lastDay} (${AOC_EVENT.TIME_ZONE}).`
    );
  }

  if (!Number.isInteger(day) || day < AOC_EVENT.FIRST_DAY || day > lastDay) {
    throw new Error(`Day must be a number from ${AOC_EVENT.FIRST_DAY} to ${lastDay}.`);
  }

  if (!sessionCookie) {
    throw new Error('Missing AOC_SESSION. Add it to your .env (AoC session cookie value).');
  }
  if (!userAgent) {
    throw new Error(
      'Missing AOC_USER_AGENT. Add it to your .env (identify your script per AoC guidelines).'
    );
  }
}
