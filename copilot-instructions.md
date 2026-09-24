# Playwright Framework Instructions

- Use JavaScript and CommonJS modules.
- Keep tests under `tests/`, page objects under `pages/`, and shared fixtures under `fixtures/`.
- Use Playwright locators and web-first assertions; avoid arbitrary timeouts.
- Run `npm test` for the full cross-browser suite and `npm run test:smoke` for smoke coverage.
- Test artifacts are written to `reports/` and `test-results/`.
