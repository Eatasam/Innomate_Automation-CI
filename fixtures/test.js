const base = require('@playwright/test');
const { ProductPage } = require('../pages/productPage');

const test = base.test.extend({
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  }
});

module.exports = {
  test,
  expect: base.expect
};
