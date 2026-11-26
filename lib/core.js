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
  // Depth layer (alpha.3): studies, segments, enterprise structure, tests, client playbacks, build contracts.
  STU: { name: 'Study', stage: 'frame', signer: 'research owner' },
  SEG: { name: 'Segment', stage: 'frame', signer: 'research owner' },
  FLW: { name: 'Flow', stage: 'frame', signer: 'design lead' },
  OBJ: { name: 'Object model', stage: 'frame', signer: 'design lead' },
  PRM: { name: 'Permissions', stage: 'frame', signer: 'engagement lead' },
  TST: { name: 'Test', stage: 'explore', signer: 'research owner' },
  PLB: { name: 'Playback', stage: null, signer: 'engagement lead' },
  CMP: { name: 'Component', stage: 'harden', signer: 'design lead' },
  API: { name: 'Data contract', stage: 'ship', signer: 'engineer' },
  QAR: { name: 'QA record', stage: 'ship', signer: 'engineer' },
};
const TYPE_IDS = () => Object.keys(TYPES).join('|');

// Rigour: how much ceremony a project carries. Chosen at the start (engagement.md: rigour, appetite),
// shown on the board, and read by the gates, the checkers and the planner.
const RIGOUR = {
  sprint: {
    label: 'Sprint', floor: 'major', structure: ['FLW'], api: false, metFields: false, secondMethod: 'warn', matrixRoles: 2,
    signers: { frame: ['engagement lead'], explore: ['design lead'], harden: ['design lead', 'engineer'], ship: ['engineer'] },
    note: 'Gates ask only about Blocker and Major findings; the state matrix covers the top two roles; one signer per gate plus the engineer at Harden.',
  },
  standard: {
    label: 'Standard', floor: 'minor', structure: ['FLW', 'OBJ', 'PRM'], api: true, metFields: true, secondMethod: 'warn', matrixRoles: 99,
    signers: { frame: ['engagement lead', 'research owner'], explore: ['design lead'], harden: ['engineer', 'rulebook owner', 'design lead'], ship: ['engineer'] },
    note: 'Every finding needs a disposition; structure (flows, objects, permissions) before Directions; a data contract per Screen.',
  },
  regulated: {
    label: 'Regulated', floor: 'note', structure: ['FLW', 'OBJ', 'PRM'], api: true, metFields: true, secondMethod: 'block', matrixRoles: 99, permCosign: true,
    signers: { frame: ['engagement lead', 'research owner'], explore: ['design lead', 'research owner'], harden: ['engineer', 'rulebook owner', 'design lead'], ship: ['engineer', 'rulebook owner'] },
    note: 'As standard, plus: an Insight behind an irreversible decision needs two methods, the client co-signs Permissions, and notes need dispositions too.',
  },
};
function rigour(eng) {
  const k = String((eng && eng.rigour) || 'standard').toLowerCase();
  return { key: RIGOUR[k] ? k : 'standard', ...(RIGOUR[k] || RIGOUR.standard) };
}

// Checker finding severity. Untagged findings count as major.
const SEVERITIES = ['blocker', 'major', 'minor', 'note'];
function atOrAbove(sev, floor) { return SEVERITIES.indexOf(sev) <= SEVERITIES.indexOf(floor); }

const STATUSES = ['draft', 'review', 'final', 'superseded'];
const EVIDENCE = ['observed', 'story', 'attitude', 'stakeholder', 'document', 'analytics', 'support', 'expert', 'synthetic'];
const QUANT = ['analytics', 'support'];
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
const LINK_RE = /^(supports|contradicts|cites|reframes|serves|tests|implements|measures|affects|supersedes|uses|covers)\s+([A-Z]{3}-\d{3})(?:@(\d+))?\s*(?::|—|–|-)?\s*(.*)$/;

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
  const dups = [];
  Object.defineProperty(cards, '__dups', { value: dups, enumerable: false });
  if (!fs.existsSync(dir)) return cards;
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.md')) continue;
    const file = path.join(dir, f);
    const text = fs.readFileSync(file, 'utf8');
    const c = cardFromText(text, file);
    if (!c.id) continue;
    // Two people (or two sessions) minted the same id on different branches: keep the earlier card
    // here and report the clash; koru ids --fix renumbers the later one.
    if (cards[c.id]) {
      const a = cards[c.id];
      const later = String(c.meta.created || '') >= String(a.meta.created || '') ? c : a;
      dups.push({ id: c.id, kept: later === c ? a.file : c.file, clash: later.file });
      if (later === a) cards[c.id] = c;
      continue;
    }
    cards[c.id] = c;
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
  const hist = fs.existsSync(paths(root).history) ? fs.readdirSync(paths(root).history) : [];
  let branches = [];
  try { branches = require('./team').idsOnBranches(root); } catch {}
  const resDir = path.join(paths(root).state, 'ids');
  const reserved = fs.existsSync(resDir) ? fs.readdirSync(resDir) : [];
  for (const id of Object.keys(cards).concat(hist, branches, reserved)) if (id.startsWith(type + '-')) n = Math.max(n, Number(id.slice(4)) || 0);
  // Reserve atomically, so parallel agents on one machine never mint the same id.
  fs.mkdirSync(resDir, { recursive: true });
  for (let i = 1; i < 1000; i++) {
    const id = `${type}-${String(n + i).padStart(3, '0')}`;
    try { fs.closeSync(fs.openSync(path.join(resDir, id), 'wx')); return id; } catch (e) { if (e.code !== 'EEXIST') throw e; }
  }
  throw new Error(`could not reserve a ${type} id`);
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
// > "exact words" (P03, 00:12:34, DAT-002). The timestamp is optional for transcripts without one,
// and the speaker may be a participant code or a named stakeholder ("Tom Okafor").
const QUOTE_RE = /^>\s*["“](.+?)["”]\s*\(\s*([^,()]+?)\s*,\s*(?:(\d{1,2}:\d{2}(?::\d{2})?)\s*,\s*)?(DAT-\d{3})\s*\)\s*$/;
// Speaker labels in a transcript: "[00:01:10] P01:", "**P01:**", "Tom Okafor:", "**Int:**".
const SPEAKER_RE = /(?:^|\n)[ \t]*(?:\[[^\]\n]*\][ \t]*)?\*{0,2}([A-Z][A-Za-z0-9 .'-]{0,40}?)\*{0,2}[ \t]*:/g;

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
    if (q.bad) { problems.push(`Quote not in the required form > "words" (P01, 00:12:34, DAT-001), timestamp optional: ${q.line.slice(0, 80)}`); continue; }
    const dat = cards[q.dat];
    if (!dat) { problems.push(`Quote cites ${q.dat}, which does not exist.`); continue; }
    const rel = dat.meta.file;
    if (!rel) { problems.push(`${q.dat} has no transcript file, so the quote cannot be checked.`); continue; }
    // A transcript lives in koru/raw (research, pseudonymised) or anywhere in the project (client material such as inbox/).
    const tf = [path.resolve(paths(root).koru, rel), path.resolve(root, rel)].find((f) => fs.existsSync(f)) || path.resolve(paths(root).koru, rel);
    if (!fs.existsSync(tf)) { problems.push(`${q.dat} points to ${rel}, which is missing.`); continue; }
    // Normalise each line but keep the line breaks, so speaker labels stay at line starts.
    const t = fs.readFileSync(tf, 'utf8').split(/\r?\n/).map(norm).join('\n');
    const at = t.indexOf(norm(q.text));
    if (at < 0) { problems.push(`"${q.text.slice(0, 60)}" is not word-for-word in ${rel}.`); continue; }
    const before = t.slice(Math.max(0, at - 800), at);
    if (q.time && !before.includes(q.time)) problems.push(`"${q.text.slice(0, 40)}": timestamp ${q.time} is not just before it in ${rel}.`);
    const labels = [...(before + t.slice(at, at + 1)).matchAll(SPEAKER_RE)].map((m) => m[1].trim());
    const last = labels[labels.length - 1] || '';
    const who = String(q.participant).trim().toLowerCase();
    if (!last || !(last.toLowerCase() === who || last.toLowerCase().split(/\s+/)[0] === who.split(/\s+/)[0])) problems.push(`"${q.text.slice(0, 40)}": the speaker in ${rel} is ${last || 'unclear'}, not ${q.participant}.`);
  }
  return problems;
}

