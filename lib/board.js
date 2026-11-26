'use strict';
// Generates everything people look at from the graph: the board, the decision log, the trace,
// the client page and the Claude project knowledge (finals only). Never edit these by hand.

const fs = require('fs');
const path = require('path');
const K = require('./core');

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function flagsFor(c, cards, wb, prov) {
  const f = [];
  const lp = K.linkProblems(c, cards);
  if (lp.some((p) => p.rule === 'stale')) f.push(['stale', 'Stale: a source changed']);
  if (wb.some((w) => w.id === c.id)) f.push(['writeback', 'Writeback from a decision']);
  if (lp.some((p) => p.rule === 'assumption') || c.type === 'ASM') f.push(['assumption', 'Rests on an assumption']);
  if (prov[c.id]) f.push(['ai', 'Claude drafted or edited this']);
  return f;
}

function chain(cards, id, depth = 0, seen = new Set()) {
  const c = cards[id];
  if (!c || seen.has(id) || depth > 12) return [];
  seen.add(id);
  const ups = c.links.filter((l) => !l.bad && !['affects', 'contradicts', 'supersedes'].includes(l.kind));
  return [{ id, depth, c }, ...ups.flatMap((l) => chain(cards, l.id, depth + 1, seen))];
}

const CLIENT_CSS = ':root{--bg:#f5f6f8;--panel:#fff;--ink:#1b2230;--muted:#5b6577;--line:#e7eaef;--ok:#1e6b3a}@media (prefers-color-scheme:dark){:root{--bg:#11161c;--panel:#1a2129;--ink:#e6ebf1;--muted:#a3adba;--line:#2b3540;--ok:#6cc58d}}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,sans-serif}.doc{max-width:760px;margin:auto;padding:24px 16px}.card{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--ok);border-radius:8px;padding:12px 14px;margin:0 0 12px}.id{font:600 12px ui-monospace,monospace;color:var(--muted)}.muted{color:var(--muted)}.t{display:block;margin:4px 0}';
const APP = fs.readFileSync(path.join(__dirname, 'board-app.html'), 'utf8');
const noRole = (s) => String(s || '').replace(/\s*\([^)]*\)/g, '').trim();
const HIDDEN_FIELDS = new Set(['id', 'type', 'title', 'links', 'owner', 'author', 'roles', 'reviewers']);

function historyOf(p, id) {
  const d = path.join(p.history, id);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).sort().map((f) => {
    const m = f.match(/^(\d{4}-\d{2}-\d{2})T(\d{2})(\d{2})(\d{2})Z-v(\d+)(?:-([a-z]+))?\.md$/);
    return m ? { at: `${m[1]} ${m[2]}:${m[3]}`, version: Number(m[5]), by: m[6] === 'claude' ? 'Claude' : m[6] === 'board' ? 'board edit' : 'koru command', file: f } : { at: '', version: 0, by: '', file: f };
  });
}

