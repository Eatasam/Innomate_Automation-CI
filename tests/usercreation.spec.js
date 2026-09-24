const { test, expect } = require('@playwright/test');
const crypto = require('crypto');

const username = process.env.LOGIN_USERNAME || 'Superadmin';
const password = process.env.LOGIN_PASSWORD;

test.use({
  ignoreHTTPSErrors: true
});

test('test', async ({ page }) => {
  const uniqueSuffix = Date.now().toString();
  const firstName = `Eatasam${uniqueSuffix}`;
  const lastName = `Ahmed${uniqueSuffix}`;
  const createdUserPassword = process.env.CREATED_USER_PASSWORD
    || `Pw-${crypto.randomBytes(12).toString('base64url')}!`;

  test.info().annotations.push({
    type: 'created-user',
    description: `First Name: ${firstName}, Last Name: ${lastName}`
  });

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
//  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('link', { name: /User Options/ }).click();
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('textbox', { name: 'Select Account Type' }).click();
  await page.getByRole('option', { name: 'Accountant', exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter User ID' }).click();
  await page.getByRole('textbox', { name: 'Enter User ID' }).fill(uniqueSuffix);
  await page.locator('.mb-3 > div:nth-child(4)').click();
  await page.getByRole('textbox', { name: 'Enter First Name' }).click();
  await page.getByRole('textbox', { name: 'Enter First Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter First Name' }).fill('E');
  await page.getByRole('textbox', { name: 'Enter First Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter First Name' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Enter First Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Enter Last Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Last Name' }).fill('A');
  await page.getByRole('textbox', { name: 'Enter Last Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Last Name' }).fill(lastName);
  await page.getByRole('textbox', { name: 'Enter Password', exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter Password', exact: true }).fill(createdUserPassword);
  await page.getByRole('textbox', { name: 'Re-enter Password' }).click();
  await page.getByRole('textbox', { name: 'Re-enter Password' }).fill(createdUserPassword);
  await page.locator('.col-3').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('User Account Created Successfully!', { exact: true })).toBeVisible();
});

