'use strict';
// The live board: every playbook step is a ticket. Agents pick tickets up, the board shows them
// working and what they write, people see what they owe, and a person can queue a ticket for the
// orchestrator to run next. Nothing here is typed by hand: tickets come from the planner (lib/plan.js),
// "working" comes from the hooks that see the orchestrator start and finish each agent, and the
// activity feed comes from the provenance every card write already leaves.
//
// State: koru/state/runs.jsonl holds order, start, launched (a background agent's id), finish, queued and unqueued events.

const fs = require('fs');
const path = require('path');
const K = require('./core');

const STAGES = ['frame', 'explore', 'harden', 'ship'];
const COLUMNS = [
  ['backlog', 'Waiting on earlier steps'],
  ['ready', 'Ready for an agent'],
  ['queued', 'Up next'],
  ['working', 'Agents working'],
  ['people', 'Needs a person'],
  ['done', 'Done'],
];
const STALE_MS = 3 * 60 * 60 * 1000; // a start with no finish for three hours is treated as abandoned

const short = (a) => String(a || 'main').split(':').pop();
const keyOf = (step, pkg) => `${String(step || '').toUpperCase()}${pkg ? ` · ${pkg}` : ''}`;
const runsFile = (root) => K.stateFile(root, 'runs.jsonl');

function events(root) { return K.readJsonl(runsFile(root)); }

// Open starts, queued keys and finishes, folded from the event log in order.
function fold(evs, now = Date.now()) {
  const open = new Map(); // key -> start event
  const queued = new Map(); // key -> queued event
  const finished = new Map(); // key -> last finish event
  for (const e of evs) {
    const k = keyOf(e.step, e.package);
    if (e.event === 'queued') queued.set(k, e);
    else if (e.event === 'unqueued') queued.delete(k);
    else if (e.event === 'start') { open.set(k, { ...e }); queued.delete(k); }
    else if (e.event === 'launched') { const s = [...open.values()].find((x) => x.tool_use_id === e.tool_use_id); if (s) s.agent_id = e.agent_id; }
    else if (e.event === 'finish') {
      // A finish closes the start with the same tool call or background agent id, else the latest open start of that key or agent.
      let hit = [...open.entries()].find(([, s]) => (e.tool_use_id && s.tool_use_id === e.tool_use_id) || (e.agent_id && s.agent_id === e.agent_id));
      if (!hit && e.step) hit = open.has(k) ? [k, open.get(k)] : null;
      if (!hit && e.agent) hit = [...open.entries()].reverse().find(([, s]) => s.agent === e.agent) || null;
      if (hit) { open.delete(hit[0]); finished.set(hit[0], { ...e, started: hit[1].at }); }
    }
  }
  for (const [k, s] of open) if (now - Date.parse(s.at) > STALE_MS) open.delete(k);
  return { open, queued, finished };
}

