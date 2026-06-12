---
artifact: design-brief
project: <client codename>
created_by: skillcloud/design-brief v<VERSION>
sources: [ux/insight-report.md]
status: draft
updated: <yyyy-mm-dd>
---

# Design Brief — <client codename>: <effort name>

**Read this first:** every factual claim cites an insight ID (`INS-NN`) or carries `[unvalidated]`. The non-goals list is binding until a DEC entry supersedes it.

## Problem statement

<Who (specific persona/role) + struggles to do what (the job, in their words) + in what context (journey moment, environment) + at what cost (to the user and to the client's business or safety outcomes). 3–5 sentences. Cite insight IDs inline.>

**Solving for first:** <persona/segment> — <one line on why them before others>

## Evidence base

| Insight | Claim (short) | Why it matters to this effort |
|---|---|---|
| INS-02 | <e.g. "Bed status lives in phone calls, not the board"> | <drives the problem statement's core> |
| INS-04 | <…> | <…> |

**Where the stakeholder ask diverges from the evidence:** <name the divergence and what the brief does about it — or "none found">

## Success metrics

| Metric | Type | Baseline | Target | Measurement source | Owner |
|---|---|---|---|---|---|
| <behavioral — what users do> | leading | <value, or "unknown — establish by <how>"> | <…> | <instrumentation / data pull> | <role> |
| <experiential — what users report> | lagging | <…> | <…> | <survey / usability benchmark> | <role> |
| <healthcare: safety/burden — time-on-task in shift, interruption recovery, alert dismissal rate, documentation clicks> | leading | <…> | <…> | <…> | <role> |

## Constraints

- **Client design system:** <library + token set; where deviation is negotiable; who approves deviations>
- **Accessibility bar:** <from project-context.md — healthcare-enterprise default: WCAG 2.2 AA, Section 508>
- **Technical:** <platforms, browsers, EHR embedding (iframe / SMART on FHIR), offline expectations, device classes (workstation-on-wheels, wall display, gloved tablet)>
- **Regulatory / process:** <PHI display rules, audit-trail needs, SME/clinical review gates, legal review for patient-facing language>
- **Time and people:** <engagement end date, client review cadence, sign-off chain>

## Scope

**In scope:**
- <flow/surface this effort will actually design>
- <…>

**Non-goals** (each with why it's out — sequencing, ownership, or evidence):
- <adjacent thing stakeholders will assume is included> — <why not>
- <…>

## Riskiest assumptions

| # | Assumption | Impact if wrong | Uncertainty | Cheapest test |
|---|---|---|---|---|
| A1 | <…> | high/med/low | high/med/low | <5-user test / prototype-in-critique / data pull / SME interview> |

## Open questions

| Question | Owner | Needed by |
|---|---|---|
| <…> | <name/role — an unowned question is a future blocker> | <date tied to design schedule> |

## Review log

| Date | Reviewer | Outcome |
|---|---|---|
| <yyyy-mm-dd> | <client design lead / PM> | <edits captured → status: reviewed> |