// One JSON payload; the page renders it. Names are shown without roles.
function payload(root, cards, ctx) {
  const p = K.paths(root);
  const eng = ctx.eng;
  const log = K.readJsonl(K.stateFile(root, 'log.jsonl'));
  const data = Object.values(cards).sort((x, y) => x.id.localeCompare(y.id)).map((c) => {
    const meta = {};
    for (const [k, v] of Object.entries(c.meta)) if (!HIDDEN_FIELDS.has(k) && K.filled(v)) meta[k] = /signed_by|cosigned_by|approver|seed_author|by$/.test(k) ? [].concat(v).map(noRole).join(', ') : v;
    const problems = K.checkCard(root, c, cards, eng).filter((x) => x.level !== 'info').map((x) => ({ level: x.level, msg: x.msg }));
    const events = log.filter((e) => e.id === c.id).map((e) => ({ at: String(e.at).slice(0, 16).replace('T', ' '), action: e.action, detail: e.reason || e.title || e.decision || '' }));
    return {
      id: c.id, type: c.type, typeName: (K.TYPES[c.type] || {}).name || c.type, stage: c.meta.stage || (K.TYPES[c.type] || {}).stage || 'frame',
      status: c.status, version: c.version, title: c.meta.title || c.id, meta, body: c.body.replace(/^# .*\n+/, ''),
      links: c.links.filter((l) => !l.bad).map((l) => ({ kind: l.kind, id: l.id, why: l.why, pin: l.pin })),
      inbound: K.inbound(cards, c.id).map((x) => ({ id: x.id, kind: (x.links.find((l) => l.id === c.id) || {}).kind })),
      flags: flagsFor(c, cards, ctx.wb, ctx.prov).map(([k, t]) => ({ k, t })),
      problems, history: historyOf(p, c.id), events,
      prov: (ctx.prov[c.id] || []).map((e) => ({ at: String(e.at).slice(0, 16).replace('T', ' '), by: e.by, tool: e.tool })),
      signer: (K.TYPES[c.type] || {}).signer || '', file: path.relative(root, c.file),
    };
  });
  const gates = K.STAGES.map((s) => {
    const r = K.gateReport(root, s, cards);
    return { stage: s, label: K.GATES[s].label, rows: r.rows, ok: r.ok, passed: r.passed ? { by: noRole(r.passed.by), at: r.passed.at } : null };
  });
  let ds = null;
  try {
    const D = require('./ds');
    const chk = D.check(root);
    const l = D.load(root);
    if (l.ready) ds = { system: chk.system, version: chk.version, contrast: chk.contrast, blocks: chk.blocks, warns: chk.warns, additions: chk.additions, newComponents: chk.newComponents, approved: chk.approval.approved ? { by: noRole(chk.approval.by), current: chk.approval.current } : null, components: l.manifest.components.map((x) => ({ name: x.name, status: x.status, spec: x.spec || '' })), gallery: path.relative(p.generated, l.paths.gallery) };
  } catch (e) { ds = null; }
  const audits = K.readJsonl(K.stateFile(root, 'audits.jsonl'));
  const latestAudits = Object.values(audits.reduce((m, a) => { m[a.file] = a; return m; }, {}));
  return {
    client: eng.client || 'Koru project', stage: ctx.stage, generated: K.now(),
    switches: { 'call context': eng.call_context, 'starting point': eng.starting_point, 'product state': eng.product_state, 'design system': eng.design_system, 'AI in the product': eng.ai_in_product, deliverables: [].concat(eng.deliverables || []).join(', '), 'client maturity': eng.client_maturity, 'tech stack': eng.tech_stack, 'AI tier': eng.ai_tier, 'data class': eng.data_class },
    types: K.TYPES, stages: K.STAGES, cards: data, gates, ds, audits: latestAudits, health: ctx.health,
  };
}

function generate(root, { health }) {
  const p = K.paths(root);
  const cards = K.loadCards(root);
  const eng = K.readEngagement(root);
  const wb = K.writebacks(root, cards);
  const prov = K.provenance(root);
  const stage = K.currentStage(root, cards);
  const out = [];
  fs.mkdirSync(p.generated, { recursive: true });
  const decs = Object.values(cards).filter((c) => c.type === 'DEC');

  // ---- board: one self-contained page; the data is embedded, the app renders and filters it.
  const data = payload(root, cards, { eng, wb, prov, stage, health: health(root, cards) });
  const board = APP.replace('__TITLE__', `${esc(data.client)} · Koru board`).replace('/*__DATA__*/null', JSON.stringify(data).replace(/</g, '\\u003c'));
  const boardFile = path.join(p.generated, 'board.html');
  fs.writeFileSync(boardFile, board);
  out.push(boardFile);

  // ---- decision log (markdown)
  const dl = ['# Decision log', '', `Generated ${K.now()} from koru/cards. Do not edit.`, '', '| ID | Question | Outcome | Approver | Status | Affects |', '| --- | --- | --- | --- | --- | --- |']
    .concat(decs.map((d) => `| ${d.id} | ${d.meta.title} | ${(d.meta.outcome || '').replace(/\|/g, '/')} | ${d.meta.approver} | ${d.status}${d.meta.superseded_by ? ' by ' + d.meta.superseded_by : ''} | ${d.links.filter((l) => l.kind === 'affects').map((l) => l.id).join(', ')} |`));
  fs.writeFileSync(path.join(p.generated, 'decisions.md'), dl.join('\n') + '\n');
  out.push(path.join(p.generated, 'decisions.md'));

  // ---- trace (markdown)
  const tr = ['# Trace', ''];
  for (const t of K.active(cards, 'TKT')) { for (const x of chain(cards, t.id)) tr.push(`${'  '.repeat(x.depth)}- ${x.id} ${x.c.meta.title} (${x.c.status})`); tr.push(''); }
  fs.writeFileSync(path.join(p.generated, 'trace.md'), tr.join('\n'));
  out.push(path.join(p.generated, 'trace.md'));

  // ---- client page: finals only, marked client: yes, plus the AI-use note
  const clientCards = Object.values(cards).filter((c) => c.status === 'final' && (c.meta.client === 'yes' || ['BRF', 'PRB', 'MET'].includes(c.type) || (c.type === 'DIR' && c.meta.chosen === 'yes') || (c.type === 'DEC' && K.filled(c.meta.client_commitment))));
  const aiTouched = clientCards.filter((c) => prov[c.id]);
  const md = (t) => esc(t).replace(/^## (.*)$/gm, '<h4>$1</h4>').replace(/\n\n/g, '<br><br>');
  const clientHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(eng.client)} · Koru</title><style>${CLIENT_CSS}</style></head><body><main class="doc"><header><h1>${esc(eng.client)}</h1><div class="muted">Signed work from Koru · ${K.today()}</div></header>
${clientCards.map((c) => `<div class="card final"><span class="id">${c.id}</span><span class="t"><b>${esc(c.meta.title)}</b></span>${md(c.body.replace(/^# .*\n/, ''))}<div class="muted">Signed by ${esc(noRole(c.meta.signed_by))}</div></div>`).join('') || '<p class="muted">Nothing signed for the client yet.</p>'}
<h2>How AI was used</h2><p>${aiTouched.length ? `Claude drafted or edited ${aiTouched.length} of these ${clientCards.length} items (${aiTouched.map((c) => c.id).join(', ')}). A named person at Koru reviewed and signed every item.` : 'No AI-drafted items on this page.'}</p></main></body></html>`;
  fs.mkdirSync(path.join(p.generated, 'client'), { recursive: true });
  fs.writeFileSync(path.join(p.generated, 'client', 'index.html'), clientHtml);
  out.push(path.join(p.generated, 'client', 'index.html'));

  // ---- Claude project knowledge: final cards only
  const kd = path.join(p.generated, 'knowledge');
  fs.rmSync(kd, { recursive: true, force: true });
  fs.mkdirSync(kd, { recursive: true });
  const finals = Object.values(cards).filter((c) => c.status === 'final');
  for (const c of finals) fs.copyFileSync(c.file, path.join(kd, path.basename(c.file)));
  fs.writeFileSync(path.join(kd, 'README.md'), `Final, signed cards only (${finals.length}). Upload these to Claude project knowledge. Drafts never go here.\n`);
  out.push(kd);
  return out;
}

module.exports = { generate, payload };
