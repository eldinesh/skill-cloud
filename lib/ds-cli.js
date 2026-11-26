'use strict';
// koru ds …: the design-system commands. The engine is lib/ds.js.

const fs = require('fs');
const path = require('path');
const D = require('./ds');

const HELP = `koru ds: the design system every deliverable must use

  ds catalog                       the systems Koru can adopt exactly, with licences and limits
  ds adopt ID [--stack S] [--ui-layer DIR]     adopt one (koru-neutral, shadcn, material, carbon, fluent,
                                   primer, antd, spectrum, govuk, uswds, nhsuk)
  ds extend --css FILE --name N --version V --components A,B,C [--components-doc FILE] [--tailwind]
                                   take over the client's own system and fill its gaps, marked as additions
  ds build                         regenerate tokens.css, the Tailwind preset, the kit and the gallery
  ds check                         contrast (WCAG AA), additions, new components, approval
  ds lint [FILE|DIR …] [--json]    refuse raw values, off-scale sizes and components outside the system
  ds inline FILE                   put the current token block into a standalone prototype
  ds component add NAME --spec SCR-001 [--states a,b] [--contrast fg,bg,use]
                                   record a component the system lacks, with the card that asks for it
  ds approve --name N --role R     (a person)  approve the system as it stands; any later change needs a new approval
  ds status                        one-line summary`;

function out(opt, obj, text) { if (opt.json) console.log(JSON.stringify(obj, null, 2)); else console.log(text); }

function catalog() {
  const rows = Object.entries(D.CATALOG.systems).map(([id, s]) => `  ${id.padEnd(13)} ${s.name.padEnd(28)} ${String(s.licence).padEnd(12)} prototype: ${s.prototype.mode}${s.restrictions ? `\n  ${''.padEnd(13)} limits: ${[].concat(s.restrictions).join(' ')}` : ''}`);
  console.log(`Systems Koru can adopt exactly (versions pinned in lib/ds-catalog.json):\n${rows.join('\n')}\n\nNo system and no brand yet? Adopt koru-neutral: behaviour-first, AA-checked, swapped for the client's system later.`);
}

function status(root) {
  const r = D.check(root);
  if (r.blocks.length && /No design system/.test(r.blocks[0])) return console.log('Design system: none yet. Run the koru-design-system skill (koru ds catalog).');
  const ap = r.approval;
  console.log(`Design system: ${r.system} ${r.version} · ${r.contrast.filter((c) => c.ok).length}/${r.contrast.length} contrast pairs pass AA · ${r.additions} added tokens · ${r.newComponents.length} new components · ${ap.approved ? (ap.current ? `approved by ${ap.by}` : `changed since ${ap.by} approved it`) : 'not approved yet'}`);
}

function cmdDs(root, pos, opt) {
  const [sub, ...rest] = pos;
  try {
    switch (sub) {
      case 'catalog': return catalog();
      case 'adopt': {
        const r = D.adopt(root, rest[0], { stack: opt.stack, uiLayer: opt['ui-layer'] });
        console.log(`Adopted ${r.sys.name} ${r.version} (${r.sys.licence}). Prototype mode: ${r.sys.prototype.mode}.`);
        if (r.sys.restrictions) console.log(`Limits: ${[].concat(r.sys.restrictions).join(' ')}`);
        console.log('Next: koru ds check, then the design lead approves it (Claude asks them, with options).');
        return status(root);
      }
      case 'extend': {
        if (!opt.css) throw new Error('koru ds extend --css inbox/…/tokens.css --name "Client UI" --version 1.0 --components Button,Card');
        const r = D.extend(root, { css: opt.css, name: opt.name, version: opt.version, components: opt.components, componentsDoc: opt['components-doc'], tailwind: !!opt.tailwind, uiLayer: opt['ui-layer'], stack: opt.stack });
        console.log(`Took over ${opt.name || 'the client system'}: ${r.tokens} tokens (${r.added} added by Koru, marked), ${r.components} components.`);
        const missing = r.roles.filter((x) => /added/.test(x));
        if (missing.length) console.log(`Filled gaps: ${missing.join(', ')}`);
        const c = D.check(root);
        for (const w of c.warns) console.log(`! ${w}`);
        if (c.blocks.length) console.log(`\nThe system has problems to settle before it is approved:\n${c.blocks.map((b) => `✗ ${b}`).join('\n')}`);
        return status(root);
      }
      case 'build': { const p = D.build(root); return console.log(`Built ${path.relative(root, p.build)}: tokens.css, tailwind.preset.js, components.css, gallery.html`); }
      case 'check': {
        const r = D.check(root);
        const lines = [`${r.system || 'Design system'} ${r.version || ''}`];
        for (const c of r.contrast || []) lines.push(`${c.ok ? '✓' : /^client markup/.test(c.use) ? '!' : '✗'} ${String(c.ratio).padStart(5)}:1  ${c.use}  (${c.fg} on ${c.bg})`);
        for (const b of r.blocks.filter((x) => !/^Contrast/.test(x))) lines.push(`✗ ${b}`);
        for (const w of r.warns) lines.push(`! ${w}`);
        if (r.newComponents && r.newComponents.length) lines.push(`· New components to contribute back: ${r.newComponents.join(', ')}`);
        if (r.approval) lines.push(r.approval.approved ? (r.approval.current ? `✓ Approved by ${r.approval.by} ${r.approval.at}` : `✗ Changed since ${r.approval.by} approved it. A person approves again.`) : '✗ Not approved yet: the design lead approves it (Claude asks them, with options).');
        out(opt, r, lines.join('\n'));
        if (r.blocks.length) process.exitCode = 1;
        return;
      }
      case 'lint': {
        const files = D.lintTargets(root, rest);
        const all = [];
        for (const f of files) for (const x of D.lintFile(root, f)) all.push({ file: path.relative(process.cwd(), f), ...x });
        const blocks = all.filter((x) => x.level === 'block');
        if (opt.json) console.log(JSON.stringify({ files: files.length, findings: all }, null, 2));
        else {
          for (const x of all) console.log(`${x.level === 'block' ? '✗' : '!'} ${x.file}:${x.line}  [${x.rule}] ${x.msg}`);
          console.log(`${files.length} file(s), ${blocks.length} blocking, ${all.length - blocks.length} warnings.`);
        }
        if (blocks.length) process.exitCode = 1;
        return;
      }
      case 'inline': {
        const f = path.resolve(rest[0] || '');
        if (!fs.existsSync(f)) throw new Error('koru ds inline koru/deliverables/prototype.html');
        fs.writeFileSync(f, D.inlineInto(root, fs.readFileSync(f, 'utf8')));
        return console.log(`Inlined the ${D.load(root).manifest.system} token block and kit into ${path.relative(process.cwd(), f)}.`);
      }
      case 'component': {
        if (rest[0] !== 'add' || !rest[1]) throw new Error('koru ds component add NAME --spec SCR-001');
        const c = D.addComponent(root, rest[1], opt);
        return console.log(`Added ${c.name} (${c.status}, spec ${c.spec || 'none'}, states ${c.states.join(', ')}). It is a gap to contribute back; the next approval covers it.`);
      }
      case 'approve': {
        if (!opt.name) throw new Error('koru ds approve --name "Your Name" --role "design lead"');
        const rec = D.approve(root, opt.name, opt.role);
        return console.log(`Approved ${rec.system} ${rec.version} as it stands (${rec.hash}). Any change to tokens or components needs a new approval.`);
      }
      case 'status': return status(root);
      default: return console.log(HELP);
    }
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}

module.exports = { cmdDs, HELP };
