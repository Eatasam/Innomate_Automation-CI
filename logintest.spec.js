const { test, expect } = require('@playwright/test');

test.use({
  ignoreHTTPSErrors: true
});

test('logintest', async ({ page }, testInfo) => {
  const apiResponses = [];
  const responsePromises = [];
  const username = process.env.LOGIN_USERNAME || 'admin';
  const password = process.env.LOGIN_PASSWORD;

  page.on('response', (response) => {
    const request = response.request();
    if (!['xhr', 'fetch'].includes(request.resourceType())) {
      return;
    }

    responsePromises.push((async () => {
      const timing = request.timing();
      let body = '[response body unavailable]';

      try {
        body = await response.text();
        if (body.length > 10000) {
          body = `${body.slice(0, 10000)}... [truncated]`;
        }
      } catch (error) {
        body = `[${error.message}]`;
      }

      apiResponses.push({
        method: request.method(),
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        durationMs: timing.responseEnd >= 0
          ? Math.round(timing.responseEnd - timing.startTime)
          : null,
        body
      });
    })());
  });

  try {
    await test.step('Open login page', async () => {
      await page.goto('/');
    });

    await test.step('Enter username', async () => {
      await page.getByRole('textbox', { name: 'Username' }).fill(username);
    });

    await test.step('Enter password', async () => {
      await page.getByRole('textbox', { name: 'Password' }).fill(password);
    });

    await test.step('Submit login form', async () => {
      await page.getByRole('button', { name: 'Sign In' }).click();
    });

    await test.step('Wait for login response capture', async () => {
      await Promise.all(responsePromises);
    });

    await test.step('Validate authenticated state', async () => {
      await expect(page).not.toHaveURL(/login/i);
    });
  } finally {
    await Promise.all(responsePromises);
    await testInfo.attach('api-responses.json', {
      body: JSON.stringify(apiResponses, null, 2),
      contentType: 'application/json'
    });
  }
});