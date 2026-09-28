const base = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  credentials: async ({}, use) => {
    const username = process.env.LOGIN_USERNAME;
    const password = process.env.LOGIN_PASSWORD;

    if (!username || !password) {
      throw new Error('Set LOGIN_USERNAME and LOGIN_PASSWORD to run authenticated tests.');
    }

    await use({ username, password });
  }
});

module.exports = {
  test,
  expect: base.expect
};
