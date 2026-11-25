'use strict';
// Koru core: the project graph. Cards are Markdown files with a small YAML header.
// No dependencies: Node 18+ only. Shared by the CLI (lib/koru.js) and the hooks (lib/guard.js).

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------- card types

const STAGES = ['frame', 'explore', 'harden', 'ship'];

// signer = the role that signs a card of this type (spec v2, "Cards with fixed shapes").
const TYPES = {
  CTX: { name: 'Context', stage: 'frame', signer: 'engagement lead' },
  REQ: { name: 'Request', stage: 'frame', signer: 'engagement lead' },
  DAT: { name: 'Data', stage: 'frame', signer: 'research owner' },
  FND: { name: 'Finding', stage: 'frame', signer: 'research owner' },
  INS: { name: 'Insight', stage: 'frame', signer: 'research owner' },
  JOB: { name: 'Job to be done', stage: 'frame', signer: 'research owner' },
  CON: { name: 'Conflict', stage: 'frame', signer: 'research owner' },
  ASM: { name: 'Assumption', stage: 'frame', signer: 'engagement lead' },
  IDE: { name: 'Idea', stage: 'frame', signer: 'engagement lead' },
  HYP: { name: 'Hypothesis', stage: 'frame', signer: 'research owner' },
  PRB: { name: 'Problem', stage: 'frame', signer: 'engagement lead' },
  HMW: { name: 'How might we', stage: 'frame', signer: 'design lead' },
  OPP: { name: 'Opportunity', stage: 'frame', signer: 'engagement lead' },
  BRF: { name: 'Brief', stage: 'frame', signer: 'engagement lead' },
  DIR: { name: 'Direction', stage: 'explore', signer: 'design lead' },
  SCR: { name: 'Screen', stage: 'explore', signer: 'design lead' },
  STA: { name: 'State', stage: 'harden', signer: 'design lead' },
  MET: { name: 'Metric', stage: 'harden', signer: 'engagement lead' },
  TKT: { name: 'Ticket', stage: 'ship', signer: 'engineer' },
  HND: { name: 'Handoff note', stage: 'ship', signer: 'engineer' },
  DEC: { name: 'Decision', stage: null, signer: 'approver' },
  REV: { name: 'Review record', stage: null, signer: 'design lead' },
};

const STATUSES = ['draft', 'review', 'final', 'superseded'];
const EVIDENCE = ['observed', 'story', 'attitude', 'stakeholder', 'document', 'synthetic'];
const CONFIDENCE = ['low', 'medium', 'high'];
const ELEMENT_CLASSES = ['use', 'configure', 'extend', 'recipe', 'snowflake', 'new', 'work-around'];
const CAUSAL = /\b(because|due to|caused by|so that|in order to|leads? to|results? in|therefore|since they)\b/i;
const AMBIGUOUS = /\b(fast|quick(ly)?|intuitive|appropriate(ly)?|user[- ]friendly|easy|easily|simple|seamless(ly)?|robust|efficient(ly)?|as needed|etc\.?|approximately|reasonable|nice|clean)\b/i;
const OPEN_MARKERS = /\b(TBD|TODO|FIXME)\b|\[NEEDS CLARIFICATION\]|\[\?\]/;
const VERBS = /^(add|allow|approve|archive|assign|block|build|cancel|change|choose|clear|close|compare|configure|confirm|connect|copy|create|delete|disable|download|edit|enable|explain|export|filter|find|flag|group|hide|import|invite|link|list|load|log|manage|mark|merge|move|notify|open|override|pause|pick|preview|publish|record|reject|remove|rename|reorder|reply|request|reset|resolve|restore|retry|review|save|schedule|search|select|send|set|share|show|sign|sort|split|start|stop|submit|switch|tag|track|undo|update|upload|validate|verify|view|warn)\b/i;

// Context card: the 12 questions (spec v2, "New card types"). 1 to 5 must be answered for the Brief.
const CTX_QUESTIONS = [
  'Why now', 'Result wanted', 'Users', 'Decider', 'What exists', 'What was tried',
  "Client's ideas", 'Constraints', 'Out of scope', 'Known conflicts', 'Unverified beliefs',
  'Failure in six months',
];

// ---------------------------------------------------------------- tiny YAML

