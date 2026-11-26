'use strict';
// A person's decision, made by clicking. In the Claude Code desktop app Claude asks with
// AskUserQuestion and the person picks an option; the PostToolUse hook records what they picked.
// A person's own chat message counts too (UserPromptSubmit). Only those two sources are written
// here, and both come from the person's side of the screen: Claude cannot produce either.
//
// A person-only command (sign, contract, gate pass, result, share, ...) then runs when a recent
// decision in the same session names everything the command does, and the person's answer was a
// yes. Each decision is used once. Without one, the hook refuses and tells Claude how to ask.
//
// State: koru/state/consents.jsonl holds {event: 'choice' | 'message' | 'used'} rows.

const path = require('path');
const K = require('./core');

const WINDOW_MS = 30 * 60 * 1000; // a decision is good for half an hour
const NO = /^\s*(no\b|not (yet|now)|don'?t|do not|cancel|stop|skip|later|wait|hold|leave it|none of)/i;
const file = (root) => K.stateFile(root, 'consents.jsonl');

// AskUserQuestion's answers, whichever shape the app hands the hook.
function answersOf(payload) {
  const input = payload.tool_input || {};
  const resp = payload.tool_response;
  const out = [];
  const qs = (input.questions || []).map((q) => ({ question: String(q.question || ''), header: String(q.header || ''), options: (q.options || []).map((o) => (typeof o === 'object' ? { label: String(o.label || ''), description: String(o.description || '') } : { label: String(o), description: '' })) }));
  const map = (resp && typeof resp === 'object' && (resp.answers || (resp.result && resp.result.answers))) || input.answers || null;
  if (map && typeof map === 'object') {
    for (const [question, answer] of Object.entries(map)) out.push({ question, answer: Array.isArray(answer) ? answer.join(', ') : String(answer) });
  } else {
    // The text form: User has answered your questions: "Question?"="Answer", "Other?"="Answer".
    const text = typeof resp === 'string' ? resp : JSON.stringify(resp || '');
    for (const m of text.matchAll(/"((?:[^"\\]|\\.)+)"\s*=\s*"((?:[^"\\]|\\.)*)"/g)) out.push({ question: m[1].replace(/\\"/g, '"'), answer: m[2].replace(/\\"/g, '"') });
  }
  return out.map((a) => {
    const q = qs.find((x) => x.question === a.question) || {};
    return { ...a, header: q.header || '', options: q.options || [] };
  });
}

function recordChoice(root, payload) {
  if (payload.agent_type) return 0; // only the person at the main session answers questions
  const rows = answersOf(payload);
  for (const r of rows) K.appendJsonl(file(root), { at: K.now(), event: 'choice', session: payload.session_id || '', call: payload.tool_use_id || '', question: r.question, header: r.header, answer: r.answer, options: r.options });
  return rows.length;
}

function recordMessage(root, payload) {
  const text = String(payload.prompt || '').trim();
  if (!text || text.startsWith('/')) return; // a slash command is a request, not a decision
  K.appendJsonl(file(root), { at: K.now(), event: 'message', session: payload.session_id || '', text: text.slice(0, 4000) });
}

// What a person must have agreed to for this command: every card id, stage, file and value it carries.
function needs(cmd) {
  const c = String(cmd);
  const verb = (c.match(/\bkoru(?:\.js)?\s+(ds\s+approve|gate|sign|contract|share|pseudonymi[sz]e|clear-flag|caught|result|confidence)\b/) || [])[1] || '';
  const tokens = new Set((c.match(/\b[A-Z]{3}-\d{3}\b/g) || []));
  const flag = (f) => (c.match(new RegExp(`--${f}[= ]+("[^"]*"|'[^']*'|\\S+)`)) || [])[1];
  const unq = (v) => (v ? v.replace(/^["']|["']$/g, '') : v);
  if (verb === 'gate') { const st = (c.match(/\bgate\s+(frame|explore|harden|ship)\b/i) || [])[1]; if (st) tokens.add(st.toLowerCase()); }
  if (verb === 'contract') { for (const f of ['tier', 'data-class']) if (flag(f)) tokens.add(unq(flag(f)).toLowerCase()); }
  if (verb === 'confidence' && flag('level')) tokens.add(unq(flag('level')).toLowerCase());
  if (verb === 'result') { for (const f of ['passed', 'of']) if (flag(f)) tokens.add(unq(flag(f))); }
  if (verb === 'share' || /^pseudonymi/.test(verb)) {
    const f = (c.match(/\b(?:share|pseudonymi[sz]e)\s+("[^"]+"|'[^']+'|[^\s-][^\s]*)/) || [])[1];
    if (f) tokens.add(path.basename(unq(f)).replace(/\.[a-z0-9]+$/i, '').toLowerCase());
  }
  return { verb: verb.replace(/\s+/g, ' '), tokens: [...tokens] };
}

const norm = (s) => String(s || '').toLowerCase().replace(/[‐-―]/g, '-');
// "internal" in "AI tier internal", "8" in "6 of 8", BRF-001 as written.
const mentions = (text, token) => new RegExp(`(^|[^a-z0-9])${norm(token).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9])`).test(norm(text));
const VERB_WORDS = { sign: /sign/, contract: /contract|tier|consent|data/, gate: /gate|pass|close|finish/, result: /result|pass|passed|record/, share: /share|send|link/, 'ds approve': /approve/, caught: /mistake|caught|wrong|log/, 'clear-flag': /flag|clear/, pseudonymise: /pseudonym|anonym|names/, pseudonymize: /pseudonym|anonym|names/, confidence: /confiden|sure|certain|rate|rating|low|medium|high/ };

function rows(root) { return K.readJsonl(file(root)); }

// The decision that lets this command run, or null. The questions of one AskUserQuestion call are read
// together (a contract asks the tier and the data class side by side); a chat message stands alone.
function find(root, cmd, session, now = Date.now()) {
  const { verb, tokens } = needs(cmd);
  if (!verb) return null;
  const all = rows(root);
  const used = new Set(all.filter((r) => r.event === 'used').map((r) => r.ref));
  const fresh = all.filter((r) => (r.event === 'choice' || r.event === 'message') && now - Date.parse(r.at) <= WINDOW_MS && (!session || !r.session || r.session === session));
  const groups = [];
  for (const r of fresh) {
    const key = r.event === 'choice' && r.call ? `call:${r.call}` : `${r.at}|${r.question || r.text}`;
    let g = groups.find((x) => x.ref === key);
    if (!g) { g = { ref: key, rows: [] }; groups.push(g); }
    g.rows.push(r);
  }
  for (const g of groups.reverse()) {
    if (used.has(g.ref)) continue;
    const said = g.rows.map((r) => (r.event === 'choice' ? `${r.header} ${r.question} ${r.answer}` : r.text)).join(' \n ');
    if (g.rows.some((r) => NO.test(r.event === 'choice' ? r.answer : r.text))) continue;
    if (!(VERB_WORDS[verb] || /./).test(norm(said))) continue;
    if (tokens.every((t) => mentions(said, t))) {
      const r = g.rows[0];
      return { event: r.event, at: r.at, question: g.rows.map((x) => x.question).filter(Boolean).join(' / '), answer: g.rows.map((x) => x.answer).filter(Boolean).join(' / '), text: r.text, ref: g.ref, verb, tokens };
    }
  }
  return null;
}

function use(root, hit, cmd) {
  K.appendJsonl(file(root), { at: K.now(), event: 'used', ref: hit.ref, command: String(cmd).slice(0, 300) });
  K.log(root, 'person-decided', { how: hit.event === 'choice' ? 'picked an option' : 'said so in chat', question: hit.question || '', answer: hit.answer || hit.text || '', command: String(cmd).slice(0, 200) });
}

// What Claude should do instead of asking the person to type a command.
function howToAsk(cmd) {
  const { verb, tokens } = needs(cmd);
  const what = tokens.length ? ` naming ${tokens.join(', ')}` : '';
  return `This is the person's decision. Ask them with the AskUserQuestion tool: one question${what}, with a clear yes option (for example "Sign it" or "Pass the gate") and a "Not yet" option, recommended option first. When they pick yes, run this same command again and it will go through. Never ask them to type a command.`;
}

// A person's own words or chosen option that contain this text (an Insight they wrote or picked).
function saidByPerson(root, text, session, now = Date.now()) {
  const want = norm(text).replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim();
  if (want.length < 12) return null;
  for (const r of rows(root).reverse()) {
    if (!(r.event === 'choice' || r.event === 'message') || now - Date.parse(r.at) > WINDOW_MS * 4) continue;
    if (session && r.session && r.session !== session) continue;
    const picked = r.event === 'choice' ? (r.options || []).filter((o) => o && o.label && String(r.answer).split(', ').includes(o.label)).map((o) => o.description).join(' ') : '';
    const said = norm(r.event === 'choice' ? `${r.answer} ${picked}` : r.text).replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '');
    if (said.includes(want)) return r;
  }
  return null;
}

// The engine's own check, for when koru runs inside a Claude Code shell (CLAUDECODE=1): a person-only
// command must follow a decision the hook just let through for this same command. This catches calls
// the hook cannot recognise (a variable for koru, a wrapper script) and stops one click running twice.
const PERSON_ONLY = /^(sign|contract|share|pseudonymi[sz]e|clear-flag|caught|result)$/;
function isPersonOnly(argv) {
  const [cmd, sub] = argv;
  return PERSON_ONLY.test(cmd || '') || (cmd === 'ds' && sub === 'approve') || (cmd === 'gate' && argv.includes('--pass'));
}
function cliAllowed(root, argv, now = Date.now()) {
  if (process.env.CLAUDECODE !== '1' || !isPersonOnly(argv)) return true;
  const quoted = argv.map((a) => (/\s/.test(a) ? `"${a}"` : a)).join(' ');
  const want = needs(`koru ${quoted}`);
  const all = rows(root);
  const spent = new Set(all.filter((r) => r.event === 'spent').map((r) => r.ref));
  for (const r of all.slice().reverse()) {
    if (r.event !== 'used' || spent.has(`${r.at}|${r.ref}`) || now - Date.parse(r.at) > 120000) continue;
    const got = needs(r.command);
    if (got.verb === want.verb && want.tokens.every((t) => got.tokens.map(norm).includes(norm(t)))) {
      K.appendJsonl(file(root), { at: K.now(), event: 'spent', ref: `${r.at}|${r.ref}` });
      return true;
    }
  }
  return false;
}

module.exports = { cliAllowed, isPersonOnly,  answersOf, recordChoice, recordMessage, needs, find, use, howToAsk, saidByPerson, mentions };