// ---------------------------------------------------------------- confidence signals

// What the evidence under an Insight actually shows, so a person's rating can be checked by numbers.
function confidenceSignals(card, cards) {
  const fnds = card.links.filter((l) => l.kind === 'supports' && /^FND-/.test(l.id)).map((l) => cards[l.id]).filter(Boolean);
  const parts = new Set();
  const segs = new Set();
  const ev = new Set();
  const methods = new Set();
  for (const f of fnds) {
    for (const p of String(f.meta.participants || '').match(/\b[A-Z]{1,3}\d{2,3}\b/g) || []) parts.add(p);
    for (const q of extractQuotes(f.sections.quotes || '')) if (q.participant) parts.add(q.participant);
    if (filled(f.meta.segment)) segs.add(String(f.meta.segment).toLowerCase());
    if (filled(f.meta.evidence)) ev.add(String(f.meta.evidence));
    for (const l of f.links) if (l.kind === 'supports' && cards[l.id] && cards[l.id].type === 'DAT') methods.add(String(cards[l.id].meta.kind || cards[l.id].meta.method || 'interview').toLowerCase());
  }
  const contradicting = card.links.filter((l) => l.kind === 'contradicts').length;
  const conf = String(card.meta.confidence || '');
  const mismatches = [];
  const n = parts.size;
  if (conf === 'high' && n < 3) mismatches.push(`Rated high on ${n} participant(s). High usually needs three or more, from more than one segment.`);
  if (conf === 'high' && fnds.length < 2) mismatches.push(`Rated high on ${fnds.length} Finding(s).`);
  if (conf === 'high' && ev.size && ![...ev].some((e) => e === 'observed' || e === 'document')) mismatches.push('Rated high on self-report only (no observed behaviour or documents).');
  if (conf === 'high' && methods.size < 2) mismatches.push('Rated high on one method. An Insight feeding an irreversible decision needs a second method or a second analyst.');
  const triangulated = [...ev].some((e) => QUANT.includes(e)) && [...ev].some((e) => !QUANT.includes(e) && e !== 'synthetic');
  if (conf === 'low' && n >= 5 && contradicting === 0) mismatches.push(`Rated low, yet ${n} participants support it with nothing against. Check the rating is not too cautious.`);
  return { participants: [...parts], segments: [...segs], evidence: [...ev], methods: [...methods], findings: fnds.length, contradicting, mismatches, triangulated };
}

// ---------------------------------------------------------------- shapes

