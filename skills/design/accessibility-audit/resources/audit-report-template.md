---
artifact: accessibility-audit
project: <client codename>
created_by: skillcloud/accessibility-audit v<VERSION>
sources: ["<Figma link / staging URL>", ux/design/heuristic-eval.md]
status: draft
updated: <yyyy-mm-dd>
---

# Accessibility Audit — <client codename>: <scope>

**Target conformance:** WCAG 2.2 AA (Section 508) — per `ux/project-context.md`
**Scope:** <screens/flows + fidelity (design-stage Figma | staging build)>
**Methods:** <design inspection / contrast measurement / keyboard pass / screen reader (which) / automated scan (which)>
**Device classes considered:** <desktop / workstation-on-wheels / wall display / gloved tablet>

## Executive summary

- **Verdict:** <meets / does not yet meet> WCAG 2.2 AA for the audited scope — <N> findings (<n> critical, <n> high, <n> moderate, <n> low)
- **Top finding:** <one sentence>
- **Biggest quick win:** <one sentence>
- **Deferred to build verification:** <N> checks annotated for /handoff-spec and /design-qa-checklist
- **Recommended next step:** <one sentence>

## Findings

### A11Y-01 — <title> · critical

- **WCAG:** <1.4.3 Contrast (Minimum)> — Level <AA>
- **Principle:** Perceivable / Operable / Understandable / Robust
- **Where:** <screen/frame + element>
- **Who's affected:** <e.g. low-vision clinicians on workstation-on-wheels; keyboard-only users>
- **Evidence:** <measured: "status text #-token-ref on token surface = 3.1:1; requires 4.5:1">
- **Fix:** <token swap / pattern change / redundant channel — concrete>
- **Effort:** S / M / L

### A11Y-02 — <title> · high

- **WCAG:** <…> — Level <…>
- **Principle:** <…>
- **Where:** <…>
- **Who's affected:** <…>
- **Evidence:** <…>
- **Fix:** <…>
- **Effort:** <…>

<!-- Repeat per finding. One finding per root cause; list all locations. -->

## Healthcare emphasis checks

| Check | Status | Note |
|---|---|---|
| Session timeout: warn, extend, preserve work, restore on re-auth (2.2.1/2.2.5) | pass / fail / n.a. / [build] | |
| Color-only status in dashboards/worklists (1.4.1) | pass / fail / n.a. | |
| Type floors at real viewing distance per device class | pass / fail / n.a. | |

## Build-stage annotations (not verifiable in design)

| # | Requirement | WCAG | Verify in |
|---|---|---|---|
| B-01 | <e.g. save status announced via polite live region> | 4.1.3 | /design-qa-checklist |
| B-02 | <e.g. focus order on order-entry screen: patient banner → form → actions> | 2.4.3 | /design-qa-checklist |

## What passed

- <criterion + where — clean results claimed explicitly>

## Remediation plan

| Priority | Finding | WCAG | Severity | Effort | Tier | Owner |
|---|---|---|---|---|---|---|
| 1 | A11Y-__ | | critical | S | 1 | |
| 2 | A11Y-__ | | high | M | 1 | |

**Tiers:** 1 — Level A or critical/high AA: before next release · 2 — remaining AA: this quarter · 3 — AAA/best practice: backlog

## Summary by severity and principle

| Severity | Count |
|---|---|
| critical | _ |
| high | _ |
| moderate | _ |
| low | _ |

| Principle | Findings | Most common issue |
|---|---|---|
| Perceivable | _ | |
| Operable | _ | |
| Understandable | _ | |
| Robust | _ | |
