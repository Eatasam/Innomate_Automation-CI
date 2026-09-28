const { test, expect } = require('../fixtures/test');
const crypto = require('crypto');

test('creates a user with a unique ID', async ({ page, loginPage, credentials }) => {
  const uniqueSuffix = Date.now().toString();
  const firstName = `Eatasam${uniqueSuffix}`;
  const lastName = `Ahmed${uniqueSuffix}`;
  const createdUserPassword = process.env.CREATED_USER_PASSWORD
    || `Pw-${crypto.randomBytes(12).toString('base64url')}!`;

  test.info().annotations.push({
    type: 'created-user',
    description: `First Name: ${firstName}, Last Name: ${lastName}`
  });

  await loginPage.open();
  await loginPage.signIn(credentials.username, credentials.password);
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('link', { name: /User Options/ }).click();
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('textbox', { name: 'Select Account Type' }).click();
  await page.getByRole('option', { name: 'Accountant', exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter User ID' }).fill(uniqueSuffix);
  await page.getByRole('textbox', { name: 'Enter First Name' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Enter Last Name' }).fill(lastName);
  await page.getByRole('textbox', { name: 'Enter Password', exact: true }).fill(createdUserPassword);
  await page.getByRole('textbox', { name: 'Re-enter Password' }).fill(createdUserPassword);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('User Account Created Successfully!', { exact: true })).toBeVisible();
});