function unquote(s) {
  s = String(s).trim();
  if (!/^["']/.test(s)) s = s.replace(/\s+#\s.*$/, '').trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

function parseYaml(src) {
  const out = {};
  let key = null;
  for (const raw of src.split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const item = raw.match(/^\s*-\s+(.*)$/);
    if (item && key) {
      if (!Array.isArray(out[key])) out[key] = [];
      out[key].push(unquote(item[1]));
      continue;
    }
    const kv = raw.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      let v = kv[2].trim();
      if (!/^["']/.test(v)) v = v.replace(/\s+#\s.*$/, '').trim();
      if (v === '' || v === '~' || v === 'null') out[key] = '';
      else if (v === '[]') out[key] = [];
      else if (v.startsWith('[') && v.endsWith(']')) out[key] = v.slice(1, -1).split(',').map(unquote).map((s) => s.trim()).filter(Boolean);
      else out[key] = unquote(v);
    }
  }
  return out;
}

function splitCard(text) {
  const m = String(text).match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/);
  if (!m) return { meta: {}, body: String(text), header: '', hasHeader: false };
  return { meta: parseYaml(m[1]), body: m[2], header: m[1], hasHeader: true };
}

function fmtValue(v) {
  if (Array.isArray(v)) return v.length ? '\n' + v.map((x) => `  - ${x}`).join('\n') : ' []';
  if (v === undefined || v === null || v === '') return '';
  return ' ' + v;
}

// Set (or add) one header field, keeping every other line as written.
function setField(text, key, value) {
  const c = splitCard(text);
  if (!c.hasHeader) throw new Error('card has no header');
  const lines = c.header.split(/\r?\n/);
  const out = [];
  let i = 0;
  let done = false;
  while (i < lines.length) {
    const kv = lines[i].match(/^([A-Za-z_][\w-]*):/);
    if (kv && kv[1] === key) {
      out.push(`${key}:${fmtValue(value)}`);
      i++;
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) i++; // drop old list items
      done = true;
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  if (!done) out.push(`${key}:${fmtValue(value)}`);
  return `---\n${out.join('\n')}\n---\n${c.body}`;
}

// Markdown body helpers
function sections(body) {
  const out = {};
  let cur = '_intro';
  out[cur] = [];
  for (const line of String(body).split(/\r?\n/)) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) { cur = h[1].toLowerCase(); out[cur] = []; continue; }
    out[cur].push(line);
  }
  const res = {};
  for (const k of Object.keys(out)) res[k] = stripComments(out[k].join('\n'));
  return res;
}

function stripComments(s) { return String(s || '').replace(/<!--[\s\S]*?-->/g, '').trim(); }
function filled(s) { return stripComments(s).replace(/[-*_\s]/g, '').length > 0; }

// ---------------------------------------------------------------- links

// links:
//   - supports FND-003@2: why it supports
//   - contradicts FND-007: why it contradicts
//   - cites DEC-001: context
const LINK_RE = /^(supports|contradicts|cites|reframes|serves|tests|implements|measures|affects|supersedes)\s+([A-Z]{3}-\d{3})(?:@(\d+))?\s*(?::|—|–|-)?\s*(.*)$/;

function parseLinks(meta) {
  const raw = Array.isArray(meta.links) ? meta.links : meta.links ? [meta.links] : [];
  return raw.map((s) => {
    const m = String(s).trim().match(LINK_RE);
    if (!m) return { raw: s, bad: true };
    return { kind: m[1], id: m[2], pin: m[3] ? Number(m[3]) : null, why: m[4].trim(), raw: s };
  });
}

// ---------------------------------------------------------------- project

function findRoot(start) {
  if (process.env.KORU_ROOT) return path.resolve(process.env.KORU_ROOT);
  let d = path.resolve(start || process.cwd());
  for (;;) {
    if (fs.existsSync(path.join(d, 'koru', 'engagement.md'))) return d;
    const p = path.dirname(d);
    if (p === d) return null;
    d = p;
  }
}

function paths(root) {
  const k = path.join(root, 'koru');
  return {
    root, koru: k,
    engagement: path.join(k, 'engagement.md'),
    client: path.join(k, 'client.md'),
    ds: path.join(k, 'design-system.md'),
    cards: path.join(k, 'cards'),
    raw: path.join(k, 'raw'),
    originals: path.join(k, 'raw', 'originals'),
    private: path.join(k, 'private'),
    deliverables: path.join(k, 'deliverables'),
    history: path.join(k, 'history'),
    state: path.join(k, 'state'),
    generated: path.join(k, 'generated'),
  };
}

function readEngagement(root) {
  const p = paths(root).engagement;
  if (!fs.existsSync(p)) return {};
  return splitCard(fs.readFileSync(p, 'utf8')).meta;
}

function cardIdFromPath(file) {
  const m = path.basename(file).match(/^([A-Z]{3}-\d{3})\b/);
  return m ? m[1] : null;
}

function isCardPath(root, file) {
  if (!root || !file) return false;
  const rel = path.relative(paths(root).cards, path.resolve(file));
  return !rel.startsWith('..') && !path.isAbsolute(rel) && /\.md$/.test(rel) && !!cardIdFromPath(file);
}

function loadCards(root) {
  const dir = paths(root).cards;
  const cards = {};
  if (!fs.existsSync(dir)) return cards;
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.md')) continue;
    const file = path.join(dir, f);
    const text = fs.readFileSync(file, 'utf8');
    const c = cardFromText(text, file);
    if (c.id) cards[c.id] = c;
  }
  return cards;
}

function cardFromText(text, file) {
  const { meta, body, hasHeader } = splitCard(text);
  const id = meta.id || cardIdFromPath(file || '');
  const type = meta.type || (id ? id.slice(0, 3) : null);
  return {
    id, type, file, text, meta, body, hasHeader,
    status: meta.status || 'draft',
    version: Number(meta.version || 1),
    links: parseLinks(meta),
    sections: sections(body),
  };
}

function nextId(root, type) {
  const cards = loadCards(root);
  let n = 0;
  for (const id of Object.keys(cards)) if (id.startsWith(type + '-')) n = Math.max(n, Number(id.slice(4)));
  return `${type}-${String(n + 1).padStart(3, '0')}`;
}

// ---------------------------------------------------------------- state files

function stateFile(root, name) { return path.join(paths(root).state, name); }

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

function appendJsonl(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(obj) + '\n');
}

