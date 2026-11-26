#!/usr/bin/env node
'use strict';
// Weaves the SkillCloud method skills into Koru from one map (lib/methods.js):
//  - writes each method skill's "Koru mode" block (where its output goes, what comes next),
//  - points every preamble at the plugin (${CLAUDE_PLUGIN_ROOT}, the plugin's bin/ on PATH),
//    never at ~/.skillcloud, which a plugin install does not create,
//  - says in each description which Koru step calls the skill, so routing prefers the stage skill.
// node tools/weave.js          rewrite in place
// node tools/weave.js --check  exit 1 if any skill is out of date (tools/validate.sh runs this)
const fs = require('fs');
const path = require('path');
const M = require('../lib/methods');

const ROOT = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');
const PLUG = '${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}';
const stale = [];

function skillFiles() {
  const out = {};
  for (const b of fs.readdirSync(path.join(ROOT, 'skills'))) for (const s of fs.readdirSync(path.join(ROOT, 'skills', b))) {
    const f = path.join(ROOT, 'skills', b, s, 'SKILL.md');
    if (fs.existsSync(f)) out[s] = f;
  }
  return out;
}

function weave(name, text) {
  let t = text;
  // Plugin paths. The skillcloud skill itself manages the standalone install and keeps its paths.
  if (name !== 'skillcloud') {
    t = t.replace(/_UPD=\$\("\$\{SKILLCLOUD_HOME:-\$HOME\/\.skillcloud\}\/repo\/bin\/skillcloud-update-check" 2>\/dev\/null \|\| true\)/g,
      `_UPD=$(command -v skillcloud-update-check >/dev/null 2>&1 && skillcloud-update-check 2>/dev/null || "${PLUG}/bin/skillcloud-update-check" 2>/dev/null || true)`);
    t = t.replace(/"\$\{SKILLCLOUD_HOME:-\$HOME\/\.skillcloud\}\/repo\/bin\/skillcloud-config"/g, `"${PLUG}/bin/skillcloud-config"`);
    t = t.replace(/command -v koru >\/dev\/null 2>&1 \|\| koru\(\) \{ node "\$HOME\/\.skillcloud\/repo\/lib\/koru\.js" "\$@"; \}/g,
      `command -v koru >/dev/null 2>&1 || koru() { node "${PLUG}/lib/koru.js" "$@"; }`);
    t = t.replace(/~\/\.skillcloud\/repo\//g, '${CLAUDE_PLUGIN_ROOT}/').replace(/\$HOME\/\.skillcloud\/repo\//g, '${CLAUDE_PLUGIN_ROOT}/');
  }
  const m = M.METHODS[name];
  if (!m) return t;
  // Koru detection in the preamble: regenerate the project context the skill is about to read.
  if (!/KORU_PROJECT/.test(t)) {
    t = t.replace(/(\[ -f "ux\/project-context\.md" \] && echo "PROJECT_CONTEXT: present" \|\| echo "PROJECT_CONTEXT: missing")/,
      `[ -f koru/engagement.md ] && { (command -v koru >/dev/null 2>&1 && koru context || node "${PLUG}/lib/koru.js" context) >/dev/null 2>&1; echo "KORU_PROJECT: yes (follow Koru mode)"; }\n$1`);
    t = t.replace(/(- If `PROJECT_CONTEXT: missing`)/, '- If `KORU_PROJECT: yes`: read **Koru mode** below before anything else. It overrides this skill\'s Produces, Next and Handoff.\n$1');
  }
  // The Koru mode block, right after the Contract.
  const block = M.koruModeBlock(name);
  if (/<!-- koru-mode:start/.test(t)) t = t.replace(/<!-- koru-mode:start[\s\S]*?<!-- koru-mode:end -->/, block);
  else {
    const at = t.search(/^## Contract[\s\S]*?(?=^#{1,2} )/m);
    const contract = t.match(/^## Contract[\s\S]*?(?=^#{1,2} (?!Contract))/m);
    if (at > -1 && contract) t = t.slice(0, at + contract[0].length) + block + '\n\n' + t.slice(at + contract[0].length);
    else t = t.replace(/^(# .+)$/m, `${block}\n\n$1`);
  }
  // Description: which Koru step calls it, so stage skills win routing in a Koru project.
  const tag = `In a Koru project it runs as ${m.step} of ${M.STAGE_SKILL[m.stage]} and writes ${m.writes.length ? m.writes.join('/') + ' cards' : 'no files (a generated view)'}.`;
  if (!t.includes(tag)) {
    t = t.replace(/\n  In a Koru project it runs as [^\n]*?(?= \(skillcloud\)|\n)/, '');
    t = t.replace(/ \(skillcloud\)\n---/, ` ${tag} (skillcloud)\n---`);
  }
  t = t.replace(/\(clinical playbook shipped\)/g, '(enterprise SaaS by default; clinical playbook included)');
  return t;
}

const files = skillFiles();
for (const [name, f] of Object.entries(files)) {
  const before = fs.readFileSync(f, 'utf8');
  const after = weave(name, before);
  if (after !== before) { stale.push(name); if (!check) fs.writeFileSync(f, after); }
}
for (const s of Object.keys(M.METHODS)) if (!files[s]) { console.error(`lib/methods.js names ${s}, which has no SKILL.md`); process.exitCode = 1; }
if (check) {
  if (stale.length) { console.error(`Out of date with lib/methods.js: ${stale.join(', ')}. Run: node tools/weave.js`); process.exitCode = 1; }
  else console.log(`weave: ${Object.keys(M.METHODS).length} method skills match lib/methods.js`);
} else console.log(stale.length ? `Rewove ${stale.length} skill(s): ${stale.join(', ')}` : 'Nothing to weave.');
