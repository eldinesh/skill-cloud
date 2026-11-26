#!/usr/bin/env node
'use strict';
// Koru hooks: the Tier 1 rules that must never break. Deterministic; no model opinion involved.
// Called by hooks/hooks.json as:  node lib/guard.js <SessionStart|PreToolUse|PostToolUse>
// Reads the hook payload on stdin. Outside a Koru project it allows everything.

const fs = require('fs');
const path = require('path');
const os = require('os');
const K = require('./core');
const M = require('./methods');

const PLUGIN_ROOT = path.resolve(__dirname, '..');
const CONTRACT_FIELDS = ['ai_tier', 'data_class', 'ai_processor', 'disclosure'];
const SIGN_FIELDS = ['signed_by', 'signed_at', 'cosigned_by', 'reviewers', 'signature', 'signed_email', 'signed_commit', 'human_edit'];
const HUMAN_CMD = /\bkoru(?:\.js)?\s+(sign|contract|share|pseudonymi[sz]e|clear-flag|ds\s+approve|caught|result)\b/;
const GATE_PASS = /\bkoru(?:\.js)?\s+gate\b[^\n;&|]*--pass\b/;

function readStdin() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; }
}

function respond(obj) { process.stdout.write(JSON.stringify(obj)); process.exit(0); }

function deny(reason) {
  respond({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: `Koru rule: ${reason}` } });
}
function ask(reason) {
  respond({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'ask', permissionDecisionReason: `Koru: ${reason}` } });
}
function allow() { process.exit(0); }

function relKoru(root, file) {
  const rel = path.relative(K.paths(root).koru, path.resolve(file));
  return rel.startsWith('..') || path.isAbsolute(rel) ? null : rel.split(path.sep).join('/');
}

function aiMayReadResearch(eng) {
  return (eng.ai_tier === 'full' || eng.ai_tier === 'internal') && K.filled(eng.ai_processor);
}

// The file as it would be after this Write / Edit / MultiEdit.
function proposed(tool, input, oldText) {
  if (tool === 'Write') return input.content || '';
  let text = oldText || '';
  const edits = tool === 'MultiEdit' ? input.edits || [] : [input];
  for (const e of edits) {
    if (e.old_string === undefined) continue;
    if (e.old_string === '' && !text) { text = e.new_string || ''; continue; }
    if (!text.includes(e.old_string)) return null;
    text = e.replace_all ? text.split(e.old_string).join(e.new_string) : text.replace(e.old_string, () => e.new_string);
  }
  return text;
}

const normal = (v) => (v === undefined || v === null || (Array.isArray(v) && !v.length) ? '' : v);
const same = (a, b) => JSON.stringify(normal(a)) === JSON.stringify(normal(b));

// ---------------------------------------------------------------- agents

// Each Koru agent writes only the card types the method map gives it; checkers write nothing.
function agentRefuses(agentType, type) {
  const a = M.agentOf(agentType);
  if (!a || !type) return null;
  if (a.checker) return `The ${a.label} is an independent checker: it lists findings and never changes cards. The orchestrator records its findings with koru review.`;
  if (!a.writes.includes(type)) {
    const owners = M.ownerOf(type);
    return `The ${a.label} agent writes ${a.writes.join(', ')} cards. ${type} cards belong to ${owners.length ? owners.join(' or ') : 'people'}: report it back to the orchestrator so it routes the work there.`;
  }
  return null;
}

