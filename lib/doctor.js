'use strict';
// koru doctor: every line PASS, WARN or FAIL, each with the one-line fix. koru skills: the map.

const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');
const K = require('./core');
const M = require('./methods');

const PLUGIN = path.resolve(__dirname, '..');

function line(level, what, fix) { return { level, what, fix: fix || '' }; }

function skillFiles() {
  const out = {};
  const base = path.join(PLUGIN, 'skills');
  for (const bundle of fs.readdirSync(base)) for (const s of fs.readdirSync(path.join(base, bundle))) {
    const f = path.join(base, bundle, s, 'SKILL.md');
    if (fs.existsSync(f)) out[s] = f;
  }
  return out;
}

// The hooks must actually fire: send the guard a write Claude may never make and expect a deny.
function hookDryRun() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koru-doctor-'));
  try {
    fs.mkdirSync(path.join(tmp, 'koru', 'state'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'koru', 'engagement.md'), '---\nclient: doctor\nai_tier: unset\n---\n');
    const payload = JSON.stringify({ cwd: tmp, tool_name: 'Write', tool_input: { file_path: path.join(tmp, 'koru', 'state', 'gates.jsonl'), content: '{}' } });
    const r = cp.spawnSync(process.execPath, [path.join(PLUGIN, 'lib', 'guard.js'), 'PreToolUse'], { input: payload, encoding: 'utf8', timeout: 10000, env: { ...process.env, KORU_ROOT: '' } });
    return /"permissionDecision":"deny"/.test(r.stdout);
  } finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {} }
}

