'use strict';
// Loops that come back into the graph as evidence, and the tools that keep judgement measurable:
// test results against saved thresholds, client playbacks, direction comparisons, the state
// matrix, Figma drift, cross-project find, stage packs for checkers, and AI accuracy.

const fs = require('fs');
const path = require('path');
const os = require('os');
const K = require('./core');
const T = require('./templates');

const die = (msg) => { console.error(msg); process.exit(1); };
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'card';
const write = (f, t) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, t); };
const list = (v) => (v === undefined || v === true ? [] : [].concat(v).flatMap((x) => String(x).split(/\s*,\s*/)).filter(Boolean));
function newCard(root, type, title, fields, links, body) {
  const id = K.nextId(root, type);
  let text = T.render(type, id, title, { ...fields, links });
  if (body) for (const [sec, content] of Object.entries(body)) text = text.replace(new RegExp(`(## ${sec}\\n\\n)(?:<!--[\\s\\S]*?-->\\n|\\|[^\\n]*\\n\\|[^\\n]*\\n)?`), `$1${content}\n`);
  const file = path.join(K.paths(root).cards, `${id}-${slug(title)}.md`);
  write(file, text);
  K.log(root, 'new', { id, title });
  return { id, file };
}
const roleName = (eng, role) => { const p = require('./team').people(eng).find((x) => x.roles.includes(role)); return p ? p.name : ''; };

// ---------------------------------------------------------------- test results

function resultTest(root, c, opt) {
  if (!K.filled(c.meta.threshold_saved_at)) die(`${c.id} has no saved threshold. Save it before any session: koru threshold ${c.id}`);
  if (K.filled(c.meta.result)) die(`${c.id} already has a result (${c.meta.result}). A second round is a new Test card.`);
  const passed = Number(opt.passed);
  const of = Number(opt.of);
  if (!Number.isFinite(passed) || !Number.isFinite(of) || of <= 0 || passed < 0 || passed > of) die(`koru result ${c.id} --passed 6 --of 8   (how many participants met the task, out of how many)`);
  const th = K.parseThreshold(c.meta.threshold);
  if (!th) die(`${c.id}'s threshold "${c.meta.threshold}" is not a number.`);
  const met = passed / of >= th.pct - 1e-9;
  const res = `${met ? 'met' : 'not met'}: ${passed} of ${of} (threshold ${c.meta.threshold})`;
  let text = c.text;
  for (const [k, v] of [['passed', String(passed)], ['of', String(of)], ['result', res], ['result_at', K.now()]]) text = K.setField(text, k, v);
  write(c.file, text);
  K.log(root, 'result', { id: c.id, result: res, by: opt.name || '' });
  console.log(`${c.id}: ${res}.`);
  const dirs = c.links.filter((l) => l.kind === 'tests' && /^DIR-/.test(l.id)).map((l) => l.id);
  if (!met) {
    const eng = K.readEngagement(root);
    const d = newCard(root, 'DEC', `${c.id} missed its threshold: iterate, switch Direction, or accept the miss?`, { approver: roleName(eng, 'design lead'), outcome: '' },
      [...dirs.map((id) => `affects ${id}: its test missed the saved threshold`), `cites ${c.id}: ${res}`],
      { Question: `${c.id} (${c.meta.title}) scored ${passed} of ${of} against a saved threshold of ${c.meta.threshold}. What do we do?`, Factors: '- What the observed issues say (Findings that test this Direction)\n- Time left in the appetite\n- Whether the other Direction tested better' });
    console.log(`Missed. Drafted ${d.id} for the design lead: iterate, switch, or accept. The explore gate waits until it is signed.`);
  }
  console.log('Next: one Finding per observed issue (evidence: observed, severity 0 to 4, "tests ' + (dirs[0] || 'DIR-001') + '").');
}

// ---------------------------------------------------------------- playbacks

