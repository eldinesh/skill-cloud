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
t('Claude cannot set confidence or sign (hook)', () => {
  eq(claudeEdit('FND-001', 'status: draft', 'status: final'), 'deny');
  eq(claudeEdit('FND-001', 'signed_by:', 'signed_by: Claude'), 'deny');
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru sign FND-001 --name X --role "research owner"' } })), 'deny');
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'sed -i s/draft/final/ koru/cards/FND-001.md' } })), 'deny');
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
  for (const id of ['JOB-001', 'PRB-001']) koru(['sign', id, '--name', id === 'JOB-001' ? 'Sam' : 'Dee', '--role', id === 'JOB-001' ? 'research owner' : 'engagement lead']);
  koru(['sign', 'HMW-001', '--name', 'Lee', '--role', 'design lead']);
  koru(['sign', 'BRF-001', '--name', 'Dee', '--role', 'engagement lead']);
  koru(['sign', 'BRF-001', '--cosign', '--name', 'Pat']);
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
  has(koru(['gate', 'frame'], true), '✗ Every checker finding has a disposition');
  let s = read('REV-001').replace('searched — open', 'searched — fixed').replace('general — open', 'general — accepted risk');
  put('REV-001', s);
});
t('Claude cannot pass a gate; a signer can', () => {
  eq(decision(guard('PreToolUse', { tool_name: 'Bash', tool_input: { command: 'koru gate frame --pass --name Dee --role "engagement lead"' } })), 'deny');
  has(koru(['gate', 'frame']), 'Ready to pass');
  has(koru(['gate', 'frame', '--pass', '--name', 'Dee', '--role', 'engagement lead']), 'Frame gate passed');
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
  fill('DEC-001', { Question: 'Which direction?', Factors: 'Trust, effort, fit', Options: '| A | high | |', Outcome: 'DIR-001' }, { approver: 'Dee, Lee' });
  has(koru(['check', 'DEC-001'], true), 'exactly one Approver');
  fill('DEC-001', {}, { approver: 'Dee', outcome: 'Go with the explainable queue', client_commitment: 'Pat committed at Playback Zero 2026-11-26' });
  has(koru(['sign', 'DEC-001', '--name', 'Lee', '--role', 'design lead'], true), 'Only the Approver');
  koru(['sign', 'DEC-001', '--name', 'Dee']);
  fs.writeFileSync(path.join(dir, 'f2.md'), '1. [DIR-001] Prototype lacks the wrong-suggestion case — fixed\n');
  koru(['review', 'explore', '--checker', 'direction-checker', '--file', 'f2.md']);
  has(koru(['gate', 'explore']), 'Ready to pass');
  koru(['gate', 'explore', '--pass', '--name', 'Lee', '--role', 'design lead']);
});
t('an accepted Decision cannot be edited (hook)', () => eq(claudeEdit('DEC-001', 'Trust, effort, fit', 'Cost'), 'deny'));

console.log('\nHarden');
t('unclassified elements and blank state cells block the gate', () => {
  koru(['new', 'SCR', 'Assignment review', '--link', 'implements DIR-001: chosen', '--field', 'flow_step=1', '--field', 'ds_version=acme-ds@4.1']);
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
  koru(['sign', 'MET-001', '--name', 'Dee', '--role', 'engagement lead']);
  koru(['sign', 'SCR-001', '--name', 'Lee', '--role', 'design lead']);
  fs.writeFileSync(path.join(dir, 'f3.md'), '1. [STA-002] n/a reason is thin — accepted risk\n');
  koru(['review', 'harden', '--checker', 'harden-checker', '--file', 'f3.md']);
  has(koru(['gate', 'harden']), 'Ready to pass');
});
t('the Harden review needs all three signers', () => {
  has(koru(['sign', 'REV-003', '--name', 'Eng', '--role', 'engineer']), 'Still needed');
  koru(['sign', 'REV-003', '--name', 'Rob', '--role', 'rulebook owner']);
  has(koru(['sign', 'REV-003', '--name', 'Lee', '--role', 'design lead']), 'Final');
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
  koru(['review', 'ship', '--checker', 'spec-checker', '--file', 'f4.md']);
  let s = read('REV-005').replace('named — fixed', 'named — fixed'); put('REV-005', s);
  has(koru(['gate', 'ship']), 'Ready to pass');
});

console.log('\nChange travels both ways');
t('a build decision supersedes nothing silently and flags what it touches', () => {
  koru(['decide', 'new', 'API cannot sort by owner', '--affects', 'SCR-001', '--why', 'sorting removed']);
  fill('DEC-002', { Question: 'Drop owner sort?', Factors: 'Feasibility', Options: '| drop | | |' }, { approver: 'Eng', outcome: 'Drop owner sort' });
  has(koru(['decide', 'impact', 'DEC-002']), 'TKT-001');
  has(koru(['sign', 'DEC-002', '--name', 'Eng']), 'Flagged for writeback: SCR-001');
  has(koru(['where']), 'writeback');
});
t('revising the flagged Screen makes its Ticket stale once re-signed', () => {
  koru(['revise', 'SCR-001', '--reason', 'remove owner sort']);
  koru(['sign', 'SCR-001', '--name', 'Lee', '--role', 'design lead']);
  has(koru(['check', 'TKT-001'], true), 'Stale');
});

t('a design-system version bump flags pinned Screens', () => {
  fs.writeFileSync(path.join(dir, 'koru/design-system.md'), '---\nversion: acme-ds@4.2\n---\n# DS\n');
  has(koru(['check', 'SCR-001'], true), 'now acme-ds@4.2');
  fs.writeFileSync(path.join(dir, 'koru/design-system.md'), '---\nversion: acme-ds@4.1\n---\n# DS\n');
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

console.log(`\n${pass} passed, ${fail} failed.`);
if (!process.env.KORU_KEEP) fs.rmSync(dir, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