function checks(root) {
  const out = [];
  const major = Number(process.versions.node.split('.')[0]);
  out.push(line(major >= 18 ? 'PASS' : 'FAIL', `Node ${process.versions.node}`, major >= 18 ? '' : 'Install Node 18 or newer: https://nodejs.org'));
  let manifest = {};
  try { manifest = JSON.parse(fs.readFileSync(path.join(PLUGIN, '.claude-plugin', 'plugin.json'), 'utf8')); } catch {}
  out.push(line(manifest.version ? 'PASS' : 'FAIL', `Plugin ${manifest.name || '?'} ${manifest.version || '(no version)'} at ${PLUGIN}`, manifest.version ? '' : 'Reinstall the plugin from the marketplace.'));
  if (/alpha|beta|rc/.test(manifest.version || '')) out.push(line('WARN', `Pre-release version ${manifest.version}`, 'Pin a release in the private marketplace before client work (plugin version pinning replaces the old update check).'));
  const onPath = (process.env.PATH || '').split(path.delimiter).some((d) => fs.existsSync(path.join(d, 'koru')));
  out.push(line(onPath ? 'PASS' : 'WARN', onPath ? 'koru is on the shell path' : 'koru is not on this shell\'s path', onPath ? '' : `Inside Claude Code the plugin's bin/ is on the path. Elsewhere: export PATH="${path.join(PLUGIN, 'bin')}:$PATH"`));
  const fires = hookDryRun();
  out.push(line(fires ? 'PASS' : 'FAIL', fires ? 'Hooks fire: a dry-run write to koru/state was refused' : 'The guard did not refuse a protected write', fires ? '' : 'Check hooks/hooks.json is loaded (claude --debug) and Node runs from the hook shell.'));

  // The weave: every method skill has its Koru mode block, every agent exists, every skill an agent names exists.
  const files = skillFiles();
  const missingBlock = Object.keys(M.METHODS).filter((s) => !files[s] || !fs.readFileSync(files[s], 'utf8').includes('koru-mode:start'));
  out.push(line(missingBlock.length ? 'FAIL' : 'PASS', missingBlock.length ? `Method skills without a Koru mode block: ${missingBlock.join(', ')}` : `All ${Object.keys(M.METHODS).length} method skills write cards in Koru mode`, missingBlock.length ? 'node tools/weave.js' : ''));
  const stale = Object.keys(M.METHODS).filter((s) => files[s] && fs.readFileSync(files[s], 'utf8').includes('koru-mode:start') && !fs.readFileSync(files[s], 'utf8').includes(M.koruModeBlock(s)));
  if (stale.length) out.push(line('FAIL', `Koru mode blocks out of date with lib/methods.js: ${stale.join(', ')}`, 'node tools/weave.js'));
  const agentFiles = Object.keys(M.AGENTS).filter((a) => !fs.existsSync(path.join(PLUGIN, 'agents', `${a}.md`)));
  out.push(line(agentFiles.length ? 'FAIL' : 'PASS', agentFiles.length ? `Agents missing: ${agentFiles.join(', ')}` : `${Object.keys(M.AGENTS).length} agents present (7 workers, 4 checkers)`, agentFiles.length ? 'Reinstall the plugin.' : ''));
  const ghost = Object.entries(M.AGENTS).flatMap(([a, v]) => v.skills.filter((s) => !files[s]).map((s) => `${a}→${s}`));
  if (ghost.length) out.push(line('FAIL', `Agents name skills that do not exist: ${ghost.join(', ')}`, 'Fix lib/methods.js.'));
  const home = path.join(os.homedir(), '.skillcloud', 'repo');
  const FALLBACK = '${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}';
  const leftovers = Object.entries(files).filter(([n, f]) => n !== 'skillcloud' && /\$HOME\/\.skillcloud|~\/\.skillcloud/.test(fs.readFileSync(f, 'utf8').split(FALLBACK).join('')));
  out.push(line(leftovers.length ? 'WARN' : 'PASS', leftovers.length ? `${leftovers.length} skill(s) still point at ~/.skillcloud` : 'No skill depends on ~/.skillcloud (plugin paths only)', leftovers.length ? 'node tools/weave.js' : ''));
  if (fs.existsSync(home)) out.push(line('PASS', `Standalone SkillCloud also present at ${home}`, ''));
  const tools = ['playwright', 'axe-core'].filter((t) => !fs.existsSync(path.join(PLUGIN, 'tools', 'node_modules', t)));
  out.push(line(tools.length ? 'WARN' : 'PASS', tools.length ? `Browser audit tools missing (${tools.join(', ')}): koru audit falls back to static checks` : 'Browser audit tools installed (Playwright, axe-core)', tools.length ? `cd "${path.join(PLUGIN, 'tools')}" && npm ci` : ''));
  out.push(line('PASS', 'Connector rules: Figma writes match /figma/ and Jira writes match /jira|atlassian/ in the tool name; reads are free, writes ask a person and the contract tier', ''));

  if (!root) { out.push(line('WARN', 'No Koru project in this folder', 'Run /koru:start (or koru init) in the client folder.')); return out; }
  const eng = K.readEngagement(root);
  const cards = K.loadCards(root);
  const T = require('./team');
  out.push(line(eng.ai_tier && eng.ai_tier !== 'unset' ? 'PASS' : 'FAIL', `Contract: AI tier ${eng.ai_tier || 'unset'} · data ${eng.data_class || 'unset'} · processor ${eng.ai_processor || 'none'}`, eng.ai_tier && eng.ai_tier !== 'unset' ? '' : 'Run /koru:start: one question decides what Claude may do with the client\'s material.'));
  const R = K.rigour(eng);
  out.push(line(eng.rigour ? 'PASS' : 'WARN', `Rigour ${R.label}${eng.appetite ? ` · appetite ${eng.appetite}` : ''}`, eng.rigour ? '' : 'Set rigour: sprint | standard | regulated and appetite: (e.g. 3d) in koru/engagement.md.'));
  const ppl = T.people(eng);
  out.push(line(ppl.length ? 'PASS' : 'WARN', ppl.length ? `${ppl.length} people with roles; signatures are checked against them` : 'No people or roles recorded, so signatures are not checked', ppl.length ? '' : 'Add roles: (role: Name) or people: (Name <email>: role, role) to koru/engagement.md.'));
  if (T.inGit(root)) {
    const me = T.identity(root);
    const known = ppl.some((p) => p.email && p.email === me.email);
    out.push(line(!ppl.some((p) => p.email) ? 'WARN' : known ? 'PASS' : 'FAIL', `Git identity ${me.email || '(none)'}${known ? ' is on the people list' : ''}`, known ? '' : 'Add emails to people: so signatures bind to git identities, or git config user.email you@… .'));
    const attr = fs.existsSync(path.join(root, '.gitattributes')) && /merge=union/.test(fs.readFileSync(path.join(root, '.gitattributes'), 'utf8'));
    const hook = fs.existsSync(path.join(root, '.git', 'hooks', 'pre-commit')) && /Koru/.test(fs.readFileSync(path.join(root, '.git', 'hooks', 'pre-commit'), 'utf8'));
    out.push(line(attr && hook ? 'PASS' : 'WARN', attr && hook ? 'Git set up for a team (union merge for state, pre-commit checks)' : 'Git not set up for a team yet', attr && hook ? '' : 'koru git-setup'));
  } else out.push(line('WARN', 'Not a git repository: history, blame and team merges need one', 'git init && koru git-setup'));
  const dups = cards.__dups || [];
  out.push(line(dups.length ? 'FAIL' : 'PASS', dups.length ? `Duplicate ids: ${dups.map((d) => d.id).join(', ')}` : 'No duplicate card ids', dups.length ? 'koru ids --fix' : ''));
  const sig = K.signatureProblems(cards);
  out.push(line(sig.length ? 'FAIL' : 'PASS', sig.length ? `Signed cards changed outside Koru: ${sig.map((x) => x.card.id).join(', ')}` : 'Every signature matches its card', sig.length ? 'koru revise ID --reason … and re-sign' : ''));
  let D = { ready: false };
  try { D = require('./ds').load(root); } catch {}
  out.push(line(D.ready ? 'PASS' : 'WARN', D.ready ? `Design system ${D.manifest.system} ${D.manifest.version}` : 'No design system set up', D.ready ? '' : 'koru ds catalog, then koru ds adopt ID or koru ds extend …'));
  const staleCards = Object.values(cards).filter((c) => K.linkProblems(c, cards).some((p) => p.rule === 'stale'));
  const wb = K.writebacks(root, cards);
  const open = K.active(cards, 'REV').flatMap((r) => K.findingRows(r.sections.findings || '').filter((f) => f.kind === 'open' && K.atOrAbove(f.severity, R.floor)));
  out.push(line(staleCards.length || wb.length || open.length ? 'WARN' : 'PASS', `${staleCards.length} stale · ${wb.length} writeback · ${open.length} open checker finding(s)`, staleCards.length || wb.length || open.length ? 'koru where' : ''));
  const ux = path.join(root, 'ux');
  const extra = fs.existsSync(ux) ? fs.readdirSync(ux, { recursive: true }).filter((f) => /\.md$/.test(f) && f !== 'project-context.md') : [];
  out.push(line(extra.length ? 'WARN' : 'PASS', extra.length ? `${extra.length} file(s) under ux/ outside the card graph (${extra.slice(0, 3).join(', ')})` : 'One source of truth: no ux/ files beside the cards', extra.length ? 'Turn them into cards (koru skills shows which), then delete them.' : ''));
  const ctx = path.join(ux, 'project-context.md');
  const ctxOk = fs.existsSync(ctx) && /koru context/.test(fs.readFileSync(ctx, 'utf8'));
  out.push(line(ctxOk ? 'PASS' : 'WARN', ctxOk ? 'ux/project-context.md is generated from the engagement' : 'ux/project-context.md is missing or hand-written', ctxOk ? '' : 'koru context'));
  return out;
}

