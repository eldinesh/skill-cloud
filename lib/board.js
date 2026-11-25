'use strict';
// Generates everything people look at from the graph: the board, the decision log, the trace,
// the client page and the Claude project knowledge (finals only). Never edit these by hand.

const fs = require('fs');
const path = require('path');
const K = require('./core');

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function flagsFor(c, cards, wb, prov) {
  const f = [];
  const lp = K.linkProblems(c, cards);
  if (lp.some((p) => p.rule === 'stale')) f.push(['stale', 'Stale: a source changed']);
  if (wb.some((w) => w.id === c.id)) f.push(['writeback', 'Writeback from a decision']);
  if (lp.some((p) => p.rule === 'assumption') || c.type === 'ASM') f.push(['assumption', 'Rests on an assumption']);
  if (prov[c.id]) f.push(['ai', 'Claude drafted or edited this']);
  return f;
}

function chain(cards, id, depth = 0, seen = new Set()) {
  const c = cards[id];
  if (!c || seen.has(id) || depth > 12) return [];
  seen.add(id);
  const ups = c.links.filter((l) => !l.bad && !['affects', 'contradicts', 'supersedes'].includes(l.kind));
  return [{ id, depth, c }, ...ups.flatMap((l) => chain(cards, l.id, depth + 1, seen))];
}

const CSS = `
:root{--bg:#f6f7f9;--panel:#fff;--ink:#16202a;--muted:#5b6672;--line:#dfe3e8;--accent:#1f6f8b;--human:#a8336a;--ok:#2e7d4f;--warn:#b26b00;--bad:#b3261e;--chip:#eef2f5}
@media (prefers-color-scheme:dark){:root{--bg:#0f1418;--panel:#172027;--ink:#e6edf3;--muted:#9aa7b3;--line:#2a3640;--accent:#5fb3cf;--human:#e07aa9;--ok:#5cc28a;--warn:#e0a040;--bad:#f07167;--chip:#22303a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif}
header{padding:20px 24px 8px}h1{font-size:20px;margin:0 0 4px}h2{font-size:15px;margin:22px 0 10px}.muted{color:var(--muted)}
main{padding:0 24px 40px}.tabs{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0}.tabs button{border:1px solid var(--line);background:var(--panel);color:var(--ink);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit}
.tabs button[aria-selected=true]{background:var(--accent);border-color:var(--accent);color:#fff}section[hidden]{display:none}
.gates{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.gate,.stat{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.gate b{display:block}.ok{color:var(--ok)}.bad{color:var(--bad)}.warn{color:var(--warn)}
.cols{display:grid;grid-template-columns:repeat(4,minmax(220px,1fr));gap:12px;overflow-x:auto}.col{background:transparent}.col h3{font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin:6px 0}
.card{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--line);border-radius:8px;padding:8px 10px;margin-bottom:8px}
.card.final{border-left-color:var(--ok)}.card.review{border-left-color:var(--warn)}.card.superseded{opacity:.55}
.id{font:600 11px ui-monospace,Menlo,monospace;color:var(--accent)}.t{display:block;margin:2px 0 4px}
.chip{display:inline-block;font-size:11px;background:var(--chip);border-radius:999px;padding:1px 7px;margin:2px 3px 0 0}
.chip.stale,.chip.writeback{background:var(--bad);color:#fff}.chip.assumption{background:var(--warn);color:#fff}.chip.ai{background:var(--accent);color:#fff}
table{border-collapse:collapse;width:100%;background:var(--panel);border:1px solid var(--line);border-radius:8px;overflow:hidden}th,td{text-align:left;padding:7px 9px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;color:var(--muted)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.stat b{display:block;font-size:12px;color:var(--muted);font-weight:500}
.trace{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:13px}
@media (max-width:700px){header,main{padding-left:16px;padding-right:16px}.cols{grid-template-columns:1fr}}
`;

const JS = `document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));document.querySelectorAll('main>section').forEach(s=>s.hidden=s.id!==b.dataset.t)});`;

