class ProductPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1');
  }

  async open() {
    await this.page.goto('/');
  }

  async getHeading() {
    return this.heading.textContent();
  }
}

module.exports = { ProductPage };