function log(root, action, detail) {
  appendJsonl(stateFile(root, 'log.jsonl'), { at: new Date().toISOString(), action, ...detail });
}

function now() { return new Date().toISOString().replace(/\.\d+Z$/, 'Z'); }
function today() { return new Date().toISOString().slice(0, 10); }

// ---------------------------------------------------------------- quotes

// Quote format inside Finding cards:
//   > "exact words" (P03, 00:12:34, DAT-002)
const QUOTE_RE = /^>\s*["“](.+?)["”]\s*\(\s*(P\d+)\s*,\s*([\d:]+)\s*,\s*(DAT-\d{3})\s*\)\s*$/;

function norm(s) { return String(s).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim(); }

function extractQuotes(body) {
  const out = [];
  for (const line of String(body).split(/\r?\n/)) {
    if (!/^>\s*["“]/.test(line)) continue;
    const m = line.match(QUOTE_RE);
    out.push(m ? { text: m[1], participant: m[2], time: m[3], dat: m[4], line } : { bad: true, line });
  }
  return out;
}

// Returns a list of problems (empty = every quote verified against its transcript).
function verifyQuotes(root, card, cards) {
  const problems = [];
  cards = cards || loadCards(root);
  for (const q of extractQuotes(card.body)) {
    if (q.bad) { problems.push(`Quote not in the required form > "words" (P01, 00:12:34, DAT-001): ${q.line.slice(0, 80)}`); continue; }
    const dat = cards[q.dat];
    if (!dat) { problems.push(`Quote cites ${q.dat}, which does not exist.`); continue; }
    const rel = dat.meta.file;
    if (!rel) { problems.push(`${q.dat} has no transcript file, so the quote cannot be checked.`); continue; }
    const tf = path.resolve(paths(root).koru, rel);
    if (!fs.existsSync(tf)) { problems.push(`${q.dat} points to ${rel}, which is missing.`); continue; }
    const t = norm(fs.readFileSync(tf, 'utf8'));
    const at = t.indexOf(norm(q.text));
    if (at < 0) { problems.push(`"${q.text.slice(0, 60)}" is not word-for-word in ${rel}.`); continue; }
    const before = t.slice(Math.max(0, at - 800), at);
    if (!before.includes(q.time)) problems.push(`"${q.text.slice(0, 40)}": timestamp ${q.time} is not just before it in ${rel}.`);
    const speakers = before.match(/\bP\d+\b/g) || [];
    if (!speakers.length || speakers[speakers.length - 1] !== q.participant) problems.push(`"${q.text.slice(0, 40)}": the speaker in ${rel} is not ${q.participant}.`);
  }
  return problems;
}

// ---------------------------------------------------------------- shapes

function P(level, rule, msg) { return { level, rule, msg }; }

// Per-type shape checks. 'block' = a fact the gate refuses; 'warn' = advice a person weighs.
function checkShape(card, ctx) {
  const m = card.meta;
  const s = card.sections;
  const out = [];
  const need = (field, label) => { if (!filled(m[field])) out.push(P('block', 'shape', `${label || field} is empty.`)); };
  const needSec = (name, label) => { if (!filled(s[name])) out.push(P('block', 'shape', `Section "${label || name}" is empty.`)); };

  if (!card.hasHeader) return [P('block', 'shape', 'Card has no header.')];
  if (!TYPES[card.type]) return [P('block', 'shape', `Unknown card type ${card.type}.`)];
  if (card.id && card.id.slice(0, 3) !== card.type) out.push(P('block', 'shape', `Id ${card.id} does not match type ${card.type}.`));
  if (!filled(m.title)) out.push(P('block', 'shape', 'Title is empty.'));
  if (!STATUSES.includes(card.status)) out.push(P('block', 'shape', `Status must be one of ${STATUSES.join(', ')}.`));
  for (const l of card.links) if (l.bad) out.push(P('block', 'links', `Link not understood: "${l.raw}". Use "supports FND-003: why".`));

  switch (card.type) {
    case 'CTX': {
      CTX_QUESTIONS.forEach((q, i) => {
        const k = q.toLowerCase();
        if (!filled(s[k])) out.push(P(i < 5 ? 'block' : 'warn', 'context', `Context question ${i + 1} (${q}) is blank.`));
      });
      break;
    }
    case 'DAT':
      need('source'); need('consent', 'Consent record'); need('data_class', 'Data class'); need('retention'); need('study');
      if (m.consent && ctx && ctx.engagement && ctx.engagement.ai_processor && !String(m.consent).toLowerCase().includes(String(ctx.engagement.ai_processor).toLowerCase()))
        out.push(P('block', 'consent', `Consent record does not name the AI processor (${ctx.engagement.ai_processor}).`));
      if (/\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(m.participant || '')) out.push(P('block', 'privacy', 'Participant looks like a real name. Use a participant ID (P01).'));
      break;
    case 'FND': {
      need('evidence', 'Evidence type');
      if (m.evidence && !EVIDENCE.includes(m.evidence)) out.push(P('block', 'shape', `Evidence type must be one of ${EVIDENCE.join(', ')}.`));
      if (m.evidence === 'synthetic') out.push(P('block', 'synthetic', 'Synthetic output cannot be a Finding. Make it a Hypothesis (HYP) card.'));
      need('count', 'Count ("6 of 9")');
      needSec('observation');
      if (CAUSAL.test(s.observation || '') || CAUSAL.test(m.title || '')) out.push(P('warn', 'causal', 'The observation uses a causal word. Findings say what happened; the "why" belongs in an Insight.'));
      if (!card.links.some((l) => l.kind === 'supports' && /^DAT-/.test(l.id))) out.push(P('block', 'links', 'A Finding must be supported by at least one Data card.'));
      break;
    }
    case 'INS':
      needSec('what'); needSec('why'); needSec('so what');
      if (s.why && !/\bbecause\b/i.test(s.why)) out.push(P('warn', 'because', 'The "why" has no "because".'));
      if (!card.links.some((l) => l.kind === 'supports' && /^FND-/.test(l.id))) out.push(P('block', 'links', 'An Insight must be supported by at least one Finding.'));
      if (!card.links.some((l) => l.kind === 'contradicts')) out.push(P('warn', 'contradicts', 'No contradicting evidence is linked. Say so explicitly if none was found.'));
      need('confidence'); need('last_validated'); need('review_by');
      if (m.confidence && !CONFIDENCE.includes(m.confidence)) out.push(P('block', 'shape', 'Confidence must be low, medium or high.'));
      if (filled(m.review_by) && String(m.review_by) < today()) out.push(P('warn', 'ageing', `Due for re-validation since ${m.review_by}. Decisions citing it should check it still holds.`));
      break;
    case 'JOB':
      needSec('job'); needSec('forces');
      if (s.job && !/\bwhen\b[\s\S]*\bi want\b[\s\S]*\bso\b/i.test(s.job)) out.push(P('warn', 'shape', 'Job should read "When …, I want to …, so I can …".'));
      if (!card.links.some((l) => /^INS-/.test(l.id))) out.push(P('block', 'links', 'A JTBD must rest on at least one Insight.'));
      break;
    case 'PRB':
      needSec('who'); needSec('what'); needSec('wow');
      if (!card.links.some((l) => /^(INS|JOB)-/.test(l.id))) out.push(P('block', 'links', 'A Problem must cite an Insight or JTBD.'));
      break;
    case 'HMW':
      if (!/^how might we\b/i.test(m.title || '')) out.push(P('block', 'shape', 'Title must start "How might we".'));
      if (!card.links.some((l) => /^PRB-/.test(l.id))) out.push(P('block', 'links', 'Every HMW must cite a Problem.'));
      break;
    case 'OPP':
      need('kind', 'Kind (ux or ai)');
      if (m.kind === 'ai') needSec('ai opportunity statement');
      break;
    case 'CON':
      needSec('positions');
      need('resolution', 'Resolution (open, resolved, client, bet)');
      break;
    case 'IDE':
      needSec('reverse trace');
      break;
    case 'BRF':
      needSec('problem'); needSec('outcome'); needSec('scope');
      break;
    case 'DIR': {
      need('seed_author', 'Seed author'); needSec('core idea'); needSec('hypothesis'); needSec('biggest risk'); needSec('test question');
      need('threshold', 'Pre-set success threshold');
      if (filled(m.result) && !filled(m.threshold_saved_at)) out.push(P('block', 'threshold', 'A result is recorded but the threshold was never saved before testing.'));
      if (filled(m.result) && filled(m.threshold_saved_at) && filled(m.result_at) && m.result_at < m.threshold_saved_at) out.push(P('block', 'threshold', 'The threshold was saved after the result.'));
      if (!card.links.some((l) => /^HMW-/.test(l.id))) out.push(P('block', 'links', 'A Direction must serve at least one HMW.'));
      break;
    }
    case 'SCR': {
      need('flow_step', 'Flow step'); need('ds_version', 'Pinned design-system version');
      const rows = elementRows(s.elements || '');
      if (!rows.length) out.push(P('block', 'elements', 'No elements listed. Every element needs a class.'));
      for (const r of rows) if (!ELEMENT_CLASSES.includes(r.cls)) out.push(P('block', 'elements', `Element "${r.name}" is unclassified (use, configure, extend, recipe, snowflake, new, work-around).`));
      if (!card.links.some((l) => /^DIR-/.test(l.id))) out.push(P('block', 'links', 'A Screen must implement a Direction.'));
      if (ctx && ctx.root && m.ds_version) {
        const dsf = paths(ctx.root).ds;
        const dsv = fs.existsSync(dsf) ? splitCard(fs.readFileSync(dsf, 'utf8')).meta.version : '';
        if (dsv && dsv !== 'unknown' && String(dsv) !== String(m.ds_version)) out.push(P('block', 'stale', `Pinned to design system ${m.ds_version}; the client's system is now ${dsv}. Re-check this Screen and its Tickets.`));
      }
      break;
    }
    case 'STA':
      need('screen'); need('role'); need('state');
      if (!filled(m.resolution)) out.push(P('block', 'matrix', 'Blank state cell. Mark it designed, or n/a with a reason.'));
      else if (/^n\/?a\b/i.test(m.resolution) && !/^n\/?a\s*[:—-]\s*\S/i.test(m.resolution)) out.push(P('block', 'matrix', '"n/a" needs a reason: "n/a: why".'));
      break;
    case 'MET':
      need('level', 'Steer level'); need('threshold', 'Directional threshold'); needSec('feedback loop');
      break;
    case 'TKT':
      for (const p of dor(card, ctx && ctx.cards)) out.push(p);
      break;
    case 'HND':
      needSec('in'); needSec('not in'); needSec('decisions'); needSec('who to ask'); needSec('rabbit holes'); needSec('no-gos');
      break;
    case 'DEC': {
      needSec('question'); needSec('factors'); needSec('options');
      need('approver', 'Approver');
      if (Array.isArray(m.approver) && m.approver.length !== 1) out.push(P('block', 'daci', 'A Decision has exactly one Approver.'));
      if (/,|\band\b/.test(String(m.approver || ''))) out.push(P('block', 'daci', 'A Decision has exactly one Approver.'));
      const f = card.body.indexOf('## Factors'); const o = card.body.indexOf('## Options');
      if (f > -1 && o > -1 && o < f) out.push(P('block', 'daci', 'Factors must be written before the options.'));
      break;
    }
    case 'REV': {
      need('gate', 'Gate (stage)'); need('checker'); need('checklist_version', 'Checklist version');
      for (const f of findingRows(s.findings || '')) if (!/^(fixed|accepted risk|deferred\s+TKT-\d{3}|open)$/i.test(f.disposition)) out.push(P('block', 'review', `Finding ${f.n} needs a disposition: fixed, accepted risk, or deferred TKT-000.`));
      if (findingRows(s.findings || '').some((f) => /^open$/i.test(f.disposition))) out.push(P('block', 'review', 'Some findings are still open.'));
      break;
    }
    default:
  }

  if (card.type === 'FND' && ctx && ctx.root) for (const msg of verifyQuotes(ctx.root, card, ctx.cards)) out.push(P('block', 'quote', msg));
  return out;
}

// Elements table rows: "| element | class | note |" (header and divider skipped)
function elementRows(text) {
  const rows = [];
  for (const line of String(text).split(/\r?\n/)) {
    if (!/^\|/.test(line) || /^\|\s*-/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (!cells.length || /^element$/i.test(cells[0])) continue;
    rows.push({ name: cells[0], cls: (cells[1] || '').toLowerCase() });
  }
  return rows;
}

// Findings in a review record: "1. [CARD-ID] what — disposition"
function findingRows(text) {
  const rows = [];
  for (const line of String(text).split(/\r?\n/)) {
    const m = line.match(/^(\d+)\.\s+(.*)\s+(?:—|--)\s+(.+?)\s*$/);
    if (m) rows.push({ n: m[1], text: m[2], disposition: m[3].trim() });
    else if (/^\d+\.\s+/.test(line)) rows.push({ n: line.match(/^(\d+)/)[1], text: line, disposition: '' });
  }
  return rows;
}

// Definition of Ready for a Ticket.
function dor(card, cards) {
  const out = [];
  const s = card.sections;
  const title = card.meta.title || '';
  if (!VERBS.test(title)) out.push(P('block', 'dor', 'Title must start with a verb (verb plus object).'));
  if (!/\bas an?\b[\s\S]*\bi want\b[\s\S]*\bso that\b/i.test(s['user story'] || '')) out.push(P('block', 'dor', 'User story must read "As a …, I want …, so that …".'));
  const crit = s['acceptance criteria'] || '';
  const gwt = crit.split(/\r?\n/).filter((l) => /\bgiven\b[\s\S]*\bwhen\b[\s\S]*\bthen\b/i.test(l));
  if (!gwt.length) out.push(P('block', 'dor', 'No given/when/then acceptance criteria.'));
  const scr = card.links.filter((l) => /^SCR-/.test(l.id)).map((l) => l.id);
  if (!scr.length) out.push(P('block', 'dor', 'Ticket links to no Screen.'));
  if (!card.links.some((l) => /^JOB-/.test(l.id))) out.push(P('block', 'dor', 'Ticket links to no JTBD.'));
  if (!card.links.some((l) => /^MET-/.test(l.id))) out.push(P('block', 'dor', 'Ticket links to no Metric.'));
  if (cards) {
    for (const sid of scr) {
      const cells = Object.values(cards).filter((c) => c.type === 'STA' && c.meta.screen === sid && c.status !== 'superseded');
      for (const cell of cells) {
        if (/^n\/?a/i.test(cell.meta.resolution || '')) continue;
        if (!crit.includes(cell.id)) out.push(P('block', 'dor', `No acceptance criterion for state ${cell.id} (${cell.meta.role} · ${cell.meta.state}).`));
      }
    }
  }
  const text = [title, s['user story'], crit].join('\n');
  const amb = text.match(AMBIGUOUS);
  if (amb) out.push(P('block', 'ambiguity', `"${amb[0]}" has no measure. Say what number or behaviour proves it.`));
  if (OPEN_MARKERS.test(card.body)) out.push(P('block', 'dor', 'Open clarification marker (TBD, TODO, [?]) in the ticket.'));
  return out;
}

// ---------------------------------------------------------------- graph checks

function linkProblems(card, cards) {
  const out = [];
  for (const l of card.links) {
    if (l.bad) continue;
    const t = cards[l.id];
    if (!t) { out.push(P('block', 'links', `Links to ${l.id}, which does not exist.`)); continue; }
    if (t.status === 'superseded' && l.kind !== 'supersedes') out.push(P('block', 'links', `Cites ${l.id}, which is superseded.`));
    if (l.kind === 'supports' && t.type === 'HYP') out.push(P('block', 'synthetic', `${l.id} is a Hypothesis; it can be tested, never cited as support.`));
    if (l.kind === 'supports' && t.type === 'ASM') out.push(P('warn', 'assumption', `Rests on assumption ${l.id}.`));
    if (l.pin && t.version > l.pin) {
      if (t.status === 'final') out.push(P('block', 'stale', `Stale: pinned to ${l.id}@${l.pin}, now signed at version ${t.version}.`));
      else out.push(P('info', 'revising', `${l.id} is being revised (version ${t.version}, ${t.status}).`));
    }
    if (t.status === 'draft' || t.status === 'review') out.push(P('info', 'draft-source', `Cites ${l.id}, which is not final yet.`));
  }
  return out;
}

function inbound(cards, id) {
  return Object.values(cards).filter((c) => c.links.some((l) => l.id === id && !l.bad));
}

// Accepted decisions flag the cards they name (writeback), one hop.
function writebacks(root, cards) {
  const cleared = readJsonl(stateFile(root, 'flags.jsonl'));
  const out = [];
  for (const d of Object.values(cards)) {
    if (d.type !== 'DEC' || d.meta.status !== 'final') continue;
    for (const l of d.links.filter((x) => x.kind === 'affects')) {
      const t = cards[l.id];
      if (!t) continue;
      const resolved = (l.pin && t.version > l.pin && t.status === 'final') || cleared.some((f) => f.id === l.id && f.decision === d.id);
      if (!resolved) out.push({ id: l.id, decision: d.id, why: l.why });
    }
  }
  return out;
}

function checkCard(root, card, cards, engagement) {
  const ctx = { root, cards, engagement };
  return [...checkShape(card, ctx), ...linkProblems(card, cards)];
}

// ---------------------------------------------------------------- gates

const GATES = {
  frame: { signers: ['engagement lead', 'research owner'], label: 'Frame' },
  explore: { signers: ['design lead'], label: 'Explore' },
  harden: { signers: ['engineer', 'rulebook owner', 'design lead'], label: 'Harden' },
  ship: { signers: ['engineer'], label: 'Ship' },
};

function active(cards, type) { return Object.values(cards).filter((c) => c.type === type && c.status !== 'superseded'); }

function lastChange(cards, stage) {
  let t = '';
  for (const c of Object.values(cards)) if ((TYPES[c.type] || {}).stage === stage && c.type !== 'REV' && String(c.meta.updated || '') > t) t = String(c.meta.updated || '');
  return t;
}

// The exit contract per stage: a list of { ok, item } rows. Deterministic, so a hook can trust it.
function gateReport(root, stage, cards) {
  cards = cards || loadCards(root);
  const eng = readEngagement(root);
  const rows = [];
  const row = (ok, item) => rows.push({ ok: !!ok, item });
  const blockers = (c) => checkCard(root, c, cards, eng).filter((p) => p.level === 'block');

  const noGo = active(cards, 'DEC').find((d) => d.meta.status === 'final' && /no-go/i.test(d.meta.outcome || ''));
  if (stage === 'frame' && noGo) {
    row(true, `No-go decision ${noGo.id} signed by ${noGo.meta.signed_by}: ending discovery is a valid outcome.`);
    return finishGate(root, stage, cards, rows, true);
  }

  if (stage === 'frame') {
    const ctx = active(cards, 'CTX')[0];
    row(ctx && !blockers(ctx).some((p) => p.rule === 'context'), 'Context card: questions 1 to 5 answered');
    const brf = active(cards, 'BRF')[0];
    row(brf && brf.status === 'final', 'Brief is final');
    row(brf && filled(brf.meta.cosigned_by), 'Brief co-signed by the client sponsor');
    const ins = active(cards, 'INS');
    row(ins.length && ins.every((c) => c.status === 'final'), `Every Insight final (${ins.filter((c) => c.status === 'final').length} of ${ins.length})`);
    const prb = active(cards, 'PRB').filter((c) => !/foundation/i.test(c.meta.kind || ''));
    row(prb.length >= 1 && prb.length <= 3, `One to three Problems (${prb.length})`);
    const hmw = active(cards, 'HMW');
    row(hmw.length && hmw.every((c) => c.links.some((l) => /^PRB-/.test(l.id))), 'Every HMW cites a Problem');
    const fnd = active(cards, 'FND');
    const badQuotes = fnd.filter((c) => verifyQuotes(root, c, cards).length);
    row(!badQuotes.length, `Every quote verified against its transcript${badQuotes.length ? ` (failing: ${badQuotes.map((c) => c.id).join(', ')})` : ''}`);
    const openCon = active(cards, 'CON').filter((c) => /^open$/i.test(c.meta.resolution || 'open'));
    row(!openCon.length, `No open Conflicts${openCon.length ? ` (${openCon.map((c) => c.id).join(', ')})` : ''}`);
  }

  if (stage === 'explore') {
    const dirs = active(cards, 'DIR');
    row(dirs.length >= 1 && dirs.length <= 2, `One or two Directions (${dirs.length}); never more than two`);
    row(dirs.every((d) => filled(d.meta.seed_author)), 'Every Direction names its human seed author');
    row(dirs.every((d) => filled(d.meta.threshold_saved_at)), 'Test thresholds saved before testing');
    const chosen = dirs.find((d) => d.meta.chosen === 'yes' || d.meta.chosen === 'true');
    row(chosen && chosen.status === 'final', 'Chosen Direction is final');
    row(chosen && filled(chosen.meta.result), 'Chosen Direction has test evidence');
    const dec = active(cards, 'DEC').find((d) => d.meta.status === 'final' && chosen && d.links.some((l) => l.id === chosen.id));
    row(dec, 'A signed Decision with one Approver chose it');
    row(dec && filled(dec.meta.client_commitment), 'Client commitment (Playback Zero) recorded on that Decision');
  }

  if (stage === 'harden') {
    const scr = active(cards, 'SCR');
    row(scr.length, `Screens exist (${scr.length})`);
    const sta = active(cards, 'STA');
    const blank = sta.filter((c) => blockers(c).some((p) => p.rule === 'matrix'));
    row(sta.length && !blank.length, `No blank state cells (${sta.length} cells${blank.length ? `, blank: ${blank.map((c) => c.id).join(', ')}` : ''})`);
    const noCells = scr.filter((s) => !sta.some((c) => c.meta.screen === s.id));
    row(!noCells.length, `Every Screen has a state matrix${noCells.length ? ` (missing: ${noCells.map((c) => c.id).join(', ')})` : ''}`);
    const uncls = scr.filter((c) => blockers(c).some((p) => p.rule === 'elements'));
    row(!uncls.length, `Every element classified${uncls.length ? ` (open: ${uncls.map((c) => c.id).join(', ')})` : ''}`);
    row(active(cards, 'MET').some((c) => c.status === 'final'), 'At least one Metric is final');
  }

  if (stage === 'ship') {
    const tkt = active(cards, 'TKT');
    row(tkt.length, `Tickets exist (${tkt.length})`);
    const notReady = tkt.filter((c) => dor(c, cards).some((p) => p.level === 'block'));
    row(tkt.length && !notReady.length, `Every Ticket passes Definition of Ready${notReady.length ? ` (failing: ${notReady.map((c) => c.id).join(', ')})` : ''}`);
    const scr = active(cards, 'SCR');
    const orphanScr = scr.filter((s) => !tkt.some((t) => t.links.some((l) => l.id === s.id)));
    row(!orphanScr.length, `No Screen without a Ticket${orphanScr.length ? ` (${orphanScr.map((c) => c.id).join(', ')})` : ''}`);
    row(tkt.every((c) => c.status === 'final'), 'Every Ticket signed by the engineer');
    const hnd = active(cards, 'HND')[0];
    row(hnd && !blockers(hnd).length, 'Handoff note complete, with rabbit holes and no-gos');
  }

  return finishGate(root, stage, cards, rows, false);
}

function finishGate(root, stage, cards, rows, isNoGo) {
  // The checker must have run on the stage as it stands now, and every finding needs a disposition.
  const revs = active(cards, 'REV').filter((r) => r.meta.gate === stage).sort((a, b) => String(b.meta.created).localeCompare(String(a.meta.created)));
  const rev = revs[0];
  const changed = lastChange(cards, stage);
  if (!isNoGo) {
    rows.push({ ok: !!rev, item: `Checker review record for ${stage}` });
    rows.push({ ok: rev && String(rev.meta.created || '') >= changed, item: 'Review is newer than the last change in this stage' });
    rows.push({ ok: rev && !checkShape(rev, {}).some((p) => p.level === 'block'), item: 'Every checker finding has a disposition' });
  }
  const stale = Object.values(cards).filter((c) => (TYPES[c.type] || {}).stage === stage && linkProblems(c, cards).some((p) => p.rule === 'stale'));
  rows.push({ ok: !stale.length, item: `No stale cards${stale.length ? ` (${stale.map((c) => c.id).join(', ')})` : ''}` });
  const passed = readJsonl(stateFile(root, 'gates.jsonl')).filter((g) => g.stage === stage).pop();
  return { stage, rows, ok: rows.every((r) => r.ok), review: rev ? rev.id : null, passed: passed || null };
}

function currentStage(root, cards) {
  const passed = readJsonl(stateFile(root, 'gates.jsonl'));
  for (const s of STAGES) if (!passed.some((g) => g.stage === s)) return s;
  return 'done';
}

// ---------------------------------------------------------------- provenance

function provenance(root) {
  const by = {};
  for (const e of readJsonl(stateFile(root, 'provenance.jsonl'))) {
    (by[e.id] = by[e.id] || []).push(e);
  }
  return by;
}

module.exports = {
  STAGES, TYPES, STATUSES, EVIDENCE, CONFIDENCE, ELEMENT_CLASSES, CTX_QUESTIONS, GATES, AMBIGUOUS, CAUSAL,
  parseYaml, splitCard, setField, sections, filled, parseLinks, findRoot, paths, readEngagement,
  cardIdFromPath, isCardPath, loadCards, cardFromText, nextId, readJsonl, appendJsonl, stateFile, log, now, today,
  extractQuotes, verifyQuotes, checkShape, checkCard, linkProblems, inbound, writebacks, dor, elementRows, findingRows,
  gateReport, currentStage, active, provenance,
};
