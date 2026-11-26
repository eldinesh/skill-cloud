#!/usr/bin/env node
'use strict';
// End-to-end test of the Koru engine and hooks: a small claims project from kick-off to tickets,
// with planted defects each rule must catch. Run: node tests/koru/test.js   (no dependencies)

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '../..');
const KORU = path.join(REPO, 'lib', 'koru.js');
const GUARD = path.join(REPO, 'lib', 'guard.js');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koru-test-'));
let pass = 0;
let fail = 0;

function koru(args, expectFail) {
  const r = spawnSync('node', [KORU, ...args], { cwd: dir, encoding: 'utf8', env: { ...process.env, KORU_ROOT: '' } });
  const out = (r.stdout || '') + (r.stderr || '');
  if (!expectFail && r.status !== 0) throw new Error(`koru ${args.join(' ')} failed:\n${out}`);
  if (expectFail && r.status === 0) throw new Error(`koru ${args.join(' ')} should have failed:\n${out}`);
  return out;
}
function guard(event, payload) {
  const r = spawnSync('node', [GUARD, event], { cwd: dir, input: JSON.stringify({ cwd: dir, ...payload }), encoding: 'utf8' });
  return r.stdout ? JSON.parse(r.stdout) : {};
}
const decision = (o) => (o.hookSpecificOutput || {}).permissionDecision || 'allow';
function t(name, fn) {
  try { fn(); pass++; console.log(`  ✓ ${name}`); } catch (e) { fail++; console.log(`  ✗ ${name}\n      ${String(e.message).split('\n').join('\n      ')}`); }
}
function eq(a, b, msg) { if (a !== b) throw new Error(`${msg || ''} expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }
function has(s, sub) { if (!String(s).includes(sub)) throw new Error(`expected output to contain "${sub}":\n${s}`); }
const card = (id) => path.join(dir, 'koru', 'cards', fs.readdirSync(path.join(dir, 'koru', 'cards')).find((f) => f.startsWith(id)));
const read = (id) => fs.readFileSync(card(id), 'utf8');
const put = (id, text) => fs.writeFileSync(card(id), text);
// What a person does in their editor (hooks do not apply to people).
function fill(id, sections, fields) {
  let s = read(id);
  for (const [k, v] of Object.entries(fields || {})) s = s.replace(new RegExp(`^${k}:.*$`, 'm'), `${k}: ${v}`);
  for (const [h, v] of Object.entries(sections || {})) s = s.replace(new RegExp(`(## ${h}\\n\\n)[\\s\\S]*?(?=\\n## |$)`), (m, a) => `${a}${v}\n`);
  put(id, s);
}
// What Claude does: an Edit that goes through the PreToolUse hook first.
function claudeEdit(id, oldS, newS) {
  return decision(guard('PreToolUse', { tool_name: 'Edit', tool_input: { file_path: card(id), old_string: oldS, new_string: newS } }));
}

console.log(`Koru engine test in ${dir}\n`);
console.log('Setup and contract');
t('init creates the project', () => { has(koru(['init', '--client', 'Acme Claims']), 'Koru project created'); });
t('research data is closed until a person sets the contract', () => {
  fs.writeFileSync(path.join(dir, 'koru/raw/interview-01.md'), '# Interview 01\n[00:01:10] P01: I usually export everything to a spreadsheet first.\n[00:03:42] P01: Honestly I never trust the auto-assigned owner, I check it by hand every morning.\n[00:05:07] P02: It sent three claims to someone on leave.\n');
  eq(decision(guard('PreToolUse', { tool_name: 'Read', tool_input: { file_path: path.join(dir, 'koru/raw/interview-01.md') } })), 'deny');
});
t('Claude cannot run koru contract', () => eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru contract --tier full' } })), 'deny'));
t('a person sets the contract', () => { has(koru(['contract', '--tier', 'full', '--data-class', 'personal', '--processor', 'Anthropic']), 'AI tier full'); });
t('now Claude may read the pseudonymised transcript', () => eq(decision(guard('PreToolUse', { tool_name: 'Read', tool_input: { file_path: path.join(dir, 'koru/raw/interview-01.md') } })), 'allow'));
t('originals stay closed', () => eq(decision(guard('PreToolUse', { tool_name: 'Read', tool_input: { file_path: path.join(dir, 'koru/raw/originals/x.txt') } })), 'deny'));
t('Claude cannot change the contract in engagement.md', () => {
  eq(decision(guard('PreToolUse', { tool_name: 'Edit', tool_input: { file_path: path.join(dir, 'koru/engagement.md'), old_string: 'ai_tier: full', new_string: 'ai_tier: restricted' } })), 'deny');
});
t('pseudonymise replaces names from the private map', () => {
  fs.writeFileSync(path.join(dir, 'koru/private/names.csv'), 'Maria Lopez,P03\n');
  fs.writeFileSync(path.join(dir, 'koru/raw/originals/int-03.txt'), '[00:00:05] Maria Lopez: Maria here, I run the queue.\n');
  has(koru(['pseudonymise', 'koru/raw/originals/int-03.txt']), 'name(s) replaced');
  const out = fs.readFileSync(path.join(dir, 'koru/raw/int-03.txt'), 'utf8');
  if (/Maria|Lopez/.test(out)) throw new Error(out);
});
t('pseudonymise lists names the map missed', () => {
  fs.writeFileSync(path.join(dir, 'koru/raw/originals/int-04.txt'), '[00:00:05] Maria Lopez: My lead Sandra checks the big ones.\n');
  has(koru(['pseudonymise', 'koru/raw/originals/int-04.txt']), 'line 1: Sandra');
  fs.unlinkSync(path.join(dir, 'koru/raw/int-04.txt'));
});

console.log('\nFrame');
t('context card blocks the Brief until questions 1-5 are answered', () => {
  koru(['new', 'CTX', 'Context']);
  has(koru(['check', 'CTX-001'], true), 'Context question 1');
  fill('CTX-001', { 'Why now': 'Backlog doubled after the merger.', 'Result wanted': 'Claims assigned right first time.', Users: 'Claims adjusters, team leads.', Decider: 'Head of claims ops.', 'What exists': 'Rule-based auto-assignment.' });
  has(koru(['check', 'CTX-001']), 'No blocking problems');
});
t('a Data card needs consent naming the processor (hook)', () => {
  koru(['new', 'DAT', 'Interview P01', '--field', 'source=interview', '--field', 'file=raw/interview-01.md', '--field', 'study=S1', '--field', 'participant=P01', '--field', 'consent=Signed form 2026-11-20', '--field', 'data_class=personal', '--field', 'retention=2028-11-20']);
  eq(claudeEdit('DAT-001', 'study: S1', 'study: S1 '), 'deny');
  fill('DAT-001', {}, { consent: 'Signed form 2026-11-20 naming Anthropic as AI processor' });
  eq(claudeEdit('DAT-001', 'study: S1', 'study: S1'), 'allow');
});
t('a wrong quote is refused before it is written', () => {
  koru(['new', 'FND', 'Adjusters re-check auto-assigned owners by hand', '--link', 'supports DAT-001: interview', '--field', 'evidence=observed', '--field', 'count=2 of 9']);
  eq(claudeEdit('FND-001', '## Quotes\n', '## Quotes\n\n> "I never trust the owner it assigns" (P01, 00:03:42, DAT-001)\n'), 'deny');
});
t('a quote with the wrong speaker is refused', () => {
  eq(claudeEdit('FND-001', '## Quotes\n', '## Quotes\n\n> "It sent three claims to someone on leave." (P01, 00:05:07, DAT-001)\n'), 'deny');
});
t('an exact quote is allowed', () => {
  eq(claudeEdit('FND-001', '## Quotes\n', '## Quotes\n\n> "Honestly I never trust the auto-assigned owner, I check it by hand every morning." (P01, 00:03:42, DAT-001)\n'), 'allow');
  fill('FND-001', { Observation: 'Two of nine adjusters re-check every auto-assigned owner by hand each morning.', Quotes: '> "Honestly I never trust the auto-assigned owner, I check it by hand every morning." (P01, 00:03:42, DAT-001)' });
  has(koru(['quotes', 'FND-001']), 'all verified');
});
t('a causal word in a Finding is flagged as advice', () => {
  fill('FND-001', { Observation: 'Adjusters re-check owners because they distrust the rules.' });
  const out = koru(['check', 'FND-001']);
  has(out, 'causal word');
  fill('FND-001', { Observation: 'Two of nine adjusters re-check every auto-assigned owner by hand each morning.' });
});
t('synthetic output cannot become a Finding (hook)', () => eq(claudeEdit('FND-001', 'evidence: observed', 'evidence: synthetic'), 'deny'));
t('Claude cannot write an Insight (hook)', () => {
  eq(decision(guard('PreToolUse', { tool_name: 'Write', tool_input: { file_path: path.join(dir, 'koru/cards/INS-001-x.md'), content: '---\nid: INS-001\ntype: INS\ntitle: x\n---\n' } })), 'deny');
});
t('Claude cannot create an Insight through the engine either (hook)', () => {
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru new INS "Adjusters distrust routing"' } })), 'deny');
});
t('koru new refuses sign-off fields, synthetic Findings and help flags', () => {
  has(koru(['new', 'FND', 'x', '--field', 'signed_by=Claude'], true), 'set by koru sign');
  has(koru(['new', 'FND', 'x', '--field', 'evidence=synthetic'], true), 'Synthetic output cannot become a Finding');
  has(koru(['new', 'DAT', '--help']), 'new TYPE "title"');
  if (fs.readdirSync(path.join(dir, 'koru/cards')).some((f) => f.startsWith('DAT-002'))) throw new Error('--help made a card');
});
t('Claude cannot set confidence or sign (hook)', () => {
  eq(claudeEdit('FND-001', 'status: draft', 'status: final'), 'deny');
  eq(claudeEdit('FND-001', 'signed_by:', 'signed_by: Claude'), 'deny');
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru sign FND-001 --name X --role "research owner"' } })), 'deny');
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'sed -i s/draft/final/ koru/cards/FND-001.md' } })), 'deny');
  const sh = (command) => decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command } }));
  eq(sh('echo "status: final" >> koru/cards/FND-001.md'), 'deny');
  eq(sh('find koru -type f | head; cat koru/engagement.md 2>&1; koru list >/dev/null'), 'allow');
  eq(sh('grep -l final koru/cards/*.md > /tmp/out.txt'), 'allow');
});
t('signing needs the right role and final sources', () => {
  has(koru(['sign', 'FND-001', '--name', 'Rae', '--role', 'designer'], true), 'signed by the research owner');
  has(koru(['sign', 'FND-001', '--name', 'Rae', '--role', 'research owner'], true), 'DAT-001, which is draft');
  koru(['sign', 'DAT-001', '--name', 'Rae', '--role', 'research owner']);
  has(koru(['sign', 'FND-001', '--name', 'Rae', '--role', 'research owner']), 'Final at version 1');
  has(read('FND-001'), 'supports DAT-001@1');
});
t('a signed card cannot be edited by Claude, only revised', () => {
  eq(claudeEdit('FND-001', 'count: 2 of 9', 'count: 3 of 9'), 'deny');
});
t('people write Insights; the gate needs every Insight final', () => {
  koru(['new', 'INS', 'Adjusters do not trust automatic assignment', '--link', 'supports FND-001: re-checking by hand', '--field', 'author=Rae']);
  fill('INS-001', { What: 'Adjusters treat auto-assignment as a suggestion to verify.', Why: 'Because one bad assignment costs them a day of rework.', 'So what': 'Assignment must show its reasons and be easy to correct.' }, { confidence: 'medium', last_validated: '2026-11-25', review_by: '2027-05-25' });
  has(koru(['check', 'INS-001']), 'No contradicting evidence');
  has(koru(['check', 'INS-001']), 'Signals: 1 participant(s)');
  koru(['sign', 'INS-001', '--name', 'Sam', '--role', 'research owner']);
});
t('solo mode: nobody signs their own high-confidence Insight', () => {
  koru(['new', 'INS', 'Team leads rebalance queues daily', '--link', 'supports FND-001: same sessions', '--field', 'author=Rae']);
  fill('INS-002', { What: 'x', Why: 'Because y.', 'So what': 'z' }, { confidence: 'high', last_validated: '2026-11-25', review_by: '2027-05-25' });
  has(koru(['sign', 'INS-002', '--name', 'Rae', '--role', 'research owner'], true), 'second person');
  koru(['sign', 'INS-002', '--name', 'Sam', '--role', 'research owner']);
});
t('a Hypothesis cannot support anything (hook)', () => {
  koru(['new', 'HYP', 'Synthetic users want auto-routing', '--field', 'generated_by=synthetic panel']);
  koru(['new', 'JOB', 'Get each claim to the right adjuster', '--link', 'supports INS-001: trust']);
  eq(claudeEdit('JOB-001', 'supports INS-001: trust', 'supports HYP-001: synthetic'), 'deny');
  fill('JOB-001', { Job: 'When a claim lands, I want it with the right adjuster, so I can start work the same day.', Forces: 'Push: rework. Pull: same-day start. Habit: manual checks. Anxiety: losing claims.' });
});
t('Problem, HMW and Brief chain', () => {
  koru(['new', 'PRB', 'Adjusters lose a day to misassigned claims', '--link', 'supports INS-001: trust', '--link', 'supports JOB-001: job']);
  fill('PRB-001', { Who: 'Claims adjusters', What: 'Reassign misrouted claims by hand', Wow: 'Cut misassignment rework from 1 day to 1 hour, measured by reassignment logs.' });
  koru(['new', 'HMW', 'How might we let adjusters trust and correct assignment in one step', '--link', 'reframes PRB-001: trust gap']);
  koru(['new', 'BRF', 'Trusted claim assignment']);
  fill('BRF-001', { Problem: 'PRB-001', Outcome: 'Right first time assignment', Scope: 'Assignment review flow' });
  has(koru(['sign', 'PRB-001', '--name', 'Avery', '--role', 'engagement lead'], true), 'Sign these first, in this order');
  koru(['sign', 'JOB-001', '--name', 'Sam', '--role', 'research owner']);
  koru(['sign', 'PRB-001', '--name', 'Avery', '--role', 'engagement lead']);
  koru(['sign', 'HMW-001', '--name', 'Lee', '--role', 'design lead']);
  has(koru(['sign', 'BRF-001', '--cosign', '--name', 'Pat'], true), 'not final yet');
  koru(['sign', 'BRF-001', '--name', 'Avery', '--role', 'engagement lead']);
  koru(['sign', 'BRF-001', '--cosign', '--name', 'Pat']);
});
t('the Frame gate asks for a Study, Segments and the enterprise structure', () => {
  const out = koru(['gate', 'frame'], true);
  has(out, '✗ Study plan written'); has(out, '✗ Segments are cards'); has(out, '✗ Structure: current flow'); has(out, '✗ Structure: permissions by role');
  koru(['new', 'STU', 'Adjuster interviews', '--field', 'method=semi-structured interviews, 9 sessions']);
  fill('STU-001', { 'Research questions': 'How do adjusters decide whether to trust an assignment?', Method: 'Interviews, because trust is a story question.', Participants: 'Adjusters with 1+ years, 3 per region.', Guide: 'Warm-up, last claim story, probes on re-checking.', Consent: 'Recorded consent naming Anthropic as AI processor.' });
  koru(['new', 'SEG', 'Adjuster', '--field', 'kind=role', '--link', 'supports FND-001: re-checks by hand']);
  fill('SEG-001', { Who: 'Claims adjusters handling 20 to 40 claims a day.', Evidence: 'FND-001 (2 of 9 re-check by hand).' });
  fill('FND-001', {}, {});
  koru(['new', 'FLW', 'Claim intake today', '--field', 'kind=current', '--link', 'supports FND-001: observed re-checking']);
  fill('FLW-001', { Steps: '| # | Step | Actor | Workaround or pain | Handoff |\n| --- | --- | --- | --- | --- |\n| 1 | Claim arrives | system | | to adjuster |\n| 2 | Re-check owner | adjuster | exports to a spreadsheet | to lead |' });
  koru(['new', 'OBJ', 'Claims object model']);
  fill('OBJ-001', { Objects: '| Object | Key attributes | Relationships | Actions |\n| --- | --- | --- | --- |\n| Claim | id, value, region | has one owner | assign, reassign |\n| Adjuster | region, load | owns claims | accept, decline |' });
  koru(['new', 'PRM', 'Who may assign']);
  fill('PRM-001', { Matrix: '| Action | adjuster | lead |\n| --- | --- | --- |\n| Accept assignment | own | yes |\n| Reassign | request | yes |' });
  has(koru(['check', 'PRM-001']), 'No blocking problems');
});
t('in a Koru project, method skills write cards, never ux/ files (hook)', () => {
  const w = (f) => guard('PreToolUse', { tool_name: 'Write', tool_input: { file_path: path.join(dir, f), content: 'x' } });
  const d = w('ux/personas/adjuster.md');
  eq(decision(d), 'deny'); has(d.hookSpecificOutput.permissionDecisionReason, 'SEG');
  eq(decision(w('ux/project-context.md')), 'deny');
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'echo x > ux/synthesis/affinity-map.md' } })), 'deny');
  has(koru(['context']), 'ux/project-context.md');
  has(fs.readFileSync(path.join(dir, 'ux/project-context.md'), 'utf8'), 'generated from koru/engagement.md');
});
t('each agent writes only its own card types; checkers write nothing (hook)', () => {
  const as = (agent, command) => decision(guard('PreToolUse', { tool_name: 'Bash', agent_type: agent, tool_input: { command } }));
  eq(as('koru:researcher', 'koru new FND "x" --link "supports DAT-001: y"'), 'allow');
  eq(as('koru:researcher', 'koru new PRB "x"'), 'deny');
  eq(as('koru:architect', 'koru new FLW "x"'), 'allow');
  eq(as('koru:research-checker', 'koru pack frame'), 'allow');
  eq(as('koru:research-checker', 'koru new FND "x"'), 'deny');
  eq(decision(guard('PreToolUse', { tool_name: 'Edit', agent_type: 'koru:research-checker', tool_input: { file_path: card('FND-001'), old_string: 'count: 2 of 9', new_string: 'count: 2 of 9' } })), 'deny');
  eq(decision(guard('PreToolUse', { tool_name: 'Edit', agent_type: 'koru:designer', tool_input: { file_path: card('PRM-001'), old_string: 'Who may assign', new_string: 'Who may assign claims' } })), 'deny');
});
t('the planner computes the next steps and writes work orders', () => {
  const out = koru(['next', '--stage', 'frame']);
  has(out, 'F14'); has(out, 'research-checker');
  const j = JSON.parse(koru(['next', '--json', '--stage', 'frame']));
  if (!j.steps.find((x) => x.id === 'F10').done) throw new Error('F10 should be done: ' + JSON.stringify(j.steps.find((x) => x.id === 'F10')));
  const order = koru(['next', '--order', 'F14']);
  has(order, 'WORK ORDER F14'); has(order, '[BLOCKER|MAJOR|MINOR|NOTE][RULE-ID][CARD-ID]');
});
t('an open Conflict blocks the Frame gate', () => {
  koru(['new', 'CON', 'PRD says leads assign; interviews say adjusters self-assign']);
  fill('CON-001', { Positions: '- PRD: leads assign (document)\n- Interviews: adjusters self-assign (observed)' }, { resolution: 'open' });
  has(koru(['gate', 'frame'], true), '✗ No open Conflicts');
  fill('CON-001', {}, { resolution: 'resolved' });
});
t('the gate needs a checker review newer than the last change', () => {
  has(koru(['gate', 'frame'], true), '✗ Checker review record for frame');
  fs.writeFileSync(path.join(dir, 'findings.md'), '1. [INS-001] No contradicting evidence searched — open\n2. [FND-001] Count is 2 of 9; insight reads as general — open\n');
  koru(['review', 'frame', '--checker', 'research-checker', '--file', 'findings.md']);
  has(koru(['gate', 'frame'], true), 'has a disposition');
  let s = read('REV-001').replace('searched — open', 'searched — fixed').replace('general — open', 'general — accepted risk');
  put('REV-001', s);
  // An edit after the review, by anyone, needs a new review unless a "fixed" finding names the card.
  const ctxFile = path.join(dir, 'koru/cards', fs.readdirSync(path.join(dir, 'koru/cards')).find((f) => f.startsWith('CTX-001')));
  const ctxText = fs.readFileSync(ctxFile, 'utf8');
  fs.writeFileSync(ctxFile, ctxText + '\nA late note.\n');
  has(koru(['gate', 'frame'], true), 'changed: CTX-001');
  fs.writeFileSync(ctxFile, ctxText);
});
t('Claude cannot pass a gate; a signer can', () => {
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru gate frame --pass --name Avery --role "engagement lead"' } })), 'deny');
  has(koru(['gate', 'frame'], true), '✗ Review signed by engagement lead, research owner');
  koru(['sign', 'REV-001', '--name', 'Avery', '--role', 'engagement lead']);
  koru(['sign', 'REV-001', '--name', 'Sam', '--role', 'research owner']);
  has(koru(['gate', 'frame']), 'Ready to pass');
  has(koru(['gate', 'frame', '--pass', '--name', 'Avery', '--role', 'engagement lead']), 'Frame gate passed');
});

