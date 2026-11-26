'use strict';
// The one map that weaves the SkillCloud method skills into Koru.
//
// Every method skill has a home: the stage step that calls it, the agent that runs it, the card
// types it reads and the card types it writes. The planner (lib/plan.js) routes work by this map,
// the hooks (lib/guard.js) refuse an agent writing a card type it does not own, and
// tools/weave.js writes each skill's "Koru mode" block from it, so the skills, the agents and the
// gates can never disagree about who does what.

// ---------------------------------------------------------------- agents

// Workers do the stage work; checkers challenge it with fresh context and write nothing.
const AGENTS = {
  researcher: {
    label: 'Researcher',
    does: 'Plans studies, turns sessions into Data and Findings with verified quotes, plans usability tests and records what was observed.',
    skills: ['research-plan', 'interview-guide', 'interview-synthesis', 'usability-test-plan', 'topic-deep-dive'],
    writes: ['STU', 'DAT', 'FND', 'TST', 'REQ', 'HYP'],
  },
  synthesiser: {
    label: 'Synthesiser',
    does: 'Clusters Findings, surfaces conflicts and contradicting evidence, names segments and jobs, and drafts readings an Insight could rest on (people write the Insight).',
    skills: ['affinity-mapping', 'cross-study-synthesis', 'jobs-to-be-done', 'persona', 'insight-report'],
    writes: ['FND', 'CON', 'JOB', 'SEG', 'HYP', 'ASM'],
  },
  architect: {
    label: 'Architect',
    does: 'Models the enterprise structure: current and future flows with workarounds and handoffs, the object model, and who may do what.',
    skills: ['journey-map'],
    writes: ['FLW', 'OBJ', 'PRM', 'SEG', 'ASM'],
  },
  strategist: {
    label: 'Strategist',
    does: 'Sorts client requests and ideas, frames Problems and How-might-we questions, spots AI opportunities, drafts the Brief and the Metrics.',
    skills: ['sense-shape-steer', 'design-brief', 'topic-deep-dive'],
    writes: ['CTX', 'REQ', 'IDE', 'ASM', 'PRB', 'HMW', 'OPP', 'BRF', 'MET', 'PLB'],
  },
  designer: {
    label: 'Designer',
    does: 'Sets up the design system, turns human seeds into Directions, builds Screens and prototypes from the system only, drafts comparisons and Decisions.',
    skills: ['koru-design-system', 'koru-explore', 'component-spec', 'ux-writing', 'design-rationale', 'figma-hygiene'],
    writes: ['DIR', 'SCR', 'FLW', 'CMP', 'DEC', 'HYP'],
    files: ['deliverables', 'design-system'],
  },
  quality: {
    label: 'Quality',
    does: 'Hardens the chosen Direction: the state matrix by role, copy for every state, browser audits, heuristic review and the QA checklist.',
    skills: ['koru-harden', 'accessibility-audit', 'heuristic-evaluation', 'ux-writing', 'design-qa-checklist'],
    writes: ['STA', 'FND', 'MET', 'CMP', 'QAR'],
    files: ['deliverables'],
  },
  engineer: {
    label: 'Engineer',
    does: 'Builds the front-end foundation for the chosen stack, the component library, data contracts, Tickets that pass Definition of Ready and the handoff.',
    skills: ['koru-ship', 'handoff-spec', 'component-spec', 'design-qa-checklist'],
    writes: ['TKT', 'HND', 'API', 'CMP', 'QAR'],
    files: ['frontend'],
  },
  'research-checker': { label: 'Research checker', checker: 'frame', skills: ['cross-study-synthesis'], writes: [] },
  'direction-checker': { label: 'Direction checker', checker: 'explore', skills: ['design-critique', 'heuristic-evaluation'], writes: [] },
  'harden-checker': { label: 'Harden checker', checker: 'harden', skills: ['accessibility-audit', 'heuristic-evaluation'], writes: [] },
  'spec-checker': { label: 'Spec checker', checker: 'ship', skills: ['handoff-spec'], writes: [] },
};

// ---------------------------------------------------------------- method skills