// "7 of 10", "7/10", "70%", "at least 7 of 10 finish unaided" -> { need, of } or { pct }.
function parseThreshold(t) {
  const s = String(t || '');
  let m = s.match(/(\d+)\s*(?:of|\/|out of)\s*(\d+)/i);
  if (m) return { need: Number(m[1]), of: Number(m[2]), pct: Number(m[1]) / Number(m[2]) };
  m = s.match(/(\d+(?:\.\d+)?)\s*%/);
  if (m) return { pct: Number(m[1]) / 100 };
  return null;
}

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
      need('source'); need('data_class', 'Data class'); need('retention'); need('study');
      if (!/^(analytics|support|document)$/.test(m.kind || '')) need('consent', 'Consent record');
      if (/^(analytics|support)$/.test(m.kind || '')) { need('query', 'Query or export used'); need('period'); need('denominator', 'Denominator (out of how many)'); }
      if (m.consent && ctx && ctx.engagement && ctx.engagement.ai_processor && !String(m.consent).toLowerCase().includes(String(ctx.engagement.ai_processor).toLowerCase()))
        out.push(P('block', 'consent', `Consent record does not name the AI processor (${ctx.engagement.ai_processor}).`));
      if (/\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(m.participant || '')) out.push(P('block', 'privacy', 'Participant looks like a real name. Use a participant ID (P01).'));
      break;
    case 'FND': {
      need('evidence', 'Evidence type');
      if (m.evidence && !EVIDENCE.includes(m.evidence)) out.push(P('block', 'shape', `Evidence type must be one of ${EVIDENCE.join(', ')}.`));
      if (m.evidence === 'synthetic') out.push(P('block', 'synthetic', 'Synthetic output cannot be a Finding. Make it a Hypothesis (HYP) card.'));
      need('count', 'Count ("6 of 9")');
      if (filled(m.severity) && !/^[0-4]$/.test(String(m.severity))) out.push(P('block', 'shape', 'Severity is 0 to 4 (Nielsen: 0 not a problem, 4 catastrophe).'));
      if (/^(observed|expert)$/.test(m.evidence || '') && card.links.some((l) => l.kind === 'tests') && !filled(m.severity)) out.push(P('block', 'shape', 'A usability issue from a test or expert review needs a severity (0 to 4).'));
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
      if (ctx && ctx.cards) {
        const sig = confidenceSignals(card, ctx.cards);
        out.push(P('signal', 'signals', `Signals: ${sig.participants.length} participant(s), ${sig.segments.length} segment(s), ${sig.methods.length} method(s), evidence ${sig.evidence.join(' · ') || 'none'}, ${sig.contradicting} contradicting link(s)${sig.triangulated ? ', triangulated (qualitative and quantitative agree)' : ''}.`));
        const strict = rigour(ctx.engagement).secondMethod === 'block';
        for (const w of sig.mismatches) out.push(P(strict && /one method/.test(w) ? 'block' : 'warn', 'confidence', w));
      }
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
      if (ctx && ctx.cards && active(ctx.cards, 'DAT').some((d) => QUANT.includes(d.meta.kind)) && !/\d/.test(s.wow || '')) out.push(P('warn', 'sizing', 'Analytics or support data exists, but the Wow has no number. Size the problem from it (a baseline).'));
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
      const tested = ctx && ctx.cards && Object.values(ctx.cards).some((t) => t.type === 'TST' && t.status !== 'superseded' && t.links.some((l) => l.kind === 'tests' && l.id === card.id));
      if (!tested) need('threshold', 'Pre-set success threshold (or a Test card that tests this Direction)');
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
      if (ctx && ctx.cards && active(ctx.cards, 'FLW').length && !/FLW-\d{3}/.test(String(m.flow_step || ''))) out.push(P('warn', 'flow', 'Name the flow step this Screen implements (flow_step: FLW-002 step 3).'));
      if (ctx && ctx.root && m.ds_version) {
        const dsf = paths(ctx.root).ds;
        const dsv = fs.existsSync(dsf) ? splitCard(fs.readFileSync(dsf, 'utf8')).meta.version : '';
        if (dsv && dsv !== 'unknown' && String(dsv) !== String(m.ds_version)) out.push(P('block', 'stale', `Pinned to design system ${m.ds_version}; the client's system is now ${dsv}. Re-check this Screen and its Tickets.`));
      }
      break;
    }
    case 'STA':
      need('screen'); need('role'); need('state');
      if (ctx && ctx.cards && filled(m.role)) {
        const prm = active(ctx.cards, 'PRM')[0];
        const roles = prm ? tableRows(prm.sections.matrix || '').header.slice(1).map((h) => h.toLowerCase()) : [];
        if (roles.length && !roles.some((r) => String(m.role).toLowerCase().includes(r) || r.includes(String(m.role).toLowerCase()))) out.push(P('warn', 'matrix', `Role "${m.role}" is not in the Permissions matrix (${roles.join(', ')}).`));
      }
      if (!filled(m.resolution)) out.push(P('block', 'matrix', 'Blank state cell. Mark it designed, or n/a with a reason.'));
      else if (/^n\/?a\b/i.test(m.resolution) && !/^n\/?a\s*[:—-]\s*\S/i.test(m.resolution)) out.push(P('block', 'matrix', '"n/a" needs a reason: "n/a: why".'));
      break;
    case 'MET':
      need('level', 'Steer level'); need('threshold', 'Directional threshold'); needSec('feedback loop');
      if (ctx && ctx.engagement && rigour(ctx.engagement).metFields) for (const [f, l] of [['baseline', 'Baseline (today\'s number, or "none yet: how we get one")'], ['source', 'Data source'], ['events', 'Event names to instrument'], ['metric_owner', 'Owner after launch (metric_owner)']]) need(f, l);
      if (!filled(m.guardrail)) out.push(P('warn', 'metric', 'No guardrail metric (what must not get worse).'));
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
      const floor = rigour(ctx && ctx.engagement).floor;
      const rows = findingRows(s.findings || '');
      for (const f of rows) {
        const owed = atOrAbove(f.severity, floor);
        if (!DISPOSITION.test(f.disposition)) out.push(P(owed ? 'block' : 'warn', 'review', `Finding ${f.n} needs a disposition: fixed, accepted risk, rejected: why, or deferred TKT-000 (a short reason may follow a colon).`));
        else if (/^open$/i.test(f.disposition) && !owed) out.push(P('info', 'review', `Finding ${f.n} (${f.severity}) is below this project's severity floor (${floor}); it stays as a note.`));
      }
      if (rows.some((f) => /^open$/i.test(f.disposition) && atOrAbove(f.severity, floor))) out.push(P('block', 'review', 'Some findings are still open.'));
      break;
    }
    case 'STU':
      need('method', 'Method'); needSec('research questions'); needSec('participants'); needSec('consent');
      if (!card.links.some((l) => /^SEG-/.test(l.id))) out.push(P('warn', 'segments', 'The study names no Segment cards. Recruit against segments (serves SEG-001: why).'));
      break;
    case 'SEG':
      need('kind', 'Kind (segment or role)'); needSec('who'); needSec('evidence');
      if (!card.links.some((l) => /^(FND|DAT|CTX|INS)-/.test(l.id))) out.push(P('warn', 'links', 'A Segment should rest on Data, Findings or the Context card.'));
      break;
    case 'FLW': {
      need('kind', 'Kind (current or future)');
      if (m.kind && !/^(current|future)$/.test(m.kind)) out.push(P('block', 'shape', 'Kind must be current or future.'));
      const t = tableRows(s.steps || '');
      if (!t.rows.length) out.push(P('block', 'flow', 'No steps. One row per step: | # | Step | Actor | Workaround or pain | Handoff |'));
      const actor = t.header.findIndex((h) => /actor|role/i.test(h));
      if (actor > -1 && t.rows.some((r) => !filled(r[actor]))) out.push(P('block', 'flow', 'Every step names its actor.'));
      if (m.kind === 'current' && !card.links.some((l) => /^(FND|DAT|INS)-/.test(l.id))) out.push(P('warn', 'links', 'A current flow should rest on observed Findings or Data.'));
      if (m.kind === 'future' && !card.links.some((l) => /^(DIR|HMW|FLW)-/.test(l.id))) out.push(P('block', 'links', 'A future flow serves a Direction or HMW and names the current flow it replaces.'));
      break;
    }
    case 'OBJ': {
      const t = tableRows(s.objects || '');
      if (!t.rows.length) out.push(P('block', 'shape', 'No objects. One row per object: | Object | Key attributes | Relationships | Actions |'));
      for (const r of t.rows) if (r.slice(1).some((c) => !filled(c))) out.push(P('warn', 'shape', `Object "${r[0]}" has blank cells.`));
      break;
    }
    case 'PRM': {
      const t = tableRows(s.matrix || '');
      if (t.header.length < 2 || !t.rows.length) out.push(P('block', 'shape', 'No matrix. | Action | Role A | Role B | with yes, no, own, approve or view in every cell.'));
      const unk = []; const odd = [];
      for (const r of t.rows) t.header.slice(1).forEach((role, i) => {
        const v = String(r[i + 1] || '').toLowerCase();
        if (!filled(v)) out.push(P('block', 'matrix', `Blank cell: ${role} × ${r[0]}.`));
        else if (/^(unknown|\?|tbc|ask)\b/.test(v)) unk.push(`${role} × ${r[0]}`);
        else if (!/^(yes|no|own|approve|view|request|n\/a)\b/.test(v)) odd.push(`${role} × ${r[0]} ("${r[i + 1]}")`);
      });
      const few = (a) => `${a.slice(0, 4).join('; ')}${a.length > 4 ? `; and ${a.length - 4} more` : ''}`;
      if (unk.length) out.push(P('warn', 'matrix', `${unk.length} cell(s) marked unknown, to ask the client before Harden: ${few(unk)}.`));
      if (odd.length) out.push(P('warn', 'matrix', `${odd.length} cell(s) outside yes, no, own, approve, view, request or unknown: ${few(odd)}.`));
      if (ctx && ctx.cards) {
        const segs = active(ctx.cards, 'SEG').map((x) => String(x.meta.title || '').toLowerCase());
        const unknown = t.header.slice(1).filter((h) => segs.length && !segs.some((sg) => sg.includes(h.toLowerCase()) || h.toLowerCase().includes(sg)));
        if (unknown.length) out.push(P('warn', 'segments', `Roles with no Segment card: ${unknown.join(', ')}.`));
      }
      if (ctx && ctx.engagement && rigour(ctx.engagement).permCosign && card.status === 'final' && !filled(m.cosigned_by)) out.push(P('block', 'cosign', 'Regulated rigour: the client co-signs Permissions.'));
      break;
    }
    case 'TST': {
      need('task', 'Task'); need('threshold', 'Numeric threshold ("7 of 10" or "70%")');
      if (filled(m.threshold) && !parseThreshold(m.threshold)) out.push(P('block', 'threshold', `Threshold "${m.threshold}" is not a number. Write "7 of 10 finish unaided" or "80%".`));
      if (!card.links.some((l) => l.kind === 'tests' && /^DIR-/.test(l.id))) out.push(P('block', 'links', 'A Test tests a Direction (tests DIR-001: why).'));
      if (!filled(m.hard_case)) out.push(P('warn', 'hard-case', 'Name the hard case the task uses (workaround, scale, wrong data or a wrong AI suggestion).'));
      if (!filled(m.segment) || !/SEG-\d{3}/.test(String(m.segment))) out.push(P('warn', 'segments', 'Name the Segment the participants come from (segment: SEG-001).'));
      if (filled(m.result) && !filled(m.threshold_saved_at)) out.push(P('block', 'threshold', 'A result is recorded but the threshold was never saved before testing.'));
      if (filled(m.result_at) && filled(m.threshold_saved_at) && m.result_at < m.threshold_saved_at) out.push(P('block', 'threshold', 'The threshold was saved after the result.'));
      break;
    }
    case 'PLB': {
      need('kind', 'Kind (hills, -2, -1, zero, delivery)'); need('held_at', 'When it was held'); need('attendees');
      const t = tableRows(s.feedback || '');
      const ti = t.header.findIndex((h) => /^type$/i.test(h));
      for (const r of t.rows) if (ti > -1 && !/^(evidence|constraint|idea|preference|decision)$/i.test(r[ti] || '')) out.push(P('block', 'feedback', `Feedback "${(r[1] || '').slice(0, 40)}" needs a type: evidence, constraint, idea, preference or decision.`));
      const bi = t.header.findIndex((h) => /becomes/i.test(h));
      for (const r of t.rows) if (bi > -1 && !filled(r[bi]) && !/preference/i.test(r[ti] || '')) out.push(P('warn', 'feedback', `Feedback "${(r[1] || '').slice(0, 40)}" has not become a card yet (REQ, IDE, FND or DEC).`));
      break;
    }
    case 'CMP':
      need('ds_status', 'Status in the design system (exists, new, snowflake)'); needSec('anatomy'); needSec('states'); needSec('accessibility');
      if (/snowflake/i.test(m.ds_status || '') && !card.links.some((l) => /^DEC-/.test(l.id))) out.push(P('block', 'links', 'A snowflake component needs a Decision (cites DEC-001: why).'));
      break;
    case 'API': {
      need('screen');
      if (!tableRows(s.fields || '').rows.length) out.push(P('block', 'contract', 'No fields. | Field | Type | Required | Source | Validation |'));
      const e = tableRows(s.errors || '');
      if (!e.rows.length) out.push(P('block', 'contract', 'No errors. | Code | When | Message the user sees | State |'));
      const mi = e.header.findIndex((h) => /message/i.test(h));
      if (mi > -1 && e.rows.some((r) => !filled(r[mi]))) out.push(P('block', 'contract', 'Every error code maps to a message the user sees.'));
      break;
    }
    case 'QAR': {
      need('build_url', 'Build URL'); need('compared_version', 'Card versions compared');
      const t = tableRows(s.evidence || '');
      if (!t.rows.length) out.push(P('block', 'shape', 'No evidence rows. | Criterion | Evidence | Result |'));
      if (t.rows.some((r) => /fail/i.test(r[r.length - 1] || ''))) out.push(P('warn', 'qa', 'Some criteria fail. Open a Ticket or a Decision for each.'));
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

// Dispositions a person may give a checker finding. A reason may follow a colon; "rejected" needs one.
const DISPOSITION = /^(fixed|accepted risk|deferred\s+TKT-\d{3}|open)(\s*[:—-]\s*.+)?$|^rejected\s*[:—-]\s*\S.+$/i;

// Findings in a review record:
//   1. [MAJOR][RC-05][INS-002] what · evidence: … · confidence: high — disposition
// Severity and rule are optional (old reviews: "1. [INS-002] what — disposition"); untagged counts as major.
function findingRows(text) {
  const rows = [];
  for (const line of String(text).split(/\r?\n/)) {
    let m = line.match(/^(\d+)\.\s+(.*)\s+(?:—|--)\s+(.+?)\s*$/);
    const row = m ? { n: m[1], text: m[2], disposition: m[3].trim() } : /^\d+\.\s+/.test(line) ? { n: line.match(/^(\d+)/)[1], text: line, disposition: '' } : null;
    if (!row) continue;
    const tags = [...row.text.matchAll(/\[([^\]]+)\]/g)].map((x) => x[1].trim());
    const sev = tags.map((t) => t.toLowerCase()).find((t) => SEVERITIES.includes(t));
    row.severity = sev || 'major';
    row.rule = tags.find((t) => /^[A-Z]{2,4}-\d{2}$/.test(t) && !TYPES[t.slice(0, 3)]) || '';
    row.cards = [...new Set((row.text.match(new RegExp(`\\b(?:${TYPE_IDS()})-\\d{3}\\b`, 'g')) || []))];
    const conf = row.text.match(/confidence:\s*(low|medium|high)/i);
    row.confidence = conf ? conf[1].toLowerCase() : '';
    row.kind = /^rejected/i.test(row.disposition) ? 'rejected' : /^fixed/i.test(row.disposition) ? 'fixed' : /^accepted risk/i.test(row.disposition) ? 'accepted' : /^deferred/i.test(row.disposition) ? 'deferred' : 'open';
    rows.push(row);
  }
  return rows;
}

