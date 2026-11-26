'use strict';
// Card templates: each type's fixed shape. Header fields are short facts; ## sections hold prose.
const { TYPES, CTX_QUESTIONS } = require('./core');

const EXTRA = {
  CTX: [],
  REQ: ['from', 'received', 'sorted_as'],
  DAT: ['kind', 'source', 'file', 'study', 'participant', 'segment', 'consent', 'data_class', 'retention', 'secondary', 'query', 'period', 'denominator'],
  FND: ['evidence', 'count', 'segment', 'participants', 'severity', 'cluster'],
  INS: ['confidence', 'last_validated', 'review_by'],
  JOB: [],
  CON: ['resolution'],
  ASM: ['claimed_by'],
  IDE: ['from'],
  HYP: ['generated_by'],
  PRB: ['kind'],
  HMW: [],
  OPP: ['kind', 'ai_mode'],
  BRF: ['cosigned_by'],
  DIR: ['seed_author', 'chosen', 'threshold', 'threshold_saved_at', 'result', 'result_at', 'prototype'],
  SCR: ['flow_step', 'ds_version', 'prototype'],
  STA: ['screen', 'role', 'state', 'resolution'],
  MET: ['level', 'threshold', 'baseline', 'source', 'events', 'metric_owner', 'cadence', 'guardrail'],
  TKT: ['jira'],
  HND: [],
  DEC: ['approver', 'contributors', 'outcome', 'client_commitment', 'revisit_if'],
  REV: ['gate', 'checker', 'checklist_version', 'catches', 'severity_floor', 'reviewers'],
  STU: ['method', 'sessions', 'window'],
  SEG: ['kind', 'size'],
  FLW: ['kind', 'actors'],
  OBJ: [],
  PRM: ['cosigned_by'],
  TST: ['task', 'hard_case', 'segment', 'threshold', 'threshold_saved_at', 'passed', 'of', 'result', 'result_at'],
  PLB: ['kind', 'held_at', 'attendees', 'source'],
  CMP: ['ds_status', 'ds_component'],
  API: ['screen', 'endpoint'],
  QAR: ['build_url', 'compared_version', 'tested_at'],
};

