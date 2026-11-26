'use strict';
// Koru for a team: git as the substrate, people checked against the engagement's roles,
// signatures that prove what was signed, ids that survive two people working at once, and the
// generated project context every SkillCloud method skill reads.

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const K = require('./core');

// ---------------------------------------------------------------- git

function git(root, args) {
  try {
    const r = cp.spawnSync('git', args, { cwd: root, encoding: 'utf8', timeout: 5000 });
    return r.status === 0 ? String(r.stdout).trim() : '';
  } catch { return ''; }
}
const inGit = (root) => git(root, ['rev-parse', '--is-inside-work-tree']) === 'true';

// ---------------------------------------------------------------- people and roles

// engagement.md lists people either way:
//   roles:                         people:
//     - research owner: Tariq Bose   - Tariq Bose <tariq@example.com>: research owner, designer
function people(eng) {
  const out = new Map();
  const add = (name, email, role) => {
    name = String(name || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
    if (!name) return;
    const key = name.toLowerCase();
    const p = out.get(key) || { name, email: '', roles: [] };
    if (email) p.email = email.toLowerCase();
    for (const r of [].concat(role || [])) if (r && !p.roles.includes(r)) p.roles.push(r);
    out.set(key, p);
  };
  for (const line of [].concat(eng.roles || [])) {
    const m = String(line).match(/^\s*([^:]+?)\s*:\s*(.+?)\s*$/);
    if (m) add(m[2], '', m[1].toLowerCase());
  }
  for (const line of [].concat(eng.people || [])) {
    const m = String(line).match(/^\s*([^<:]+?)\s*(?:<([^>]+)>)?\s*:\s*(.+?)\s*$/);
    if (m) add(m[1], m[2], m[3].split(/\s*,\s*/).map((r) => r.toLowerCase()));
  }
  return [...out.values()];
}

// Who is at the keyboard: the git identity of this checkout (KORU_SIGNER_* override it in tests).
function identity(root) {
  return {
    email: String(process.env.KORU_SIGNER_EMAIL || git(root, ['config', 'user.email']) || '').toLowerCase(),
    name: process.env.KORU_SIGNER_NAME || git(root, ['config', 'user.name']) || '',
  };
}

// Checks a signature against the people list. Returns { ok, why, person, email, warn }.
function checkSigner(root, name, role, opts) {
  opts = opts || {};
  const eng = K.readEngagement(root);
  const ppl = people(eng);
  const me = identity(root);
  if (!ppl.length) return { ok: true, email: me.email, warn: 'No people or roles recorded in koru/engagement.md, so this signature is not checked against a role. Add them under roles: or people:.' };
  let person = null;
  if (me.email && ppl.some((p) => p.email)) {
    person = ppl.find((p) => p.email === me.email);
    if (!person) return { ok: false, why: `This checkout is signed in to git as ${me.email}, who is not on the engagement's people list. Add them to people: in koru/engagement.md (a person edits it), or sign from your own checkout.` };
    if (name && person.name.toLowerCase() !== String(name).toLowerCase()) return { ok: false, why: `Git says you are ${person.name} (${me.email}); you cannot sign as ${name}.` };
  } else {
    person = ppl.find((p) => p.name.toLowerCase() === String(name || '').toLowerCase());
    if (!person) return { ok: false, why: `${name} is not on the engagement's roles list (${ppl.map((p) => p.name).join(', ')}).` };
  }
  if (role && !opts.anyRole && !person.roles.includes(String(role).toLowerCase())) return { ok: false, why: `${person.name} holds ${person.roles.join(', ') || 'no role'} on this engagement, not ${role}.` };
  return { ok: true, person, email: me.email };
}

// The signature: the content hash of what was signed, the commit it was signed on, and who.
function signature(root, card, email, name) {
  const commit = inGit(root) ? git(root, ['rev-parse', '--short', 'HEAD']) || 'uncommitted' : 'nogit';
  return `${K.contentHash(card)}@${commit} ${email || String(name || '').replace(/\s+/g, '_')}`;
}

// ---------------------------------------------------------------- human edit ratio

function words(text) {
  const { meta, body } = K.splitCard(text);
  const keep = Object.keys(meta).filter((k) => !/^(status|version|signed_by|signed_at|cosigned_by|cosigned_at|reviewers|updated|created|uid|links|signature|signed_email|signed_commit|human_edit|owner|author)$/.test(k)).sort().map((k) => `${k} ${[].concat(meta[k]).join(' ')}`);
  return (keep.join('\n') + '\n' + K.splitCard(text).body.replace(/<!--[\s\S]*?-->/g, '')).split(/\s+/).filter(Boolean);
}
function lcs(a, b) {
  if (a.length > 4000 || b.length > 4000) { a = a.slice(0, 4000); b = b.slice(0, 4000); }
  let prev = new Uint16Array(b.length + 1);
  let cur = new Uint16Array(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    [prev, cur] = [cur, prev];
  }
  return prev[b.length];
}
// Share of the signed card a person changed after the AI's last draft (0 = signed as drafted).
function humanEdit(root, card) {
  const f = path.join(K.paths(root).state, 'drafts', `${card.id}.v${card.version}.md`);
  if (!fs.existsSync(f)) return null;
  const a = words(fs.readFileSync(f, 'utf8'));
  const b = words(card.text);
  if (!a.length && !b.length) return 0;
  const common = lcs(a, b);
  return Math.round((1 - (2 * common) / (a.length + b.length)) * 100) / 100;
}
const bucket = (r) => (r === null || r === undefined ? 'person' : r <= 0.02 ? 'unchanged' : r <= 0.2 ? 'light' : 'heavy');

// ---------------------------------------------------------------- ids

// Ids already used on other branches, so two people rarely mint the same one.
function idsOnBranches(root) {
  if (!inGit(root)) return [];
  const refs = git(root, ['for-each-ref', '--format=%(refname)', 'refs/heads', 'refs/remotes']).split('\n').filter(Boolean).slice(0, 40);
  const rel = path.relative(git(root, ['rev-parse', '--show-toplevel']) || root, K.paths(root).cards).split(path.sep).join('/');
  const ids = new Set();
  for (const ref of refs) for (const f of git(root, ['ls-tree', '--name-only', ref, rel + '/']).split('\n')) { const id = K.cardIdFromPath(f); if (id) ids.add(id); }
  return [...ids];
}

function cmdIds(root, pos, opt) {
  const cards = K.loadCards(root);
  const dups = cards.__dups;
  if (!dups.length) return console.log('No duplicate ids.');
  if (!opt.fix) {
    for (const d of dups) console.log(`✗ ${d.id} is used twice: ${path.relative(root, d.kept)} and ${path.relative(root, d.clash)}`);
    console.log('Two people (or sessions) minted the same id. Run: koru ids --fix   (renumbers the later card and re-points the links that came with it)');
    process.exit(1);
  }
  const prov = K.provenance(root);
  for (const d of dups) {
    const text = fs.readFileSync(d.clash, 'utf8');
    const c = K.cardFromText(text, d.clash);
    const newId = K.nextId(root, c.type);
    let t = K.setField(text, 'id', newId).replace(new RegExp(`^# ${d.id}\\b`, 'm'), `# ${newId}`);
    const file = path.join(path.dirname(d.clash), path.basename(d.clash).replace(d.id, newId));
    fs.writeFileSync(file, t);
    fs.unlinkSync(d.clash);
    // Links that came with the renumbered card: cards created after it by the same author or session.
    const sessions = new Set((prov[d.id] || []).map((p) => p.session).filter(Boolean));
    const moved = [];
    const ask = [];
    for (const x of Object.values(K.loadCards(root))) {
      if (x.file === file || !new RegExp(`\\b${d.id}\\b`).test(x.text)) continue;
      const same = (K.filled(c.meta.author) && x.meta.author === c.meta.author) || (prov[x.id] || []).some((p) => sessions.has(p.session));
      if (same && String(x.meta.created || '') >= String(c.meta.created || '')) {
        fs.writeFileSync(x.file, x.text.replace(new RegExp(`\\b${d.id}\\b`, 'g'), newId));
        moved.push(x.id);
      } else ask.push(x.id);
    }
    K.log(root, 'renumber', { id: d.id, to: newId, moved, ask });
    console.log(`${d.id} → ${newId} (${path.relative(root, file)})${moved.length ? `; re-pointed ${moved.join(', ')}` : ''}${ask.length ? `\n  Check: ${ask.join(', ')} cite ${d.id}, which now means the earlier card. Re-point any that meant the renumbered one.` : ''}`);
  }
}

// ---------------------------------------------------------------- verify

function cmdVerify(root, pos, opt) {
  const cards = K.loadCards(root);
  const bad = K.signatureProblems(cards);
  const unsigned = Object.values(cards).filter((c) => c.status === 'final' && !K.filled(c.meta.signature) && c.type !== 'REV');
  const ppl = people(K.readEngagement(root));
  for (const b of bad) console.log(`✗ ${b.card.id} changed after it was signed (signed ${b.want}, now ${b.got}). Revise and re-sign it: koru revise ${b.card.id} --reason "…"`);
  if (!opt.quiet) {
    console.log(`${Object.values(cards).filter((c) => K.filled(c.meta.signature)).length} signed card(s) carry a verifiable signature${unsigned.length ? `; ${unsigned.length} were signed before signatures existed` : ''}.`);
    console.log(`People on the engagement: ${ppl.map((p) => `${p.name}${p.email ? ` <${p.email}>` : ''} (${p.roles.join(', ')})`).join(' · ') || 'none recorded'}`);
    const me = identity(root);
    console.log(`This checkout signs as: ${me.name || '?'} <${me.email || 'no git email'}>`);
  }
  if (bad.length || (cards.__dups || []).length) process.exit(1);
}

// ---------------------------------------------------------------- git setup

function cmdGitSetup(root) {
  const attr = path.join(root, '.gitattributes');
  const want = ['koru/state/*.jsonl merge=union', 'koru/history/** -diff linguist-generated', 'koru/generated/** linguist-generated'];
  const have = fs.existsSync(attr) ? fs.readFileSync(attr, 'utf8') : '';
  const add = want.filter((l) => !have.includes(l));
  if (add.length) fs.writeFileSync(attr, (have && !have.endsWith('\n') ? have + '\n' : have) + '# Koru: state logs merge by union; history and generated files are not reviewed as diffs\n' + add.join('\n') + '\n');
  if (!inGit(root)) return console.log(`.gitattributes written. This folder is not a git repository yet: git init, commit, then run koru git-setup again for the hooks.`);
  const hooks = path.join(git(root, ['rev-parse', '--git-path', 'hooks']) ? path.resolve(root, git(root, ['rev-parse', '--git-path', 'hooks'])) : path.join(root, '.git', 'hooks'));
  fs.mkdirSync(hooks, { recursive: true });
  const bin = path.join(__dirname, '..', 'bin', 'koru');
  const hook = (name, body) => { const f = path.join(hooks, name); fs.writeFileSync(f, `#!/bin/sh\n# Koru ${name} hook (koru git-setup)\nKORU="$(command -v koru || echo ${bin})"\n${body}\n`); fs.chmodSync(f, 0o755); };
  hook('pre-commit', '"$KORU" ids || exit 1\n"$KORU" verify --quiet || { echo "Koru: a signed card changed outside Koru. Revise and re-sign it."; exit 1; }');
  hook('post-merge', '"$KORU" ids >/dev/null 2>&1 || echo "Koru: two people minted the same card id. Run: koru ids --fix"');
  console.log(`Git set up for a team: .gitattributes (union merge for koru/state), pre-commit (duplicate ids, signatures) and post-merge (id clash warning) hooks in ${path.relative(root, hooks)}.`);
}

// ---------------------------------------------------------------- project context

// ux/project-context.md, generated: the one file every SkillCloud method skill reads first.
function writeContext(root) {
  const eng = K.readEngagement(root);
  const p = K.paths(root);
  const client = fs.existsSync(p.client) ? fs.readFileSync(p.client, 'utf8') : '';
  const secs = K.sections(client.replace(/^#\s.*$/m, ''));
  const D = (() => { try { return require('./ds').load(root); } catch { return { ready: false }; } })();
  const restricted = eng.ai_tier === 'restricted' || !K.filled(eng.ai_processor);
  const ppl = people(eng);
  const text = `---
artifact: project-context
project: ${eng.project || eng.client || ''}
created_by: koru context (generated from koru/engagement.md and koru/client.md; do not edit)
status: generated
updated: ${K.today()}
---

# Project Context — ${eng.client || eng.project || 'project'}

> Generated by Koru. Every SkillCloud skill reads this first. To change it, change koru/engagement.md or koru/client.md and run koru context. In this project, skills write cards in koru/cards (see each skill's "Koru mode"), never files under ux/.

## Project

- **Name / codename:** ${eng.client || ''}
- **Domain / industry:** ${eng.domain || 'enterprise SaaS'}
- **What it is:** ${eng.starting_point || ''} · product ${eng.product_state || ''} · AI in product: ${eng.ai_in_product || 'none'}
- **Data rules:** ${restricted ? `restricted — AI may not process research material until a person sets the contract (AI tier ${eng.ai_tier || 'unset'})` : `AI tier ${eng.ai_tier}, data class ${eng.data_class}, processor ${eng.ai_processor}; de-identify people data on intake; originals and koru/private are never read`}
- **Rigour:** ${K.rigour(eng).label}${eng.appetite ? ` · appetite ${eng.appetite}` : ''}

## Design & brand

- **Design system:** ${D.ready ? `${D.manifest.system} ${D.manifest.version} (koru/design-system/; the hook refuses anything else)` : eng.design_system || 'none yet'}
- **Accessibility bar:** WCAG 2.2 AA${/regulated/.test(K.rigour(eng).key) ? ' plus the client\'s regulatory bar' : ''}
- **Voice & terminology:** ${secs.voice || secs['voice and terminology'] || 'see Glossary'}
- **Tech stack:** ${eng.tech_stack || 'unknown'}${eng.frontend_dir ? ` in ${eng.frontend_dir}/` : ''}

## Constraints

${secs.constraints || '- See the Context card (CTX) question 8.'}

## Glossary (codenames — use these everywhere)

${secs.glossary || '| Real thing (category only) | Codename |\n|---|---|'}

## Stakeholders (roles only)

| Role | Involvement |
|---|---|
${ppl.flatMap((x) => x.roles).filter((v, i, a) => a.indexOf(v) === i).map((r) => `| ${r} | signs ${Object.entries(K.TYPES).filter(([, t]) => t.signer === r).map(([k]) => k).join(', ') || '—'} |`).join('\n') || '| (not recorded) | |'}

## Project state pointers

- Cards: koru/cards · board: koru/generated/board.html · next step: koru next
`;
  const f = path.join(root, 'ux', 'project-context.md');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, text);
  return f;
}

module.exports = { people, identity, checkSigner, signature, humanEdit, bucket, idsOnBranches, cmdIds, cmdVerify, cmdGitSetup, writeContext, git, inGit };
