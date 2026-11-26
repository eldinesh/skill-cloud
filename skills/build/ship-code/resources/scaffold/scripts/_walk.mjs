import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.some((e) => p.endsWith(e))) out.push(p);
  }
  return out;
}

export function report(code, hits) {
  for (const h of hits) console.log(`FAIL ${code} ${h}`);
  if (hits.length) { console.log(`${code}: ${hits.length} problem(s)`); process.exit(1); }
  console.log(`OK   ${code}`);
}

export const lines = (file) => readFileSync(file, 'utf8').split('\n');