// Simple Markdown table: [{ header cells }, rows of cells]. Divider rows are skipped.
function tableRows(text) {
  const lines = String(text).split(/\r?\n/).filter((l) => /^\s*\|/.test(l));
  const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
  if (!lines.length) return { header: [], rows: [] };
  const header = cells(lines[0]);
  const rows = lines.slice(1).filter((l) => !/^\s*\|\s*:?-{2,}/.test(l)).map(cells).filter((r) => r.some((c) => c));
  return { header, rows };
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
  const out = [...checkShape(card, ctx), ...linkProblems(card, cards)];
  if (card.type !== 'REV') {
    const ghosts = [...new Set(String(card.body || '').match(new RegExp(`\\b(?:${TYPE_IDS()})-\\d{3}\\b`, 'g')) || [])].filter((id) => !cards[id]);
    if (ghosts.length) out.push(P('warn', 'mentions', `The text mentions ${ghosts.join(', ')}, which ${ghosts.length > 1 ? 'do' : 'does'} not exist.`));
  }
  return out;
}

// ---------------------------------------------------------------- gates

const GATES = {
  frame: { signers: ['engagement lead', 'research owner'], label: 'Frame' },
  explore: { signers: ['design lead'], label: 'Explore' },
  harden: { signers: ['engineer', 'rulebook owner', 'design lead'], label: 'Harden' },
  ship: { signers: ['engineer'], label: 'Ship' },
};

