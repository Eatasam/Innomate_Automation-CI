const fs = require('fs');

const reportPath = 'reports/results.json';
if (!fs.existsSync(reportPath)) {
  console.error(`Report not found: ${reportPath}. Run npm test first.`);
  process.exitCode = 1;
  return;
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const summary = report.stats || {};
console.log(JSON.stringify({
  expected: summary.expected ?? 0,
  unexpected: summary.unexpected ?? 0,
  flaky: summary.flaky ?? 0,
  skipped: summary.skipped ?? 0,
  durationMs: summary.duration ?? 0
}, null, 2));
