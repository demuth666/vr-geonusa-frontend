import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

/**
 * PRD #9/#54: setiap request mode "real" harus ada di contracts/openapi.yaml.
 * Menangkap drift path/method sebelum integrasi dengan backend sungguhan.
 */
const root = path.resolve(__dirname, '../..');

function openApiOperations(): Set<string> {
  const yaml = readFileSync(path.join(root, 'contracts/openapi.yaml'), 'utf8');
  const ops = new Set<string>();
  let currentPath: string | null = null;
  for (const line of yaml.split('\n')) {
    const p = line.match(/^ {2}(\/\S+):\s*$/);
    if (p) {
      currentPath = p[1];
      continue;
    }
    const m = line.match(/^ {4}(get|post|put|patch|delete):/);
    if (m && currentPath) ops.add(`${m[1].toUpperCase()} ${currentPath}`);
  }
  return ops;
}

function frontendOperations(): string[] {
  const featuresDir = path.join(root, 'src/features');
  const ops: string[] = [];
  for (const feature of readdirSync(featuresDir)) {
    let src: string;
    try {
      src = readFileSync(path.join(featuresDir, feature, 'api.ts'), 'utf8');
    } catch {
      continue;
    }
    for (const m of src.matchAll(/http<[^>]*>\(\s*'(GET|POST|PUT|PATCH|DELETE)',\s*[`'"]([^`'"]+)[`'"]/g)) {
      // `${sessionId}` -> {param}, lalu samakan dengan nama param apa pun di OpenAPI.
      ops.push(`${m[1]} ${m[2].replace(/\$\{[^}]+\}/g, '{}')}`);
    }
  }
  return ops;
}

describe('frontend API calls match OpenAPI contract', () => {
  it('every http() call exists in contracts/openapi.yaml', () => {
    const contract = new Set([...openApiOperations()].map((op) => op.replace(/\{[^}]+\}/g, '{}')));
    const calls = frontendOperations();
    expect(calls.length).toBeGreaterThan(20);
    const missing = calls.filter((op) => !contract.has(op));
    expect(missing).toEqual([]);
  });
});
