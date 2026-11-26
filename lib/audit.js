'use strict';
// koru audit: open a prototype in a real browser and check every state it declares.
//   axe-core (WCAG 2.0/2.1/2.2 A and AA rules) · keyboard: focus order, visible focus, traps ·
//   target size (WCAG 2.5.8, 24px) · reflow and overflow at desktop, small laptop, tablet and phone ·
//   design-system lint and token contrast · every State card of the prototype's Screens reachable.
// States: the prototype lists them in <meta name="koru-states" content="STA-001,STA-002"> or as
// data-koru-state attributes, and opens one from the URL: index.html?state=STA-004.

const fs = require('fs');
const path = require('path');
const K = require('./core');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'workstation', width: 1366, height: 768 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'phone', width: 390, height: 844 },
];
const INSTALL = 'koru audit needs a browser and axe-core. Install once:\n  npm --prefix "<plugin>/tools" install && npx --prefix "<plugin>/tools" playwright install chromium\n(<plugin> is the Koru plugin folder; koru doctor prints it.)';

function need(name, root) {
  const tries = [path.join(root, 'node_modules', name), path.join(__dirname, '..', 'tools', 'node_modules', name), name];
  for (const t of tries) { try { return require(t); } catch (e) { /* next */ } }
  return null;
}

async function launch(pw) {
  try { return await pw.chromium.launch(); } catch (e) {
    if (fs.existsSync('/opt/pw-browsers/chromium')) return pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
    throw e;
  }
}