// Feedback comes back from the share page as a JSON export (anchored to SCR·STA), or as notes.
function cmdPlayback(root, pos, opt) {
  const sub = pos[0];
  if (sub !== 'import') die('koru playback import feedback.json [--kind zero] [--attendees "…"] [--held 2026-11-26]');
  const f = path.resolve(pos[1] || '');
  if (!fs.existsSync(f)) die(`No file ${pos[1] || ''}. Export it from the shared page ("Download feedback") or write notes as "- [SCR-002 · STA-004] text (who)".`);
  const raw = fs.readFileSync(f, 'utf8');
  let items = [];
  let meta = {};
  try {
    const j = JSON.parse(raw);
    meta = j;
    items = (j.comments || []).map((x) => ({ text: x.text, from: [x.author, x.role].filter(Boolean).join(', '), anchor: [x.anchor, x.state].filter(Boolean).join(' · '), type: x.type || '' }));
  } catch {
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*[-*]\s*(?:\[([^\]]+)\]\s*)?(.+?)(?:\s*\(([^)]+)\))?\s*$/);
      if (m && m[2]) items.push({ anchor: m[1] || '', text: m[2], from: m[3] || '', type: '' });
    }
  }
  if (!items.length) die('No feedback found in that file.');
  const clean = (s) => String(s || '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
  const rows = items.map((x, i) => `| ${i + 1} | ${clean(x.text)} | ${clean(x.type)} | ${clean(x.from)} | ${clean(x.anchor)} |  |`);
  const kind = opt.kind && opt.kind !== true ? opt.kind : 'zero';
  const anchors = [...new Set(items.flatMap((x) => String(x.anchor).match(/\b(?:SCR|STA|DIR)-\d{3}\b/g) || []))];
  const cards = K.loadCards(root);
  const c = newCard(root, 'PLB', `Playback ${kind}: ${path.basename(f)}`, { kind, held_at: opt.held || K.today(), attendees: opt.attendees || [...new Set(items.map((x) => x.from).filter(Boolean))].join('; '), source: path.relative(root, f) },
    anchors.filter((id) => cards[id]).map((id) => `cites ${id}: feedback anchored here`),
    { Feedback: `| # | Feedback | Type | From | Anchor | Becomes |\n| --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}` });
  K.log(root, 'playback', { id: c.id, items: items.length, file: path.relative(root, f) });
  console.log(`${path.relative(process.cwd(), c.file)}: ${items.length} piece(s) of feedback.`);
  console.log('Next: type each row (evidence, constraint, idea, preference or decision) and say what it becomes: a Finding (evidence), a Request (constraint), an Idea card, or a Decision. Contributors have a voice; the Approver decides.');
}

// ---------------------------------------------------------------- comparison

function cmdCompare(root, pos, opt) {
  const cards = K.loadCards(root);
  const ids = (pos.length ? pos : K.active(cards, 'DIR').map((d) => d.id)).map((x) => String(x).toUpperCase());
  if (ids.length < 2) die('koru compare DIR-001 DIR-002 [--factors "time to triage, trust in suggestions, works for travel nurses"]');
  for (const id of ids) if (!cards[id]) die(`No card ${id}.`);
  const brf = K.active(cards, 'BRF')[0];
  const factors = list(opt.factors).length ? list(opt.factors) : [
    brf && K.filled(brf.sections.outcome) ? `Delivers the Brief's outcome (${brf.id})` : 'Delivers the outcome in the Brief',
    'Holds up on the hard cases (workaround, scale, wrong data or a wrong AI suggestion)',
    'Test result against its saved threshold',
    'Fits the design system without snowflakes',
    'Effort and risk to build in the appetite',
  ];
  const tsts = K.active(cards, 'TST');
  const optRows = ids.map((id) => {
    const t = tsts.filter((x) => x.links.some((l) => l.id === id));
    return `| ${id} ${cards[id].meta.title} | ${factors.map(() => '_').join(' / ')} | seed: ${cards[id].meta.seed_author || '?'}${t.length ? `; tests: ${t.map((x) => `${x.id} ${x.meta.result || 'no result yet'}`).join(', ')}` : ''} |`;
  });
  const eng = K.readEngagement(root);
  const c = newCard(root, 'DEC', opt.title && opt.title !== true ? opt.title : 'Which Direction do we take forward?', { approver: roleName(eng, 'design lead'), contributors: '' },
    [...ids.map((id) => `affects ${id}: compared`), ...tsts.filter((x) => x.links.some((l) => ids.includes(l.id))).map((x) => `cites ${x.id}: test evidence`)],
    {
      Question: `Which of ${ids.join(' and ')} do we take forward, and what do we keep from the other?`,
      Factors: factors.map((f, i) => `${i + 1}. ${f}`).join('\n') + '\n\nScore each factor 1 to 5 per option, silently and before any discussion (art museum, then heat map). Contributors score; the Approver decides.',
      Options: `| Option | Factor scores (${factors.map((_, i) => i + 1).join(' / ')}) | Notes |\n| --- | --- | --- |\n${optRows.join('\n')}`,
    });
  console.log(`${path.relative(process.cwd(), c.file)}: factors are written before the options, so the comparison is fair. People fill the scores.`);
}

