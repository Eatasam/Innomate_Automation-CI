const { test, expect } = require('../fixtures/test');

test('@smoke application login page is reachable', async ({ loginPage }) => {
  await loginPage.open();
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();
});