function snapshot(root) {
  const P = require('./plan');
  const M = require('./methods');
  const evs = events(root);
  const { open, queued, finished } = fold(evs);
  const cards = K.loadCards(root);
  const prov = [];
  for (const [id, es] of Object.entries(K.provenance(root))) for (const e of es) prov.push({ at: e.at, id, agent: short(e.agent), tool: e.tool || '' });
  prov.sort((a, b) => String(b.at).localeCompare(String(a.at)));

  const tickets = [];
  let current = null;
  let team = {};
  let rigour = '';
  for (const stage of STAGES) {
    const ev = P.evaluate(root, { stage });
    current = current || ev.x.stage;
    // A later stage's steps wait for this stage's gate, even when their own inputs exist.
    const ahead = STAGES.indexOf(stage) > STAGES.indexOf(current);
    team = ev.team || team;
    rigour = ev.rigour.label || ev.rigour.key;
    for (const s of ev.steps) {
      const base = { step: s.id, stage, title: s.title, progress: s.progress || '', skills: s.skills || [], writes: s.writes || [], optional: !!s.optional };
      if (s.who === 'person') {
        const names = team[s.role] || [];
        tickets.push({ ...base, key: s.id, kind: 'person', role: s.role, people: names, ask: s.ask || '', column: s.done ? 'done' : s.ready && !ahead ? 'people' : 'backlog' });
        continue;
      }
      const agent = s.agent;
      const kind = s.checker ? 'checker' : 'agent';
      const label = (M.AGENTS[agent] || {}).label || agent;
      // A step splits into one ticket per package once agents can pick it up; until then it is one ticket.
      const split = !s.done && (s.ready && !ahead || [...open.keys(), ...queued.keys()].some((k) => k.startsWith(`${s.id} · `)));
      const pkgs = split && (s.packages || []).length ? s.packages : [null];
      for (const p of pkgs) {
        const key = keyOf(s.id, p && p.key);
        const run = open.get(key) || (!p ? ([...open.entries()].find(([k]) => k.startsWith(`${s.id} · `)) || [])[1] : null);
        const t = { ...base, key, kind, agent, label, package: p ? p.key : '', note: p ? p.note : '', packages: !p && !s.done ? (s.packages || []).length : 0 };
        if (s.done) {
          const f = finished.get(key) || [...finished.entries()].reverse().find(([k]) => k === s.id || k.startsWith(`${s.id} · `));
          t.column = 'done';
          if (f) { const fe = Array.isArray(f) ? f[1] : f; t.finishedAt = fe.at; t.startedAt = fe.started; }
        } else if (run) {
          t.column = 'working'; t.startedAt = run.at; t.agentId = run.agent_id || '';
          t.wrote = [...new Set(prov.filter((e) => e.agent === agent && e.at >= run.at).map((e) => e.id))];
        } else if (queued.has(key) || (!p && queued.has(s.id))) {
          t.column = 'queued'; t.queuedBy = (queued.get(key) || queued.get(s.id)).by || '';
        } else t.column = s.ready && !ahead ? 'ready' : 'backlog';
        tickets.push(t);
      }
    }
  }
  // Agents that ran outside a work order (an ad hoc Agent call) still show as working.
  // So do agents still finishing a package of a step whose done test has already passed.
  for (const [k, s] of open) {
    if (tickets.some((t) => t.key === k)) continue;
    const step = P.STEPS.find((x) => x.id === s.step);
    const agent = short(s.agent);
    tickets.push({ key: k || `${agent} (ad hoc)`, step: s.step || '', stage: step ? step.stage : current, title: step ? step.title : s.description || 'Ad hoc agent run', package: s.package || '', note: s.description || '', kind: (M.AGENTS[agent] || {}).checker ? 'checker' : 'agent', agent, label: (M.AGENTS[agent] || {}).label || agent, column: 'working', startedAt: s.at, skills: [], writes: [], wrote: [...new Set(prov.filter((e) => e.agent === agent && e.at >= s.at).map((e) => e.id))] });
  }

  const title = (id) => (cards[id] ? cards[id].meta.title : '');
  const feed = prov.slice(0, 60).map((e) => ({ at: e.at, kind: 'write', agent: e.agent, id: e.id, title: title(e.id), tool: e.tool }))
    .concat(evs.filter((e) => ['start', 'finish', 'queued'].includes(e.event)).slice(-60).map((e) => ({ at: e.at, kind: e.event, agent: short(e.agent), step: keyOf(e.step, e.package), by: e.by || '', outcome: e.outcome || '' })))
    .sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 80);
  const eng = K.readEngagement(root);
  const agents = Object.entries(M.AGENTS).map(([k, a]) => ({ key: k, label: a.label, checker: !!a.checker, skills: a.skills || [], working: tickets.filter((t) => t.column === 'working' && t.agent === k).map((t) => t.key) }));
  return { client: eng.client || 'Koru project', stage: current, rigour, now: K.now(), columns: COLUMNS, tickets, feed, team, agents };
}

// ---------------------------------------------------------------- hooks: the orchestrator starts and finishes agents

function workOrderOf(prompt) {
  // The planner's first line: WORK ORDER E3 [DIR-001] · Screens and prototypes …
  const m = String(prompt || '').match(/WORK ORDER\s+([A-Z]\d{1,2})(?:\s+\[([^\]\n]+)\])?/);
  return m ? { step: m[1], package: (m[2] || '').trim() } : { step: '', package: '' };
}