// ---------------------------------------------------------------- state matrix

const CORE_STATES = ['default', 'empty', 'loading', 'error', 'no permission'];
const EXTRA_STATES = [
  [/import|upload|csv/i, 'import errors'], [/edit|form|draft|save/i, 'unsaved changes'], [/edit|form|long|session/i, 'session expired'],
  [/delete|remove|bulk|archive|cancel/i, 'undo window'], [/background|async|job|notify|email|queue|sync/i, 'async in progress'],
  [/list|table|search|filter|queue/i, 'slow (1s and 10s)'], [/link|share|detail/i, 'deep link and back'], [/edit|assign|approve/i, 'edited in another tab'],
  [/ai|suggest|predict|recommend|copilot|confidence/i, 'AI suggestion wrong'], [/list|table|queue/i, 'scale (1 and 10,000 rows)'],
];
function cmdMatrix(root, pos, opt) {
  const cards = K.loadCards(root);
  const eng = K.readEngagement(root);
  const R = K.rigour(eng);
  const scrs = pos.length ? pos.map((p) => cards[String(p).toUpperCase()]).filter(Boolean) : K.liveScreens(cards);
  if (!scrs.length) die('koru matrix SCR-001 [--roles "approver, requester"] [--states "…"]');
  const prm = K.active(cards, 'PRM')[0];
  let roles = list(opt.roles);
  if (!roles.length && prm) roles = K.tableRows(prm.sections.matrix || '').header.slice(1);
  if (!roles.length) roles = K.active(cards, 'SEG').filter((s) => /role/i.test(s.meta.kind || '')).map((s) => s.meta.title);
  if (!roles.length) die('No roles: write the Permissions card (PRM) or pass --roles.');
  roles = roles.slice(0, R.matrixRoles);
  let made = 0;
  for (const s of scrs) {
    const hay = [s.meta.title, s.body, ...(s.links.map((l) => (cards[l.id] ? cards[l.id].meta.title : '')))].join(' ');
    const states = list(opt.states).length ? list(opt.states) : [...CORE_STATES, ...EXTRA_STATES.filter(([re]) => re.test(hay)).map(([, st]) => st)].filter((v, i, a) => a.indexOf(v) === i);
    const have = K.active(cards, 'STA').filter((c) => c.meta.screen === s.id);
    for (const role of roles) for (const st of states) {
      if (have.some((c) => String(c.meta.role).toLowerCase() === role.toLowerCase() && String(c.meta.state).toLowerCase() === st.toLowerCase())) continue;
      newCard(root, 'STA', `${s.meta.title || s.id} · ${role} · ${st}`, { screen: s.id, role, state: st }, [`implements ${s.id}: state cell`]);
      made++;
    }
  }
  console.log(`${made} state cell(s) drafted for ${scrs.map((s) => s.id).join(', ')} (${roles.length} role(s) at ${R.label} rigour). Each needs a resolution: designed, or n/a: why.`);
}

