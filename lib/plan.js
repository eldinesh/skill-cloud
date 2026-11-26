'use strict';
// The Koru playbook as data, and the planner the orchestrator runs on.
//
// Each step names the agent that does it (or "person"), the skills it uses, the card types it
// writes, what it needs first, and a done test computed from the project graph. `koru next`
// walks this list: steps whose needs are met and whose done test fails are either ready for an
// agent (with a work order) or waiting on a person (with the exact command). Nothing here trusts
// a status someone typed: every answer is recomputed from the cards.

const fs = require('fs');
const path = require('path');
const K = require('./core');
const M = require('./methods');

const exists = (f) => { try { return fs.existsSync(f); } catch { return false; } };
const listFiles = (dir, keep) => {
  if (!exists(dir)) return [];
  const out = [];
  const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); const st = fs.statSync(p); if (st.isDirectory()) { if (!/^(originals|node_modules|\.git)$/.test(f)) walk(p); } else if (!keep || keep(p)) out.push(p); } };
  walk(dir);
  return out.sort();
};

function context(root) {
  const cards = K.loadCards(root);
  const eng = K.readEngagement(root);
  const p = K.paths(root);
  const R = K.rigour(eng);
  const A = (t) => K.active(cards, t);
  const transcripts = listFiles(p.raw, (f) => /\.(md|txt|vtt)$/i.test(f) && !/README\.md$/i.test(f));
  const originals = listFiles(p.originals, (f) => !/README\.md$/i.test(f));
  const inbox = listFiles(path.join(root, 'inbox'), (f) => !/(^|\/)\./.test(path.basename(f)));
  const allText = Object.values(cards).map((c) => c.text).join('\n');
  const passed = K.readJsonl(K.stateFile(root, 'gates.jsonl'));
  return { root, cards, eng, p, R, A, transcripts, originals, inbox, allText, passed, stage: K.currentStage(root, cards) };
}

const blockers = (x, c) => K.checkCard(x.root, c, x.cards, x.eng).filter((p) => p.level === 'block');
const rel = (x, f) => path.relative(x.root, f);
const cited = (x, f) => x.allText.includes(path.basename(f)) || x.allText.includes(rel(x, f));
const datFor = (x, f) => x.A('DAT').find((d) => d.meta.file && (path.basename(String(d.meta.file)) === path.basename(f)));
function reviewCurrent(x, stage) {
  const rep = K.gateReport(x.root, stage, x.cards);
  const has = rep.rows.find((r) => /^Checker review record/.test(r.item));
  const fresh = rep.rows.find((r) => /^Nothing changed since the review|^Review is newer/.test(r.item));
  return !!(has && has.ok && fresh && fresh.ok);
}
const gatePassed = (x, stage) => x.passed.some((g) => g.stage === stage);
const chosenDir = (x) => x.A('DIR').find((d) => d.meta.chosen === 'yes' || d.meta.chosen === 'true');
const ds = (x) => { try { return require('./ds').load(x.root); } catch { return { ready: false }; } };

// ---------------------------------------------------------------- the playbook

