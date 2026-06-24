import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const XRAY_BASE = 'https://xray.cloud.getxray.app';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable: ${name}`);
  return value;
}

async function authenticate(): Promise<string> {
  const res = await fetch(`${XRAY_BASE}/api/v2/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: requireEnv('XRAY_CLIENT_ID'),
      client_secret: requireEnv('XRAY_CLIENT_SECRET'),
    }),
  });
  if (!res.ok) {
    throw new Error(`XRAY auth failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as string;
}

async function importToXray(): Promise<void> {
  const reportPath = path.resolve('reports/cucumber-report.json');

  if (!fs.existsSync(reportPath)) {
    throw new Error(`Report not found at ${reportPath}. Run tests first.`);
  }

  const report = fs.readFileSync(reportPath, 'utf-8');
  const token = await authenticate();

  const res = await fetch(`${XRAY_BASE}/api/v2/import/execution/cucumber`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: report,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`XRAY import failed: ${res.status} ${text}`);
  }
  console.log('XRAY import successful:', text);
}

importToXray().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});