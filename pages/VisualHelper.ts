import * as fs from 'fs';
import * as path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { Page } from 'playwright';

export async function compareScreenshot(
  page: Page,
  name: string,
  selector: string
): Promise<number> {
  const baselineDir = 'reports/screenshots/baseline';
  const actualDir = 'reports/screenshots/actual';
  const diffDir = 'reports/screenshots/diff';

  const baselinePath = path.join(baselineDir, `${name}.png`);
  const actualPath = path.join(actualDir, `${name}.png`);
  const diffPath = path.join(diffDir, `${name}.png`);

  // Take actual screenshot of the canvas element
  const element = page.locator(selector).first();
  await element.screenshot({ path: actualPath });

  // If no baseline exists, save current as baseline
  if (!fs.existsSync(baselinePath)) {
    fs.copyFileSync(actualPath, baselinePath);
    console.log(`Baseline created for: ${name}`);
    return 0;
  }

  // Compare actual vs baseline
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const actual = PNG.sync.read(fs.readFileSync(actualPath));
  const { width, height } = baseline;
  const diff = new PNG({ width, height });

  const mismatchedPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  console.log(`${name}: ${mismatchedPixels} mismatched pixels`);
  return mismatchedPixels;
}