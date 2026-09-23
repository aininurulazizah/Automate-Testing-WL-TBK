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

          error: status === 'passed'
            ? null
            : {
                summary: cleanAnsi(lastResult.error?.message),
                detail: cleanAnsi(lastResult.errors?.at(-1)?.message)
              }
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
  const hasFailed = results.some(result => result.status !== 'passed');

  const lastStatus = results.at(-1)?.status ?? 'failed';

  // Pernah gagal lalu berhasil (retry)
  if (results.length > 1 && hasPassed && hasFailed) {
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

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function cleanAnsi(text) {
  if (!text) return null;

  return text.replace(/\u001b\[[0-9;]*m/g,'');
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

  return Buffer.from(attachment.body, 'base64').toString('utf8');
}
