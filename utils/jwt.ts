export function decodeJwtPayload(token: string): Record<string, unknown> {
  const part = token.split('.')[1];
  if (!part) throw new Error('Invalid JWT — missing payload.');
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const json = Buffer.from(b64, 'base64').toString('utf-8');
  return JSON.parse(json) as Record<string, unknown>;
}