// ---------------------------------------------------------------- figma

// Compares frame metadata (saved from the Figma MCP get_metadata) with the signed cards.
function cmdFigma(root, pos, opt) {
  if (pos[0] !== 'diff') die('koru figma diff --file frames.json   (save the frame list from the Figma MCP first)');
  const f = path.resolve(opt.file || '');
  if (!fs.existsSync(f)) die('Pass --file frames.json: the frame names, ids and last-modified times from Figma.');
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const frames = [];
  const walk = (n) => { if (!n || typeof n !== 'object') return; if (Array.isArray(n)) return n.forEach(walk); if (n.name && /(SCR|STA)-\d{3}/.test(n.name)) frames.push(n); for (const k of ['children', 'frames', 'nodes', 'document']) walk(n[k]); };
  walk(j);
  const cards = K.loadCards(root);
  const out = [];
  const scr = K.liveScreens(cards);
  for (const s of scr) if (!frames.some((fr) => fr.name.includes(s.id))) out.push({ kind: 'missing', id: s.id, msg: `${s.id} has no frame named for it in Figma.` });
  for (const fr of frames) {
    for (const id of fr.name.match(/(SCR|STA)-\d{3}/g)) {
      const c = cards[id];
      if (!c) { out.push({ kind: 'orphan', id, msg: `Frame "${fr.name}" names ${id}, which does not exist.` }); continue; }
      if (c.status === 'superseded') out.push({ kind: 'superseded', id, msg: `Frame "${fr.name}" shows superseded ${id}.` });
      const mod = fr.lastModified || fr.last_modified || fr.updated_at;
      if (mod && c.status === 'final' && String(mod) > String(c.meta.signed_at || '')) out.push({ kind: 'changed', id, frame: fr.name, msg: `Frame "${fr.name}" changed (${mod}) after ${id} v${c.version} was signed (${c.meta.signed_at}).` });
    }
  }
  const comps = (j.components || []).filter((x) => x && x.name);
  if (comps.length) {
    const mapped = comps.filter((x) => x.codeConnect || x.code_connect).length;
    out.push({ kind: 'coverage', msg: `Code Connect covers ${mapped} of ${comps.length} Figma components (${Math.round((100 * mapped) / comps.length)}%).` });
  }
  for (const o of out) console.log(`${o.kind === 'coverage' ? '≈' : '!'} ${o.msg}`);
  if (!out.length) console.log('Figma matches the signed cards.');
  if (opt.draft) {
    const eng = K.readEngagement(root);
    for (const o of out.filter((x) => x.kind === 'changed')) {
      const d = newCard(root, 'DEC', `Accept the Figma change to ${o.id}, or revert it?`, { approver: roleName(eng, 'design lead') }, [`affects ${o.id}: changed in Figma after signing`], { Question: o.msg, Factors: '- Does the change follow from evidence or a signed Decision?\n- What else cites this card (koru decide impact)?' });
      console.log(`Drafted ${d.id}.`);
    }
  }
}

// ---------------------------------------------------------------- find before you build