// produces: what the skill writes in a Koru project. replaces: what it wrote before (never in Koru).
const METHODS = {
  'research-plan': {
    agent: 'researcher', stage: 'frame', step: 'F3', reads: ['CTX', 'BRF', 'SEG'], writes: ['STU'], replaces: 'ux/research-plan.md',
    how: 'Write one Study card (koru new STU "…"): research questions tied to decisions, the method and why, sample size per Segment, the screener by behaviour, the consent text naming the AI processor. Link the Segments it recruits from (serves SEG-001: why).',
  },
  'interview-guide': {
    agent: 'researcher', stage: 'frame', step: 'F3', reads: ['STU', 'SEG', 'CTX'], writes: ['STU'], replaces: 'ux/interviews/guide.md',
    how: 'Put the guide in the Study card\'s "Guide" section (warm-up, core, probes; story-based JTBD questions; no leading questions). Do not write a separate file.',
  },
  'interview-synthesis': {
    agent: 'researcher', stage: 'frame', step: 'F5', reads: ['DAT', 'STU'], writes: ['DAT', 'FND'], replaces: 'ux/interviews/P*.md, ux/synthesis/interview-synthesis.md',
    how: 'One Data card per session (koru new DAT, with file, participant code, consent naming the processor). Then one Finding per observation (koru new FND "…" --link "supports DAT-001: …"): what people did or said, no "because", a count ("4 of 9"), the segment as a SEG id, and quotes word for word as > "words" (P03, 00:12:34, DAT-002). The hook checks every quote against the transcript. Themes and pain rankings are not files: they become Finding clusters in the next step.',
  },
  'affinity-mapping': {
    agent: 'synthesiser', stage: 'frame', step: 'F6', reads: ['FND'], writes: ['FND', 'CON'], replaces: 'ux/synthesis/affinity-map.md',
    how: 'Set cluster: on every Finding (one short name per cluster), report the tail (singletons, outliers) in your reply for the review record, and open a Conflict card (koru new CON) wherever Findings disagree. Never merge contradicting Findings into one.',
  },
  'cross-study-synthesis': {
    agent: 'synthesiser', stage: 'frame', step: 'F8', reads: ['INS', 'FND', 'CON', 'DAT'], writes: ['CON', 'FND'],
    replaces: 'ux/synthesis/cross-study.md',
    how: 'Re-validate existing Insights against new Findings: link new support or contradiction on the Findings, open Conflicts, and tell the research owner which Insights are due for revision (koru revise is theirs). Weigh by kind of evidence (observed and analytics over attitude), never by majority.',
  },
  'jobs-to-be-done': {
    agent: 'synthesiser', stage: 'frame', step: 'F9', reads: ['INS', 'FND', 'SEG'], writes: ['JOB'], replaces: 'ux/synthesis/jobs-to-be-done.md',
    how: 'One Job card per job (koru new JOB "…" --link "supports INS-001: …"): "When …, I want to …, so I can …" plus the four forces. A Job rests on a signed Insight.',
  },
  persona: {
    agent: 'synthesiser', stage: 'frame', step: 'F7', reads: ['FND', 'DAT', 'CTX'], writes: ['SEG'], replaces: 'ux/personas/*.md',
    how: 'One Segment card per role or segment the evidence shows (koru new SEG "…" --field kind=role). Evidence section names the Data and Findings; "Differs by" says what sets it apart. No invented names, photos or demographics. Findings, Studies, Tests and state cells reference the SEG id.',
  },
  'journey-map': {
    agent: 'architect', stage: 'frame', step: 'F10', reads: ['FND', 'SEG', 'DAT'], writes: ['FLW'], replaces: 'ux/journeys/*.md',
    how: 'One Flow card per flow (koru new FLW "…" --field kind=current): a step table with the actor of every step, the workaround or pain, and the handoff between actors. With several actors it is a service blueprint. Future flows (kind=future) come in Explore and serve a Direction.',
  },
  'insight-report': {
    agent: 'synthesiser', stage: 'frame', step: 'F8', reads: ['INS'], writes: [], replaces: 'ux/insight-report.md',
    how: 'Write nothing. The insight report is a generated view of final Insights (koru index builds it into koru/generated/). Draft readings for the research owner in chat instead: what, because, so what, the contradicting evidence, and the signals koru check shows.',
  },
  'design-brief': {
    agent: 'strategist', stage: 'frame', step: 'F12', reads: ['PRB', 'HMW', 'INS', 'CTX', 'OPP'], writes: ['BRF'], replaces: 'ux/design/brief.md',
    how: 'Fill the one Brief card (koru new BRF): problem, outcome, scope, out of scope, constraints, each citing its Problem and Insights. The engagement lead signs it and the client sponsor co-signs.',
  },
  'sense-shape-steer': {
    agent: 'strategist', stage: 'frame', step: 'F11', reads: ['INS', 'JOB', 'PRB', 'FLW'], writes: ['OPP', 'MET'], replaces: 'ux/sprint/*.md',
    how: 'Sense: AI opportunities become Opportunity cards with kind: ai and the AI opportunity statement. Shape: trust and failure behaviour become rows on state cells in Harden. Steer: the measures become Metric cards with a baseline, events and an owner.',
  },
  'topic-deep-dive': {
    agent: 'researcher', stage: 'frame', step: 'F2', reads: ['CTX', 'REQ'], writes: ['DAT', 'ASM'], replaces: 'ux/research/desk/*.md',
    how: 'Desk research becomes Data cards with kind: document (source, link, date) and Assumption cards for claims not yet tested. Never a Finding: Findings come from observed or reported behaviour.',
  },
  'usability-test-plan': {
    agent: 'researcher', stage: 'explore', step: 'E5', reads: ['DIR', 'SCR', 'SEG', 'STU'], writes: ['TST', 'FND'], replaces: 'ux/validation/usability-test-plan.md',
    how: 'One Test card per test question (koru new TST "…" --link "tests DIR-001: …"): the task, the hard case it uses, the segment (SEG id), and a numeric threshold ("7 of 10 finish unaided"), saved with koru threshold before any session. After sessions: koru result TST-001 --passed N --of M, and one Finding per observed issue with evidence: observed, a severity 0 to 4 and a "tests DIR-001" link.',
  },
  'heuristic-evaluation': {
    agent: 'quality', stage: 'harden', step: 'H4', reads: ['SCR', 'STA'], writes: ['FND'], replaces: 'ux/design/heuristic-eval.md',
    how: 'Each violation becomes a Finding with evidence: expert, the heuristic, a severity 0 to 4 and a link to the Screen (tests SCR-002: …). Expert Findings never support an Insight on their own.',
  },
  'design-critique': {
    agent: 'direction-checker', stage: 'explore', step: 'E7', reads: ['DIR', 'SCR'], writes: [], replaces: 'ux/design/critiques/*',
    how: 'The crit is findings on the Explore review record, in the checker format: [SEV][RULE][CARD] finding · evidence · confidence. Score the visual-quality rubric per Screen (hierarchy, type scale, density, consistency, states shown).',
  },
  'accessibility-audit': {
    agent: 'quality', stage: 'harden', step: 'H3', reads: ['SCR', 'STA'], writes: ['STA'], replaces: 'ux/design/accessibility-audit.md',
    how: 'Run koru audit on every prototype first (axe, keyboard, targets, four sizes, every ?state=). Record what the tools cannot see as rows on the state cells or Harden review findings: screen reader pass, 400% zoom and 320px reflow, forced colours, reduced motion, focus order.',
  },
  'component-spec': {
    agent: 'engineer', stage: 'ship', step: 'S2', reads: ['SCR', 'STA', 'DEC'], writes: ['CMP'], replaces: 'ux/design/components/*.md',
    how: 'One Component card per new or changed component (koru new CMP "…" --field ds_status=new): anatomy, every state, props, accessibility; snowflakes cite a Decision. Then koru ds component add NAME --spec CMP-001 so the manifest and the hook know it.',
  },
  'ux-writing': {
    agent: 'quality', stage: 'harden', step: 'H2', reads: ['STA', 'SEG', 'SCR'], writes: ['STA'], replaces: 'ux/design/copy/*.md',
    how: 'Copy lives on the state cells: the words the user sees in each state, the register by Segment, error text from the data contract. Terms the client must confirm go into koru/client.md under Glossary with [SME-REVIEW].',
  },
  'design-rationale': {
    agent: 'designer', stage: 'explore', step: 'E4', reads: ['DIR', 'SCR', 'INS'], writes: ['DEC'], replaces: 'ux/design/rationale.md',
    how: 'Write nothing separate. Rationale is the Decision log: koru decide new "…" with factors written before options, one Approver, and affects links.',
  },
  'handoff-spec': {
    agent: 'engineer', stage: 'ship', step: 'S4', reads: ['SCR', 'STA', 'TKT', 'API', 'DEC'], writes: ['HND'], replaces: 'ux/delivery/handoff-*.md',
    how: 'Fill the Handoff card: in, not in, decisions, who to ask, rabbit holes, no-gos. Field shapes and error codes belong on data contracts (API), acceptance criteria on Tickets.',
  },
  'design-qa-checklist': {
    agent: 'engineer', stage: 'ship', step: 'S5', reads: ['TKT', 'STA', 'API'], writes: ['QAR'], replaces: 'ux/delivery/qa-checklist.md',
    how: 'One QA record per build (koru new QAR "…"): the build URL, the card versions compared, and one evidence row per acceptance criterion with pass or fail.',
  },
  'figma-hygiene': {
    agent: 'designer', stage: 'explore', step: 'E3', reads: ['SCR', 'STA'], writes: [], replaces: 'ux/design/figma-conventions.md',
    how: 'Name every frame by its cards (SCR-001 · STA-004) so koru figma diff can compare the file with the signed cards. Conventions go in koru/client.md.',
  },
};

