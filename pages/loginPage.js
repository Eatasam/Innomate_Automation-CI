class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  async open() {
    await this.page.goto('/');
  }

  async signIn(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async waitForAuthenticatedLanding() {
    const welcomeButton = this.page.getByRole('button', { name: 'Yes' });
    const userOptionsLink = this.page.getByRole('link', { name: /User Options/ });

    await Promise.race([
      welcomeButton.waitFor({ state: 'visible' }).then(() => 'welcome'),
      userOptionsLink.waitFor({ state: 'visible' }).then(() => 'dashboard')
    ]);

    if (await welcomeButton.isVisible()) {
      await welcomeButton.click();
    }

    await userOptionsLink.waitFor({ state: 'visible' });
  }
}

module.exports = { LoginPage };