// Who signs a gate's review and passes it, by the project's rigour profile.
function gateSigners(root, stage) {
  const r = rigour(readEngagement(root));
  return (r.signers && r.signers[stage]) || (GATES[stage] || { signers: [] }).signers;
}

function active(cards, type) { return Object.values(cards).filter((c) => c.type === type && c.status !== 'superseded'); }

// What a card says, ignoring sign-off bookkeeping (status, signatures, version pins, timestamps),
// so signing after a review does not count as a change but any edit, by anyone, does.
const BOOKKEEPING = new Set(['status', 'version', 'signed_by', 'signed_at', 'cosigned_by', 'cosigned_at', 'reviewers', 'updated', 'superseded_by', 'signature', 'signed_email', 'signed_commit', 'human_edit']);
function contentHash(card) {
  const meta = {};
  for (const k of Object.keys(card.meta).sort()) if (!BOOKKEEPING.has(k)) meta[k] = card.meta[k];
  if (Array.isArray(meta.links)) meta.links = meta.links.map((l) => String(l).replace(/@\d+/, ''));
  return require('crypto').createHash('sha1').update(JSON.stringify(meta) + '\n' + String(card.body || '').trim()).digest('hex').slice(0, 16);
}
// A signature is the content hash at signing. A signed card whose content no longer matches was
// edited outside Koru (by hand, or through a merge) and is reported until it is revised and re-signed.
function signatureProblems(cards) {
  const out = [];
  for (const c of Object.values(cards)) {
    if (c.status !== 'final' || !filled(c.meta.signature)) continue;
    const want = String(c.meta.signature).split(/[@\s]/)[0];
    if (want && want !== contentHash(c)) out.push({ card: c, want, got: contentHash(c) });
  }
  return out;
}

