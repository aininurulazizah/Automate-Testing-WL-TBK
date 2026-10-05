const fs = require('fs');
const path = require('path');

const RESULT_PATH = path.join(__dirname, '../reports/result.json');
const OUTPUT_PATH = path.join(__dirname, '../reports/dashboard-data.json');

const raw = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf8'));

const summary = {
  total: 0,
  passed: 0,
  failed: 0,
  flaky: 0,
  skipped: 0,
  duration: 0
};

const details = [];

walkSuites(raw.suites);

const statusOrder = {
  failed: 1,
  flaky: 2,
  passed: 3,
  skipped: 4
};

const startTimes = details
  .map(detail => new Date(detail.startTime).getTime())
  .filter(time => !isNaN(time));

const startedAt = startTimes.length
  ? new Date(Math.min(...startTimes)).toISOString()
  : null;

details.sort((a, b) => {
  // Urutkan berdasarkan status
  const statusComparison =
    statusOrder[a.status] - statusOrder[b.status];

  if (statusComparison !== 0) {
    return statusComparison;
  }

  // Kalau status sama, urutkan berdasarkan title
  return a.title.localeCompare(b.title);
});

const githubRunUrl =
  process.env.GITHUB_SERVER_URL &&
  process.env.GITHUB_REPOSITORY &&
  process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null;

const dashboardData = {
  startedAt,
  generatedAt: new Date().toISOString(),
  githubRunUrl,
  summary: {
    ...summary,
    durationFormatted: formatDuration(summary.duration)
  },
  details
};

fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(dashboardData, null, 2)
);

console.log('✅ dashboard-data.json berhasil dibuat');

function walkSuites(suites) {
  for (const suite of suites) {

    if (suite.specs) {
      for (const spec of suite.specs) {

        const test = spec.tests?.[0];

        if (!test) continue;

        const results = test.results ?? [];

        if (results.length === 0) continue;

        const lastResult = results.at(-1);

        const status = getTestStatus(results);

        summary.total++;

        switch (status) {
          case 'passed':
            summary.passed++;
            break;

          case 'flaky':
            summary.flaky++;
            break;

          case 'skipped':
            summary.skipped++;
            break;

          default:
            summary.failed++;
            break;
        }

        summary.duration += lastResult.duration ?? 0;

        details.push({
          title: spec.title,
          status,
          duration: lastResult.duration ?? 0,
          browser: test.projectName,
          startTime: lastResult.startTime,

          // Booking code dicari dari semua attempt/retry
          bookingCode: getBookingCodeFromResults(results),

          error: status === 'passed' || status === 'flaky'
            ? null
            : getErrorFromResult(lastResult)
        });
      }
    }

    if (suite.suites?.length) {
      walkSuites(suite.suites);
    }
  }
}

function getTestStatus(results) {
  const hasPassed = results.some(result => result.status === 'passed');
  const hasNonPassed = results.some(result => result.status !== 'passed');

  const lastStatus = results.at(-1)?.status ?? 'failed';

  // Pernah gagal lalu berhasil (retry)
  if (results.length > 1 && hasPassed && hasNonPassed) {
    return 'flaky';
  }

  // Passed
  if (lastStatus === 'passed') {
    return 'passed';
  }

  // Skipped
  if (lastStatus === 'skipped') {
    return 'skipped';
  }

  // failed, timedOut, interrupted, unknown, dll.
  return 'failed';
}

function getErrorFromResult(result) {
  if (!result) return null;

  const errors = result.errors ?? [];

  // Ambil semua error dari result terakhir
  const messages = errors
    .map(error => cleanErrorMessage(error.message))
    .filter(Boolean);

  // Fallback kalau errors kosong tetapi error.message tersedia
  if (messages.length === 0 && result.error?.message) {
    const message = cleanErrorMessage(result.error.message);

    return message
      ? {
          summary: getErrorSummary(message),
          detail: message
        }
      : null;
  }

  if (messages.length === 0) {
    return null;
  }

  const detail = messages.join('\n\n');

  return {
    summary: getErrorSummary(messages[0]),
    detail
  };
}

function getErrorSummary(message) {
  if (!message) return null;

  const lines = message
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  // Ambil bagian error utama.
  // Biasanya baris pertama sudah cukup.
  return lines[0] || null;
}

function cleanErrorMessage(text) {
  if (!text) return null;

  return text
    .replace(/\u001b\[[0-9;]*m/g, '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function getBookingCodeFromResults(results) {
  // Cari dari attempt terakhir ke attempt pertama
  for (const result of [...results].reverse()) {
    const bookingCode = getBookingCode(result.attachments);

    if (bookingCode) {
      return bookingCode;
    }
  }

  return null;
}

function getBookingCode(attachments) {
  const attachment = attachments?.find(
    attachment => attachment.name === 'booking_code'
  );

  if (!attachment?.body) return null;

  try {
    return Buffer.from(attachment.body, 'base64').toString('utf8');
  } catch {
    return null;
  }

}