const registryDir = () => process.env.KORU_REGISTRY || path.join(os.homedir(), '.koru', 'registry');
function cmdPublish(root, pos, opt) {
  const cards = K.loadCards(root);
  const eng = K.readEngagement(root);
  const dir = path.join(registryDir(), slug(eng.client || 'project'));
  let n = 0;
  for (const c of Object.values(cards)) {
    if (c.status !== 'final' || !['INS', 'DEC', 'CMP', 'JOB', 'PRB', 'FLW', 'OBJ', 'PRM', 'SEG'].includes(c.type)) continue;
    const head = `---\nclient: ${eng.client || ''}\ndomain: ${eng.domain || 'enterprise SaaS'}\nid: ${c.id}\ntype: ${c.type}\ntitle: ${c.meta.title || ''}\nconfidence: ${c.meta.confidence || ''}\nsigned_at: ${c.meta.signed_at || ''}\n---\n`;
    write(path.join(dir, `${c.id}.md`), head + K.splitCard(c.text).body);
    n++;
  }
  console.log(`${n} final card(s) published to the Koru registry (${dir}). Raw research never leaves the project.`);
}
function cmdFind(root, pos, opt) {
  const q = pos.join(' ').toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  if (!q.length) die('koru find "bulk approval"');
  const hits = [];
  const score = (t) => q.reduce((a, w) => a + (t.toLowerCase().split(w).length - 1), 0);
  const reg = registryDir();
  if (fs.existsSync(reg)) for (const client of fs.readdirSync(reg)) {
    const d = path.join(reg, client);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d)) { const t = fs.readFileSync(path.join(d, f), 'utf8'); const m = K.splitCard(t).meta; const s = score(t) + 3 * score(m.title || ''); if (s) hits.push({ s, where: `${m.client}`, id: m.id, type: m.type, title: m.title, extra: `${m.confidence ? m.confidence + ' confidence · ' : ''}${String(m.signed_at || '').slice(0, 10)}` }); }
  }
  if (root) for (const c of Object.values(K.loadCards(root))) { const s = score(c.text) + 3 * score(c.meta.title || ''); if (s && c.status !== 'superseded') hits.push({ s, where: 'this project', id: c.id, type: c.type, title: c.meta.title, extra: c.status }); }
  hits.sort((a, b) => b.s - a.s);
  if (!hits.length) return console.log(`Nothing found for "${pos.join(' ')}" in this project or the registry (${reg}).`);
  for (const h of hits.slice(0, Number(opt.limit) || 10)) console.log(`${h.where.padEnd(16)} ${h.id}  ${h.type}  ${h.title}  (${h.extra})`);
}

// ---------------------------------------------------------------- stage packs

// One file a checker reads first: the stage's cards condensed, the link graph, and what changed
// since the last review. Keeps recall up when a project has hundreds of cards.
function pack(root, stage) {
  const cards = K.loadCards(root);
  const eng = K.readEngagement(root);
  const R = K.rigour(eng);
  const inStage = Object.values(cards).filter((c) => c.status !== 'superseded' && c.type !== 'REV' && ((c.meta.stage || (K.TYPES[c.type] || {}).stage) === stage || (stage !== 'frame' && ['BRF', 'INS', 'PRB', 'SEG', 'PRM', 'FLW'].includes(c.type))));
  const lastRev = K.active(cards, 'REV').filter((r) => r.meta.gate === stage).sort((a, b) => String(b.meta.created).localeCompare(String(a.meta.created)))[0];
  const since = lastRev ? K.changesSince(root, lastRev, cards, stage) : null;
  const out = [`# Stage pack: ${stage} · ${eng.client || ''}`, '', `Rigour ${R.label}: ${R.note}`, `Generated ${K.now()} by koru pack. Read this first; open full cards and sources only where a line points you.`, ''];
  if (since) out.push(`## Changed since ${lastRev.id}`, '', since.changed.length ? since.changed.map((id) => `- ${id}${since.unexplained.includes(id) ? ' (not named as a fix)' : ''}`).join('\n') : '- nothing', '');
  const byType = {};
  for (const c of inStage) (byType[c.type] = byType[c.type] || []).push(c);
  for (const [t, cs] of Object.entries(byType)) {
    out.push(`## ${K.TYPES[t].name} (${t}) · ${cs.length}`, '');
    for (const c of cs) {
      const probs = K.checkCard(root, c, cards, eng).filter((p) => p.level === 'block' || p.level === 'warn').map((p) => `${p.level === 'block' ? '✗' : '!'} ${p.msg}`);
      const keep = Object.entries(c.meta).filter(([k, v]) => !/^(id|type|title|stage|owner|uid|created|updated|links|signature|signed_email)$/.test(k) && K.filled(Array.isArray(v) ? v.join(' ') : v)).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join('; ') : v}`);
      out.push(`### ${c.id} · ${c.meta.title} (${c.status} v${c.version})`);
      if (keep.length) out.push(keep.join(' · '));
      if (c.links.length) out.push('links: ' + c.links.map((l) => l.raw).join(' | '));
      for (const [sec, txt] of Object.entries(c.sections)) {
        if (sec === '_intro' || !K.filled(txt)) continue;
        if (sec === 'quotes') { const q = K.extractQuotes(txt); out.push(`- quotes: ${q.length} (${[...new Set(q.map((x) => x.participant))].join(', ')})`); continue; }
        const lim = c.status === 'final' ? 160 : 260;
        out.push(`- ${sec}: ${txt.replace(/\s+/g, ' ').slice(0, lim)}${txt.length > lim ? ' …' : ''}`);
      }
      if (probs.length) out.push('koru check: ' + probs.join(' · '));
      out.push('');
    }
  }
  const dats = K.active(cards, 'DAT').filter((d) => K.filled(d.meta.file));
  if (stage === 'frame' && dats.length) {
    const n = Math.min(dats.length, Math.max(3, Math.ceil(dats.length / 3)));
    const sample = dats.filter((_, i) => i % Math.ceil(dats.length / n) === 0).slice(0, n);
    out.push('## Sources to sample', '', `Read these transcripts in full (a third of the sessions, spread across studies), and record the sample on the review: ${sample.map((d) => `${d.id} (${d.meta.file})`).join(', ')}.`, '');
  }
  const f = path.join(K.paths(root).generated, `pack-${stage}.md`);
  write(f, out.join('\n'));
  return f;
}
function cmdPack(root, pos) {
  const stage = pos[0] || K.currentStage(root);
  if (!K.STAGES.includes(stage)) die(`koru pack ${K.STAGES.join('|')}`);
  const f = pack(root, stage);
  console.log(`${path.relative(process.cwd(), f)} (${Math.round(fs.statSync(f).size / 1024)} KB)`);
}