console.log('\nDesign system');
const DS = require(path.join(REPO, 'lib', 'ds.js'));
const write = (rel, content) => decision(guard('PreToolUse', { tool_name: 'Write', tool_input: { file_path: path.join(dir, rel), content } }));
const CLEAN = (body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Queue</title></head><body class="k-root"><main style="padding: var(--space-6)">${body}</main></body></html>`;
t('a deliverable is refused until a design system exists (hook)', () => eq(write('koru/deliverables/q/index.html', CLEAN('<h1>Queue</h1>')), 'deny'));
t('the catalogue lists the seed and ten open-source systems', () => { const out = koru(['ds', 'catalog']); for (const id of ['koru-neutral', 'shadcn', 'material', 'carbon', 'fluent', 'primer', 'antd', 'spectrum', 'govuk', 'uswds', 'nhsuk']) has(out, id); });
t('adopting koru-neutral gives AA-checked tokens and a component manifest', () => {
  koru(['ds', 'adopt', 'koru-neutral']);
  const out = koru(['ds', 'check']);
  has(out, 'body text'); has(out, 'Not approved yet');
  if (/✗\s+\d/.test(out)) throw new Error(`a seed contrast pair fails:\n${out}`);
});
t('Claude cannot approve the design system; a person can', () => {
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru ds approve --name Lee' } })), 'deny');
  has(koru(['ds', 'approve', '--name', 'Lee', '--role', 'design lead']), 'Approved');
});
t('the hook refuses raw colours, off-scale sizes, bare controls and unknown components', () => {
  const bad = CLEAN('<div style="color:#333;padding:13px"><button>Go</button><div data-ds="Carousel"></div></div>');
  const r = guard('PreToolUse', { tool_name: 'Write', tool_input: { file_path: path.join(dir, 'koru/deliverables/q/index.html'), content: DS.inlineInto(dir, bad) } });
  const why = r.hookSpecificOutput.permissionDecisionReason;
  has(why, 'raw-colour'); has(why, 'off-scale'); has(why, 'bare-control'); has(why, 'unknown-component');
});
t('a prototype built from tokens and system components is allowed', () => {
  const good = DS.inlineInto(dir, CLEAN('<h1>Queue</h1><div data-ds="Card" class="k-card"><button data-ds="Button" class="k-btn k-btn--primary">Pick next claim</button></div>'));
  eq(write('koru/deliverables/q/index.html', good), 'allow');
  fs.mkdirSync(path.join(dir, 'koru/deliverables/q'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'koru/deliverables/q/index.html'), good);
  has(koru(['ds', 'lint']), '0 blocking');
});
t('old problems do not block a fix, new ones do', () => {
  const f = path.join(dir, 'koru/deliverables/q/index.html');
  const withOld = fs.readFileSync(f, 'utf8').replace('<h1>Queue</h1>', '<h1 style="color:#222">Queue</h1>');
  fs.writeFileSync(f, withOld);
  eq(decision(guard('PreToolUse', { tool_name: 'Edit', tool_input: { file_path: f, old_string: 'Pick next claim', new_string: 'Pick the next claim' } })), 'allow');
  eq(decision(guard('PreToolUse', { tool_name: 'Edit', tool_input: { file_path: f, old_string: 'Pick next claim', new_string: 'Pick <span style="color:#f00">next</span> claim' } })), 'deny');
  fs.writeFileSync(f, withOld.replace('<h1 style="color:#222">Queue</h1>', '<h1>Queue</h1>'));
});
t('a missing component needs the card that asks for it; a snowflake needs a Decision', () => {
  has(koru(['ds', 'component', 'add', 'ReasonChip'], true), 'needs the card');
  has(koru(['ds', 'component', 'add', 'ReasonChip', '--status', 'snowflake', '--spec', 'SCR-001'], true), 'needs the Decision');
});
t("extending a client system catches its own contrast failures and fills gaps as additions", () => {
  const c = fs.mkdtempSync(path.join(os.tmpdir(), 'koru-ds-'));
  spawnSync('node', [KORU, 'init', '--client', 'Client'], { cwd: c });
  fs.writeFileSync(path.join(c, 'tokens.css'), ':root{--brand-500:#2F80ED;--brand-600:#1F6FD9;--brand-700:#1858AD;--brand-50:#EEF5FE;--ink-900:#1A2433;--ink-700:#3D4A5C;--ink-500:#6B7789;--ink-300:#B6BFCC;--ink-100:#EEF1F5;--danger-500:#D64545;--danger-50:#FDEDED;}');
  fs.writeFileSync(path.join(c, 'components.md'), '<button class="bg-brand-500 text-white px-4 py-2">Submit</button>');
  const out = spawnSync('node', [KORU, 'ds', 'extend', '--css', 'tokens.css', '--components-doc', 'components.md', '--name', 'Client UI', '--version', '1.0.0', '--components', 'Button,Card', '--tailwind'], { cwd: c, encoding: 'utf8' }).stdout;
  has(out, 'text-white on bg-brand-500 is 3.87:1'); has(out, 'color.brand.600 passes'); has(out, 'danger.700 added'); has(out, 'success.700 added');
  const lint = DS.lintText(c, path.join(c, 'koru/deliverables/x.html'), '<button data-ds="Button" class="bg-brand-500 text-white">Go</button>');
  if (!lint.some((x) => x.rule === 'contrast')) throw new Error('the lint did not refuse white on brand-500');
});

t('a draft made by mistake can be discarded once, and its id is never reused', () => {
  koru(['new', 'ASM', 'Stray card']);
  const id = fs.readdirSync(path.join(dir, 'koru/cards')).filter((f) => f.startsWith('ASM-')).sort().pop().slice(0, 7);
  has(koru(['discard', id, '--reason', 'made by mistake']), 'discarded');
  has(koru(['new', 'ASM', 'Next card']), String(Number(id.slice(4)) + 1).padStart(3, '0'));
});

console.log('\nExplore');
t('thresholds must be saved before results', () => {
  koru(['new', 'DIR', 'Explainable queue', '--link', 'serves HMW-001: trust', '--field', 'seed_author=Lee']);
  fill('DIR-001', { 'Core idea': 'Each assignment shows why.', Hypothesis: 'We believe adjusters will accept more assignments if they see the reason.', 'Biggest risk': 'Reasons are noise.', 'Test question': 'Do adjusters accept without re-checking?' }, { threshold: '7 of 10 accept without re-checking' });
  has(koru(['result', 'DIR-001', '8 of 10'], true), 'no saved threshold');
  eq(claudeEdit('DIR-001', 'threshold_saved_at:', 'threshold_saved_at: 2026-01-01T00:00:00Z'), 'deny');
  koru(['threshold', 'DIR-001']);
  eq(claudeEdit('DIR-001', 'threshold: 7 of 10 accept without re-checking', 'threshold: 5 of 10 accept'), 'deny');
  koru(['result', 'DIR-001', '8 of 10 accepted without re-checking']);
  fill('DIR-001', {}, { chosen: 'yes' });
  koru(['sign', 'DIR-001', '--name', 'Lee', '--role', 'design lead']);
});
t('a Decision has one Approver and factors before options', () => {
  koru(['decide', 'new', 'Which direction goes forward', '--link', 'cites DIR-001: chosen']);
  fill('DEC-001', { Question: 'Which direction?', Factors: 'Trust, effort, fit', Options: '| A | high | |', Outcome: 'DIR-001' }, { approver: 'Avery, Lee' });
  has(koru(['check', 'DEC-001'], true), 'exactly one Approver');
  fill('DEC-001', {}, { approver: 'Avery', outcome: 'Go with the explainable queue', client_commitment: 'Pat committed at Playback Zero 2026-11-26' });
  has(koru(['sign', 'DEC-001', '--name', 'Lee', '--role', 'design lead'], true), 'Only the Approver');
  koru(['sign', 'DEC-001', '--name', 'Avery']);
  has(koru(['gate', 'explore'], true), '✗ Every Direction has a Test card');
  koru(['new', 'TST', 'Accept a routed claim without re-checking', '--link', 'tests DIR-001: core claim', '--field', 'task=Accept the next claim', '--field', 'hard_case=wrong owner suggested', '--field', 'segment=SEG-001', '--field', 'threshold=nice if most do']);
  has(koru(['threshold', 'TST-001', '--set', 'most adjusters'], true), 'is a number');
  koru(['threshold', 'TST-001', '--set', '7 of 10 accept unaided']);
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru result TST-001 --passed 8 --of 10' } })), 'deny');
  has(koru(['result', 'TST-001', '--passed', '6', '--of', '10']), 'not met');
  has(read('DEC-002'), 'missed its threshold');
  koru(['sign', 'TST-001', '--name', 'Sam', '--role', 'research owner']);
  fill('DEC-002', { Question: 'Iterate or accept?', Factors: 'Evidence, time', Options: '| accept | | |' }, { approver: 'Lee', outcome: 'Accept: the misses were the wrong-owner case we fix in Harden' });
  koru(['sign', 'DEC-002', '--name', 'Lee']);
  koru(['new', 'FLW', 'Claim intake with reasons', '--field', 'kind=future', '--link', 'serves DIR-001: future flow', '--link', 'cites FLW-001: replaces']);
  fill('FLW-002', { Steps: '| # | Step | Actor | Workaround or pain | Handoff |\n| --- | --- | --- | --- | --- |\n| 1 | Claim arrives with a reason | system | | to adjuster |\n| 2 | Accept or correct | adjuster | | |' });
  fs.writeFileSync(path.join(dir, 'f2.md'), '1. [MAJOR][DC-06][DIR-001] Prototype lacks the wrong-suggestion case · evidence: no ?state for it · confidence: high — fixed\n2. [MINOR][DC-09][DIR-001] Dense table header · evidence: 11px labels · confidence: low — rejected: labels are 12px tokens\n');
  koru(['review', 'explore', '--checker', 'direction-checker', '--file', 'f2.md']);
  koru(['sign', 'REV-002', '--name', 'Lee', '--role', 'design lead']);
  has(koru(['gate', 'explore']), 'Ready to pass');
  koru(['gate', 'explore', '--pass', '--name', 'Lee', '--role', 'design lead']);
});
t('an accepted Decision cannot be edited (hook)', () => eq(claudeEdit('DEC-001', 'Trust, effort, fit', 'Cost'), 'deny'));

console.log('\nHarden');
t('unclassified elements and blank state cells block the gate', () => {
  koru(['new', 'SCR', 'Assignment review', '--link', 'implements DIR-001: chosen', '--field', 'flow_step=1', '--field', 'ds_version=1.0.0']);
  fill('SCR-001', { Elements: '| Element | Class | Note |\n| --- | --- | --- |\n| Queue table | use | |\n| Reason chip | |  |' });
  koru(['new', 'STA', 'Assignment review · adjuster · empty', '--field', 'screen=SCR-001', '--field', 'role=adjuster', '--field', 'state=first-use empty']);
  koru(['new', 'STA', 'Assignment review · adjuster · error', '--field', 'screen=SCR-001', '--field', 'role=adjuster', '--field', 'state=page error', '--field', 'resolution=n/a']);
  const out = koru(['gate', 'harden'], true);
  has(out, '✗ No blank state cells'); has(out, '✗ Every element classified');
  fill('SCR-001', { Elements: '| Element | Class | Note |\n| --- | --- | --- |\n| Queue table | use | |\n| Reason chip | new | needs DS owner |' });
  fill('STA-001', {}, { resolution: 'designed' });
  fill('STA-002', {}, { resolution: 'n/a: the review page has no page-level load' });
  koru(['new', 'MET', 'Reassignment rate', '--field', 'level=core', '--field', 'threshold=under 5% of claims reassigned']);
  fill('MET-001', { 'Feedback loop': 'Weekly reassignment log review.' });
  has(koru(['check', 'MET-001'], true), 'Baseline');
  fill('MET-001', {}, { baseline: '18% reassigned (Q3 log)', source: 'assignment log', events: 'claim_assigned, claim_reassigned', metric_owner: 'Head of claims ops', guardrail: 'time to first touch does not rise' });
  has(koru(['gate', 'harden'], true), '✗ Permissions matrix (PRM) signed');
  koru(['sign', 'PRM-001', '--name', 'Avery', '--role', 'engagement lead']);
  koru(['sign', 'MET-001', '--name', 'Avery', '--role', 'engagement lead']);
  koru(['sign', 'SCR-001', 'STA-001', 'STA-002', '--name', 'Lee', '--role', 'design lead']);
  fs.writeFileSync(path.join(dir, 'f3.md'), '1. [STA-002] n/a reason is thin — accepted risk\n');
  koru(['review', 'harden', '--checker', 'harden-checker', '--file', 'f3.md']);
  has(koru(['gate', 'harden'], true), '✗ Review signed by engineer, rulebook owner, design lead');
});
t('the Harden review needs all three signers', () => {
  has(koru(['sign', 'REV-003', '--name', 'Eng', '--role', 'engineer']), 'Still needed');
  koru(['sign', 'REV-003', '--name', 'Rob', '--role', 'rulebook owner']);
  has(koru(['sign', 'REV-003', '--name', 'Lee', '--role', 'design lead']), 'Final');
  const tools = fs.existsSync(path.join(REPO, 'tools', 'node_modules', 'axe-core'));
  if (tools) has(koru(['audit', '--quick']), '0 blocking');
  else {
    // Without a browser installed, record the audit the way koru audit would (the gate still checks the file hash).
    const html = fs.readFileSync(path.join(dir, 'koru/deliverables/q/index.html'), 'utf8');
    fs.appendFileSync(path.join(dir, 'koru/state/audits.jsonl'), JSON.stringify({ file: 'koru/deliverables/q/index.html', at: new Date().toISOString(), hash: require('crypto').createHash('sha256').update(html).digest('hex').slice(0, 16), blocks: 0, warns: 0, states: 1 }) + '\n');
    console.log('      (browser tools not installed: audit recorded without running; npm --prefix tools install)');
  }
  koru(['gate', 'harden', '--pass', '--name', 'Lee', '--role', 'design lead']);
});

console.log('\nShip');
t('Definition of Ready catches vague, untraced tickets', () => {
  koru(['new', 'TKT', 'Assignment reasons', '--link', 'implements SCR-001: screen']);
  fill('TKT-001', { 'User story': 'As an adjuster, I want to see why a claim was assigned to me, so that I can accept it without checking.', 'Acceptance criteria': '- STA-001: Given no claims, when I open the queue, then I see the next action quickly.' });
  const out = koru(['dor', 'TKT-001'], true);
  has(out, 'Title must start with a verb'); has(out, 'links to no JTBD'); has(out, '"quickly" has no measure');
});
t('Jira creation is refused for a ticket that is not ready (hook)', () => {
  eq(decision(guard('PreToolUse', { tool_name: 'mcp__atlassian__createJiraIssue', tool_input: { summary: 'TKT-001 Assignment reasons' } })), 'deny');
});
t('a ready ticket passes and Jira asks a person', () => {
  let s = read('TKT-001').replace('title: Assignment reasons', 'title: Show assignment reasons').replace('quickly.', 'the "Pick next claim" button within 1 second.');
  s = s.replace('links:\n', 'links:\n  - serves JOB-001: job\n  - measures MET-001: metric\n');
  put('TKT-001', s);
  has(koru(['dor', 'TKT-001']), 'ready');
  koru(['sign', 'TKT-001', '--name', 'Eng', '--role', 'engineer']);
  eq(decision(guard('PreToolUse', { tool_name: 'mcp__atlassian__createJiraIssue', tool_input: { summary: 'TKT-001 Show assignment reasons' } })), 'ask');
});
t('the Ship gate needs a handoff with rabbit holes and no-gos', () => {
  koru(['new', 'HND', 'Handoff']);
  fs.writeFileSync(path.join(dir, 'f4.md'), '1. [TKT-001] Token for reason chip not named — fixed\n');
  koru(['review', 'ship', '--checker', 'spec-checker', '--file', 'f4.md']);
  has(koru(['gate', 'ship'], true), '✗ Handoff note complete');
  fill('HND-001', { In: 'Assignment review', 'Not in': 'Bulk reassignment', Decisions: 'DEC-001', 'Who to ask': 'Lee', 'Rabbit holes': 'Reason text length', 'No-gos': 'No auto-accept' });
  has(koru(['gate', 'ship'], true), '✗ Every Screen has a data contract');
  koru(['new', 'API', 'Assignment review contract', '--field', 'screen=SCR-001']);
  fill('API-001', { Fields: '| Field | Type | Required | Source | Validation |\n| --- | --- | --- | --- | --- |\n| claimId | string | yes | claims API | uuid |', Errors: '| Code | When | Message the user sees | State |\n| --- | --- | --- | --- |\n| 409 | claim already reassigned | This claim was just reassigned to someone else. | STA-002 |' });
  koru(['review', 'ship', '--checker', 'spec-checker', '--file', 'f4.md']);
  koru(['sign', 'REV-005', '--name', 'Eng', '--role', 'engineer']);
  has(koru(['gate', 'ship']), 'Ready to pass');
});

console.log('\nChange travels both ways');
t('a build decision supersedes nothing silently and flags what it touches', () => {
  koru(['decide', 'new', 'API cannot sort by owner', '--affects', 'SCR-001', '--why', 'sorting removed']);
  fill('DEC-003', { Question: 'Drop owner sort?', Factors: 'Feasibility', Options: '| drop | | |' }, { approver: 'Eng', outcome: 'Drop owner sort' });
  has(koru(['decide', 'impact', 'DEC-003']), 'TKT-001');
  has(koru(['sign', 'DEC-003', '--name', 'Eng']), 'Flagged for writeback: SCR-001');
  has(koru(['where']), 'writeback');
});
t('revising the flagged Screen makes its Ticket stale once re-signed', () => {
  koru(['revise', 'SCR-001', '--reason', 'remove owner sort']);
  koru(['sign', 'SCR-001', '--name', 'Lee', '--role', 'design lead']);
  has(koru(['check', 'TKT-001'], true), 'Stale');
});

t('a design-system version bump flags pinned Screens', () => {
  fs.writeFileSync(path.join(dir, 'koru/design-system.md'), '---\nversion: 1.1.0\n---\n# DS\n');
  has(koru(['check', 'SCR-001'], true), 'now 1.1.0');
  fs.writeFileSync(path.join(dir, 'koru/design-system.md'), '---\nversion: 1.0.0\n---\n# DS\n');
});

console.log('\nBoard, sharing and provenance');
t('Claude writes are stamped and versioned', () => {
  const r = guard('PostToolUse', { tool_name: 'Edit', session_id: 's1', tool_input: { file_path: card('HYP-001') } });
  const prov = fs.readFileSync(path.join(dir, 'koru/state/provenance.jsonl'), 'utf8');
  has(prov, 'HYP-001');
  if (!fs.readdirSync(path.join(dir, 'koru/history/HYP-001')).length) throw new Error('no history');
  void r;
});
t('index builds the board, decision log, trace, client page and finals-only knowledge', () => {
  koru(['index']);
  for (const f of ['board.html', 'decisions.md', 'trace.md', 'client/index.html', 'knowledge/README.md']) if (!fs.existsSync(path.join(dir, 'koru/generated', f))) throw new Error(`missing ${f}`);
  if (fs.readdirSync(path.join(dir, 'koru/generated/knowledge')).some((f) => f.startsWith('HYP-'))) throw new Error('draft leaked into knowledge');
  eq(decision(guard('PreToolUse', { tool_name: 'Write', tool_input: { file_path: path.join(dir, 'koru/generated/board.html'), content: 'x' } })), 'deny');
});
t('share makes a password-protected page and records what it shows', () => {
  const out = koru(['share', 'client', '--password', 'amber-river-test-42', '--to', 'Pat']);
  has(out, 'Password: amber-river-test-42');
  const f = fs.readdirSync(path.join(dir, 'koru/generated/share'))[0];
  const html = fs.readFileSync(path.join(dir, 'koru/generated/share', f), 'utf8');
  if (html.includes('Acme Claims</h1>')) throw new Error('plaintext leaked');
  // decrypt the way a browser would
  const payload = JSON.parse(html.match(/const P=(\{.*?\});/)[1]);
  const crypto = require('crypto');
  const key = crypto.pbkdf2Sync('amber-river-test-42', Buffer.from(payload.salt, 'base64'), payload.rounds, 32, 'sha256');
  const buf = Buffer.from(payload.data, 'base64');
  const d = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(payload.iv, 'base64'));
  d.setAuthTag(buf.subarray(buf.length - 16));
  const plain = Buffer.concat([d.update(buf.subarray(0, buf.length - 16)), d.final()]).toString();
  has(plain, 'Acme Claims');
  has(fs.readFileSync(path.join(dir, 'koru/state/shares.jsonl'), 'utf8'), 'BRF-001@1');
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru share client' } })), 'deny');
});
t('Figma writes are blocked when the contract tier forbids them', () => {
  koru(['contract', '--tier', 'internal']);
  eq(decision(guard('PreToolUse', { tool_name: 'mcp__Figma__use_figma', tool_input: {} })), 'deny');
  eq(decision(guard('PreToolUse', { tool_name: 'mcp__Figma__get_screenshot', tool_input: {} })), 'allow');
});
t('health numbers compute', () => { has(koru(['health']), 'trace coverage'); });
t('session start gives the rules and a recap', () => {
  const r = guard('SessionStart', { source: 'startup' });
  has(r.hookSpecificOutput.additionalContext, 'Where this project stands');
});
t('outside a Koru project the hooks stay out of the way', () => {
  const r = spawnSync('node', [GUARD, 'PreToolUse'], { input: JSON.stringify({ cwd: os.tmpdir(), tool_name: 'Bash', tool_input: { command: 'koru sign X' } }), encoding: 'utf8' });
  eq(r.stdout, '');
});


console.log('\nTeam, rigour and the loops back in');
const koruAs = (email, args, expectFail) => {
  const r = spawnSync('node', [KORU, ...args], { cwd: dir, encoding: 'utf8', env: { ...process.env, KORU_ROOT: '', KORU_SIGNER_EMAIL: email } });
  const out = (r.stdout || '') + (r.stderr || '');
  if (!expectFail && r.status !== 0) throw new Error(`koru ${args.join(' ')} failed:\n${out}`);
  if (expectFail && r.status === 0) throw new Error(`koru ${args.join(' ')} should have failed:\n${out}`);
  return out;
};
const engFile = path.join(dir, 'koru/engagement.md');
const engBefore = fs.readFileSync(engFile, 'utf8');
t('signatures are checked against the people list and the git identity', () => {
  fs.writeFileSync(engFile, engBefore.replace(/^people: \[\].*$/m, 'people:\n  - Sam Rivera <sam@example.com>: research owner\n  - Lee Park <lee@example.com>: design lead, designer'));
  koru(['new', 'SEG', 'Team lead', '--field', 'kind=role', '--link', 'supports FND-001: leads rebalance']);
  fill('SEG-002', { Who: 'Team leads who rebalance queues.', Evidence: 'FND-001.' });
  has(koruAs('lee@example.com', ['sign', 'SEG-002', '--name', 'Sam Rivera', '--role', 'research owner'], true), 'you cannot sign as Sam Rivera');
  has(koruAs('lee@example.com', ['sign', 'SEG-002', '--name', 'Lee Park', '--role', 'research owner'], true), 'not research owner');
  has(koruAs('nobody@example.com', ['sign', 'SEG-002', '--name', 'Sam Rivera', '--role', 'research owner'], true), 'not on the engagement');
  koruAs('sam@example.com', ['sign', 'SEG-002', '--name', 'Sam Rivera', '--role', 'research owner']);
  has(read('SEG-002'), 'signature:'); has(read('SEG-002'), 'signed_email: sam@example.com');
});
t('a signed card edited outside Koru is caught by koru verify and the gate', () => {
  const before = read('SEG-002');
  put('SEG-002', before.replace('Team leads who rebalance queues.', 'Team leads who own every queue.'));
  has(koru(['verify'], true), 'changed after it was signed');
  has(koru(['gate', 'frame'], true), 'changed outside Koru: SEG-002');
  put('SEG-002', before);
  koru(['verify']);
  fs.writeFileSync(engFile, engBefore);
});
t('two people minting the same id is caught and fixed', () => {
  const src = card('SEG-002');
  const clash = src.replace('team-lead', 'team-lead-copy');
  fs.writeFileSync(clash, fs.readFileSync(src, 'utf8').replace('title: Team lead', 'title: Regional manager').replace(/^created: .*$/m, 'created: 2099-01-01T00:00:00Z').replace(/^status: final$/m, 'status: draft'));
  has(koru(['ids'], true), 'SEG-002 is used twice');
  has(koru(['ids', '--fix']), 'SEG-002 → SEG-003');
  has(read('SEG-003'), 'Regional manager');
  koru(['ids']);
});
t('the AI draft is compared with what a person signs (human edit ratio)', () => {
  koru(['new', 'SEG', 'Auditor', '--field', 'kind=role']);
  fill('SEG-004', { Who: 'Internal auditors who sample assigned claims.', Evidence: 'CTX-001 users.' });
  guard('PostToolUse', { tool_name: 'Edit', session_id: 's1', agent_type: 'koru:synthesiser', tool_input: { file_path: card('SEG-004') } });
  fill('SEG-004', { Who: 'Internal auditors who sample assigned claims every month and flag reassignments.' });
  has(koru(['sign', 'SEG-004', '--name', 'Sam', '--role', 'research owner']), 'of the AI draft');
  has(read('SEG-004'), 'human_edit:');
  has(koru(['stats']), 'AI drafts signed: 1');
  has(koru(['stats']), 'synthesiser');
});
t('people record AI mistakes they caught; Claude cannot', () => {
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru caught SEG-004 "x"' } })), 'deny');
  koru(['caught', 'SEG-004', 'it invented a monthly cadence', '--name', 'Sam']);
  has(koru(['stats']), 'Mistakes people caught (koru caught): 1');
  has(koru(['stats']), 'rejected (checker was wrong) 1');
});
t('the severity floor follows the rigour profile', () => {
  const K = require(path.join(REPO, 'lib', 'core.js'));
  const rev = K.cardFromText('---\nid: REV-099\ntype: REV\ntitle: x\ngate: frame\nchecker: c\nchecklist_version: v\n---\n## Findings\n\n1. [MINOR][RC-02][FND-001] causal word · evidence: "because" · confidence: low — open\n', 'REV-099.md');
  const blocks = (rigour) => K.checkShape(rev, { engagement: { rigour } }).filter((p) => p.level === 'block').length;
  eq(blocks('standard') > 0, true, 'standard');
  eq(blocks('sprint'), 0, 'sprint');
  const row = K.findingRows(rev.sections.findings)[0];
  eq(row.severity, 'minor'); eq(row.rule, 'RC-02'); eq(row.cards[0], 'FND-001'); eq(row.confidence, 'low');
});
t('client feedback comes back as a Playback card with typed rows', () => {
  fs.writeFileSync(path.join(dir, 'feedback.json'), JSON.stringify({ comments: [{ anchor: 'SCR-001', state: 'STA-001', text: 'Leads need to see who reassigned it', author: 'Pat', role: 'client sponsor' }, { anchor: 'SCR-001', text: 'Love the colours', author: 'Pat' }] }));
  has(koru(['playback', 'import', 'feedback.json', '--kind', 'zero']), '2 piece(s) of feedback');
  has(koru(['check', 'PLB-001'], true), 'needs a type');
});
t('a shared page carries the feedback layer, and its export imports as Playback', () => {
  const S = require('../../lib/share.js');
  const out = S.withFeedback('<html><body><main data-koru-state="STA-001">x</main></body></html>', 'Acme · Tracker');
  has(out, 'Download feedback'); has(out, 'koru-feedback:'); eq((out.match(/<\/body>/g) || []).length, 1, 'one body close');
  has(S.withFeedback('<p>no body</p>', 'x'), 'id="kfb"');
});
t('compare drafts a fair Decision; matrix drafts state cells from Permissions roles', () => {
  has(koru(['compare', 'DIR-001', 'DIR-001']), 'factors are written before the options');
  const n = koru(['matrix', 'SCR-001']);
  has(n, 'state cell(s) drafted'); has(n, '2 role(s)');
  if (!fs.readdirSync(path.join(dir, 'koru/cards')).some((f) => /^STA-\d+-assignment-review-lead-loading/.test(f))) throw new Error('no lead loading cell');
});
t('a stage pack condenses the stage for the checker', () => {
  has(koru(['pack', 'frame']), 'pack-frame.md');
  has(fs.readFileSync(path.join(dir, 'koru/generated/pack-frame.md'), 'utf8'), '# Stage pack: frame');
});
t('planted-defect evals score a checker', () => {
  fs.writeFileSync(path.join(dir, 'planted.json'), JSON.stringify({ checker: 'research-checker', defects: [{ card: 'INS-001', rule: 'RC-04' }, { card: 'FND-001', rule: 'RC-01' }] }));
  fs.writeFileSync(path.join(dir, 'found.md'), '1. [MAJOR][RC-04][INS-001] no contradicting evidence · evidence: no link · confidence: high — open\n2. [MINOR][RC-02][CTX-001] noise · evidence: x · confidence: low — open\n');
  has(koru(['eval', 'score', '--expected', 'planted.json', '--file', 'found.md']), 'recall 0.5');
});
t('the skills are woven from one map and the doctor proves the hooks fire', () => {
  const w = spawnSync('node', [path.join(REPO, 'tools', 'weave.js'), '--check'], { encoding: 'utf8' });
  eq(w.status, 0, w.stderr);
  has(koru(['doctor']), 'Hooks fire');
  has(koru(['skills', 'persona']), 'writes SEG'.replace('writes SEG', 'Writes:** `SEG`'));
});

console.log(`\n${pass} passed, ${fail} failed.`);
if (!process.env.KORU_KEEP) fs.rmSync(dir, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
