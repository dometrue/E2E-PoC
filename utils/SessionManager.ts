import 'dotenv/config';
import { chromium } from 'playwright';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable: ${name}`);
  return value;
}

export async function clearUserSessions(): Promise<void> {
  const backofficeUrl = requireEnv('BASE_URL_BACKOFFICE');
  const username = requireEnv('BACKOFFICE_USERNAME');
  const password = requireEnv('BACKOFFICE_PASSWORD');
  const searchTerm = username.split('@')[0].split('.')[1]; // extracts 'dumitrache'

  console.log('Clearing sessions via backoffice...');

const browser = await chromium.launch({
  headless: process.env.CI === 'true' || process.env.CI === '1'
});
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(backofficeUrl);

    // Login
    await page.getByRole('textbox', { name: 'Email address' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Continue' }).click();

    // Navigate to Users
    await page.getByRole('link', { name: 'Users' }).click();

    // Search for user
    await page.getByRole('textbox', { name: 'Search by email or name' }).fill(searchTerm);
    await page.getByRole('textbox', { name: 'Search by email or name' }).press('Enter');

    // Click Edit then Clear Sessions
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('button', { name: 'Clear Sessions' }).click();

    console.log('Sessions cleared successfully via backoffice');
  } catch (e) {
    throw new Error(`Session clearing failed: ${e instanceof Error ? e.message : e}`);
  } finally {
    await browser.close();
  }
}