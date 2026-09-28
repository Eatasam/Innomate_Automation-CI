const { test, expect } = require('../fixtures/test');

test('user can sign in', async ({ page, loginPage, credentials }, testInfo) => {
  const apiResponses = [];

  page.on('response', (response) => {
    const request = response.request();
    if (!['xhr', 'fetch'].includes(request.resourceType())) {
      return;
    }

    const timing = request.timing();
    const responseUrl = new URL(response.url());
    responseUrl.search = '';
    responseUrl.hash = '';

    apiResponses.push({
      method: request.method(),
      url: responseUrl.toString(),
      status: response.status(),
      statusText: response.statusText(),
      durationMs: timing.responseEnd >= 0
        ? Math.round(timing.responseEnd - timing.startTime)
        : null
    });
  });

  try {
    await test.step('Open login page', () => loginPage.open());
    await test.step('Submit valid credentials', () => (
      loginPage.signIn(credentials.username, credentials.password)
    ));
    await test.step('Dismiss welcome prompt', async () => {
      await page.getByRole('button', { name: 'Yes' }).click();
    });
    await test.step('Verify authenticated navigation', async () => {
      await expect(page.getByRole('link', { name: /User Options/ })).toBeVisible();
    });
  } finally {
    await testInfo.attach('api-responses.json', {
      body: JSON.stringify(apiResponses, null, 2),
      contentType: 'application/json'
    });
  }
});