const SECTIONS = {
  CTX: CTX_QUESTIONS.map((q) => [q, '']),
  REQ: [['Request', 'What was asked, in their words.'], ['Sorted', 'Evidence · constraint · proposed solution (make an Idea) · reference · asset.']],
  DAT: [['Notes', 'What this data is. Pseudonymised before any AI sees it.']],
  FND: [['Observation', 'What people did or said. No "because": the why belongs in an Insight.'], ['Quotes', 'Form: > "exact words" (P01, 00:12:34, DAT-001). Checked word for word against the transcript.']],
  INS: [['What', ''], ['Why', 'Because …'], ['So what', ''], ['Confidence signals', 'Filled by `koru check`: participants, segments, methods, contradicting links.']],
  JOB: [['Job', 'When …, I want to …, so I can …'], ['Forces', 'Push: …\nPull: …\nHabit: …\nAnxiety: …']],
  CON: [['Positions', '- Position A (source, evidence type, weight)\n- Position B (source, evidence type, weight)'], ['Weighing', 'Weigh by the kind of question, not by majority.']],
  ASM: [['Claim', ''], ['How we would test it', '']],
  IDE: [['Idea', 'The client or stakeholder solution, as proposed.'], ['Reverse trace', 'The problem this idea implies.']],
  HYP: [['Hypothesis', 'Synthetic or AI-speculated. Can be tested, never cited as support.'], ['Test', '']],
  PRB: [['Who', ''], ['What', ''], ['Wow', 'Impact, and how we will measure it.']],
  HMW: [['Reframes', 'The Problem this question reframes.']],
  OPP: [['Opportunity', ''], ['AI opportunity statement', 'Only for kind: ai (Sense).']],
  BRF: [['Problem', ''], ['Outcome', ''], ['Scope', ''], ['Out of scope', ''], ['Constraints', '']],
  DIR: [['Core idea', 'One sentence.'], ['Hypothesis', 'We believe … if … with …'], ['Where AI sits', ''], ['Biggest risk', ''], ['Test question', ''], ['Hard cases', '- workaround\n- scale (1 and 10,000 rows)\n- wrong (bad data or a wrong AI suggestion)']],
  SCR: [['Purpose', ''], ['Elements', '| Element | Class | Note |\n| --- | --- | --- |']],
  STA: [['Design', 'What the user sees and can do in this state.']],
  MET: [['Measure', ''], ['Feedback loop', '']],
  TKT: [['User story', 'As a …, I want …, so that …'], ['Acceptance criteria', 'One line per state cell: - STA-001: Given … when … then …'], ['Tokens and components', ''], ['Out of scope', ''], ['Open questions', '']],
  HND: [['In', ''], ['Not in', ''], ['Decisions', ''], ['Who to ask', ''], ['Rabbit holes', 'Known traps.'], ['No-gos', 'Things deliberately not built.']],
  DEC: [['Question', ''], ['Factors', 'Written before the options are scored.'], ['Options', '| Option | Factor scores | Notes |\n| --- | --- | --- |'], ['Outcome', ''], ['Cards affected', 'List them as "affects ID: why" links in the header.']],
  REV: [['Checklist', ''], ['Findings', '1. [MAJOR][RC-01][CARD-ID] what · evidence: … · confidence: high — fixed | accepted risk | rejected: why | deferred TKT-000 | open']],
  STU: [['Research questions', 'What the study must answer, each tied to a decision.'], ['Method', 'Why this method for these questions; sample size per segment.'], ['Participants', 'Screener criteria by Segment (behaviour, not demographics).'], ['Guide', 'Warm-up, core, probes. Story-based, never leading.'], ['Consent', 'The consent text participants agree to, naming the AI processor.']],
  SEG: [['Who', 'The role or segment, in the client\'s words.'], ['Evidence', 'The Data and Findings that show this segment exists and differs.'], ['Goals and jobs', ''], ['Differs by', 'What sets this segment apart: volume, permissions, tools, stakes.']],
  FLW: [['Steps', '| # | Step | Actor | Workaround or pain | Handoff |\n| --- | --- | --- | --- | --- |'], ['Moments that matter', ''], ['Systems touched', '']],
  OBJ: [['Objects', '| Object | Key attributes | Relationships | Actions |\n| --- | --- | --- | --- |'], ['Lifecycle', 'States each object moves through (draft, submitted, approved, archived …).']],
  PRM: [['Matrix', '| Action | Role A | Role B |\n| --- | --- | --- |'], ['Rules', 'Separation of duties, approval limits, audit needs.']],
  TST: [['Scenario', 'In the participant\'s world; never echoes interface labels.'], ['Observations', 'One line per participant: P01 passed / failed, what happened.']],
  PLB: [['Feedback', '| # | Feedback | Type | From | Anchor | Becomes |\n| --- | --- | --- | --- | --- | --- |'], ['Agreed', 'What the client committed to, in their words.']],
  CMP: [['Anatomy', ''], ['States', 'default, hover, focus, active, disabled, loading, error, empty'], ['Props', ''], ['Accessibility', 'Role, name, keyboard, focus, announcements.']],
  API: [['Fields', '| Field | Type | Required | Source | Validation |\n| --- | --- | --- | --- | --- |'], ['Errors', '| Code | When | Message the user sees | State |\n| --- | --- | --- | --- |'], ['Rollout', 'Feature flag, migration and change communication for existing users.']],
  QAR: [['Evidence', '| Criterion | Evidence | Result |\n| --- | --- | --- |'], ['Visual regression', 'Baseline and diff results.']],
};

// A collision-free identity behind the readable id: time plus randomness, sortable.
function uid() { return Date.now().toString(36) + require('crypto').randomBytes(4).toString('hex'); }

function render(type, id, title, opts) {
  opts = opts || {};
  const t = TYPES[type];
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const head = [
    `id: ${id}`, `type: ${type}`, `title: ${title}`, `stage: ${opts.stage || t.stage || ''}`,
    'status: draft', 'version: 1', `owner: ${opts.owner || t.signer}`, `author:${opts.author ? ' ' + opts.author : ''}`, 'signed_by:', 'signed_at:',
  ];
  for (const f of EXTRA[type] || []) head.push(`${f}:${opts[f] ? ' ' + opts[f] : ''}`);
  head.push('links:');
  for (const l of opts.links || []) head.push(`  - ${l}`);
  head.push(`uid: ${uid()}`, `created: ${now}`, `updated: ${now}`);
  const bodyOut = (SECTIONS[type] || [])
    .map(([h, hint]) => `## ${h}\n\n${!hint ? '' : hint.startsWith('|') ? hint + '\n' : `<!-- ${hint.replace(/\n/g, ' · ')} -->\n`}`)
    .join('\n');
  return `---\n${head.join('\n')}\n---\n# ${id} · ${title}\n\n${bodyOut}`;
}

module.exports = { render, EXTRA, SECTIONS, uid };
