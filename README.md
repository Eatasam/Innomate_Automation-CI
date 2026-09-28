# Playwright Web Product Framework

A JavaScript Playwright Test framework for web-based product UI testing.

## Setup

```powershell
npm ci
npm run install:browsers
Copy-Item .env.example .env
```

Set `BASE_URL` in `.env` to the product environment under test.

For an internal environment with a self-signed certificate, set `IGNORE_HTTPS_ERRORS=true` in `.env`. Certificate verification remains enabled by default.

## Run Tests

```powershell
npm test
npm run test:smoke
npm run test:ci
npm run test:headed
npm run test:ui
```

Run the login test only:

```powershell
npm.cmd run test:login
```

If invoking Playwright directly on Windows, use forward slashes in the test path: `tests/logintest.spec.js`. Playwright treats positional paths as regular expressions, so `tests\logintest.spec.js` can result in `No tests found`.

Set `LOGIN_USERNAME` and `LOGIN_PASSWORD` in `.env` before running authenticated tests. Missing credentials fail with a clear message. The smoke test checks the product login form and does not require credentials.

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
- Traces and screenshots on failure, and videos for every test: `test-results`
- API methods, URLs without query strings, statuses, and response times: attached as `api-responses.json` in the login test report

Login actions are wrapped in Playwright `test.step`, so the HTML report shows each step and its timing. API response bodies are intentionally excluded from reports to avoid storing sensitive application data.

Open the interactive HTML report with:

```powershell
npm run report
```

Print a compact JSON summary with:

```powershell
npm run report:json
```

## Jenkins CI

This repository includes a Jenkins pipeline in `Jenkinsfile` that runs the full suite on Chromium, including the smoke test. Create a Pipeline job that loads this repository's `Jenkinsfile`, and create a Jenkins username/password credential with the ID `playwright-test-credentials`. The credential is injected only while the tests run as `LOGIN_USERNAME` and `LOGIN_PASSWORD`. The HTML Publisher plugin is optional; install it to add a dedicated report link to each build.

Configure the development CI job to trigger this job after its build completes. It can pass the `BASE_URL` and `IGNORE_HTTPS_ERRORS` parameters when invoking the downstream Jenkins job. Jenkins publishes JUnit results and archives JSON, traces, screenshots, videos, and other files. When the HTML Publisher plugin is installed, the pipeline also adds a **Playwright HTML Report** link. If Jenkins' Content Security Policy blocks the interactive report, ask a Jenkins administrator to configure a secure resource-root/CSP policy; do not disable the policy globally.

The Jenkins executor must be running on Windows with Node.js, npm, and Git available on `PATH`. The upstream job should trigger this pipeline after its build completes, rather than embedding test commands in the development build. Configure artifact retention on the Jenkins job to match your storage policy; the pipeline keeps the latest 20 builds.

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
