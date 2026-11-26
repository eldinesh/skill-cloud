// CODE-R16 / DSY-R05: no raw colours, spacing, durations or z-index outside src/styles/tokens.css.
// CNT-R01: no placeholder copy. Escape hatch for a reviewed exception: a `token-request:` comment on the line.
import { walk, report, lines } from './_walk.mjs';

const hits = [];
for (const f of walk('src', ['.css', '.ts', '.tsx'])) {
  if (f.endsWith('styles/tokens.css')) continue;
  lines(f).forEach((l, i) => {
    if (l.includes('token-request:')) return;
    const at = `${f}:${i + 1}`;
    if (/#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/.test(l) && !/href=|#[a-z-]+["']/.test(l)) hits.push(`${at} raw colour`);
    if (/\b(?:rgba?|hsla?)\(/.test(l)) hits.push(`${at} raw colour function`);
    if (f.endsWith('.css') && /(?:margin|padding|gap|inset|top|left|right|bottom|font-size|line-height|border-radius)[a-z-]*\s*:[^;]*\b\d+(?:\.\d+)?px/.test(l)) hits.push(`${at} raw spacing/size`);
    if (f.endsWith('.css') && /(?:transition|animation)[a-z-]*\s*:[^;]*\b\d+m?s\b/.test(l)) hits.push(`${at} raw duration`);
    if (f.endsWith('.css') && /z-index\s*:\s*\d/.test(l)) hits.push(`${at} raw z-index`);
    if (/lorem ipsum|\bTODO\b|\bTBD\b/i.test(l)) hits.push(`${at} placeholder`);
  });
}
report('check:tokens', hits);
