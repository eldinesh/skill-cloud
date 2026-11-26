// CODE-R22: no keys, tokens or private keys anywhere in the deliverable source.
import { walk, report, lines } from './_walk.mjs';

const patterns = [
  [/sk-[A-Za-z0-9_-]{20,}/, 'api key (sk-)'],
  [/AKIA[0-9A-Z]{16}/, 'cloud access key'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'chat token'],
  [/gh[pousr]_[A-Za-z0-9]{30,}/, 'git host token'],
  [/(?:api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"\s]{12,}['"]/i, 'credential assignment'],
];
const hits = [];
for (const f of [...walk('src', ['.ts', '.tsx', '.css', '.json']), 'index.html', 'vite.config.ts']) {
  lines(f).forEach((l, i) => {
    for (const [re, what] of patterns) if (re.test(l)) hits.push(`${f}:${i + 1} ${what}`);
  });
}
report('check:secrets', hits);