function stageCards(cards, stage) {
  return Object.values(cards).filter((c) => c.type !== 'REV' && (c.meta.stage || (TYPES[c.type] || {}).stage) === stage);
}
function reviewSnapshot(cards, stage) {
  const out = {};
  for (const c of stageCards(cards, stage)) out[c.id] = contentHash(c);
  return out;
}
// Cards changed since a review, and whether each change is a fix the review names.
function changesSince(root, rev, cards, stage) {
  const snap = readJsonl(stateFile(root, 'reviews.jsonl')).filter((x) => x.rev === rev.id).pop();
  if (!snap) return null;
  const now = reviewSnapshot(cards, stage);
  const ids = new Set([...Object.keys(snap.hashes), ...Object.keys(now)]);
  const fixed = new Set();
  const fixedTypes = new Set();
  for (const f of findingRows(rev.sections.findings || '')) {
    if (!/^fixed/i.test(f.disposition)) continue;
    for (const id of f.text.match(/[A-Z]{3}-\d{3}/g) || []) fixed.add(id);
    // Ranges such as [JOB-001..003] and whole types such as [IDE] (a finding that asks for new cards).
    for (const m of f.text.matchAll(/\b([A-Z]{3})-(\d{3})\.\.(?:[A-Z]{3}-)?(\d{3})\b/g)) for (let n = Number(m[2]); n <= Number(m[3]); n++) fixed.add(`${m[1]}-${String(n).padStart(3, '0')}`);
    for (const m of f.text.matchAll(/\[([A-Z]{3})\]/g)) fixedTypes.add(m[1]);
  }
  const changed = [...ids].filter((id) => snap.hashes[id] !== now[id]);
  const direct = (id) => fixed.has(id) || fixedTypes.has(id.slice(0, 3));
  // A card that only follows a fix (it cites a card the review named as fixed) is reported, not re-checked.
  const follows = changed.filter((id) => !direct(id) && cards[id] && cards[id].links.some((l) => fixed.has(l.id)));
  return { changed, follows, unexplained: changed.filter((id) => !direct(id) && !follows.includes(id)) };
}

function lastChange(cards, stage) {
  let t = '';
  for (const c of Object.values(cards)) if ((TYPES[c.type] || {}).stage === stage && c.type !== 'REV' && String(c.meta.updated || '') > t) t = String(c.meta.updated || '');
  return t;
}

