#!/usr/bin/env node
'use strict';
// koru: the command-line engine behind the Koru plugin. Run `koru help`.
// People run the commands that sign, pass gates, set the contract or share outside Koru.
// The plugin's hooks stop Claude from running those (see lib/guard.js).

const fs = require('fs');
const path = require('path');
const K = require('./core');
const T = require('./templates');

const HUMAN_ONLY = ['sign', 'contract', 'share', 'pseudonymise', 'clear-flag'];

// ---------------------------------------------------------------- args

function parseArgs(argv) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split(/=(.*)/s);
      const val = v !== undefined ? v : argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      if (opt[k] === undefined) opt[k] = val;
      else opt[k] = [].concat(opt[k], val);
    } else pos.push(a);
  }
  return { pos, opt };
}
const list = (v) => (v === undefined ? [] : [].concat(v));

function die(msg, code) { console.error(msg); process.exit(code === undefined ? 1 : code); }

function root() {
  const r = K.findRoot();
  if (!r) die('No Koru project here. Start one with: koru init  (or /koru:start in Claude Code)');
  return r;
}

function write(file, text) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); }

function snapshot(r, card) {
  const dir = path.join(K.paths(r).history, card.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${K.now().replace(/[:]/g, '')}-v${card.version}.md`), card.text);
}

function getCard(r, id, cards) {
  cards = cards || K.loadCards(r);
  const c = cards[String(id || '').toUpperCase()];
  if (!c) die(`No card ${id}.`);
  return c;
}

function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'card'; }

function icon(level) { return { block: '✗', warn: '!', info: '·', signal: '≈' }[level] || '·'; }

// ---------------------------------------------------------------- init / contract

const ENGAGEMENT = (client) => `---
client: ${client}
project: ${slug(client)}
# Seven switches (spec v2) plus the build settings. /koru:start asks these; change them any time.
call_context: fresh start        # fresh start | informed | ad hoc
starting_point: discovery        # discovery | roadmap | redesign | feature add | client concept
product_state: new               # new | live | legacy shell
design_system: unknown           # mature | partial | figma only | code only | brand only | none (set by the Frame audit)
ai_in_product: none              # none | co-pilot | agentic | conversational | ambient
deliverables: [html]             # any of: html, figma, frontend
client_maturity: koru-led        # koru-led | co-led | client-led
# Build settings. Asked at the start when known; koru-ship asks again before any code is written.
tech_stack: unknown              # e.g. react-tailwind | react-mui | angular-material | vue | html | client-named stack
frontend_dir:                    # the folder front-end code is written to (the design-system hook guards it), e.g. app
# Contract settings. Only a person sets these, with: koru contract
ai_tier: unset                   # full | internal | restricted
data_class: unset                # public | confidential | personal | special
disclosure: per deliverable      # per deliverable | per project | on request
ai_processor:                    # the AI platform named in the contract and consent forms, e.g. Anthropic
roles: []                        # e.g. - engagement lead: Sam Rivera
---
# Engagement

Written by \`/koru:start\`. Every skill reads this file; the hooks enforce the contract settings.
`;

function cmdInit(opt) {
  const r = process.cwd();
  const p = K.paths(r);
  if (fs.existsSync(p.engagement) && !opt.force) die('This folder already has a Koru project (koru/engagement.md).');
  for (const d of [p.cards, p.raw, p.originals, p.private, p.deliverables, p.history, p.state, p.generated]) fs.mkdirSync(d, { recursive: true });
  write(p.engagement, ENGAGEMENT(opt.client || path.basename(r)));
  if (!fs.existsSync(p.client)) write(p.client, '# Client\n\nWho the client is, the deciders, their vocabulary, house rules, the content guide if there is one.\n');
  if (!fs.existsSync(p.ds)) write(p.ds, '---\nversion: unknown\n---\n# Design system\n\nFilled by the design-system audit in Frame (F3): coverage, quality, Figma-to-code sync, governance.\n');
  write(path.join(p.koru, '.gitignore'), 'private/\nraw/originals/\ngenerated/share/\n');
  write(path.join(p.private, 'README.md'), 'Never shared with AI. The participant re-identification key lives here, held by a named person.\n');
  write(path.join(p.originals, 'README.md'), 'Original, un-pseudonymised transcripts. Never shared with AI. Run `koru pseudonymise` to make the copy Claude may read.\n');
  K.log(r, 'init', { client: opt.client || '' });
  console.log(`Koru project created in ${path.relative(process.cwd(), p.koru) || 'koru'}/.
Next:
  1. A person sets the contract:  koru contract --tier full|internal|restricted --data-class public|confidential|personal|special --processor Anthropic
  2. Answer the seven switches in koru/engagement.md (or let /koru:start ask you).
  3. koru new CTX "Context"  then  koru where`);
}

function cmdContract(opt) {
  const r = root();
  const p = K.paths(r);
  let text = fs.readFileSync(p.engagement, 'utf8');
  const tiers = ['full', 'internal', 'restricted'];
  const classes = ['public', 'confidential', 'personal', 'special'];
  if (opt.tier) { if (!tiers.includes(opt.tier)) die(`--tier must be ${tiers.join(' | ')}`); text = K.setField(text, 'ai_tier', opt.tier); }
  if (opt['data-class']) { if (!classes.includes(opt['data-class'])) die(`--data-class must be ${classes.join(' | ')}`); text = K.setField(text, 'data_class', opt['data-class']); }
  if (opt.processor) text = K.setField(text, 'ai_processor', opt.processor);
  if (opt.disclosure) text = K.setField(text, 'disclosure', opt.disclosure);
  write(p.engagement, text);
  K.log(r, 'contract', { by: opt.name || process.env.USER || 'person', tier: opt.tier, data_class: opt['data-class'], processor: opt.processor });
  const e = K.readEngagement(r);
  console.log(`Contract: AI tier ${e.ai_tier} · data class ${e.data_class} · processor ${e.ai_processor || '(none)'} · disclosure ${e.disclosure}`);
}

// ---------------------------------------------------------------- cards

function cmdNew(pos, opt) {
  const r = root();
  const type = String(pos[0] || '').toUpperCase();
  if (opt.help || opt.h || !K.TYPES[type]) die(`koru new TYPE "title" [--link "supports FND-001: why"] [--field k=v]\nCard types: ${Object.keys(K.TYPES).join(' ')}`);
  const title = pos.slice(1).join(' ') || opt.title || K.TYPES[type].name;
  const fields = {};
  for (const kv of list(opt.field)) { const [k, v] = String(kv).split(/=(.*)/s); fields[k] = v; }
  // The same rules as editing a card: sign-offs and results have their own commands.
  for (const k of Object.keys(fields)) {
    if (/^(status|version|signed_by|signed_at|cosigned_by|cosigned_at|reviewers|superseded_by)$/.test(k)) die(`"${k}" is set by koru sign, never by koru new.`);
    if (/^(threshold_saved_at|result|result_at)$/.test(k)) die(`Use koru threshold and koru result for "${k}".`);
  }
  if (type === 'FND' && /synthetic/i.test(fields.evidence || '')) die('Synthetic output cannot become a Finding. Make it a Hypothesis card (koru new HYP "…").');
  const cardsNow = K.loadCards(r);
  for (const l of list(opt.link)) {
    const m = String(l).match(/^\s*(supports)\s+([A-Z]{3}-\d{3})/i);
    if (m && cardsNow[m[2].toUpperCase()] && cardsNow[m[2].toUpperCase()].type === 'HYP') die(`${m[2]} is a Hypothesis. It can be tested, never cited as support.`);
  }
  const id = K.nextId(r, type);
  const text = T.render(type, id, title, { ...fields, links: list(opt.link), stage: opt.stage, owner: opt.owner });
  const file = path.join(K.paths(r).cards, `${id}-${slug(title)}.md`);
  write(file, text);
  K.log(r, 'new', { id, title });
  console.log(path.relative(process.cwd(), file));
}

function cmdList(opt) {
  const r = root();
  const cards = Object.values(K.loadCards(r))
    .filter((c) => !opt.type || c.type === String(opt.type).toUpperCase())
    .filter((c) => !opt.stage || (c.meta.stage || K.TYPES[c.type].stage) === opt.stage)
    .filter((c) => !opt.status || c.status === opt.status);
  for (const c of cards) console.log(`${c.id}  ${c.status.padEnd(10)} v${c.version}  ${c.meta.title || ''}`);
  if (!cards.length) console.log('No cards match.');
}

function cmdCheck(pos, opt) {
  const r = root();
  const cards = K.loadCards(r);
  const eng = K.readEngagement(r);
  const ids = pos.length ? pos.map((x) => x.toUpperCase()) : Object.keys(cards);
  let blocks = 0;
  const all = {};
  for (const id of ids) {
    const c = getCard(r, id, cards);
    const probs = K.checkCard(r, c, cards, eng).filter((p) => opt.all || p.level !== 'info');
    all[id] = probs;
    blocks += probs.filter((p) => p.level === 'block').length;
    if (opt.json) continue;
    if (!probs.length) { if (pos.length) console.log(`${id}  ok`); continue; }
    console.log(`${id}  ${c.meta.title || ''}`);
    for (const p of probs) console.log(`  ${icon(p.level)} ${p.msg}`);
  }
  for (const w of K.writebacks(r, cards)) if (!pos.length || ids.includes(w.id)) {
    if (!opt.json) console.log(`  ! ${w.id}: writeback from ${w.decision}${w.why ? ` (${w.why})` : ''}`);
  }
  if (opt.json) console.log(JSON.stringify({ blocks, cards: all, writebacks: K.writebacks(r, cards) }, null, 2));
  else console.log(blocks ? `\n${blocks} blocking problem(s).` : '\nNo blocking problems.');
  process.exit(blocks ? 1 : 0);
}

function cmdQuotes(pos) {
  const r = root();
  const cards = K.loadCards(r);
  const ids = pos.length ? pos : Object.keys(cards).filter((id) => id.startsWith('FND-'));
  let bad = 0;
  for (const id of ids) {
    const c = getCard(r, id, cards);
    const probs = K.verifyQuotes(r, c, cards);
    const n = K.extractQuotes(c.body).length;
    console.log(`${c.id}: ${n} quote(s), ${probs.length ? probs.length + ' failing' : 'all verified'}`);
    for (const p of probs) console.log(`  ✗ ${p}`);
    bad += probs.length;
  }
  process.exit(bad ? 1 : 0);
}

function cmdDor(pos) {
  const r = root();
  const cards = K.loadCards(r);
  const ids = pos.length ? pos : Object.keys(cards).filter((id) => id.startsWith('TKT-'));
  let bad = 0;
  for (const id of ids) {
    const c = getCard(r, id, cards);
    const probs = [...K.dor(c, cards), ...K.linkProblems(c, cards).filter((p) => p.level === 'block')];
    console.log(`${c.id}: ${probs.length ? 'not ready' : 'ready'}`);
    for (const p of probs) console.log(`  ✗ ${p.msg}`);
    bad += probs.length;
  }
  process.exit(bad ? 1 : 0);
}

// ---------------------------------------------------------------- sign / revise

const NEED_FINAL = ['supports', 'cites', 'reframes', 'serves', 'implements', 'measures'];

function cmdSign(pos, opt) {
  if (pos.length > 1) {
    // Several cards in one line, signed in the order given; stops at the first that cannot be signed.
    const rest = process.argv.slice(3).filter((a) => !pos.includes(a));
    const all = K.loadCards(root());
    for (const id of pos) {
      const x = all[String(id).toUpperCase()];
      if (x && x.status === 'final' && x.type !== 'REV' && !opt.cosign) { console.log(`${x.id} is already final; skipped.`); continue; }
      const res = require('child_process').spawnSync(process.execPath, [__filename, 'sign', id, ...rest], { stdio: 'inherit' });
      if (res.status) process.exit(res.status);
    }
    return;
  }
  const r = root();
  const cards = K.loadCards(r);
  const c = getCard(r, pos[0], cards);
  const name = opt.name;
  const role = String(opt.role || '').toLowerCase();
  if (!name || name === true) die('Who is signing? --name "Your Name" --role "research owner"');
  const eng = K.readEngagement(r);

  if (opt.cosign) {
    if (c.type !== 'BRF') die('Only the Brief takes a client co-sign.');
    if (c.status !== 'final') die(`${c.id} is not final yet. The engagement lead signs it first, so the client co-signs the version that stands.`);
    write(c.file, K.setField(c.text, 'cosigned_by', `${name} (client sponsor) ${K.now()}`));
    K.log(r, 'cosign', { id: c.id, by: name });
    return console.log(`${c.id} co-signed by ${name} (client sponsor).`);
  }
  if (c.status === 'final' && c.type !== 'REV') die(`${c.id} is already final. To change it: koru revise ${c.id} --reason "…"`);
  if (c.status === 'superseded') die(`${c.id} is superseded.`);

  // Role rules
  if (c.type === 'DEC') {
    if (String(c.meta.approver).toLowerCase().indexOf(name.toLowerCase()) < 0) die(`${c.id}'s Approver is ${c.meta.approver}. Only the Approver signs a Decision.`);
  } else if (c.type === 'REV') {
    const gate = K.GATES[c.meta.gate];
    if (!gate || !gate.signers.includes(role)) die(`This review is signed by: ${gate ? gate.signers.join(', ') : '(unknown gate)'}. Pass --role.`);
  } else {
    const signer = K.TYPES[c.type].signer;
    // Solo mode: a high-confidence Insight its research owner wrote is signed by a second person, in any role.
    const secondPair = c.type === 'INS' && c.meta.confidence === 'high' && K.filled(c.meta.author) && String(c.meta.author).toLowerCase() !== name.toLowerCase();
    if (role !== signer && !secondPair) die(`${c.type} cards are signed by the ${signer}. Pass --role "${signer}" if that is you.`);
  }
  const probs = K.checkCard(r, c, cards, eng).filter((p) => p.level === 'block');
  const drafts = c.links.filter((l) => !l.bad && NEED_FINAL.includes(l.kind) && cards[l.id] && cards[l.id].status !== 'final');
  if (probs.length || drafts.length) {
    console.error(`${c.id} cannot be signed yet:`);
    for (const p of probs) console.error(`  ✗ ${p.msg}`);
    for (const l of drafts) console.error(`  ✗ Cites ${l.id}, which is ${cards[l.id].status}. Sign that first.`);
    if (drafts.length) {
      // Everything upstream that is still a draft, sources first, grouped by who signs it.
      const order = [];
      const seen = new Set();
      const visit = (id) => {
        if (seen.has(id)) return;
        seen.add(id);
        const x = cards[id];
        if (!x) return;
        for (const l of x.links) if (!l.bad && NEED_FINAL.includes(l.kind) && cards[l.id] && cards[l.id].status !== 'final' && cards[l.id].status !== 'superseded') visit(l.id);
        if (id !== c.id && x.status !== 'final') order.push(x);
      };
      visit(c.id);
      const byRole = {};
      for (const x of order) (byRole[K.TYPES[x.type].signer] = byRole[K.TYPES[x.type].signer] || []).push(x.id);
      console.error('\nSign these first, in this order:');
      for (const x of order) {
        const role = K.TYPES[x.type].signer;
        if (!byRole[role]) continue;
        console.error(`  koru sign ${byRole[role].join(' ')} --name "…" --role "${role}"`);
        delete byRole[role];
      }
    }
    process.exit(1);
  }

  // Solo mode: nobody signs their own high-confidence Insight.
  if (c.type === 'INS' && c.meta.confidence === 'high' && c.meta.author && c.meta.author.toLowerCase() === name.toLowerCase())
    die('You wrote this high-confidence Insight, so a second person signs it (solo-mode rule).');

  let text = c.text;
  // Pin every link to the version signed against.
  const pinned = c.links.map((l) => (l.bad || !cards[l.id] ? l.raw : `${l.kind} ${l.id}@${cards[l.id].version}${l.why ? ': ' + l.why : ''}`));
  if (pinned.length) text = K.setField(text, 'links', pinned);

  if (c.type === 'REV') {
    const gate = K.GATES[c.meta.gate];
    const prev = [].concat(c.meta.reviewers || []).filter(Boolean);
    const others = prev.filter((x) => !x.toLowerCase().startsWith(role + ':'));
    const now = [...others, `${role}: ${name} ${K.now()}`];
    text = K.setField(text, 'reviewers', now);
    const complete = gate.signers.every((s) => now.some((x) => x.toLowerCase().startsWith(s + ':')));
    if (complete) { text = K.setField(text, 'status', 'final'); text = K.setField(text, 'signed_at', K.now()); }
    write(c.file, K.setField(text, 'updated', K.now()));
    K.log(r, 'sign', { id: c.id, by: name, role });
    return console.log(complete ? `${c.id} signed by every reviewer. Final.` : `${c.id}: ${role} signed. Still needed: ${gate.signers.filter((s) => !now.some((x) => x.toLowerCase().startsWith(s + ':'))).join(', ')}.`);
  }

  text = K.setField(text, 'status', 'final');
  text = K.setField(text, 'signed_by', `${name} (${c.type === 'DEC' ? 'approver' : role})`);
  text = K.setField(text, 'signed_at', K.now());
  text = K.setField(text, 'updated', K.now());
  write(c.file, text);
  snapshot(r, K.cardFromText(text, c.file));

  // A signed Decision supersedes what it names and flags what it affects.
  if (c.type === 'DEC') {
    for (const l of c.links.filter((x) => x.kind === 'supersedes' && cards[x.id])) {
      const old = cards[l.id];
      write(old.file, K.setField(K.setField(old.text, 'status', 'superseded'), 'superseded_by', c.id));
      K.log(r, 'superseded', { id: old.id, by: c.id });
    }
  }
  K.log(r, 'sign', { id: c.id, by: name, role });
  console.log(`${c.id} signed by ${name}. Final at version ${c.version}.`);
  const flagged = K.writebacks(r, K.loadCards(r)).filter((w) => w.decision === c.id);
  if (flagged.length) console.log(`Flagged for writeback: ${flagged.map((w) => w.id).join(', ')}. Their owners accept (koru revise), reject or note (koru clear-flag).`);
}

function cmdRevise(pos, opt) {
  const r = root();
  const c = getCard(r, pos[0]);
  if (!opt.reason || opt.reason === true) die('Say why: koru revise ID --reason "what changed"');
  if (c.type === 'DEC' && c.status === 'final') die(`${c.id} is an accepted Decision. Decisions are superseded, never edited: koru new DEC "…" --link "supersedes ${c.id}: why"`);
  if (c.status !== 'final') die(`${c.id} is ${c.status}; edit it directly.`);
  snapshot(r, c);
  let text = c.text;
  text = K.setField(text, 'version', String(c.version + 1));
  text = K.setField(text, 'status', 'draft');
  text = K.setField(text, 'signed_by', '');
  text = K.setField(text, 'signed_at', '');
  text = K.setField(text, 'updated', K.now());
  write(c.file, text);
  K.log(r, 'revise', { id: c.id, version: c.version + 1, reason: opt.reason });
  const down = K.inbound(K.loadCards(r), c.id).map((x) => x.id);
  console.log(`${c.id} is now draft version ${c.version + 1}. ${down.length ? `Cards pinned to the old version will show as stale once it is signed: ${down.join(', ')}.` : ''}`);
}

// A draft made by mistake can be discarded while nothing rests on it. It is kept in history.
function cmdDiscard(pos, opt) {
  const r = root();
  const cards = K.loadCards(r);
  const c = getCard(r, pos[0], cards);
  if (!opt.reason || opt.reason === true) die(`Say why: koru discard ${c.id} --reason "created by mistake"`);
  if (c.status !== 'draft' || c.version > 1 || K.filled(c.meta.signed_by)) die(`${c.id} has been in review or signed. It is superseded, never discarded.`);
  if (c.type === 'REV') die('Checker reviews are kept.');
  const cited = K.inbound(cards, c.id).map((x) => x.id);
  if (cited.length) die(`${cited.join(', ')} cite ${c.id}. Re-point them first.`);
  const dir = path.join(K.paths(r).history, c.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(c.file, path.join(dir, `${K.now().replace(/[:]/g, '')}-discarded.md`));
  K.log(r, 'discard', { id: c.id, title: c.meta.title, reason: opt.reason });
  console.log(`${c.id} discarded (kept in koru/history/${c.id}). Its id is not reused.`);
}

function cmdClearFlag(pos, opt) {
  const r = root();
  const c = getCard(r, pos[0]);
  if (!opt.decision || !opt.reason || opt.reason === true) die('koru clear-flag ID --decision DEC-001 --reason "why no change is needed" --name "You"');
  K.appendJsonl(K.stateFile(r, 'flags.jsonl'), { id: c.id, decision: String(opt.decision).toUpperCase(), reason: opt.reason, by: opt.name || '', at: K.now() });
  K.log(r, 'clear-flag', { id: c.id, decision: opt.decision, reason: opt.reason });
  console.log(`Writeback on ${c.id} from ${opt.decision} cleared: ${opt.reason}`);
}

// ---------------------------------------------------------------- tests

function cmdThreshold(pos, opt) {
  const r = root();
  const c = getCard(r, pos[0]);
  if (c.type !== 'DIR') die('Thresholds live on Direction cards.');
  if (K.filled(c.meta.result)) die(`${c.id} already has a result. A threshold set after results is not a threshold.`);
  let text = c.text;
  if (opt.set && opt.set !== true) text = K.setField(text, 'threshold', opt.set);
  if (!K.filled(K.splitCard(text).meta.threshold)) die('Write the threshold first: koru threshold DIR-001 --set "7 of 10 finish the task unaided"');
  text = K.setField(text, 'threshold_saved_at', K.now());
  write(c.file, text);
  K.log(r, 'threshold', { id: c.id });
  console.log(`${c.id}: threshold saved at ${K.now()}. Results can now be recorded.`);
}

function cmdResult(pos, opt) {
  const r = root();
  const c = getCard(r, pos[0]);
  if (c.type !== 'DIR') die('Results live on Direction cards.');
  if (!K.filled(c.meta.threshold_saved_at)) die(`${c.id} has no saved threshold. Save it before any result: koru threshold ${c.id}`);
  const res = pos.slice(1).join(' ') || opt.text;
  if (!res) die('koru result DIR-001 "6 of 8 finished unaided"');
  write(c.file, K.setField(K.setField(c.text, 'result', res), 'result_at', K.now()));
  K.log(r, 'result', { id: c.id, result: res });
  console.log(`${c.id}: result recorded against threshold "${c.meta.threshold}".`);
}

// ---------------------------------------------------------------- decisions

function impact(cards, ids, hops) {
  const seen = new Map();
  let frontier = ids.slice();
  for (let h = 1; h <= hops; h++) {
    const next = [];
    for (const id of frontier) for (const c of K.inbound(cards, id)) {
      if (c.type === 'DEC' || seen.has(c.id) || ids.includes(c.id)) continue;
      seen.set(c.id, h);
      next.push(c.id);
    }
    frontier = next;
  }
  return seen;
}

function cmdDecide(pos, opt) {
  const r = root();
  const sub = pos[0];
  if (sub === 'impact') {
    const cards = K.loadCards(r);
    const d = getCard(r, pos[1], cards);
    const affects = d.links.filter((l) => l.kind === 'affects').map((l) => l.id);
    if (!affects.length) die(`${d.id} names no cards. Add "affects ID: why" links first.`);
    const sens = (c) => c && (c.type === 'TKT' || /accessib|wcag|safety|contract|consent|privacy/i.test(c.text));
    console.log(`Impact of ${d.id} (${d.meta.title})`);
    console.log('Flags now (one hop): ' + affects.map((id) => `${id}${sens(cards[id]) ? ' [needs review gate]' : ''}`).join(', '));
    const more = impact(cards, affects, 2);
    if (more.size) console.log('If accepted, then: ' + [...more].map(([id, h]) => `${id} (hop ${h + 1})${sens(cards[id]) ? ' [needs review gate]' : ''}`).join(', '));
    return;
  }
  if (sub === 'new' || !sub) {
    const q = pos.slice(1).join(' ') || opt.question;
    if (!q) die('koru decide new "the question" --affects SCR-002 --affects TKT-004');
    return cmdNew(['DEC', q], { ...opt, link: [...list(opt.link), ...list(opt.affects).map((id) => `affects ${String(id).toUpperCase()}: ${opt.why || 'see decision'}`)] });
  }
  die('koru decide new "question" | koru decide impact DEC-001');
}

// ---------------------------------------------------------------- reviews

function cmdReview(pos, opt) {
  const r = root();
  const stage = pos[0];
  if (!K.STAGES.includes(stage)) die(`koru review ${K.STAGES.join('|')} --checker research-checker [--file findings.md]`);
  const checker = opt.checker || `${stage}-checker`;
  let findings = '';
  if (opt.file && opt.file !== true) findings = fs.readFileSync(path.resolve(opt.file), 'utf8').trim();
  const n = findings.split(/\r?\n/).filter((l) => /^\d+\.\s/.test(l) && !/\[none\]/i.test(l)).length;
  const id = K.nextId(r, 'REV');
  const title = `${stage} gate review`;
  let text = T.render('REV', id, title, { gate: stage, checker, checklist_version: opt.checklist || `${stage}-v2`, catches: String(n), stage });
  if (findings) text = text.replace(/## Findings\n\n[\s\S]*$/, `## Findings\n\n${findings}\n`);
  const file = path.join(K.paths(r).cards, `${id}-${slug(title)}.md`);
  write(file, text);
  K.appendJsonl(K.stateFile(r, 'reviews.jsonl'), { rev: id, stage, at: K.now(), hashes: K.reviewSnapshot(K.loadCards(r), stage) });
  K.log(r, 'review', { id, gate: stage, checker, catches: n });
  console.log(`${path.relative(process.cwd(), file)}  (${n} finding(s) from ${checker}). Give each a disposition: fixed, accepted risk, or deferred TKT-000.`);
}

// ---------------------------------------------------------------- gates

function cmdGate(pos, opt) {
  const r = root();
  const stage = pos[0] || K.currentStage(r);
  if (!K.GATES[stage]) die(`koru gate ${K.STAGES.join('|')}`);
  const rep = K.gateReport(r, stage);
  console.log(`${K.GATES[stage].label} gate${rep.passed ? ` (passed ${rep.passed.at} by ${rep.passed.by})` : ''}`);
  for (const row of rep.rows) console.log(`  ${row.ok ? '✓' : '✗'} ${row.item}`);
  console.log(`  Signers: ${K.GATES[stage].signers.join(', ')}`);
  if (!opt.pass) { console.log(rep.ok ? '\nReady to pass. A signer runs: koru gate ' + stage + ' --pass --name "…" --role "…"' : '\nNot ready.'); process.exit(rep.ok ? 0 : 1); }
  if (!rep.ok) die('\nThe gate cannot pass until every line above is ✓.');
  const role = String(opt.role || '').toLowerCase();
  if (!opt.name || !K.GATES[stage].signers.includes(role)) die(`Pass with --name and --role (${K.GATES[stage].signers.join(' or ')}).`);
  K.appendJsonl(K.stateFile(r, 'gates.jsonl'), { stage, by: `${opt.name} (${role})`, at: K.now(), review: rep.review });
  K.log(r, 'gate', { stage, by: opt.name, role });
  console.log(`\n${K.GATES[stage].label} gate passed by ${opt.name}.`);
}

// ---------------------------------------------------------------- recap

function recap(r, brief) {
  const cards = K.loadCards(r);
  const eng = K.readEngagement(r);
  const stage = K.currentStage(r, cards);
  const events = K.readJsonl(K.stateFile(r, 'log.jsonl'));
  const out = [];
  out.push(`Koru · ${eng.client || 'project'} · stage: ${stage}`);
  if (eng.ai_tier === 'unset' || !eng.ai_tier) out.push('! Contract not set. A person runs: koru contract --tier … --data-class … --processor …');
  const last = events.slice(-(brief ? 5 : 12)).reverse();
  if (last.length) {
    out.push('', 'Latest:');
    for (const e of last) out.push(`  ${e.at.slice(0, 16).replace('T', ' ')}  ${e.action}${e.id ? ' ' + e.id : ''}${e.by ? ' by ' + e.by : ''}${e.reason ? ' — ' + e.reason : ''}${e.title ? ' — ' + e.title : ''}`);
  }
  const wb = K.writebacks(r, cards);
  const stale = Object.values(cards).filter((c) => K.linkProblems(c, cards).some((p) => p.rule === 'stale'));
  const waiting = Object.values(cards).filter((c) => c.status === 'review');
  const drafts = Object.values(cards).filter((c) => c.status === 'draft');
  out.push('', `Open: ${drafts.length} draft · ${waiting.length} waiting for a signature · ${stale.length} stale · ${wb.length} writeback`);
  for (const w of wb.slice(0, 5)) out.push(`  ! ${w.id} flagged by ${w.decision}${w.why ? `: ${w.why}` : ''}`);
  for (const c of stale.slice(0, 5)) out.push(`  ! ${c.id} is stale (a source changed)`);
  for (const c of waiting.slice(0, 5)) out.push(`  · ${c.id} waits for the ${K.TYPES[c.type].signer}`);
  if (stage !== 'done') {
    const rep = K.gateReport(r, stage, cards);
    const next = rep.rows.find((x) => !x.ok);
    out.push('', `Next for the ${stage} gate: ${next ? next.item : 'ready to pass'}`);
  }
  return out.join('\n');
}

function cmdWhere(opt) { console.log(recap(root(), !!opt.brief)); }

function cmdJoin() {
  const r = root();
  const cards = K.loadCards(r);
  const eng = K.readEngagement(r);
  const brf = K.active(cards, 'BRF')[0];
  console.log(`Joining ${eng.client || 'this project'}`);
  console.log(`Switches: call ${eng.call_context} · start ${eng.starting_point} · product ${eng.product_state} · design system ${eng.design_system} · AI ${eng.ai_in_product} · deliverables ${[].concat(eng.deliverables).join(', ')} · client ${eng.client_maturity}`);
  console.log(`Contract: AI tier ${eng.ai_tier} · data ${eng.data_class} · disclosure ${eng.disclosure}`);
  console.log(`Roles: ${[].concat(eng.roles || []).join(' · ') || '(not recorded)'}`);
  console.log(`\nBrief: ${brf ? `${brf.id} ${brf.meta.title} (${brf.status})` : 'not written yet'}`);
  const decs = K.active(cards, 'DEC').filter((d) => d.status === 'final');
  console.log(`\nSigned decisions (${decs.length}):`);
  for (const d of decs) console.log(`  ${d.id} ${d.meta.title} → ${d.meta.outcome || d.sections.outcome || ''} (${d.meta.signed_by})`);
  const ctx = K.active(cards, 'CTX')[0];
  const blanks = ctx ? K.CTX_QUESTIONS.filter((q) => !K.filled(ctx.sections[q.toLowerCase()])) : K.CTX_QUESTIONS;
  const cons = K.active(cards, 'CON').filter((c) => /^open$/i.test(c.meta.resolution || 'open'));
  console.log(`\nOpen questions: ${blanks.length} unanswered context question(s)${cons.length ? `; open conflicts ${cons.map((c) => c.id).join(', ')}` : ''}`);
  console.log('\nWho signs what:');
  for (const [t, v] of Object.entries(K.TYPES)) if (v.signer !== 'approver') process.stdout.write(`${t}: ${v.signer}  `);
  console.log('\n');
  console.log(recap(r, true));
}

// ---------------------------------------------------------------- notes, pseudonymise

function cmdNote(pos, opt) {
  const text = pos.join(' ') || opt.text;
  if (!text) die('koru note "what the client asked" --from "who"');
  const r = root();
  const id = K.nextId(r, 'REQ');
  const title = text.length > 60 ? text.slice(0, 57) + '…' : text;
  let card = T.render('REQ', id, title, { from: opt.from || '', received: K.today() });
  card = card.replace(/## Request\n\n[^\n]*\n/, `## Request\n\n${text}\n`);
  const file = path.join(K.paths(r).cards, `${id}-${slug(title)}.md`);
  write(file, card);
  K.log(r, 'note', { id, title });
  console.log(path.relative(process.cwd(), file));
}

const NOT_NAMES = new Set('I Interviewer Moderator Okay Yes Yeah Sure Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March April May June July August September October November December English'.split(' '));
// Capitalised words in mid-sentence that the map did not replace: likely people the participant named.
function possibleNames(text, ids) {
  const found = [];
  const seen = new Set();
  text.split(/\r?\n/).forEach((line, i) => {
    const body = line.replace(/^\s*(\[[^\]]*\]\s*)?[^:]{1,40}:\s*(\*{1,2}\s*)?/, '');
    if (/^#/.test(line)) return;
    for (const sentence of body.split(/[.!?]\s+|[\"“”]/)) {
      const words = sentence.trim().split(/\s+/).slice(1);
      for (const w0 of words) {
        const w = w0.replace(/[^A-Za-z'’-]/g, '').replace(/['’]s$/, '');
        if (/^[A-Z][a-z]{2,}$/.test(w) && !NOT_NAMES.has(w) && !ids.includes(w) && !seen.has(w)) { seen.add(w); found.push({ line: i + 1, word: w }); }
      }
    }
  });
  return found;
}

function cmdPseudonymise(pos, opt) {
  const r = root();
  const p = K.paths(r);
  const src = path.resolve(pos[0] || '');
  if (!fs.existsSync(src)) die('koru pseudonymise koru/raw/originals/interview-01.txt --map koru/private/names.csv');
  const mapFile = path.resolve(opt.map || path.join(p.private, 'names.csv'));
  if (!fs.existsSync(mapFile)) die(`Write the name map first (outside AI's reach): ${path.relative(process.cwd(), mapFile)} with lines "Real Name,P01"`);
  let text = fs.readFileSync(src, 'utf8');
  const pairs = fs.readFileSync(mapFile, 'utf8').split(/\r?\n/).map((l) => l.split(',').map((s) => s.trim())).filter((x) => x[0] && x[1]);
  pairs.sort((a, b) => b[0].length - a[0].length);
  let n = 0;
  for (const [name, pid] of pairs) {
    const parts = [name, ...name.split(/\s+/).filter((w) => w.length > 2)];
    for (const part of parts) {
      const re = new RegExp(`\\b${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      text = text.replace(re, () => { n++; return pid; });
    }
  }
  const out = path.resolve(opt.out || path.join(p.raw, path.basename(src)));
  write(out, text);
  K.log(r, 'pseudonymise', { file: path.relative(p.koru, out), replaced: n });
  console.log(`${n} name(s) replaced. Claude may read ${path.relative(process.cwd(), out)}. The key stays in ${path.relative(process.cwd(), mapFile)}.`);
  const left = possibleNames(text, pairs.map((x) => x[1]));
  if (left.length) console.log(`Check these before Claude reads the file. They look like names the map does not cover:\n${left.map((x) => `  line ${x.line}: ${x.word}`).join('\n')}\nAdd real names to the map and run this again; ignore product or place names.`);
}

// ---------------------------------------------------------------- health

function health(r, cards) {
  cards = cards || K.loadCards(r);
  const tkts = K.active(cards, 'TKT');
  const reach = (id, target, seen = new Set()) => {
    if (seen.has(id)) return false;
    seen.add(id);
    const c = cards[id];
    if (!c) return false;
    if (c.type === target) return true;
    return c.links.some((l) => !l.bad && l.kind !== 'affects' && l.kind !== 'contradicts' && reach(l.id, target, seen));
  };
  const traced = tkts.filter((t) => reach(t.id, 'INS'));
  const ins = K.active(cards, 'INS');
  const mix = { low: 0, medium: 0, high: 0, unrated: 0 };
  for (const c of ins) mix[K.CONFIDENCE.includes(c.meta.confidence) ? c.meta.confidence : 'unrated']++;
  const revs = K.active(cards, 'REV');
  const catches = revs.reduce((a, c) => a + Number(c.meta.catches || 0), 0);
  const finals = Object.values(cards).filter((c) => c.status === 'final');
  const firstPass = finals.filter((c) => c.version === 1).length;
  const avgV = finals.length ? finals.reduce((a, c) => a + c.version, 0) / finals.length : 0;
  return {
    trace_coverage: tkts.length ? `${traced.length} of ${tkts.length} tickets trace to an Insight` : 'no tickets yet',
    confidence_mix: `${mix.high} high · ${mix.medium} medium · ${mix.low} low${mix.unrated ? ` · ${mix.unrated} unrated` : ''}`,
    open_writebacks: K.writebacks(r, cards).length,
    catch_count: `${catches} caught by checkers across ${revs.length} review(s)`,
    first_pass_acceptance: finals.length ? `${Math.round((100 * firstPass) / finals.length)}% of final cards signed at version 1` : 'nothing signed yet',
    rework_cycles: finals.length ? `${avgV.toFixed(1)} versions per final card` : '—',
  };
}

function cmdHealth() {
  const r = root();
  for (const [k, v] of Object.entries(health(r))) console.log(`${k.replace(/_/g, ' ').padEnd(22)} ${v}`);
}

// ---------------------------------------------------------------- index / board

function cmdIndex(opt) {
  const r = root();
  const out = require('./board').generate(r, { health });
  console.log(`Generated: ${out.map((f) => path.relative(process.cwd(), f)).join(', ')}`);
  if (opt.open) openFile(out[0]);
}

function openFile(f) {
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
  require('child_process').exec(`${cmd} "${f}"`);
}

// ---------------------------------------------------------------- doctor

function cmdDoctor() {
  const major = Number(process.versions.node.split('.')[0]);
  console.log(`node ${process.versions.node} ${major >= 18 ? 'ok' : '(needs 18 or newer)'}`);
  const r = K.findRoot();
  if (!r) return console.log('No Koru project in this folder yet. Run /koru:start.');
  const e = K.readEngagement(r);
  console.log(`project ${r}`);
  console.log(`contract: tier ${e.ai_tier} · data ${e.data_class} · processor ${e.ai_processor || '(none)'}`);
  console.log(`cards: ${Object.keys(K.loadCards(r)).length}`);
  console.log(`Figma writes: ${e.ai_tier === 'full' ? 'allowed, each asks a person first' : 'blocked by the contract tier'}`);
  console.log(`Jira writes: ${e.ai_tier === 'full' ? 'allowed for tickets that pass Definition of Ready, each asks a person first' : 'blocked by the contract tier'}`);
}

// ---------------------------------------------------------------- help

const HELP = `koru — the Koru project graph

Start
  init [--client NAME]               create koru/ in this folder
  contract --tier T --data-class C --processor P     (a person)  set the contract
Cards
  new TYPE "title" [--link "supports FND-001: why"] [--field k=v]
  list [--type T] [--stage S] [--status S]   ·   check [ID…] [--json]
  quotes [FND…]                      verify quotes word for word against transcripts
  dor [TKT…]                         Definition of Ready
  revise ID --reason "…"             reopen a final card as the next version
  discard ID --reason "…"            remove a draft made by mistake (never signed, nothing cites it)
  sign ID --name N --role R          (a person)  sign; pins sources; supersedes
  sign BRF-001 --cosign --name N     (a person)  client sponsor co-sign
Tests and decisions
  threshold DIR-001 --set "…"        save the success threshold before testing
  result DIR-001 "…"                 record a result (refused without a saved threshold)
  decide new "question" --affects ID ·  decide impact DEC-001
  clear-flag ID --decision DEC --reason "…"   (a person)
Gates
  review STAGE --checker NAME --file findings.md     record a checker review
  gate [STAGE]                       show the exit contract
  gate STAGE --pass --name N --role R             (a person)
Moments
  where [--brief] · join · note "client request" --from WHO · health
  index [--open]                     generate board, decision log, trace, client page, knowledge
  board --serve [--port 4321]        the board on this computer; edit draft cards in the browser
  pseudonymise FILE --map koru/private/names.csv   (a person)
  share FILE [--password P] [--publish] [--to CLIENT]   (a person)  password-protected link
  doctor
Design system and quality (koru ds help for all)
  ds catalog · ds adopt ID · ds extend --css … · ds check · ds lint [FILE] · ds inline FILE
  ds component add NAME --spec SCR-001 · ds approve --name N   (a person)
  audit [FILE] [--quick] [--json]    accessibility, keyboard, target size and layout at four sizes, every state, in a real browser
  scaffold [--stack react-tailwind] [--dir app]   front-end foundation from the design system and the cards
Card types: ${Object.entries(K.TYPES).map(([k, v]) => `${k} ${v.name}`).join(' · ')}`;

// ---------------------------------------------------------------- main

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const { pos, opt } = parseArgs(rest);
  switch (cmd) {
    case 'init': return cmdInit(opt);
    case 'contract': return cmdContract(opt);
    case 'new': return cmdNew(pos, opt);
    case 'list': case 'ls': return cmdList(opt);
    case 'show': { const c = getCard(root(), pos[0]); return console.log(c.text); }
    case 'check': return cmdCheck(pos, opt);
    case 'quotes': return cmdQuotes(pos);
    case 'dor': return cmdDor(pos);
    case 'sign': return cmdSign(pos, opt);
    case 'revise': return cmdRevise(pos, opt);
    case 'clear-flag': return cmdClearFlag(pos, opt);
    case 'discard': return cmdDiscard(pos, opt);
    case 'threshold': return cmdThreshold(pos, opt);
    case 'result': return cmdResult(pos, opt);
    case 'decide': return cmdDecide(pos, opt);
    case 'review': return cmdReview(pos, opt);
    case 'gate': return cmdGate(pos, opt);
    case 'where': return cmdWhere(opt);
    case 'join': return cmdJoin();
    case 'note': return cmdNote(pos, opt);
    case 'pseudonymise': case 'pseudonymize': return cmdPseudonymise(pos, opt);
    case 'health': return cmdHealth();
    case 'index': case 'board': if (opt.serve) return require('./serve').serve(root(), opt, health); return cmdIndex({ ...opt, open: opt.open || cmd === 'board' });
    case 'share': return require('./share').cmdShare(root(), pos, opt);
    case 'doctor': return cmdDoctor();
    case 'ds': return require('./ds-cli').cmdDs(root(), pos, opt);
    case 'audit': return require('./audit').cmdAudit(root(), pos, opt);
    case 'scaffold': return require('./scaffold').cmdScaffold(root(), pos, opt);
    case undefined: case 'help': case '--help': case '-h': return console.log(HELP);
    default: die(`Unknown command "${cmd}". Run: koru help`);
  }
}

if (require.main === module) main();
module.exports = { recap, health, HUMAN_ONLY };