function generate(root, { health }) {
  const p = K.paths(root);
  const cards = K.loadCards(root);
  const eng = K.readEngagement(root);
  const wb = K.writebacks(root, cards);
  const prov = K.provenance(root);
  const stage = K.currentStage(root, cards);
  const out = [];
  fs.mkdirSync(p.generated, { recursive: true });

  // ---- board
  const gates = K.STAGES.map((s) => {
    const r = K.gateReport(root, s, cards);
    const done = r.rows.filter((x) => x.ok).length;
    return `<div class="gate"><b>${K.GATES[s].label}${s === stage ? ' · now' : ''}</b>${r.passed ? `<span class="ok">Passed · ${esc(r.passed.by)}</span>` : `<span class="${r.ok ? 'ok' : 'muted'}">${done} of ${r.rows.length} exit items met</span>`}
      <div class="muted">${r.rows.filter((x) => !x.ok).slice(0, 2).map((x) => '✗ ' + esc(x.item)).join('<br>')}</div></div>`;
  }).join('');
  const cardHtml = (c) => `<div class="card ${c.status}"><span class="id">${c.id} · v${c.version}</span><span class="t">${esc(c.meta.title)}</span>
    <span class="chip">${c.status}</span>${c.meta.confidence ? `<span class="chip">${esc(c.meta.confidence)} confidence</span>` : ''}${flagsFor(c, cards, wb, prov).map(([k, t]) => `<span class="chip ${k}" title="${esc(t)}">${k}</span>`).join('')}
    <div class="muted">${c.status === 'final' ? 'Signed ' + esc(c.meta.signed_by) : 'Signs: ' + esc(K.TYPES[c.type] ? K.TYPES[c.type].signer : '')}</div></div>`;
  const cols = K.STAGES.map((s) => {
    const cs = Object.values(cards).filter((c) => (c.meta.stage || (K.TYPES[c.type] || {}).stage) === s && !['REQ', 'DEC', 'REV'].includes(c.type));
    return `<div class="col"><h3>${K.GATES[s].label} (${cs.length})</h3>${cs.map(cardHtml).join('') || '<p class="muted">Nothing yet.</p>'}</div>`;
  }).join('');
  const decs = Object.values(cards).filter((c) => c.type === 'DEC');
  const decRows = decs.map((d) => `<tr><td class="id">${d.id}</td><td>${esc(d.meta.title)}</td><td>${esc(d.meta.outcome || d.sections.outcome || '')}</td><td>${esc(d.meta.approver)}</td><td>${d.status}${d.meta.superseded_by ? ' by ' + d.meta.superseded_by : ''}</td><td>${d.links.filter((l) => l.kind === 'affects').map((l) => l.id).join(', ')}</td></tr>`).join('');
  const inbox = Object.values(cards).filter((c) => ['REQ', 'IDE', 'ASM', 'CON'].includes(c.type) && c.status !== 'final');
  const traces = K.active(cards, 'TKT').concat(K.active(cards, 'TKT').length ? [] : K.active(cards, 'DIR')).map((t) => `<div class="trace">${chain(cards, t.id).map((x) => `${'&nbsp;'.repeat(x.depth * 4)}<span class="id">${x.id}</span> ${esc(x.c.meta.title)} <span class="muted">(${x.c.status})</span>`).join('<br>')}</div>`).join('');
  const h = health(root, cards);
  const stats = Object.entries(h).map(([k, v]) => `<div class="stat"><b>${k.replace(/_/g, ' ')}</b>${esc(v)}</div>`).join('');
  const reviews = K.active(cards, 'REV').map((r) => `<tr><td class="id">${r.id}</td><td>${esc(r.meta.gate)}</td><td>${esc(r.meta.checker)}</td><td>${esc(r.meta.catches)}</td><td>${r.status}</td></tr>`).join('');

  const board = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Koru board · ${esc(eng.client)}</title><style>${CSS}</style></head><body>
<header><h1>${esc(eng.client || 'Koru project')} · Koru board</h1>
<div class="muted">Stage: ${stage} · AI tier ${esc(eng.ai_tier)} · data ${esc(eng.data_class)} · design system ${esc(eng.design_system)} · AI in product ${esc(eng.ai_in_product)} · deliverables ${esc([].concat(eng.deliverables || []).join(', '))} · generated ${K.now()}</div>
<nav class="tabs" role="tablist"><button data-t="stages" aria-selected="true">Stages</button><button data-t="inbox" aria-selected="false">Inbox (${inbox.length})</button><button data-t="decisions" aria-selected="false">Decisions (${decs.length})</button><button data-t="trace" aria-selected="false">Trace</button><button data-t="health" aria-selected="false">Health</button></nav></header>
<main><section id="stages"><div class="gates">${gates}</div><h2>Cards</h2><div class="cols">${cols}</div></section>
<section id="inbox" hidden><h2>Client requests, ideas, assumptions and conflicts</h2>${inbox.map(cardHtml).join('') || '<p class="muted">Inbox empty.</p>'}</section>
<section id="decisions" hidden><h2>Decision log</h2><table><tr><th>ID</th><th>Question</th><th>Outcome</th><th>Approver</th><th>Status</th><th>Affects</th></tr>${decRows || '<tr><td colspan="6" class="muted">No decisions yet.</td></tr>'}</table></section>
<section id="trace" hidden><h2>From each ticket back to the evidence</h2>${traces || '<p class="muted">Nothing to trace yet.</p>'}</section>
<section id="health" hidden><h2>Board health</h2><div class="stats">${stats}</div><h2>Checker reviews</h2><table><tr><th>ID</th><th>Gate</th><th>Checker</th><th>Catches</th><th>Status</th></tr>${reviews || '<tr><td colspan="5" class="muted">No reviews yet.</td></tr>'}</table></section></main>
<script>${JS}</script></body></html>`;
  const boardFile = path.join(p.generated, 'board.html');
  fs.writeFileSync(boardFile, board);
  out.push(boardFile);

  // ---- decision log (markdown)
  const dl = ['# Decision log', '', `Generated ${K.now()} from koru/cards. Do not edit.`, '', '| ID | Question | Outcome | Approver | Status | Affects |', '| --- | --- | --- | --- | --- | --- |']
    .concat(decs.map((d) => `| ${d.id} | ${d.meta.title} | ${(d.meta.outcome || '').replace(/\|/g, '/')} | ${d.meta.approver} | ${d.status}${d.meta.superseded_by ? ' by ' + d.meta.superseded_by : ''} | ${d.links.filter((l) => l.kind === 'affects').map((l) => l.id).join(', ')} |`));
  fs.writeFileSync(path.join(p.generated, 'decisions.md'), dl.join('\n') + '\n');
  out.push(path.join(p.generated, 'decisions.md'));

  // ---- trace (markdown)
  const tr = ['# Trace', ''];
  for (const t of K.active(cards, 'TKT')) { for (const x of chain(cards, t.id)) tr.push(`${'  '.repeat(x.depth)}- ${x.id} ${x.c.meta.title} (${x.c.status})`); tr.push(''); }
  fs.writeFileSync(path.join(p.generated, 'trace.md'), tr.join('\n'));
  out.push(path.join(p.generated, 'trace.md'));

  // ---- client page: finals only, marked client: yes, plus the AI-use note
  const clientCards = Object.values(cards).filter((c) => c.status === 'final' && (c.meta.client === 'yes' || ['BRF', 'PRB', 'MET'].includes(c.type) || (c.type === 'DIR' && c.meta.chosen === 'yes') || (c.type === 'DEC' && K.filled(c.meta.client_commitment))));
  const aiTouched = clientCards.filter((c) => prov[c.id]);
  const md = (t) => esc(t).replace(/^## (.*)$/gm, '<h4>$1</h4>').replace(/\n\n/g, '<br><br>');
  const clientHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(eng.client)} · Koru</title><style>${CSS}.doc{max-width:760px;margin:auto}</style></head><body><main class="doc"><header><h1>${esc(eng.client)}</h1><div class="muted">Signed work from Koru · ${K.today()}</div></header>
${clientCards.map((c) => `<div class="card final"><span class="id">${c.id}</span><span class="t"><b>${esc(c.meta.title)}</b></span>${md(c.body.replace(/^# .*\n/, ''))}<div class="muted">Signed by ${esc(c.meta.signed_by)}</div></div>`).join('') || '<p class="muted">Nothing signed for the client yet.</p>'}
<h2>How AI was used</h2><p>${aiTouched.length ? `Claude drafted or edited ${aiTouched.length} of these ${clientCards.length} items (${aiTouched.map((c) => c.id).join(', ')}). A named person at Koru reviewed and signed every item.` : 'No AI-drafted items on this page.'}</p></main></body></html>`;
  fs.mkdirSync(path.join(p.generated, 'client'), { recursive: true });
  fs.writeFileSync(path.join(p.generated, 'client', 'index.html'), clientHtml);
  out.push(path.join(p.generated, 'client', 'index.html'));

  // ---- Claude project knowledge: final cards only
  const kd = path.join(p.generated, 'knowledge');
  fs.rmSync(kd, { recursive: true, force: true });
  fs.mkdirSync(kd, { recursive: true });
  const finals = Object.values(cards).filter((c) => c.status === 'final');
  for (const c of finals) fs.copyFileSync(c.file, path.join(kd, path.basename(c.file)));
  fs.writeFileSync(path.join(kd, 'README.md'), `Final, signed cards only (${finals.length}). Upload these to Claude project knowledge. Drafts never go here.\n`);
  out.push(kd);
  return out;
}

module.exports = { generate };
