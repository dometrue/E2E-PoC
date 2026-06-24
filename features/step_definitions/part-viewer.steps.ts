import 'dotenv/config';
import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, Page, chromium } from 'playwright';
import LoginPage from '../../pages/LoginPage';
import PartViewerPage from '../../pages/PartViewerPage';
import { compareScreenshot } from '../../pages/VisualHelper';
import { clearUserSessions } from '../../utils/SessionManager';

setDefaultTimeout(30000);

let browser: Browser;
let page: Page;
let loginPage: LoginPage;
let partViewerPage: PartViewerPage;

Before({ tags: '@part-viewer' }, async () => {
  try {
    await clearUserSessions();
  } catch (e) {
    console.log('Session clear skipped:', e instanceof Error ? e.message : e);
  }

  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);
  partViewerPage = new PartViewerPage(page);
});

After({ tags: '@part-viewer' }, async () => {
  await browser.close();
});

Given('I am logged in and on the part viewer', async () => {
  await loginPage.goto();
  await loginPage.login(
    process.env.TEST_USERNAME as string,
    process.env.TEST_PASSWORD as string
  );
  await partViewerPage.navigateTo();
});

When('I select the back machining side', async () => {
  await partViewerPage.selectBack();
});

When('I select the top machining side', async () => {
  await partViewerPage.selectTop();
});

When('I select the bottom machining side', async () => {
  await partViewerPage.selectBottom();
});

When('I select the left machining side', async () => {
  await partViewerPage.selectLeft();
});

Then('the 3D viewer should reflect the back view', async () => {
  await page.waitForTimeout(1000);
  const diff = await compareScreenshot(page, 'back-view', 'canvas');
  if (diff > 100) throw new Error(`Back view has ${diff} mismatched pixels`);
});

Then('the 3D viewer should reflect the top view', async () => {
  await page.waitForTimeout(1000);
  const diff = await compareScreenshot(page, 'top-view', 'canvas');
  if (diff > 100) throw new Error(`Top view has ${diff} mismatched pixels`);
});

Then('the 3D viewer should reflect the bottom view', async () => {
  await page.waitForTimeout(1000);
  const diff = await compareScreenshot(page, 'bottom-view', 'canvas');
  if (diff > 100) throw new Error(`Bottom view has ${diff} mismatched pixels`);
});

Then('the 3D viewer should reflect the left view', async () => {
  await page.waitForTimeout(1000);
  const diff = await compareScreenshot(page, 'left-view', 'canvas');
  if (diff > 100) throw new Error(`Left view has ${diff} mismatched pixels`);
});