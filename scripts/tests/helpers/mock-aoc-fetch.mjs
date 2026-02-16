// Injected via: node --import <this-file>
// Keeps e2e tests fully offline by mocking global fetch.

globalThis.fetch = async () => {
  const body = process.env.AOC_TEST_INPUT ?? 'test-input\n';
  const ok = process.env.AOC_TEST_FETCH_OK ? process.env.AOC_TEST_FETCH_OK === '1' : true;
  const status = process.env.AOC_TEST_FETCH_STATUS
    ? Number(process.env.AOC_TEST_FETCH_STATUS)
    : 200;

  return {
    ok,
    status: Number.isFinite(status) ? status : 200,
    statusText: ok ? 'OK' : 'ERROR',
    async text() {
      return body;
    },
  };
};