const STEPS = [
  // ---------------- Frame
  { id: 'F0', stage: 'frame', title: 'Contract, roles and rigour', who: 'person', role: 'engagement lead',
    status: (x) => ({ done: x.eng.ai_tier && x.eng.ai_tier !== 'unset' && K.filled(x.eng.ai_processor), progress: `AI tier ${x.eng.ai_tier || 'unset'} · rigour ${x.R.key}` }),
    ask: '! koru contract --tier <full|internal|none> --data-class <class> --processor <AI processor>   (from the signed contract; then record people and roles in koru/engagement.md)' },
  { id: 'F1', stage: 'frame', title: 'Context card: questions 1 to 5 answered', agent: 'strategist', skills: ['koru-frame'], writes: ['CTX'], needs: [],
    status: (x) => { const c = x.A('CTX')[0]; return { done: c && !blockers(x, c).some((p) => p.rule === 'context'), progress: c ? `${K.CTX_QUESTIONS.filter((q) => K.filled(c.sections[q.toLowerCase()])).length} of 12 answered` : 'no Context card' }; },
    order: 'Draft the Context card from the kick-off material in inbox/ (koru new CTX "Context" if none). Answer what the material answers, mark each answer with its source file, and list the questions only the client can answer for the person to ask.' },
  { id: 'F2', stage: 'frame', title: 'Sort what the client sent (requests, ideas, documents, data)', agent: 'strategist', skills: ['koru-frame', 'topic-deep-dive'], writes: ['REQ', 'IDE', 'ASM', 'DAT'], needs: ['F1'],
    status: (x) => { const open = x.inbox.filter((f) => !cited(x, f)); return { done: !open.length, progress: `${x.inbox.length - open.length} of ${x.inbox.length} inbox files on a card`, packages: open.map((f) => ({ key: rel(x, f), note: `Sort ${rel(x, f)}: evidence (DAT kind document, analytics or support), constraint, client idea (IDE with a reverse trace), request (REQ) or assumption (ASM). Cite the file by name on the card.` })) }; } },
  { id: 'F3', stage: 'frame', title: 'Study plan and interview guide', agent: 'researcher', skills: ['research-plan', 'interview-guide'], writes: ['STU'], needs: ['F1'],
    status: (x) => { const s = x.A('STU'); return { done: s.length && s.every((c) => !blockers(x, c).length), progress: s.length ? `${s.length} study card(s)` : 'none' }; } },
  { id: 'F4', stage: 'frame', title: 'Pseudonymise transcripts before AI reads them', who: 'person', role: 'research owner', needs: ['F0'],
    status: (x) => { const left = x.originals.filter((o) => !x.transcripts.some((t) => path.basename(t) === path.basename(o))); return { done: !left.length, progress: `${x.originals.length - left.length} of ${x.originals.length} originals have a pseudonymised copy`, left }; },
    ask: '! koru pseudonymise koru/raw/originals/<file> --map koru/private/names.csv' },
  { id: 'F5', stage: 'frame', title: 'Data and Findings for every session, quotes verified', agent: 'researcher', skills: ['interview-synthesis'], writes: ['DAT', 'FND'], needs: ['F0', 'F3'], parallel: true,
    status: (x) => {
      const todo = x.transcripts.filter((f) => { const d = datFor(x, f); return !d || !x.A('FND').some((n) => n.links.some((l) => l.id === d.id)); });
      return { done: x.transcripts.length && !todo.length, progress: `${x.transcripts.length - todo.length} of ${x.transcripts.length} sessions synthesised`, packages: todo.map((f) => ({ key: rel(x, f), note: `Synthesise ${rel(x, f)}: its Data card (if missing) and one Finding per observation, quotes word for word.` })) };
    } },
  { id: 'F6', stage: 'frame', title: 'Cluster Findings and open Conflicts', agent: 'synthesiser', skills: ['affinity-mapping'], writes: ['FND', 'CON'], needs: ['F5'],
    status: (x) => { const f = x.A('FND'); const n = f.filter((c) => K.filled(c.meta.cluster)).length; return { done: f.length && n / f.length >= 0.8, progress: `${n} of ${f.length} Findings clustered` }; } },
  { id: 'F7', stage: 'frame', title: 'Segments and roles as cards', agent: 'synthesiser', skills: ['persona'], writes: ['SEG'], needs: ['F5'],
    status: (x) => { const r = K.gateReport(x.root, 'frame', x.cards).rows.find((y) => /^Segments are cards/.test(y.item)); return { done: r && r.ok, progress: r ? r.item.replace(/^Segments are cards \(SEG\) for every segment the Findings use\s*/, '') : '' }; } },
  { id: 'F8', stage: 'frame', title: 'Insights, written and rated by people', who: 'person', role: 'research owner', needs: ['F6'], prep: { agent: 'synthesiser', skills: ['insight-report', 'cross-study-synthesis'] },
    status: (x) => { const i = x.A('INS'); return { done: i.length && i.every((c) => c.status === 'final'), progress: `${i.filter((c) => c.status === 'final').length} of ${i.length} Insights final` }; },
    ask: '! koru new INS "…"   then fill What, Why (because …), So what, confidence, and sign it' },
  { id: 'F9', stage: 'frame', title: 'Jobs to be done on signed Insights', agent: 'synthesiser', skills: ['jobs-to-be-done'], writes: ['JOB'], needs: ['F8'],
    status: (x) => { const j = x.A('JOB'); return { done: j.length && j.every((c) => !blockers(x, c).length), progress: `${j.length} job(s)` }; } },
  { id: 'F10', stage: 'frame', title: 'Enterprise structure: flows, objects, permissions', agent: 'architect', skills: ['journey-map'], writes: ['FLW', 'OBJ', 'PRM'], needs: ['F7'],
    status: (x) => { const have = { FLW: x.A('FLW').some((c) => c.meta.kind === 'current'), OBJ: x.A('OBJ').length > 0, PRM: x.A('PRM').length > 0 }; const miss = x.R.structure.filter((t) => !have[t]); return { done: !miss.length, progress: miss.length ? `missing ${miss.join(', ')}` : x.R.structure.join(', ') + ' drafted' }; } },
  { id: 'F11', stage: 'frame', title: 'Problems, How-might-we, opportunities, idea traces', agent: 'strategist', skills: ['koru-frame', 'sense-shape-steer'], writes: ['PRB', 'HMW', 'OPP', 'IDE'], needs: ['F8'],
    status: (x) => { const prb = x.A('PRB').filter((c) => !/foundation/i.test(c.meta.kind || '')); const hmw = x.A('HMW'); const ide = x.A('IDE').filter((c) => blockers(x, c).length); return { done: prb.length >= 1 && prb.length <= 3 && hmw.length && hmw.every((h) => h.links.some((l) => /^PRB-/.test(l.id))) && !ide.length, progress: `${prb.length} Problem(s), ${hmw.length} HMW, ${ide.length} idea(s) without a reverse trace` }; } },
  { id: 'F12', stage: 'frame', title: 'Brief', agent: 'strategist', skills: ['design-brief'], writes: ['BRF'], needs: ['F11'],
    status: (x) => { const b = x.A('BRF')[0]; return { done: b && !blockers(x, b).length, progress: b ? b.status : 'none' }; } },
  { id: 'F13', stage: 'frame', title: 'Design-system audit and set-up', agent: 'designer', skills: ['koru-design-system'], writes: [], needs: ['F1'],
    status: (x) => { const d = ds(x); return { done: d.ready, progress: d.ready ? `${d.manifest.system} ${d.manifest.version}` : 'not set up' }; } },
  { id: 'F14', stage: 'frame', title: 'Research checker (independent, fresh context)', agent: 'research-checker', checker: 'frame', needs: ['F2', 'F3', 'F5', 'F6', 'F7', 'F9', 'F10', 'F11', 'F12'],
    status: (x) => ({ done: reviewCurrent(x, 'frame'), progress: reviewCurrent(x, 'frame') ? 'current' : 'not run on the stage as it stands' }) },
  { id: 'F15', stage: 'frame', title: 'Dispositions, signatures, client co-sign, gate', who: 'person', role: 'engagement lead', needs: ['F14'],
    status: (x) => ({ done: gatePassed(x, 'frame'), progress: firstOpenRow(x, 'frame') }),
    ask: 'Give each checker finding a disposition in the review card, sign the cards (koru sign … ), then  ! koru gate frame --pass --name "…" --role "…"' },

  // ---------------- Explore
  { id: 'E1', stage: 'explore', title: 'Seeds from people (two designers, one idea each)', who: 'person', role: 'design lead', needs: [],
    status: (x) => ({ done: x.A('DIR').length > 0 || listFiles(path.join(x.p.koru, 'seeds')).length > 0, progress: `${x.A('DIR').length} Direction(s)` }),
    ask: 'Each designer writes or sketches a seed (one sentence or a photo) into koru/seeds/, or says it in chat.' },
  { id: 'E2', stage: 'explore', title: 'Directions from the seeds, with future flows', agent: 'designer', skills: ['koru-explore'], writes: ['DIR', 'FLW'], needs: ['E1'],
    status: (x) => { const d = x.A('DIR'); const noFlow = x.R.structure.includes('FLW') ? d.filter((dir) => !x.A('FLW').some((f) => f.meta.kind === 'future' && f.links.some((l) => l.id === dir.id))) : []; return { done: d.length >= 1 && d.length <= 2 && d.every((c) => !blockers(x, c).filter((p) => p.rule !== 'threshold').length) && !noFlow.length, progress: `${d.length} Direction(s)${noFlow.length ? `, no future flow: ${noFlow.map((c) => c.id).join(', ')}` : ''}` }; } },
  { id: 'E3', stage: 'explore', title: 'Screens and prototypes, built from the design system only', agent: 'designer', skills: ['koru-explore', 'koru-design-system'], writes: ['SCR'], needs: ['E2', 'F13'], parallel: true,
    status: (x) => {
      const D = require('./ds');
      const todo = x.A('DIR').filter((d) => {
        const scr = x.A('SCR').filter((s) => s.links.some((l) => l.id === d.id));
        const proto = [d.meta.prototype, ...scr.map((s) => s.meta.prototype)].filter(K.filled).map((f) => path.resolve(x.root, f));
        return !scr.length || !proto.length || proto.some((f) => !exists(f) || D.lintFile(x.root, f).some((y) => y.level === 'block'));
      });
      return { done: x.A('DIR').length && !todo.length, progress: `${x.A('DIR').length - todo.length} of ${x.A('DIR').length} Directions have Screens and a clean prototype`, packages: todo.map((d) => ({ key: d.id, note: `Screens (SCR, each naming its flow step) and one prototype for ${d.id} in koru/deliverables/, from the design system only, with every hard case reachable by ?state=.` })) };
    } },
  { id: 'E4', stage: 'explore', title: 'Comparison and Decision draft (factors before options)', agent: 'designer', skills: ['design-rationale'], writes: ['DEC'], needs: ['E3'],
    status: (x) => { const ids = x.A('DIR').map((d) => d.id); const dec = x.A('DEC').find((d) => ids.length && ids.every((id) => d.links.some((l) => l.id === id))); return { done: !!dec, progress: dec ? dec.id : 'no Decision names every Direction (koru compare)' }; } },
  { id: 'E5', stage: 'explore', title: 'Usability tests with numeric thresholds, saved before sessions', agent: 'researcher', skills: ['usability-test-plan'], writes: ['TST'], needs: ['E3'],
    status: (x) => { const t = x.A('TST'); const dirs = x.A('DIR'); const miss = dirs.filter((d) => !t.some((y) => y.links.some((l) => l.id === d.id) && K.filled(y.meta.threshold_saved_at))); return { done: dirs.length && !miss.length, progress: miss.length ? `no saved test for ${miss.map((d) => d.id).join(', ')}` : `${t.length} test(s), thresholds saved` }; } },
  { id: 'E6', stage: 'explore', title: 'Run the sessions; record results and observed issues', who: 'person', role: 'research owner', needs: ['E5'], prep: { agent: 'researcher', skills: ['usability-test-plan', 'interview-synthesis'] },
    status: (x) => { const t = x.A('TST'); const left = t.filter((y) => !K.filled(y.meta.result)); return { done: t.length && !left.length, progress: `${t.length - left.length} of ${t.length} tests have results` }; },
    ask: 'koru result TST-001 --passed 6 --of 8   (the researcher agent then writes one observed Finding per issue, severity 0 to 4)' },
  { id: 'E7', stage: 'explore', title: 'Direction checker and crit', agent: 'direction-checker', checker: 'explore', needs: ['E4', 'E5'],
    status: (x) => ({ done: reviewCurrent(x, 'explore'), progress: reviewCurrent(x, 'explore') ? 'current' : 'not run on the stage as it stands' }) },
  { id: 'E8', stage: 'explore', title: 'Playback Zero, the choice, signatures, gate', who: 'person', role: 'design lead', needs: ['E6', 'E7'],
    status: (x) => ({ done: gatePassed(x, 'explore'), progress: firstOpenRow(x, 'explore') }),
    ask: 'Hold Playback Zero (koru playback import feedback.json), set chosen: yes on one Direction, sign the Decision, then  ! koru gate explore --pass …' },

  // ---------------- Harden
  { id: 'H1', stage: 'harden', title: 'State matrix by role and hard case', agent: 'quality', skills: ['koru-harden'], writes: ['STA'], needs: [],
    status: (x) => { const r = K.gateReport(x.root, 'harden', x.cards).rows; const a = r.find((y) => /^No blank state cells/.test(y.item)); const b = r.find((y) => /^Every Screen has a state matrix/.test(y.item)); return { done: a && a.ok && b && b.ok, progress: `${a ? a.item : ''}${b && !b.ok ? '; ' + b.item : ''}` }; } },
  { id: 'H2', stage: 'harden', title: 'Copy for every state', agent: 'quality', skills: ['ux-writing'], writes: ['STA'], needs: ['H1'],
    status: (x) => { const s = x.A('STA').filter((c) => !/^n\/?a/i.test(c.meta.resolution || '') && !K.filled(c.sections.design)); return { done: x.A('STA').length && !s.length, progress: `${s.length} state cell(s) without copy` }; } },
  { id: 'H3', stage: 'harden', title: 'Browser audit of every prototype and state', agent: 'quality', skills: ['accessibility-audit'], writes: ['STA'], needs: ['H1'],
    status: (x) => { const r = K.gateReport(x.root, 'harden', x.cards).rows.filter((y) => /^Every prototype audited|^Audits have no blocking/.test(y.item)); return { done: r.length === 2 && r.every((y) => y.ok), progress: r.map((y) => (y.ok ? '✓ ' : '✗ ') + y.item.replace(/:.*?(\(|$)/, ' $1')).join(' · ') }; } },
  { id: 'H4', stage: 'harden', title: 'Heuristic review (expert Findings with severity)', agent: 'quality', skills: ['heuristic-evaluation'], writes: ['FND'], needs: ['H1'], optional: (x) => x.R.key === 'sprint',
    status: (x) => { const f = x.A('FND').filter((c) => c.meta.evidence === 'expert'); return { done: f.length > 0, progress: `${f.length} expert Finding(s)` }; } },
  { id: 'H5', stage: 'harden', title: 'Metrics with baseline, events, owner and guardrail', agent: 'strategist', skills: ['sense-shape-steer'], writes: ['MET'], needs: [],
    status: (x) => { const m = x.A('MET'); return { done: m.length && m.every((c) => !blockers(x, c).length), progress: `${m.length} metric(s)` }; } },
  { id: 'H6', stage: 'harden', title: 'Harden checker', agent: 'harden-checker', checker: 'harden', needs: ['H1', 'H2', 'H3', 'H4', 'H5'],
    status: (x) => ({ done: reviewCurrent(x, 'harden'), progress: reviewCurrent(x, 'harden') ? 'current' : 'not run on the stage as it stands' }) },
  { id: 'H7', stage: 'harden', title: 'Signatures (Screens, state cells, Permissions, Metrics) and gate', who: 'person', role: 'design lead', needs: ['H6'],
    status: (x) => ({ done: gatePassed(x, 'harden'), progress: firstOpenRow(x, 'harden') }),
    ask: 'Sign what the gate lists, then  ! koru gate harden --pass …' },

  // ---------------- Ship
  { id: 'S1', stage: 'ship', title: 'Front-end foundation for the chosen stack', agent: 'engineer', skills: ['koru-ship'], writes: [], needs: [],
    status: (x) => { const dir = x.eng.frontend_dir ? path.join(x.root, x.eng.frontend_dir) : null; const ok = /^(html|none)$/i.test(x.eng.tech_stack || '') || (dir && exists(path.join(dir, 'package.json'))); return { done: !!ok && x.eng.tech_stack !== 'unknown', progress: `stack ${x.eng.tech_stack || 'unknown'}${dir ? ` in ${x.eng.frontend_dir}` : ''}` }; },
    order: 'Ask the person for the tech stack if tech_stack is unknown, then koru scaffold --stack … --dir …, then make lint, typecheck, tests and build pass.' },
  { id: 'S2', stage: 'ship', title: 'Components and data contracts', agent: 'engineer', skills: ['component-spec'], writes: ['CMP', 'API'], needs: ['S1'],
    status: (x) => { const r = K.gateReport(x.root, 'ship', x.cards).rows.find((y) => /^Every Screen has a data contract/.test(y.item)); const newComps = (ds(x).manifest || { components: [] }).components || []; const noSpec = (Array.isArray(newComps) ? newComps : []).filter((c) => /new|snowflake/.test(c.status || '') && !x.A('CMP').some((m) => String(m.meta.ds_component || m.meta.title).includes(c.name))); return { done: (!r || r.ok) && !noSpec.length, progress: `${r ? r.item : 'contracts not required by rigour'}${noSpec.length ? `; components without a spec card: ${noSpec.map((c) => c.name).join(', ')}` : ''}` }; } },
  { id: 'S3', stage: 'ship', title: 'Tickets that pass Definition of Ready, plus instrumentation', agent: 'engineer', skills: ['koru-ship'], writes: ['TKT'], needs: ['S2'],
    status: (x) => { const r = K.gateReport(x.root, 'ship', x.cards).rows.filter((y) => /^Tickets exist|^Every Ticket passes|^No Screen without|^Every Metric has an instrumentation/.test(y.item)); return { done: r.length && r.every((y) => y.ok), progress: r.filter((y) => !y.ok).map((y) => y.item).join('; ') || 'ready' }; } },
  { id: 'S4', stage: 'ship', title: 'Handoff note and QA record', agent: 'engineer', skills: ['handoff-spec', 'design-qa-checklist'], writes: ['HND', 'QAR'], needs: ['S3'],
    status: (x) => { const h = x.A('HND')[0]; return { done: h && !blockers(x, h).length, progress: h ? h.status : 'none' }; } },
  { id: 'S5', stage: 'ship', title: 'Spec checker', agent: 'spec-checker', checker: 'ship', needs: ['S3', 'S4'],
    status: (x) => ({ done: reviewCurrent(x, 'ship'), progress: reviewCurrent(x, 'ship') ? 'current' : 'not run on the stage as it stands' }) },
  { id: 'S6', stage: 'ship', title: 'Engineer signs the Tickets; gate', who: 'person', role: 'engineer', needs: ['S5'],
    status: (x) => ({ done: gatePassed(x, 'ship'), progress: firstOpenRow(x, 'ship') }),
    ask: '! koru sign TKT-… --name "…" --role engineer   then  ! koru gate ship --pass …' },
];

function firstOpenRow(x, stage) {
  const r = K.gateReport(x.root, stage, x.cards).rows.find((y) => !y.ok);
  return r ? `next: ${r.item}` : 'ready to pass';
}

// ---------------------------------------------------------------- the planner

function evaluate(root, opts) {
  opts = opts || {};
  const x = context(root);
  const stage = opts.stage || (x.stage === 'done' ? 'ship' : x.stage);
  const steps = STEPS.filter((s) => s.stage === stage);
  const res = {};
  for (const s of steps) {
    let st;
    try { st = s.status(x) || {}; } catch (e) { st = { done: false, progress: `(could not compute: ${e.message})` }; }
    const optional = s.optional ? !!s.optional(x) : false;
    res[s.id] = { ...s, ...st, done: !!st.done || false, optional };
  }
  const isDone = (id) => !res[id] || res[id].done || res[id].optional;
  for (const s of Object.values(res)) s.ready = !s.done && !s.optional && (s.needs || []).every(isDone);
  const list = Object.values(res);
  return {
    stage, rigour: x.R, client: x.eng.client || '',
    steps: list,
    agents: list.filter((s) => s.ready && s.agent && !s.checker),
    checkers: list.filter((s) => s.ready && s.checker),
    people: list.filter((s) => s.ready && s.who === 'person'),
    blocked: list.filter((s) => !s.done && !s.ready && !s.optional),
    team: (() => { const t = {}; for (const pr of require('./team').people(x.eng)) for (const r of pr.roles) (t[r] = t[r] || []).push(pr.name); return t; })(),
    x,
  };
}

// A self-contained work order for one agent: what to read, which skills, which cards it may write,
// the rules, when it is done, and how to report. The orchestrator passes it to the agent verbatim.
function workOrder(root, stepId, pkgKey) {
  const ev = evaluate(root, { stage: (STEPS.find((s) => s.id === stepId) || {}).stage });
  const s = ev.steps.find((y) => y.id === stepId);
  if (!s) throw new Error(`No step ${stepId}. Run koru next.`);
  const agent = s.agent || (s.prep && s.prep.agent);
  const a = M.AGENTS[agent] || {};
  const skills = s.skills || (s.prep && s.prep.skills) || [];
  const pkg = (s.packages || []).find((p) => p.key === pkgKey) || null;
  const lines = [];
  lines.push(`WORK ORDER ${s.id}${pkg ? ` · ${pkg.key}` : ''} · ${s.title}`);
  lines.push(`Project: ${ev.client} · stage ${s.stage} · rigour ${ev.rigour.key} (${ev.rigour.note})`);
  lines.push(`Working folder: ${root}  (cd here before any command; paste this path exactly)`);
  lines.push(`Agent: ${agent} (${a.label || ''}). Use these skills, in Koru mode: ${skills.join(', ') || '(none)'}.`);
  if (s.checker) {
    lines.push('', 'You are an independent checker. Read the stage pack first: koru pack ' + s.checker + ' (then open the cards and sample the sources it lists).');
    lines.push('Output only findings, one per line, in exactly this form, every line ending "— open":');
    lines.push('  1. [BLOCKER|MAJOR|MINOR|NOTE][RULE-ID][CARD-ID] what is wrong · evidence: the quote, count or field · confidence: high|medium|low — open');
    lines.push('Use the rule ids from your agent definition. Facts first, then judgements. One finding per problem per card; do not repeat a finding for every card it touches, list the cards in one line.');
    lines.push('If nothing is wrong: 1. [NOTE][NONE][none] No findings — fixed');
  } else {
    lines.push('', `You may write these card types only: ${(s.writes || a.writes || []).join(', ') || '(none: report in text)'}. The hook refuses any other type for this agent, and refuses ux/ files in a Koru project.`);
    if (pkg) lines.push(`This package: ${pkg.note}`);
    else if (s.order) lines.push(`Task: ${s.order}`);
    for (const sk of skills) if (M.METHODS[sk]) lines.push(`- ${sk}: ${M.METHODS[sk].how}`);
    lines.push('', 'Rules: create cards with koru new TYPE "title" --link "supports ID: why"; fill the fixed shape with Edit; run koru check on every card you touched and fix every ✗. Never sign, never set confidence, never write an Insight, never pass a gate. Quotes are word for word.');
  }
  lines.push('', `Done when: ${s.title.toLowerCase()} (${s.progress || ''}) is complete as koru next computes it.`);
  lines.push('Report back in at most 12 lines: the card ids you created or changed, what koru check still flags, and questions only a person can answer.');
  return lines.join('\n');
}

function render(ev, opts) {
  opts = opts || {};
  const out = [];
  const mark = (s) => (s.done ? '✓' : s.optional ? '–' : s.ready ? (s.who === 'person' ? '◆' : '▶') : '○');
  out.push(`Koru plan · ${ev.client} · ${ev.stage} · rigour ${ev.rigour.label}`);
  out.push(`  ${ev.rigour.note}`);
  out.push('');
  for (const s of ev.steps) {
    const who = s.who === 'person' ? `person (${s.role})` : s.agent;
    out.push(`  ${mark(s)} ${s.id.padEnd(4)} ${s.title}  · ${who}${s.progress ? `  · ${s.progress}` : ''}`);
    if (opts.all && s.packages && s.packages.length && !s.done) for (const p of s.packages.slice(0, 8)) out.push(`         - ${p.key}`);
  }
  out.push('');
  if (ev.agents.length || ev.checkers.length) {
    out.push('Ready for agents (the orchestrator dispatches these; packages of one step run in parallel):');
    for (const s of [...ev.agents, ...ev.checkers]) {
      const n = (s.packages || []).length;
      out.push(`  ▶ ${s.id} → ${s.agent}${n ? ` · ${n} package(s)` : ''}   koru next --order ${s.id}${n ? ` --package "${s.packages[0].key}"` : ''}`);
    }
  }
  if (ev.people.length) {
    out.push('Waiting on people:');
    for (const s of ev.people) out.push(`  ◆ ${s.id} ${s.title} (${s.role}${ev.team[s.role] ? `: ${ev.team[s.role].join(', ')}` : ''})${s.ask ? `\n      ${s.ask}` : ''}`);
  }
  if (!ev.agents.length && !ev.checkers.length && !ev.people.length) out.push(ev.steps.every((s) => s.done || s.optional) ? `Every ${ev.stage} step is done.` : 'Nothing is ready: the open steps wait on earlier ones (○).');
  out.push('', 'Legend: ✓ done · ▶ ready for an agent · ◆ waiting on a person · ○ waiting on an earlier step · – skipped at this rigour');
  return out.join('\n');
}

function cmdNext(root, pos, opt) {
  if (opt.order) {
    const text = workOrder(root, String(opt.order).toUpperCase(), opt.package === true ? null : opt.package);
    K.appendJsonl(K.stateFile(root, 'runs.jsonl'), { at: K.now(), step: String(opt.order).toUpperCase(), package: opt.package || '', event: 'order' });
    return console.log(text);
  }
  const ev = evaluate(root, { stage: opt.stage });
  if (opt.json) {
    const slim = (s) => ({ id: s.id, title: s.title, agent: s.agent || null, who: s.who || 'agent', role: s.role || null, skills: s.skills || [], writes: s.writes || [], checker: s.checker || null, done: s.done, ready: s.ready, optional: s.optional, progress: s.progress || '', packages: (s.packages || []).map((p) => p.key), ask: s.ask || null });
    return console.log(JSON.stringify({ stage: ev.stage, rigour: ev.rigour.key, steps: ev.steps.map(slim), dispatch: [...ev.agents, ...ev.checkers].map(slim), people: ev.people.map(slim), team: ev.team }, null, 2));
  }
  console.log(render(ev, { all: !!opt.all }));
}

function cmdPlan(root, pos, opt) {
  for (const st of K.STAGES) {
    const ev = evaluate(root, { stage: st });
    console.log(render(ev, { all: false }).split('\nReady for agents')[0].split('\nWaiting on people')[0].split('\nLegend')[0]);
  }
}

module.exports = { STEPS, evaluate, workOrder, render, cmdNext, cmdPlan, context };
