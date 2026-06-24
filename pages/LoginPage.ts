import { Page, Locator } from 'playwright';

const SUBMIT = 'button[type="submit"], button[name="action"]';

class LoginPage {
  private page: Page;
  private profileButton: Locator;
  private logoutMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileButton = page.getByRole('button', { name: 'Profile' });
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.page.goto(process.env.BASE_URL as string);
  }

  async login(username: string, password: string): Promise<void> {
    // Fill email
    const emailField = this.page.locator(
      'input[name="username"], input[name="email"], input[type="email"]'
    );
    await emailField.first().waitFor({ state: 'visible', timeout: 30000 });
    await emailField.first().fill(username);

    // Handle identifier-first flow (email then password on separate screens)
    const passwordField = this.page.locator(
      'input[name="password"], input[type="password"]'
    );
    if (!(await passwordField.first().isVisible().catch(() => false))) {
      await this.page.locator(SUBMIT).first().click();
      await passwordField.first().waitFor({ state: 'visible', timeout: 20000 });
    }
    await passwordField.first().fill(password);
    await this.page.locator(SUBMIT).first().click();

    // Handle org picker if it appears
    await this.handleOrgPicker();
  }

  private async handleOrgPicker(): Promise<void> {
    const orgPickerButton = this.page.getByRole('button', { name: 'DE/metrisch' });
    try {
      await orgPickerButton.waitFor({ state: 'visible', timeout: 8000 });
      await orgPickerButton.click();
    } catch {
      // No org picker shown, continue normally
    }
  }

  async logout(): Promise<void> {
    await this.profileButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.profileButton.click();
    await this.logoutMenuItem.click();
  }
}

export default LoginPage;