function cmdDoctor(root, opt) {
  const res = checks(root);
  if (opt && opt.json) return console.log(JSON.stringify(res, null, 2));
  for (const r of res) console.log(`${r.level.padEnd(4)}  ${r.what}${r.fix ? `\n      fix: ${r.fix}` : ''}`);
  const f = res.filter((r) => r.level === 'FAIL').length;
  const w = res.filter((r) => r.level === 'WARN').length;
  console.log(`\n${res.length - f - w} pass · ${w} warn · ${f} fail`);
  if (f) process.exitCode = 1;
}

function cmdSkills(pos, opt) {
  if (pos[0]) {
    const b = M.koruModeBlock(pos[0]);
    if (b) return console.log(b.replace(/<!--.*?-->\n?/g, ''));
    const a = M.AGENTS[pos[0]];
    if (a) return console.log(`${a.label}: ${a.does || ''}\nSkills: ${a.skills.join(', ')}\nWrites: ${a.writes.join(', ') || 'nothing (checker)'}`);
    console.error(`No skill or agent "${pos[0]}".`);
    process.exit(1);
  }
  if (opt.json) return console.log(JSON.stringify({ agents: M.AGENTS, methods: M.METHODS }, null, 2));
  console.log('Koru agents and the skills they use (the hook enforces the card types):\n');
  for (const [k, a] of Object.entries(M.AGENTS)) {
    console.log(`${a.checker ? '◇' : '◆'} ${k.padEnd(18)} ${a.checker ? `checks ${a.checker}` : `writes ${a.writes.join(', ')}`}`);
    for (const s of a.skills) { const m = M.METHODS[s]; console.log(`    ${s.padEnd(22)} ${m ? `${m.step} ${m.stage}: reads ${m.reads.join(', ')} → ${m.writes.join(', ') || 'a view'}` : 'stage skill'}`); }
  }
}

module.exports = { cmdDoctor, cmdSkills, checks };
