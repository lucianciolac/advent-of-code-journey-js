export const AOC_EVENT = {
  TIME_ZONE: 'America/New_York',
  EVENT_MONTH: 12,
  FIRST_DAY: 1,
  MIN_YEAR: 2015,

  LEGACY_LAST_DAY: 25,
  CUTOFF_YEAR: 2025,
  CUTOFF_LAST_DAY: 12,
};

export const CLI_CONST = {
  DAY_PAD_WIDTH: 2,
};

export function lastDayForYear(year) {
  return year >= AOC_EVENT.CUTOFF_YEAR ? AOC_EVENT.CUTOFF_LAST_DAY : AOC_EVENT.LEGACY_LAST_DAY;
}

export const formatDay = (n) => String(n).padStart(CLI_CONST.DAY_PAD_WIDTH, '0');

export function getAocToday(date = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: AOC_EVENT.TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  let year, month, day;
  for (const p of fmt.formatToParts(date)) {
    if (p.type === 'year') year = Number(p.value);
    else if (p.type === 'month') month = Number(p.value);
    else if (p.type === 'day') day = Number(p.value);
  }

  const lastDay = lastDayForYear(year);
  const inEventWindow =
    month === AOC_EVENT.EVENT_MONTH && day >= AOC_EVENT.FIRST_DAY && day <= lastDay;

  return { year, day: inEventWindow ? day : undefined };
}