// In a Koru project the method skills write cards. A file under ux/ would be a second source of
// truth that skips quote checks, provenance and sign-off, so it is refused with the card to use.
function uxRefuses(root, file) {
  const rel = path.relative(root, path.resolve(file)).split(path.sep).join('/');
  if (!/^ux\//.test(rel)) return null;
  if (rel === 'ux/project-context.md') return 'ux/project-context.md is generated from koru/engagement.md and koru/client.md (koru context). Change those, then run koru context.';
  const hit = Object.entries(M.METHODS).find(([, m]) => m.replaces && m.replaces.split(/,\s*/).some((pat) => new RegExp('^' + pat.replace(/[.]/g, '\\.').replace(/\*/g, '[^/]*') + '$').test(rel)));
  const to = hit ? `${hit[0]} writes ${hit[1].writes.length ? hit[1].writes.join(' and ') + ' cards' : 'no file here (it is a generated view)'} in a Koru project: ${hit[1].how}` : 'Write the result as cards (koru new TYPE "title"); koru next says which.';
  return `This is a Koru project, so method skills write cards, not ux/ files. ${to}`;
}

// ---------------------------------------------------------------- card writes

function checkCardWrite(root, file, oldText, newText, agentType) {
  const eng = K.readEngagement(root);
  const cards = K.loadCards(root);
  const oldCard = oldText ? K.cardFromText(oldText, file) : null;
  const card = K.cardFromText(newText, file);
  const m = card.meta;
  const om = oldCard ? oldCard.meta : {};
  const hint = (id) => `Ask the signer to type in Claude Code:  ! koru sign ${id || card.id} --name "…" --role "…"`;

  if (oldCard && oldCard.status === 'final') {
    if (oldCard.type === 'DEC') return `${oldCard.id} is an accepted Decision. Decisions are superseded, never edited: koru decide new "…" with a "supersedes ${oldCard.id}: why" link.`;
    return `${oldCard.id} is signed. To change it, run  koru revise ${oldCard.id} --reason "what changed"  first, so the change is a new version.`;
  }
  if (oldCard && oldCard.status === 'superseded') return `${oldCard.id} is superseded and stays as history.`;
  const why = agentRefuses(agentType, card.type);
  if (why) return why;
  if (card.id && card.type && card.id.slice(0, 3) !== card.type) return `Card id ${card.id} does not match its type ${card.type}. Create cards with koru new.`;
  if (card.type === 'INS') return 'Only people write Insights. Offer the researcher your reading of the Findings in chat (what, because, so what, with contradicting evidence); they write the card with  koru new INS "…".';
  if (m.status === 'final' || m.status === 'superseded') return `Claude cannot set a card to ${m.status}. ${hint()}`;
  for (const f of SIGN_FIELDS) if (!same(m[f], om[f])) return `Claude cannot fill or change "${f}". Sign-offs belong to people. ${hint()}`;
  if (!same(m.confidence, om.confidence)) return 'Claude cannot set confidence. A person rates it; koru check shows the signals that back or contradict their rating.';
  if (card.type === 'FND' && m.evidence === 'synthetic') return 'Synthetic output cannot become a Finding. Make it a Hypothesis card (koru new HYP "…"); it can be tested, never cited.';
  for (const l of card.links) {
    if (l.bad) continue;
    const t = cards[l.id];
    if (l.kind === 'supports' && t && t.type === 'HYP') return `${l.id} is a Hypothesis. It can be tested, never cited as support.`;
    if (t && t.status === 'superseded' && l.kind !== 'supersedes') return `${l.id} is superseded${t.meta.superseded_by ? ` by ${t.meta.superseded_by}` : ''}. Cite the current card.`;
  }
  if (card.type === 'TST') {
    for (const f of ['threshold_saved_at', 'result', 'result_at', 'passed', 'of']) if (!same(m[f], om[f])) return `Record thresholds and results with  koru threshold ${card.id}  and  koru result ${card.id} --passed N --of M  (a person types the result), so the threshold is provably saved first.`;
    if (K.filled(om.threshold_saved_at) && !same(m.threshold, om.threshold)) return `${card.id}'s threshold was saved at ${om.threshold_saved_at}. It cannot change once saved.`;
  }
  if (card.type === 'DIR') {
    for (const f of ['threshold_saved_at', 'result', 'result_at']) if (!same(m[f], om[f])) return `Record thresholds and results with  koru threshold ${card.id}  and  koru result ${card.id} "…", so the threshold is provably saved before any result.`;
    if (K.filled(om.threshold_saved_at) && !same(m.threshold, om.threshold)) return `${card.id}'s threshold was saved at ${om.threshold_saved_at}. It cannot change once saved; record a Decision if the test itself changes.`;
  }
  if (card.type === 'DAT') {
    if (!aiMayReadResearch(eng)) return `The contract does not let AI handle research data (AI tier "${eng.ai_tier}", processor "${eng.ai_processor || 'none'}"). A person sets it with: koru contract.`;
    const needsConsent = !/^(analytics|support|document)$/.test(m.kind || '');
    if (needsConsent && (!K.filled(m.consent) || !String(m.consent).toLowerCase().includes(String(eng.ai_processor).toLowerCase()))) return `Data needs a consent record that names the AI processor (${eng.ai_processor}). Record the consent first.`;
    if (m.file && /originals\//.test(m.file)) return 'Data cards point at pseudonymised transcripts in koru/raw/, never at originals.';
  }
  if (card.type === 'FND') {
    const probs = K.verifyQuotes(root, card, cards);
    if (probs.length) return `Every quote must match its transcript word for word, with participant and timestamp.\n- ${probs.join('\n- ')}`;
  }
  return null;
}

// Deliverables and front-end code may only use the design system. Findings already in the file
// are reported, not blocked, so fixing one problem is never refused because of an older one.
function dsGuard(root, file, tool, input) {
  const D = require('./ds');
  if (!D.isGuardedPath(root, file)) return null;
  const oldText = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const newText = proposed(tool, input, oldText);
  if (newText === null) return null;
  const key = (x) => `${x.rule}|${x.msg}`;
  const before = new Map();
  if (oldText) for (const x of D.lintText(root, file, oldText)) before.set(key(x), (before.get(key(x)) || 0) + 1);
  const fresh = [];
  for (const x of D.lintText(root, file, newText).filter((y) => y.level === 'block')) {
    const n = before.get(key(x)) || 0;
    if (n > 0) before.set(key(x), n - 1); else fresh.push(x);
  }
  if (!fresh.length) return null;
  const shown = fresh.slice(0, 8).map((x) => `line ${x.line} [${x.rule}] ${x.msg}`);
  return `this change breaks the design system (${D.load(root).manifest ? D.load(root).manifest.system : 'none set up'}):\n- ${shown.join('\n- ')}${fresh.length > 8 ? `\n- …and ${fresh.length - 8} more` : ''}\nUse tokens and the system's components. If the system truly lacks something, add it through the koru-design-system skill (koru ds component add NAME --spec CARD).`;
}

function preWrite(root, input, tool, agentType) {
  const file = input.file_path || input.notebook_path;
  if (!file) return allow();
  const uxWhy = uxRefuses(root, file);
  if (uxWhy) return deny(uxWhy);
  const ag = M.agentOf(agentType);
  if (ag && ag.checker) return deny(agentRefuses(agentType, 'REV'));
  const dsWhy = dsGuard(root, file, tool, input);
  if (dsWhy) return deny(dsWhy);
  const rel = relKoru(root, file);
  if (rel === null) return allow();
  if (/^design-system\/build\//.test(rel)) return deny('design-system/build is generated. Change tokens.json or components.json, then run koru ds build.');
  if (/^generated\//.test(rel)) return deny('koru/generated is rebuilt from the cards. Change the cards, then run koru index.');
  if (/^(private|raw\/originals)(\/|$)/.test(rel)) return deny('koru/private and the original transcripts are never handled by AI.');
  if (/^(state|history)\//.test(rel)) return deny('koru/state and koru/history are kept by Koru itself. Use koru commands.');
  if (/^raw\//.test(rel)) return deny('Research data comes from real sessions. People add transcripts; koru pseudonymise prepares the copy Claude may read.');
  const oldText = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const newText = proposed(tool, input, oldText);
  if (newText === null) return allow(); // the edit will fail on its own
  if (rel === 'engagement.md') {
    const a = K.splitCard(oldText).meta;
    const b = K.splitCard(newText).meta;
    for (const f of CONTRACT_FIELDS) if (!same(a[f], b[f])) return deny(`"${f}" is a contract setting. Only a person sets it:  ! koru contract …`);
    return allow();
  }
  if (/^cards\//.test(rel)) {
    const why = checkCardWrite(root, file, oldText, newText, agentType);
    if (why) return deny(why);
  }
  return allow();
}

// ---------------------------------------------------------------- reads

function preRead(root, input) {
  const file = input.file_path || input.path || input.notebook_path;
  if (!file) return allow();
  const rel = relKoru(root, file);
  if (rel === null) return allow();
  if (/^(private|raw\/originals)(\/|$)/.test(rel)) return deny('koru/private and the original transcripts are never shown to AI. Use the pseudonymised copy in koru/raw/.');
  if (/^raw\//.test(rel) && rel !== 'raw' && !/README\.md$/.test(rel)) {
    const eng = K.readEngagement(root);
    if (!aiMayReadResearch(eng)) return deny(`The contract does not let AI read research data yet (AI tier "${eng.ai_tier}", processor "${eng.ai_processor || 'none'}"). A person sets it: ! koru contract --tier … --processor …`);
  }
  return allow();
}

// ---------------------------------------------------------------- shell

const KORU_KEPT = /koru\/(cards|state|history|generated|raw|private|design-system\/build|engagement\.md)/;
// A shell command writes into koru/ when a redirect points there, or a mutating
// tool is used on a koru path. Reads with 2>&1 or >/dev/null are fine.
function shellWritesKoru(cmd) {
  if (!KORU_KEPT.test(cmd)) return false;
  for (const m of cmd.matchAll(/(?:^|[^0-9&>])>>?\|?\s*["']?([^\s;&|"'<>]+)/g)) if (KORU_KEPT.test(m[1])) return true;
  return /(\bsed\s+(-[a-z]*i|--in-place)|\btee\b|\bmv\b|\bcp\b|\brm\b|\bperl\b|\bpython3?\b|\btruncate\b|\bln\b|\bnode\s+-e\b|\bdd\b|\binstall\b|\btouch\b|\bchmod\b)/.test(cmd);
}

function preBash(root, input, agentType) {
  const cmd = String(input.command || '');
  const ag = M.agentOf(agentType);
  if (ag && ag.checker) {
    if (/\bkoru(?:\.js)?\s+(new|revise|discard|threshold|matrix|compare|note|playback|decide|review|ds\s+(adopt|extend|build|inline|component)|scaffold|index|board|publish|ids|git-setup|context)\b/.test(cmd) || /(^|[^0-9&>])>>?\s*(?!\/dev\/null)[^\s&|;]/.test(cmd) || /\b(tee|mv|cp|rm|sed\s+-i)\b/.test(cmd))
      return deny(`The ${ag.label} only reads: koru pack, check, list, show, quotes, gate, next. It never changes the project, so its review stays independent.`);
  }
  const nw = cmd.match(/\bkoru(?:\.js)?\s+(?:new|decide\s+new)\s+["']?([A-Za-z]{3})\b/);
  if (nw) { const why = agentRefuses(agentType, /decide/.test(nw[0]) ? 'DEC' : nw[1].toUpperCase()); if (why) return deny(why); }
  for (const [re, t] of [[/\bkoru(?:\.js)?\s+note\b/, 'REQ'], [/\bkoru(?:\.js)?\s+matrix\b/, 'STA'], [/\bkoru(?:\.js)?\s+compare\b/, 'DEC'], [/\bkoru(?:\.js)?\s+playback\b/, 'PLB'], [/\bkoru(?:\.js)?\s+review\b/, 'REV']]) {
    if (re.test(cmd)) { const why = t === 'REV' ? (M.agentOf(agentType) ? 'Only the orchestrator records a review (koru review), so a checker never grades its own work.' : null) : agentRefuses(agentType, t); if (why) return deny(why); }
  }
  if (/(^|[\s;&|])(>>?|tee)\s*["']?ux\//.test(cmd) || /\b(cp|mv)\b[^;&|]*\sux\//.test(cmd)) return deny(uxRefuses(root, path.join(root, 'ux/x.md')) || 'ux/ is not written in a Koru project.');
  const m = cmd.match(HUMAN_CMD);
  if (m && /(^|\s)(--help|-h)(\s|$)/.test(cmd) && !/[;&|]/.test(cmd)) return allow ? allow() : undefined;
  if (m) return deny(`"koru ${m[1]}" is for people: it signs, sets the contract, or sends work outside Koru. Ask the person to type it themselves, starting with "!":  ! ${cmd.trim()}`);
  if (/\bkoru(?:\.js)?\s+new\s+["']?INS\b/i.test(cmd)) return deny('Only people write Insights. Give the researcher your reading in chat; they type  ! koru new INS "…"  and write it.');
  if (GATE_PASS.test(cmd)) return deny(`Passing a gate is a sign-off. Ask a signer to type:  ! ${cmd.trim()}`);
  if (/koru\/(private|raw\/originals)\b/.test(cmd)) return deny('koru/private and the original transcripts are never handled by AI.');
  if (shellWritesKoru(cmd))
    return deny('Change cards with the Edit or Write tools, or with koru commands, so the rules apply. Shell writes into koru/ are blocked.');
  if (/koru\/raw\b/.test(cmd)) {
    const eng = K.readEngagement(root);
    if (!aiMayReadResearch(eng)) return deny(`The contract does not let AI read research data yet (AI tier "${eng.ai_tier}").`);
  }
  return allow();
}

// ---------------------------------------------------------------- connectors

function preMcp(root, tool, input) {
  const eng = K.readEngagement(root);
  const isRead = /__(get|search|list|read|whoami|fetch|lookup)/i.test(tool) || /__(get_|search_|list_)/i.test(tool);
  if (/figma/i.test(tool) && !isRead) {
    if (eng.ai_tier !== 'full') return deny(`The contract (AI tier "${eng.ai_tier}") does not allow AI to write to the client's Figma. Share frames another way, or a person changes the contract.`);
    return ask('This writes to the client\'s Figma. A person must approve each write.');
  }
  if (/jira|atlassian/i.test(tool) && /(create|edit|update|transition|add|delete|assign|link)/i.test(tool)) {
    if (eng.ai_tier !== 'full') return deny(`The contract (AI tier "${eng.ai_tier}") does not allow AI to write to the client's Jira.`);
    if (/create/i.test(tool) && /issue|ticket/i.test(tool + JSON.stringify(input))) {
      const ids = [...new Set((JSON.stringify(input).match(/TKT-\d{3}/g) || []))];
      if (!ids.length) return deny('Jira tickets are created from Ticket cards. Name the card (TKT-001) in the issue so it can be checked against Definition of Ready.');
      const cards = K.loadCards(root);
      for (const id of ids) {
        const c = cards[id];
        if (!c) return deny(`${id} does not exist.`);
        const probs = [...K.dor(c, cards), ...K.linkProblems(c, cards).filter((p) => p.level === 'block')].filter((p) => p.level === 'block');
        if (probs.length) return deny(`${id} fails Definition of Ready:\n- ${probs.map((p) => p.msg).join('\n- ')}`);
        if (c.status !== 'final') return deny(`${id} is not signed by the engineer yet.`);
      }
    }
    return ask('This writes to the client\'s Jira. A person must approve each write.');
  }
  return allow();
}

// ---------------------------------------------------------------- after writes

function post(root, payload) {
  const tool = payload.tool_name;
  const input = payload.tool_input || {};
  const file = input.file_path;
  if (!file || !['Write', 'Edit', 'MultiEdit'].includes(tool)) return process.exit(0);
  if (!K.isCardPath(root, file) || !fs.existsSync(file)) return process.exit(0);
  const card = K.cardFromText(fs.readFileSync(file, 'utf8'), file);
  // Provenance stamp: who wrote what, when, in which session. Shown on the board and in the AI-use note.
  K.appendJsonl(K.stateFile(root, 'provenance.jsonl'), { id: card.id, version: card.version, at: K.now(), by: 'claude', agent: payload.agent_type || 'main', tool, session: payload.session_id || '', sources: card.links.filter((l) => !l.bad).map((l) => l.id) });
  // Every change is saved as a version.
  const dir = path.join(K.paths(root).history, card.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${K.now().replace(/[:]/g, '')}-v${card.version}-claude.md`), card.text);
  // The AI draft as last written: koru sign compares it with what the person signs (human_edit).
  fs.mkdirSync(path.join(K.paths(root).state, 'drafts'), { recursive: true });
  fs.writeFileSync(path.join(K.paths(root).state, 'drafts', `${card.id}.v${card.version}.md`), card.text);
  K.log(root, 'claude-edit', { id: card.id, title: card.meta.title });
  // Advice, not a block: tell Claude what the card still lacks.
  const probs = K.checkCard(root, card, K.loadCards(root), K.readEngagement(root)).filter((p) => p.level !== 'info');
  if (probs.length) {
    respond({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `Koru check on ${card.id}:\n${probs.map((p) => `${p.level === 'block' ? '✗' : '!'} ${p.msg}`).join('\n')}\n(✗ items will stop this card from being signed.)` } });
  }
  process.exit(0);
}

// ---------------------------------------------------------------- session start

const CONSTITUTION = `Koru rules for this project (the hooks enforce the starred ones):
* People own judgement; you own throughput. You draft, vary, enumerate and check. You never sign, never set confidence, never write an Insight, never pass a gate.
* Every artefact is a card in koru/cards. Create cards with  koru new TYPE "title"  and fill their fixed shape. Link with "supports ID: why" or "contradicts ID: why". A card with no source is labelled an assumption.
* Quotes in Findings are word for word: > "words" (P01, 00:12:34, DAT-001).
* Signed cards change only through  koru revise ID --reason; accepted Decisions only through a superseding Decision.
* Synthetic or speculative output is a Hypothesis card, never evidence.
* Client tools (Figma, Jira) and client shares need a person, and the contract tier.
- Speak in plain designer language. Show safety messages in full. Offer "what's next" only at session start, when a card is completed, or at a gate.
- Run the stage's checker agent before any gate and record it with  koru review STAGE --checker NAME --file findings.md.
- When a rule stops you, explain it in one line and give the person the exact command to type (starting with "!").`;

function sessionStart(payload) {
  // Put the koru command on PATH for this session's shell.
  if (process.env.CLAUDE_ENV_FILE) {
    try { fs.appendFileSync(process.env.CLAUDE_ENV_FILE, `export PATH="${path.join(PLUGIN_ROOT, 'bin')}:$PATH"\n`); } catch {}
  }
  // SkillCloud skills read ~/.skillcloud/repo; point it at this plugin when SkillCloud was never installed.
  try {
    const home = process.env.SKILLCLOUD_HOME || path.join(os.homedir(), '.skillcloud');
    const link = path.join(home, 'repo');
    if (!fs.existsSync(link)) { fs.mkdirSync(home, { recursive: true }); fs.symlinkSync(PLUGIN_ROOT, link); }
  } catch {}
  const root = K.findRoot(payload.cwd);
  let ctx;
  if (!root) {
    ctx = 'Koru plugin is installed. This folder has no Koru project yet. If the person is starting client work here, suggest /koru:start.';
  } else {
    if (payload.model) K.appendJsonl(K.stateFile(root, 'sessions.jsonl'), { at: K.now(), session: payload.session_id || '', model: payload.model, source: payload.source || '' });
    let recap = '';
    try { recap = require('./koru').recap(root, true); } catch (e) { recap = `(recap unavailable: ${e.message})`; }
    ctx = `${CONSTITUTION}\n\nWhere this project stands:\n${recap}\n\nOpen with a two-line recap for the person and the suggested next step.`;
  }
  respond({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: ctx } });
}

// ---------------------------------------------------------------- main

function main() {
  const event = process.argv[2];
  const payload = readStdin();
  if (event === 'SessionStart') return sessionStart(payload);
  const root = K.findRoot(payload.cwd || process.cwd());
  if (!root) return allow();
  const tool = payload.tool_name || '';
  const input = payload.tool_input || {};
  if (tool === 'Agent' || tool === 'Task' || event === 'SubagentStop') {
    // The live board watches the orchestrator start and finish agents. Never blocks.
    try { require('./live').hookAgent(root, payload, event === 'PreToolUse' ? 'pre' : event === 'PostToolUse' ? 'post' : 'stop'); } catch (e) { /* the board is a view; never stop work for it */ }
    return allow();
  }
  try {
    if (event === 'PostToolUse') return post(root, payload);
    if (event !== 'PreToolUse') return allow();
    if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(tool)) return preWrite(root, input, tool, payload.agent_type);
    if (['Read', 'NotebookRead', 'Grep', 'Glob'].includes(tool)) return preRead(root, input);
    if (tool === 'Bash') return preBash(root, input, payload.agent_type);
    if (tool.startsWith('mcp__')) return preMcp(root, tool, input);
    return allow();
  } catch (e) {
    // A bug in a guard must not silently open the gate on protected files: fail closed for koru/ writes.
    if (['Write', 'Edit', 'MultiEdit'].includes(tool) && input.file_path && (relKoru(root, input.file_path) !== null || require('./ds').isGuardedPath(root, input.file_path))) return deny(`the Koru guard hit an error (${e.message}); the write was stopped to be safe.`);
    return allow();
  }
}

if (require.main === module) main();
module.exports = { checkCardWrite, proposed };