const STAGE_SKILL = { frame: 'koru-frame', explore: 'koru-explore', harden: 'koru-harden', ship: 'koru-ship' };

// The Koru mode block written into each method skill (tools/weave.js). Kept short: the skill's own
// method stays intact; only where its output goes, and what comes next, changes.
function koruModeBlock(name) {
  const m = METHODS[name];
  if (!m) return null;
  const a = AGENTS[m.agent];
  const writes = m.writes.length ? m.writes.map((t) => `\`${t}\``).join(', ') : 'nothing (see below)';
  return [
    '<!-- koru-mode:start (generated from lib/methods.js by tools/weave.js; do not edit by hand) -->',
    '## Koru mode',
    '',
    `When \`koru/engagement.md\` exists, this skill is step **${m.step}** of \`${STAGE_SKILL[m.stage]}\`, run by the **${a.label}** agent, and its output is cards, not files:`,
    '',
    `- **Reads:** ${m.reads.map((t) => `\`${t}\``).join(', ')} cards (\`koru list --type …\`, \`koru show ID\`), plus \`ux/project-context.md\`, which Koru generates from the engagement and \`koru/client.md\` (read-only).`,
    `- **Writes:** ${writes}. ${m.how}`,
    `- **Never writes** \`${m.replaces}\` or anything else under \`ux/\`: the hook refuses it, because a second source of truth would skip the quote checks, provenance and sign-off.`,
    `- **Next:** ignore this skill's own "Next" and "Handoff" lines. The next step is whatever \`koru next\` says.`,
    `- **Domain:** take the domain, register and data rules from \`ux/project-context.md\`. The worked examples in this skill are illustrations; for enterprise SaaS use roles such as admin, approver and operator, and constraints such as SSO, tenants, permission tiers, bulk actions, audit logs and legacy shells.`,
    '<!-- koru-mode:end -->',
  ].join('\n');
}

// Card types an agent may write (null = not a Koru agent, so no limit applies here).
function agentOf(agentType) {
  if (!agentType) return null;
  const name = String(agentType).split(':').pop();
  return AGENTS[name] ? { name, ...AGENTS[name] } : null;
}

function ownerOf(type) {
  return Object.entries(AGENTS).filter(([, a]) => a.writes.includes(type)).map(([k]) => k);
}

module.exports = { AGENTS, METHODS, STAGE_SKILL, koruModeBlock, agentOf, ownerOf };