async function auditFile(root, file, opt = {}) {
  const pw = need('playwright', root);
  const axePath = (() => { for (const t of [path.join(root, 'node_modules', 'axe-core'), path.join(__dirname, '..', 'tools', 'node_modules', 'axe-core')]) if (fs.existsSync(path.join(t, 'axe.min.js'))) return path.join(t, 'axe.min.js'); try { return require.resolve('axe-core/axe.min.js'); } catch (e) { return null; } })();
  if (!pw || !axePath) throw new Error(INSTALL);
  const abs = path.resolve(file);
  const html = fs.readFileSync(abs, 'utf8');
  const rel = path.relative(root, abs).split(path.sep).join('/');
  const slugName = rel.replace(/^koru\/deliverables\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-html?$/, '');
  const shotDir = path.join(K.paths(root).generated, 'audit', slugName);
  fs.mkdirSync(shotDir, { recursive: true });

  // States: declared, and expected from the cards.
  const declared = new Set();
  const meta = html.match(/<meta\s+name=["']koru-states["']\s+content=["']([^"']*)["']/i);
  if (meta) meta[1].split(/[,\s]+/).filter(Boolean).forEach((s) => declared.add(s));
  for (const m of html.matchAll(/data-koru-state\s*=\s*["']([A-Z]{3}-\d{3})["']/g)) declared.add(m[1]);
  const cards = K.loadCards(root);
  const screens = K.liveScreens(cards).filter((s) => html.includes(s.id) || String(s.meta.prototype || '').includes(rel));
  const expected = K.active(cards, 'STA').filter((c) => screens.some((s) => s.id === c.meta.screen) && !/^n\/a/i.test(String(c.meta.resolution || '')));

  const browser = await launch(pw);
  const axeSrc = fs.readFileSync(axePath, 'utf8');
  const runs = [];
  const states = ['default', ...declared];
  try {
    for (const state of states) {
      const url = 'file://' + abs + (state === 'default' ? '' : `?state=${encodeURIComponent(state)}`);
      const vps = opt.quick ? [VIEWPORTS[1]] : VIEWPORTS;
      for (const vp of vps) {
        const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
        const errors = [];
        page.on('pageerror', (e) => errors.push(String(e.message || e)));
        await page.goto(url, { waitUntil: 'load' });
        await page.waitForTimeout(150);
        const shown = await page.evaluate((s) => s === 'default' || !!document.querySelector(`[data-koru-state="${s}"]`) || (document.body.dataset.koruState === s), state);
        const layout = await page.evaluate(() => {
          const de = document.documentElement;
          const over = de.scrollWidth > window.innerWidth + 1;
          const clipped = [...document.querySelectorAll('body *')].filter((el) => { const st = getComputedStyle(el); if (st.display === 'none' || st.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.right > window.innerWidth + 1 && st.position !== 'fixed'; }).slice(0, 5).map((el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/)[0] : ''));
          const small = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button],[tabindex]:not([tabindex="-1"])')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24) && !(el.tagName === 'A' && getComputedStyle(el).display === 'inline'); }).slice(0, 8).map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}"`);
          return { overflow: over, scrollWidth: de.scrollWidth, clipped, small };
        });
        let axe = null;
        let keyboard = null;
        if (vp.name === 'workstation') {
          await page.addScriptTag({ content: axeSrc });
          axe = await page.evaluate(async () => {
            const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
            return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, url: v.helpUrl, nodes: v.nodes.length, target: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
          });
          // Keyboard: tab through, record focus order, visible focus and traps.
          const seen = [];
          let noVisible = 0;
          let trap = false;
          for (let i = 0; i < 40; i++) {
            await page.keyboard.press('Tab');
            const f = await page.evaluate(() => {
              const el = document.activeElement;
              if (!el || el === document.body) return null;
              const st = getComputedStyle(el);
              const visible = (st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) > 0) || (st.boxShadow && st.boxShadow !== 'none');
              return { key: el.tagName + '|' + (el.id || '') + '|' + (el.textContent || '').trim().slice(0, 20), label: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || el.value || '').trim().slice(0, 30)}"`, visible };
            });
            if (!f) { if (seen.length) break; continue; }
            if (seen.length > 2 && seen[seen.length - 1].key === f.key && seen[seen.length - 2].key === f.key) { trap = true; break; }
            if (seen.some((x) => x.key === f.key) && seen[0].key === f.key) break;
            seen.push(f);
            if (!f.visible) noVisible++;
          }
          keyboard = { stops: seen.length, order: seen.slice(0, 15).map((x) => x.label), noVisibleFocus: noVisible, trap };
        }
        const shot = path.join(shotDir, `${state}-${vp.name}.png`);
        await page.screenshot({ path: shot, fullPage: false });
        runs.push({ state, viewport: vp.name, width: vp.width, shown, errors, layout, axe, keyboard, screenshot: path.relative(root, shot) });
        await page.close();
      }
    }
  } finally { await browser.close(); }

  // Design-system lint and contrast on the same file.
  const D = require('./ds');
  const lint = D.load(root).ready ? D.lintFile(root, abs) : [];
  const findings = [];
  const add = (level, rule, msg) => findings.push({ level, rule, msg });
  for (const r of runs) {
    if (r.state !== 'default' && !r.shown && r.viewport === 'workstation') add('block', 'state-unreachable', `${r.state}: ?state=${r.state} does not show it (no element with data-koru-state="${r.state}").`);
    for (const e of r.errors) add('block', 'script-error', `${r.state} at ${r.viewport}: ${e}`);
    if (r.layout.overflow && r.viewport !== 'phone') add('block', 'overflow', `${r.state} at ${r.width}px: page scrolls sideways (${r.layout.scrollWidth}px wide)${r.layout.clipped.length ? `; past the edge: ${r.layout.clipped.join(', ')}` : ''}.`);
    if (r.layout.overflow && r.viewport === 'phone') add('warn', 'reflow', `${r.state} at 390px: page scrolls sideways (WCAG 1.4.10 reflow, if the product must work on phones).`);
    if (r.viewport === 'workstation' && r.layout.small.length) add('block', 'target-size', `${r.state}: targets under 24px (WCAG 2.5.8): ${r.layout.small.join(', ')}.`);
    for (const v of r.axe || []) add(['serious', 'critical'].includes(v.impact) ? 'block' : 'warn', `axe:${v.id}`, `${r.state}: ${v.help} (${v.impact}, ${v.nodes} element${v.nodes > 1 ? 's' : ''}: ${v.target.join(' · ')})`);
    if (r.keyboard) {
      if (r.keyboard.trap) add('block', 'keyboard-trap', `${r.state}: focus gets stuck (WCAG 2.1.2).`);
      if (r.keyboard.noVisibleFocus) add('block', 'focus-visible', `${r.state}: ${r.keyboard.noVisibleFocus} of ${r.keyboard.stops} focus stops show no visible focus (WCAG 2.4.7).`);
      if (!r.keyboard.stops) add('warn', 'keyboard', `${r.state}: nothing takes keyboard focus.`);
    }
  }
  for (const s of expected) if (!declared.has(s.id)) add('block', 'state-missing', `${s.id} (${s.meta.title}) is a designed state of ${s.meta.screen} but the prototype does not declare it.`);
  for (const l of lint.filter((x) => x.level === 'block')) add('block', `ds:${l.rule}`, `line ${l.line}: ${l.msg}`);

  const result = {
    file: rel, at: K.now(), hash: require('crypto').createHash('sha256').update(html).digest('hex').slice(0, 16),
    states: states.length, viewports: opt.quick ? 1 : VIEWPORTS.length, screens: screens.map((s) => s.id),
    blocks: findings.filter((f) => f.level === 'block').length, warns: findings.filter((f) => f.level === 'warn').length,
    findings, runs,
    owed: ['Screen reader pass by a person (NVDA or VoiceOver) on the main flow', 'Zoom to 200% and 400% (WCAG 1.4.4, 1.4.10)', 'Forced colours / Windows high contrast', 'Reduced motion (prefers-reduced-motion)', 'Plain-language read of every state\'s copy'],
  };
  K.appendJsonl(K.stateFile(root, 'audits.jsonl'), { file: rel, at: result.at, hash: result.hash, blocks: result.blocks, warns: result.warns, states: result.states });
  fs.writeFileSync(path.join(shotDir, 'audit.json'), JSON.stringify(result, null, 2));
  return result;
}

// The latest audit of a file, and whether it still matches the file as it stands.
function latest(root, rel) {
  const all = K.readJsonl(K.stateFile(root, 'audits.jsonl')).filter((a) => a.file === rel);
  const a = all.pop();
  if (!a) return null;
  const f = path.join(root, rel);
  const hash = fs.existsSync(f) ? require('crypto').createHash('sha256').update(fs.readFileSync(f, 'utf8')).digest('hex').slice(0, 16) : '';
  return { ...a, current: a.hash === hash };
}

function prototypes(root) {
  const d = K.paths(root).deliverables;
  const out = [];
  const walk = (x) => { if (!fs.existsSync(x)) return; for (const f of fs.readdirSync(x)) { const p = path.join(x, f); if (fs.statSync(p).isDirectory()) { if (!/node_modules|src|dist/.test(f)) walk(p); } else if (/\.html?$/i.test(f)) out.push(path.relative(root, p).split(path.sep).join('/')); } };
  walk(d);
  return out;
}

async function cmdAuditAsync(root, pos, opt) {
  const files = pos.length ? pos : prototypes(root).map((f) => path.join(root, f));
  if (!files.length) throw new Error('No prototype to audit. koru audit koru/deliverables/<name>/index.html');
  let blocks = 0;
  for (const f of files) {
    const r = await auditFile(root, f, { quick: !!opt.quick });
    blocks += r.blocks;
    if (opt.json) { console.log(JSON.stringify(r, null, 2)); continue; }
    console.log(`\n${r.file}: ${r.states} state(s) × ${r.viewports} screen size(s) · ${r.blocks} blocking · ${r.warns} warnings`);
    for (const x of r.findings) console.log(`${x.level === 'block' ? '✗' : '!'} [${x.rule}] ${x.msg}`);
    const k = r.runs.find((x) => x.keyboard);
    if (k) console.log(`· Keyboard order (${k.keyboard.stops} stops): ${k.keyboard.order.slice(0, 8).join(' → ')}${k.keyboard.stops > 8 ? ' …' : ''}`);
    console.log(`· Screenshots: ${path.dirname(r.runs[0].screenshot)}/`);
    console.log(`· Still owed by a person: ${r.owed.join('; ')}.`);
  }
  if (blocks) process.exitCode = 1;
}

function cmdAudit(root, pos, opt) {
  cmdAuditAsync(root, pos, opt).catch((e) => { console.error(e.message); process.exitCode = 1; });
}

module.exports = { auditFile, latest, prototypes, cmdAudit, VIEWPORTS };
