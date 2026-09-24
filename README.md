# Playwright Web Product Framework

A JavaScript Playwright Test framework for web-based product UI testing.

## Setup

```powershell
npm install
npm run install:browsers
Copy-Item .env.example .env
```

Set `BASE_URL` in `.env` to the product environment under test.

For an internal environment with a self-signed certificate, set `IGNORE_HTTPS_ERRORS=true` in `.env` so recorded tests can run against it.

## Run Tests

```powershell
npm test
npm run test:smoke
npm run test:headed
npm run test:ui
```

Run the login test only:

```powershell
npm.cmd run test:login
```

If invoking Playwright directly on Windows, use forward slashes in the test path: `tests/logintest.spec.js`. Playwright treats positional paths as regular expressions, so `tests\logintest.spec.js` can result in `No tests found`.

Set `LOGIN_USERNAME` and `LOGIN_PASSWORD` in `.env` before running against a real product environment. The login flow uses the recorded selectors for `Username`, `Password`, and `Sign In`.

The login test defaults to `https://10.21.20.200:8500/`; override `BASE_URL` in `.env` for another environment.

## Record Tests

Use Playwright Codegen to interact with the product and generate JavaScript test code:

```powershell
npm run record -- https://example.com
```

To save the generated Playwright Test code directly to a file:

```powershell
npm run record:test -- https://example.com
```

This writes to `tests/recorded.spec.js`. Review the generated locators, rename the test, and move reusable actions into a page object under `pages/` when the flow is stable. Use the configured product URL without an argument:

```powershell
npm run record -- "$env:BASE_URL"
```

The recorder is configured with `--ignore-https-errors` for internal environments that use self-signed certificates. Keep certificate validation enabled for normal production test execution unless the environment explicitly requires otherwise.

## Reports

Each run generates:

- HTML report: `reports/html`
- JSON report: `reports/results.json`
- JUnit report: `reports/results.xml`
- Traces, screenshots, and videos on failure: `test-results`
- API response bodies, statuses, and response times: attached as `api-responses.json` in the HTML report

Every login action is wrapped in a Playwright `test.step`, so the HTML report shows the iteration sequence and timing for each step. API capture includes XHR/fetch responses, HTTP status, method, URL, response body, and measured duration in milliseconds.

Open the interactive HTML report with:

```powershell
npm run report
```

Print a compact JSON summary with:

```powershell
npm run report:json
```

## Jenkins CI

This repository includes a Jenkins pipeline in `Jenkinsfile` that currently runs the Chromium login test (`npm run test:login`). Create a Pipeline job that loads this repository's `Jenkinsfile`, and create a Jenkins username/password credential with the ID `playwright-test-credentials`. The credential is injected only while the test runs as `LOGIN_USERNAME` and `LOGIN_PASSWORD`.

Configure the development CI job to trigger this job after its build completes. It can pass the `BASE_URL` and `IGNORE_HTTPS_ERRORS` parameters when invoking the downstream Jenkins job. The pipeline publishes `reports/results.xml` as JUnit results and archives the HTML report, JSON report, traces, screenshots, videos, and other files under `reports/` and `test-results/`.

The Jenkins executor must be running on Windows with Node.js, npm, and Git available on `PATH`. The upstream job should trigger this pipeline after its build completes, rather than embedding test commands in the development build.

## Structure

```text
.github/copilot-instructions.md  Workspace guidance
automation/                       Optional API and utility automation
fixtures/                         Custom Playwright fixtures
pages/                            Page objects
scripts/                          Reporting utilities
tests/                            Test specifications
playwright.config.js              Cross-browser and reporter configuration
```
