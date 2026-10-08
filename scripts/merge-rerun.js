const fs = require('fs');
const path = require('path');

const executionDate = process.argv[2];
const rerunResultPath = process.argv[3] || 'reports/rerun-result.json';

if (!executionDate) {
    console.error('Execution date wajib diisi.');
    console.error('Contoh: node scripts/merge-rerun.js 2026-09-29');
    process.exit(1);
}

const executionFile = path.join(
    'dashboard',
    'src',
    'data',
    'executions',
    `${executionDate}.json`
);

const currentDashboardFile = path.join(
    'dashboard',
    'src',
    'data',
    'dashboard-data.json'
);

const publicExecutionFile = path.join(
    'dashboard',
    'public',
    'executions',
    `${executionDate}.json`
);

if (!fs.existsSync(executionFile)) {
    console.error(`Execution file tidak ditemukan: ${executionFile}`);
    process.exit(1);
}

if (!fs.existsSync(rerunResultPath)) {
    console.error(`Rerun result tidak ditemukan: ${rerunResultPath}`);
    process.exit(1);
}

const executionData = JSON.parse(
    fs.readFileSync(executionFile, 'utf8')
);

const rerunData = JSON.parse(
    fs.readFileSync(rerunResultPath, 'utf8')
);

function getRerunTests(data) {
    const tests = [];

    for (const suite of data.suites || []) {
        for (const spec of suite.specs || []) {
            const test = spec.tests?.[0];

            if (!test) continue;

            const results = test.results || [];
            const lastResult = results.at(-1);

            if (!lastResult) continue;

            const hasPassed = results.some(result => result.status === 'passed');
            const hasNonPassed = results.some(result => result.status !== 'passed');

            let status;

            if (results.length > 1 && hasPassed && hasNonPassed) {
                status = 'flaky';
            } else if (hasPassed) {
                status = 'passed';
            } else {
                status = 'failed';
            }

            const bookingCodeAttachment = lastResult.attachments?.find(
                attachment => attachment.name === 'booking_code'
            );

            let bookingCode = null;

            if (bookingCodeAttachment?.body) {
                try {
                    bookingCode = Buffer
                        .from(bookingCodeAttachment.body, 'base64')
                        .toString('utf8');
                } catch {
                    bookingCode = null;
                }
            }

            const error =
                status === 'passed' || status === 'flaky'
                    ? null
                    : getErrorFromResult(lastResult);

            tests.push({
                title: spec.title,
                status,
                duration: lastResult.duration || 0,
                browser: test.projectName || null,
                startTime: lastResult.startTime || null,
                bookingCode,
                error
            });
        }
    }

    return tests;
}

function getErrorFromResult(result) {
    if (!result) return null;

    const errors = result.errors || [];

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

    const lines = message.split('\n').map(line => line.trim()).filter(Boolean);

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

const rerunTests = getRerunTests(rerunData);

if (rerunTests.length === 0) {
    console.error('Tidak ada test ditemukan di rerun result.');
    process.exit(1);
}

console.log(`Rerun tests ditemukan: ${rerunTests.length}`);

let updatedCount = 0;

for (const rerunTest of rerunTests) {
    const existingTest = executionData.details.find(
        detail => detail.title === rerunTest.title
    );

    if (!existingTest) {
        console.warn(
            `Test tidak ditemukan di execution: ${rerunTest.title}`
        );
        continue;
    }

    console.log(
        `${rerunTest.title}: ${existingTest.status} → ${rerunTest.status}`
    );

    existingTest.status = rerunTest.status;
    existingTest.duration = rerunTest.duration;
    existingTest.browser = rerunTest.browser;
    existingTest.startTime = rerunTest.startTime;
    existingTest.bookingCode = rerunTest.bookingCode;
    existingTest.error = rerunTest.error;

    updatedCount++;
}

if (updatedCount === 0) {
    console.error('Tidak ada test yang berhasil di-update.');
    process.exit(1);
}

// Recalculate summary
let passed = 0;
let failed = 0;
let flaky = 0;
let skipped = 0;

for (const detail of executionData.details) {
    if (detail.status === 'passed') {
        passed++;
    } else if (detail.status === 'failed') {
        failed++;
    } else if (detail.status === 'flaky') {
        flaky++;
    } else if (detail.status === 'skipped') {
        skipped++;
    }
}

executionData.summary.total = executionData.details.length;
executionData.summary.passed = passed;
executionData.summary.failed = failed;
executionData.summary.flaky = flaky;
executionData.summary.skipped = skipped;
executionData.generatedAt = new Date().toISOString();

fs.writeFileSync(
    executionFile,
    JSON.stringify(executionData, null, 2) + '\n'
);

fs.writeFileSync(
    currentDashboardFile,
    JSON.stringify(executionData, null, 2) + '\n'
);

fs.mkdirSync(
    path.dirname(publicExecutionFile),
    { recursive: true }
);

fs.writeFileSync(
    publicExecutionFile,
    JSON.stringify(executionData, null, 2) + '\n'
);

console.log('');
console.log('Merge rerun berhasil.');
console.log(`Execution: ${executionDate}`);
console.log(`Updated: ${updatedCount}`);
console.log(`Total: ${executionData.summary.total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Flaky: ${flaky}`);
console.log(`Skipped: ${skipped}`);