// ---------------------------------------------------------------- AI accuracy

function cmdCaught(root, pos, opt) {
  const cards = K.loadCards(root);
  const c = cards[String(pos[0] || '').toUpperCase()];
  const what = pos.slice(1).join(' ') || opt.what;
  if (!c || !what) die('koru caught FND-012 "what the AI got wrong" --name "You"   (a person records an AI mistake they caught)');
  const prov = (K.provenance(root)[c.id] || []).slice(-1)[0] || {};
  K.appendJsonl(K.stateFile(root, 'caught.jsonl'), { at: K.now(), id: c.id, type: c.type, agent: prov.agent || 'main', what, method: opt.method || '', by: opt.name || '' });
  K.log(root, 'caught', { id: c.id, by: opt.name || '', reason: what });
  console.log(`Recorded: the AI got ${c.id} wrong (${what}). It counts in koru stats and the board's AI accuracy.`);
}

function stats(root) {
  const cards = K.loadCards(root);
  const edits = K.readJsonl(K.stateFile(root, 'edits.jsonl'));
  const byBucket = { unchanged: 0, light: 0, heavy: 0, person: 0 };
  for (const e of edits) byBucket[e.bucket || 'person']++;
  const discarded = K.readJsonl(K.stateFile(root, 'log.jsonl')).filter((e) => e.action === 'discard').length;
  const findings = [];
  for (const r of K.active(cards, 'REV')) for (const f of K.findingRows(r.sections.findings || '')) if (!/\[none\]/i.test(f.text)) findings.push({ ...f, rev: r.id, checker: r.meta.checker });
  const disp = { fixed: 0, accepted: 0, deferred: 0, rejected: 0, open: 0 };
  const rules = {};
  for (const f of findings) {
    disp[f.kind]++;
    const k = f.rule || '(no rule id)';
    rules[k] = rules[k] || { n: 0, rejected: 0, checker: f.checker };
    rules[k].n++;
    if (f.kind === 'rejected') rules[k].rejected++;
  }
  const caught = K.readJsonl(K.stateFile(root, 'caught.jsonl'));
  const prov = K.readJsonl(K.stateFile(root, 'provenance.jsonl'));
  const agents = {};
  for (const p of prov) { const a = String(p.agent || 'main').split(':').pop(); agents[a] = agents[a] || new Set(); agents[a].add(p.id); }
  const drafts = byBucket.unchanged + byBucket.light + byBucket.heavy;
  return {
    drafts, byBucket, discarded, findings: findings.length, disp, caught,
    rules: Object.entries(rules).map(([rule, v]) => ({ rule, ...v, rate: v.n ? v.rejected / v.n : 0 })).sort((a, b) => b.rate - a.rate || b.n - a.n),
    agents: Object.fromEntries(Object.entries(agents).map(([k, v]) => [k, v.size])),
  };
}
function cmdStats(root, pos, opt) {
  const s = stats(root);
  if (opt.json) return console.log(JSON.stringify(s, null, 2));
  const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : '—');
  console.log('AI accuracy, from what people did with the AI\'s work');
  console.log(`  AI drafts signed: ${s.drafts} · unchanged ${s.byBucket.unchanged} (${pct(s.byBucket.unchanged, s.drafts)}) · lightly edited ${s.byBucket.light} · heavily edited ${s.byBucket.heavy} · AI drafts discarded ${s.discarded}`);
  console.log(`  Checker findings: ${s.findings} · fixed ${s.disp.fixed} · accepted risk ${s.disp.accepted} · deferred ${s.disp.deferred} · rejected (checker was wrong) ${s.disp.rejected} · open ${s.disp.open}`);
  console.log(`  Mistakes people caught (koru caught): ${s.caught.length}`);
  for (const c of s.caught.slice(-5)) console.log(`    ${c.id} (${c.agent}): ${c.what}`);
  const hot = s.rules.filter((r) => r.n >= 3 && r.rate >= 0.5);
  if (hot.length) console.log(`  Rules people reject most (rewrite these): ${hot.map((r) => `${r.rule} ${pct(r.rejected, r.n)} of ${r.n}`).join(', ')}`);
  console.log(`  Cards each agent wrote: ${Object.entries(s.agents).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none yet'}`);
}

