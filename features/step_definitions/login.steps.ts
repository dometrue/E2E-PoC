import 'dotenv/config';
import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, Page, chromium } from 'playwright';
import LoginPage from '../../pages/LoginPage';

setDefaultTimeout(30000);

let browser: Browser;
let page: Page;
let loginPage: LoginPage;

Before({ tags: '@login' }, async () => {
  browser = await chromium.launch({ headless: process.env.CI === 'true' || process.env.CI === '1' });
  const context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);
});

After({ tags: '@login' }, async () => {
  await browser.close();
});

Given('I open the login page', async () => {
  await loginPage.goto();
});

When('I enter valid credentials', async () => {
  await loginPage.login(
    process.env.TEST_USERNAME as string,
    process.env.TEST_PASSWORD as string
  );
});

Then('I should be logged in successfully', async () => {
  await page.waitForURL(/autocam|projects|parts|cloud\.qas/, { timeout: 15000 });
  console.log('Login successful! Current URL:', page.url());
  await page.screenshot({ path: 'reports/login-success.png' });
});

When('I enter invalid credentials', async () => {
  await loginPage.login(process.env.TEST_USERNAME as string, 'wrongpassword123');
});

Then('I should see an error message', async () => {
  await page.waitForSelector('text=Wrong email or password', { timeout: 10000 });
  console.log('Error message displayed as expected');
  await page.screenshot({ path: 'reports/login-error.png' });
});