// Screens of the chosen Direction (or every Screen while none is chosen). A rejected Direction's
// Screens stay as history and are not hardened or ticketed.
function liveScreens(cards) {
  const scr = active(cards, 'SCR');
  const dirs = active(cards, 'DIR');
  const chosen = dirs.filter((d) => d.meta.chosen === 'yes' || d.meta.chosen === 'true').map((d) => d.id);
  if (!chosen.length) return scr;
  return scr.filter((s) => {
    const impl = s.links.filter((l) => l.kind === 'implements' && /^DIR-/.test(l.id)).map((l) => l.id);
    return !impl.length || impl.some((id) => chosen.includes(id));
  });
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
    const R = rigour(eng);
    row(active(cards, 'STU').length, `Study plan written (STU): questions, method, participants, consent`);
    const segs = active(cards, 'SEG');
    const used = [...new Set(fnd.flatMap((c) => String(c.meta.segment || '').split(/[,;]|\band\b/).map((x) => x.trim())).filter(filled))];
    const named = (u) => segs.some((g) => g.id === u || String(g.meta.title || '').toLowerCase() === u.toLowerCase() || String(u).includes(g.id));
    const orphan = used.filter((u) => !named(u));
    row(segs.length && !orphan.length, `Segments are cards (SEG) for every segment the Findings use${orphan.length ? ` (no card: ${orphan.slice(0, 4).join(', ')})` : ` (${segs.length})`}`);
    const need = { FLW: () => active(cards, 'FLW').some((c) => c.meta.kind === 'current'), OBJ: () => active(cards, 'OBJ').length, PRM: () => active(cards, 'PRM').length };
    const label = { FLW: 'current flow with workarounds (FLW)', OBJ: 'object model (OBJ)', PRM: 'permissions by role (PRM)' };
    for (const t of R.structure) row(need[t](), `Structure: ${label[t]}`);
  }

  if (stage === 'explore') {
    const dirs = active(cards, 'DIR');
    row(dirs.length >= 1 && dirs.length <= 2, `One or two Directions (${dirs.length}); never more than two`);
    row(dirs.every((d) => filled(d.meta.seed_author)), 'Every Direction names its human seed author');
    const testsOf = (d) => active(cards, 'TST').filter((t) => t.links.some((l) => l.kind === 'tests' && l.id === d.id));
    row(dirs.every((d) => filled(d.meta.threshold_saved_at) || (testsOf(d).length && testsOf(d).every((t) => filled(t.meta.threshold_saved_at)))), 'Test thresholds saved before testing');
    const chosen = dirs.find((d) => d.meta.chosen === 'yes' || d.meta.chosen === 'true');
    row(chosen && chosen.status === 'final', 'Chosen Direction is final');
    row(chosen && (filled(chosen.meta.result) || testsOf(chosen).some((t) => filled(t.meta.result))), 'Chosen Direction has test evidence');
    const dec = active(cards, 'DEC').find((d) => d.meta.status === 'final' && chosen && d.links.some((l) => l.id === chosen.id));
    row(dec, 'A signed Decision with one Approver chose it');
    const plb = active(cards, 'PLB').find((p) => /zero/i.test(p.meta.kind || '') && p.status === 'final');
    row(dec && (filled(dec.meta.client_commitment) || plb), `Client commitment recorded: a signed Playback Zero (PLB) or the Decision's client_commitment${plb ? ` (${plb.id})` : ''}`);
    const tst = active(cards, 'TST');
    const untested = dirs.filter((d) => !tst.some((t) => t.links.some((l) => l.kind === 'tests' && l.id === d.id)));
    row(tst.length && !untested.length, `Every Direction has a Test card with a numeric threshold${untested.length ? ` (no test: ${untested.map((d) => d.id).join(', ')})` : ` (${tst.length})`}`);
    const early = tst.filter((t) => filled(t.meta.result) && (!filled(t.meta.threshold_saved_at) || String(t.meta.result_at) < String(t.meta.threshold_saved_at)));
    row(!early.length, `Thresholds saved before results on every Test${early.length ? ` (${early.map((t) => t.id).join(', ')})` : ''}`);
    if (chosen) {
      const mine = tst.filter((t) => t.links.some((l) => l.kind === 'tests' && l.id === chosen.id));
      const missed = mine.filter((t) => /not met/i.test(t.meta.result || ''));
      const accepted = missed.filter((t) => active(cards, 'DEC').some((d) => d.status === 'final' && d.links.some((l) => l.id === t.id)));
      row(mine.some((t) => filled(t.meta.result)) && missed.length === accepted.length, `The chosen Direction's tests have results, and any missed threshold has a signed Decision${missed.length ? ` (missed: ${missed.map((t) => t.id).join(', ')})` : ''}`);
      if (rigour(eng).structure.includes('FLW')) row(active(cards, 'FLW').some((f) => f.meta.kind === 'future' && f.links.some((l) => l.id === chosen.id)), 'A future flow (FLW) for the chosen Direction');
    }
  }

  if (stage === 'explore' || stage === 'harden' || stage === 'ship') {
    const D = require('./ds');
    const ds = D.load(root);
    row(ds.ready, `Design system set up (${ds.ready ? `${ds.manifest.system} ${ds.manifest.version}` : 'koru ds adopt or koru ds extend'})`);
    if (ds.ready) {
      const chk = D.check(root);
      row(chk.approval.approved && chk.approval.current, `Design system approved by a person as it stands${chk.approval.approved && !chk.approval.current ? ' (changed since approval)' : ''}`);
      if (stage !== 'explore') row(!chk.blocks.length, `Design system health: contrast AA and specs for new components${chk.blocks.length ? ` (${chk.blocks.length} problems: koru ds check)` : ''}`);
      const files = D.lintTargets(root, []).filter((f) => stage === 'ship' || f.startsWith(paths(root).deliverables));
      const bad = files.filter((f) => D.lintFile(root, f).some((x) => x.level === 'block'));
      row(files.length && !bad.length, `${stage === 'ship' ? 'Deliverables and front-end code' : 'Deliverables'} pass the design-system lint (${files.length} files${bad.length ? `, failing: ${bad.slice(0, 4).map((f) => path.relative(root, f)).join(', ')}` : ''})`);
    }
  }

  if (stage === 'harden') {
    const scr = liveScreens(cards);
    row(scr.length, `Screens exist (${scr.length})`);
    const sta = active(cards, 'STA');
    const blank = sta.filter((c) => blockers(c).some((p) => p.rule === 'matrix'));
    row(sta.length && !blank.length, `No blank state cells (${sta.length} cells${blank.length ? `, blank: ${blank.map((c) => c.id).join(', ')}` : ''})`);
    const noCells = scr.filter((s) => !sta.some((c) => c.meta.screen === s.id));
    row(!noCells.length, `Every Screen has a state matrix${noCells.length ? ` (missing: ${noCells.map((c) => c.id).join(', ')})` : ''}`);
    const uncls = scr.filter((c) => blockers(c).some((p) => p.rule === 'elements'));
    row(!uncls.length, `Every element classified${uncls.length ? ` (open: ${uncls.map((c) => c.id).join(', ')})` : ''}`);
    const liveIds = scr.map((c) => c.id);
    const unsigned = [...scr, ...sta.filter((c) => liveIds.includes(c.meta.screen))].filter((c) => c.status !== 'final');
    row(!unsigned.length, `Screens and state cells signed by the design lead${unsigned.length ? ` (${unsigned.length} still draft: koru sign ${unsigned.slice(0, 6).map((c) => c.id).join(' ')}${unsigned.length > 6 ? ' …' : ''})` : ''}`);
    row(active(cards, 'MET').some((c) => c.status === 'final'), 'At least one Metric is final');
    if (rigour(eng).structure.includes('PRM')) {
      const prm = active(cards, 'PRM');
      row(prm.length && prm.every((c) => c.status === 'final'), 'Permissions matrix (PRM) signed');
    }
    const A = require('./audit');
    const protos = A.prototypes(root);
    const audits = protos.map((f) => ({ f, a: A.latest(root, f) }));
    const notRun = audits.filter((x) => !x.a || !x.a.current).map((x) => x.f);
    const failing = audits.filter((x) => x.a && x.a.current && x.a.blocks).map((x) => `${x.f} (${x.a.blocks})`);
    row(protos.length && !notRun.length, `Every prototype audited as it stands: accessibility, keyboard, target size, layout at four sizes, every state${notRun.length ? ` (run koru audit: ${notRun.slice(0, 3).join(', ')})` : ''}`);
    row(protos.length && !notRun.length && !failing.length, `Audits have no blocking findings${failing.length ? ` (${failing.join(', ')})` : ''}`);
  }

  if (stage === 'ship') {
    const tkt = active(cards, 'TKT');
    row(tkt.length, `Tickets exist (${tkt.length})`);
    const notReady = tkt.filter((c) => dor(c, cards).some((p) => p.level === 'block'));
    row(tkt.length && !notReady.length, `Every Ticket passes Definition of Ready${notReady.length ? ` (failing: ${notReady.map((c) => c.id).join(', ')})` : ''}`);
    const scr = liveScreens(cards);
    const orphanScr = scr.filter((s) => !tkt.some((t) => t.links.some((l) => l.id === s.id)));
    row(!orphanScr.length, `No Screen without a Ticket${orphanScr.length ? ` (${orphanScr.map((c) => c.id).join(', ')})` : ''}`);
    row(tkt.every((c) => c.status === 'final'), 'Every Ticket signed by the engineer');
    const hnd = active(cards, 'HND')[0];
    row(hnd && !blockers(hnd).length, 'Handoff note complete, with rabbit holes and no-gos');
    if (rigour(eng).api) {
      const api = active(cards, 'API');
      const noApi = scr.filter((x) => !api.some((a) => a.meta.screen === x.id || a.links.some((l) => l.id === x.id)));
      row(!noApi.length, `Every Screen has a data contract (API) with fields and error messages${noApi.length ? ` (missing: ${noApi.map((c) => c.id).join(', ')})` : ''}`);
    }
    const mets = active(cards, 'MET').filter((m) => m.status === 'final');
    const noInst = mets.filter((m) => !tkt.some((t) => t.links.some((l) => l.kind === 'measures' && l.id === m.id) || (t.links.some((l) => l.id === m.id) && /instrument/i.test(t.meta.title || ''))));
    row(!noInst.length, `Every Metric has an instrumentation Ticket${noInst.length ? ` (missing: ${noInst.map((c) => c.id).join(', ')})` : ''}`);
  }

  return finishGate(root, stage, cards, rows, false);
}