// ---------------------------------------------------------------- checker evals

// Planted-defect evals: compare a checker's findings with the defects planted in a fixture.
function cmdEval(root, pos, opt) {
  if (pos[0] !== 'score') die('koru eval score --expected planted.json --file findings.md');
  const exp = JSON.parse(fs.readFileSync(path.resolve(opt.expected), 'utf8'));
  const rows = K.findingRows(fs.readFileSync(path.resolve(opt.file), 'utf8'));
  const planted = exp.defects || exp;
  const hit = planted.filter((d) => rows.some((r) => r.cards.includes(d.card) && (!d.rule || r.rule === d.rule || !r.rule)));
  const useful = rows.filter((r) => planted.some((d) => r.cards.includes(d.card)));
  const recall = planted.length ? hit.length / planted.length : 0;
  const precision = rows.length ? useful.length / rows.length : 0;
  const res = { checker: exp.checker || '', planted: planted.length, found: hit.length, findings: rows.length, recall: Math.round(recall * 100) / 100, precision: Math.round(precision * 100) / 100, missed: planted.filter((d) => !hit.includes(d)).map((d) => `${d.card} ${d.rule || ''} ${d.what || ''}`.trim()) };
  if (opt.json) return console.log(JSON.stringify(res, null, 2));
  console.log(`${res.checker}: recall ${res.recall} (${res.found} of ${res.planted} planted defects), precision ${res.precision} (${useful.length} of ${rows.length} findings point at a planted defect)`);
  for (const m of res.missed) console.log(`  missed: ${m}`);
  if (opt.min && recall < Number(opt.min)) process.exit(1);
}

module.exports = { resultTest, cmdPlayback, cmdCompare, cmdMatrix, cmdFigma, cmdPublish, cmdFind, pack, cmdPack, cmdCaught, stats, cmdStats, cmdEval };
