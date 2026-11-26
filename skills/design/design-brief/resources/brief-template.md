---
artifact: design-brief
project: <client codename>
created_by: skillcloud/design-brief v<VERSION>
stage: frame
sources: [ux/insight-report.md, ux/strategy/experience-strategy.md, ux/intake/calls/<file>.md]
status: draft
version: 1
updated: <yyyy-mm-dd>
---

# Design Brief — <client codename>: <effort name>

**Read this first:** page one is the framed brief: one page, every fact with a confidence level and a source. Everything below it is detail for longer engagements. The non-goals list is binding until a decision supersedes it.

## The framed brief (one page)

| Section | What goes in |
|---|---|
| **Problem** | <one sentence, solution-free> |
| **Path** | roadmap item: hypothesis "we believe … we'll know when …" · or discovery: question "what makes … hard?" |
| **Who it's for** | <specific roles, their context and skill level> |
| **What we know** | <fact> **(high / medium / low)** · <source>, one row per fact |
| **What we're assuming** | <assumptions Explore will test> (ASM-..) |
| **Where AI fits** | screen / agent / both / neither, and why (OPP-.., JOB-..) |
| **Constraints** | <tech, business, regulatory, time> |
| **Success looks like** | <2–3 outcomes we could observe, each with how it's measured> |
| **Open questions** | <what we still need from the client, each with who answers> |
| **Signed off by** | <name, date: written by /design-lead from the person's sign-off, never by an agent> |

Confidence: **high** = two or more independent sources including direct user or client evidence · **medium** = one direct source · **low** = anecdote or AI-inferred, until a person checks.

---

# Detail (longer engagements)

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
| <yyyy-mm-dd> | <client design lead / PM> | <edits captured → status: review> |