function hookAgent(root, payload, phase) {
  const input = payload.tool_input || {};
  const agent = input.subagent_type || payload.agent_type || '';
  if (phase === 'pre') {
    if (!agent) return;
    const wo = workOrderOf(input.prompt);
    K.appendJsonl(runsFile(root), { at: K.now(), event: 'start', step: wo.step, package: wo.package, agent: short(agent), tool_use_id: payload.tool_use_id || '', description: input.description || '', background: !!input.run_in_background });
    return;
  }
  if (phase === 'post') {
    if (!agent) return;
    const resp = typeof payload.tool_response === 'string' ? payload.tool_response : JSON.stringify(payload.tool_response || '');
    // A background agent returns at once; its finish comes from SubagentStop instead, matched by the agent id it was given.
    if (input.run_in_background || /running in (the )?background|async (agent )?launched|async_launched|"status":"async/i.test(resp.slice(0, 400))) {
      const id = (resp.match(/agent_?id"?\s*[:=]\s*"?([A-Za-z0-9_-]{6,})/i) || [])[1];
      if (id) K.appendJsonl(runsFile(root), { at: K.now(), event: 'launched', tool_use_id: payload.tool_use_id || '', agent_id: id });
      return;
    }
    const wo = workOrderOf(input.prompt);
    K.appendJsonl(runsFile(root), { at: K.now(), event: 'finish', step: wo.step, package: wo.package, agent: short(agent), tool_use_id: payload.tool_use_id || '', outcome: /refus|denied|blocked/i.test(resp.slice(0, 2000)) ? 'reported a refusal' : 'reported' });
    return;
  }
  if (phase === 'stop') {
    if (!payload.agent_type && !payload.agent_id) return;
    K.appendJsonl(runsFile(root), { at: K.now(), event: 'finish', agent: short(payload.agent_type || ''), agent_id: payload.agent_id || '', outcome: 'stopped' });
  }
}

// ---------------------------------------------------------------- queue: a person puts a ticket up next

function queue(root, step, pkg, by) {
  const P = require('./plan');
  step = String(step || '').toUpperCase();
  const s = P.STEPS.find((x) => x.id === step);
  if (!s) throw new Error(`No step ${step}. See koru plan.`);
  if (s.who === 'person') throw new Error(`${step} is a person's step: ${s.title}. Nobody can run it for them.`);
  const ev = P.evaluate(root, { stage: s.stage }).steps.find((x) => x.id === step);
  if (ev.done) throw new Error(`${step} is already done.`);
  if (!ev.ready) throw new Error(`${step} is waiting on earlier steps (${(s.needs || []).join(', ')}).`);
  const cur = P.evaluate(root, {}).x.stage;
  if (STAGES.indexOf(s.stage) > STAGES.indexOf(cur)) throw new Error(`${step} belongs to ${s.stage}, and the project is in ${cur}. Pass the ${cur} gate first.`);
  if (pkg && !(ev.packages || []).some((p) => p.key === pkg)) throw new Error(`${step} has no open package "${pkg}".`);
  K.appendJsonl(runsFile(root), { at: K.now(), event: 'queued', step, package: pkg || '', by: by || '' });
  return keyOf(step, pkg);
}

function queuedNow(root) {
  const { queued } = fold(events(root));
  return [...queued.values()].map((e) => ({ step: e.step, package: e.package || '', by: e.by || '', at: e.at }));
}

function cmdQueue(root, pos, opt) {
  const by = opt.name && opt.name !== true ? opt.name : (() => { try { return require('child_process').execSync('git config user.name', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch (e) { return ''; } })();
  if (opt.clear) {
    for (const q of queuedNow(root)) K.appendJsonl(runsFile(root), { at: K.now(), event: 'unqueued', step: q.step, package: q.package, by });
    return console.log('Queue cleared.');
  }
  if (opt.wait) {
    // The orchestrator's watch mode: block until a person queues a ticket on the board, then print it.
    const until = Date.now() + Math.min(Number(opt.timeout || 540), 590) * 1000;
    const tick = () => {
      const q = queuedNow(root);
      if (q.length) { console.log(JSON.stringify(q, null, 2)); process.exit(0); }
      if (Date.now() > until) { console.log('[]'); process.exit(2); }
      setTimeout(tick, 1500);
    };
    return tick();
  }
  if (!pos[0]) {
    const q = queuedNow(root);
    return console.log(q.length ? q.map((x) => `${keyOf(x.step, x.package)}${x.by ? ` (queued by ${x.by})` : ''}`).join('\n') : 'Nothing queued. Queue a ticket on the live board, or: koru queue F5 [--package KEY]');
  }
  try { console.log(`Queued ${queue(root, pos[0], opt.package && opt.package !== true ? opt.package : '', by)}. /koru:run picks it up first.`); } catch (e) { console.error(e.message); process.exit(1); }
}

// ---------------------------------------------------------------- page

function page(root) {
  const data = snapshot(root);
  const app = fs.readFileSync(path.join(__dirname, 'live-app.html'), 'utf8');
  return app.replace('__TITLE__', `${String(data.client).replace(/</g, '&lt;')} · Koru live board`).replace('/*__DATA__*/null', JSON.stringify(data).replace(/</g, '\\u003c'));
}

module.exports = { snapshot, hookAgent, queue, queuedNow, cmdQueue, page, fold, workOrderOf, COLUMNS };