function finishGate(root, stage, cards, rows, isNoGo) {
  // The checker must have run on the stage as it stands now, and every finding needs a disposition.
  const revs = active(cards, 'REV').filter((r) => r.meta.gate === stage).sort((a, b) => String(b.meta.created).localeCompare(String(a.meta.created)) || b.id.localeCompare(a.id));
  const rev = revs[0];
  const changed = lastChange(cards, stage);
  if (!isNoGo) {
    rows.push({ ok: !!rev, item: `Checker review record for ${stage}` });
    const since = rev ? changesSince(root, rev, cards, stage) : null;
    if (since) rows.push({ ok: !since.unexplained.length, item: `Nothing changed since the review except fixes it names${since.follows.length ? ` (following those fixes: ${since.follows.join(', ')})` : ''}${since.unexplained.length ? ` (changed: ${since.unexplained.join(', ')}; run the checker again)` : ''}` });
    else rows.push({ ok: rev && String(rev.meta.created || '') >= changed, item: 'Review is newer than the last change in this stage' });
    rows.push({ ok: rev && !checkShape(rev, { engagement: readEngagement(root) }).some((p) => p.level === 'block'), item: `Every checker finding at or above the severity floor (${rigour(readEngagement(root)).floor}) has a disposition` });
    rows.push({ ok: rev && rev.status === 'final', item: `Review signed by ${gateSigners(root, stage).join(', ')} (their signatures stand behind the dispositions)` });
  }
  if (!isNoGo) {
    // Signed cards were checked when they were signed; drafts still have to hold their shape.
    const eng = readEngagement(root);
    const broken = Object.values(cards).filter((c) => c.type !== 'REV' && c.status !== 'superseded' && (c.meta.stage || (TYPES[c.type] || {}).stage) === stage
      && checkCard(root, c, cards, eng).some((p) => p.level === 'block'));
    rows.push({ ok: !broken.length, item: `No blocking problems on this stage's cards${broken.length ? ` (koru check ${broken.map((c) => c.id).join(' ')})` : ''}` });
  }
  const tampered = signatureProblems(cards).filter((x) => (x.card.meta.stage || (TYPES[x.card.type] || {}).stage) === stage);
  rows.push({ ok: !tampered.length, item: `Signed cards unchanged since signing${tampered.length ? ` (changed outside Koru: ${tampered.map((x) => x.card.id).join(', ')})` : ''}` });
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
  STAGES, TYPES, STATUSES, EVIDENCE, QUANT, RIGOUR, SEVERITIES, rigour, atOrAbove, gateSigners, tableRows, parseThreshold, TYPE_IDS, CONFIDENCE, ELEMENT_CLASSES, CTX_QUESTIONS, GATES, AMBIGUOUS, CAUSAL,
  parseYaml, splitCard, setField, sections, filled, parseLinks, findRoot, paths, readEngagement,
  cardIdFromPath, isCardPath, loadCards, cardFromText, nextId, readJsonl, appendJsonl, stateFile, log, now, today,
  extractQuotes, verifyQuotes, confidenceSignals, checkShape, checkCard, linkProblems, inbound, writebacks, dor, elementRows, findingRows,
  gateReport, currentStage, signatureProblems, active, liveScreens, provenance, contentHash, reviewSnapshot, changesSince,
};
