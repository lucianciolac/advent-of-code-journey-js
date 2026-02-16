import { CLI } from '../../utils/logger.js';

export async function downloadPuzzleInput({ year, day, sessionCookie, userAgent }) {
  const url = `https://adventofcode.com/${year}/day/${day}/input`;

  const response = await fetch(url, {
    headers: {
      Cookie: `session=${sessionCookie}`,
      'User-Agent': userAgent,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const snippet = text.replace(/\s+/g, ' ').slice(0, CLI.ERROR_SNIPPET_MAX_CHARS);

    const details = [
      `Request: ${url}`,
      `HTTP ${response.status} ${response.statusText}`,
      snippet ? `Response: ${snippet}` : null,
    ].filter(Boolean);

    throw new Error(details.join('\n'));
  }

  return response.text();
}
