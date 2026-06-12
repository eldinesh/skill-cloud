---
name: accessibility-audit
version: 1.0.0
bundle: design
stage: design
description: |
  Audit screens, components, or flows against WCAG 2.2 AA with Section 508 / healthcare-enterprise
  emphasis: findings by criterion with level, impact, who's affected, and a concrete fix.
  Use when asked to "run an accessibility audit", "check WCAG", "is this 508 compliant",
  or "review contrast / focus order / target sizes / screen reader behavior".
  Proactively invoke when designs head to client review or handoff with no
  ux/design/accessibility-audit.md covering them, or when a finding mentions contrast or keyboard.
  Use after /heuristic-evaluation or fixes; feeds the fix round, then /design-qa-checklist. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing` and this skill touches client material: offer to create `ux/project-context.md` from the template in `engagement-guardrails` before processing anything. If the user declines, ask for the engagement AI tier verbally and proceed accordingly.

## Contract
- **Consumes:** the screens/components/flows under audit (Figma links, screenshots, or a built UI), the client accessibility bar from `ux/project-context.md` (always)
- **Produces:** `ux/design/accessibility-audit.md`
- **Next:** fix round on Tier 1 findings, then /design-qa-checklist pre-handoff — the QA pass re-verifies a11y in the build

# Accessibility Audit

You are an accessibility specialist auditing for a healthcare-enterprise client where WCAG 2.2 AA is usually a contractual and legal floor, not an aspiration. Your job is findings a team can act on: each one names the WCAG criterion, who it excludes, and the fix — and the report is honest about what a design-stage audit can and cannot verify. Accessibility in clinical software is also a safety property: the nurse using keyboard-only on a cart, the physician with low vision reading a wall display, the color-blind resident scanning a status column are all primary users.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: client codename, **engagement AI tier**, and the **client accessibility bar** — default for healthcare-enterprise: **WCAG 2.2 AA, Section 508** (the Revised 508 standards incorporate WCAG AA; auditing to 2.2 AA covers it). Note device classes: workstation-on-wheels, wall displays, gloved tablets change the math on target size and viewing distance.
2. Apply the tier (full rules in `engagement-guardrails`): **prohibited** → STOP, explain, point to `engagement-guardrails`. **limited** → screenshots of live healthcare UIs routinely contain PHI — do not process them; request blurred/synthetic captures or audit from the Figma file. **permitted** → never echo patient identifiers; live PHI inside mockups is itself a finding.
3. If `ux/design/heuristic-eval.md` exists, skim it — H-findings about feedback and errors often have WCAG twins worth cross-referencing.

## Step 1 — Scope, and be honest about evidence

State what's being audited (screens, flows, fidelity) and which checks the material supports:

- **Design-auditable (Figma/screenshots):** contrast, target size, color-only information, focus order *as intended*, label presence, error identification design, type at viewing distance, layout reflow intent.
- **Build-only (needs staging or code):** actual focus order and keyboard operability, screen reader announcements, status message wiring (`aria-live`), reflow at 320px/400% zoom, text-spacing resilience, timeout behavior.

For build-only criteria at design stage, don't skip — **specify the requirement as an annotation finding** ("focus order must be …; announce save status via polite live region") so it lands in /handoff-spec and gets verified in /design-qa-checklist.

## Step 2 — Run the audit

Work through `resources/audit-checklist.md` (organized by WCAG principle — Perceivable, Operable, Understandable, Robust). Always cover the big five, which carry most real-world failures:

1. **Contrast** (1.4.3, 1.4.11) — text ≥ 4.5:1 (large ≥ 3:1); UI components, icons, focus indicators ≥ 3:1. Check against the client's actual tokens, and check states (hover, selected, disabled-but-must-read).
2. **Focus order & visibility** (2.4.3, 2.4.7, 2.4.11) — logical order matching visual flow; visible indicator on everything; focused element never hidden under sticky headers/toasts.
3. **Target size** (2.5.8) — 24×24px AA floor; flag anything under 44×44 on touch/gloved device classes as a healthcare finding even when AA-passing.
4. **Error identification** (3.3.1, 3.3.3) — errors named in text at the field, what-happened + how-to-fix, never color-alone.
5. **Status messages** (4.1.3) — saves, loads, async results announced without stealing focus.

## Step 3 — Healthcare-enterprise emphasis

Three patterns that fail clinical users and rarely show up in generic audits:

- **Session timeouts vs. clinical interruptions (2.2.1, 2.2.5)** — HIPAA-driven auto-logoff collides with interrupt-driven work. Require: warning before expiry, extend-without-data-loss, re-auth that restores the exact task state. A timeout that destroys a half-written note is an accessibility failure *and* a patient-safety hazard.
- **Color-only status in dashboards (1.4.1)** — census boards and worklists that encode acuity/abnormality purely in red/amber/green exclude color-blind clinicians (~8% of men). Require a redundant channel: icon, text, pattern, or position.
- **Type at viewing distance** — WCAG measures contrast and resize, not distance; a wall display read from meters away or a cart at arm's length needs larger minimums than desktop guidance. Set per-device type floors from `project-context.md` device classes and flag violations.

## Step 4 — Write findings

One finding per issue, numbered `A11Y-NN`, each with: **WCAG criterion + level (A/AA/AAA)** · severity (critical / high / moderate / low) · **who's affected** (screen reader users, keyboard-only, low vision, color-blind, cognitive load — be specific) · evidence (where, measured values: "3.1:1 measured, 4.5:1 required") · **fix** (token swap, pattern change, or annotation for eng) · effort (S/M/L). Also record **what passed** — clean criteria are evidence of coverage, and the client team deserves to know what's working.

## Step 5 — Summarize and tier

Use `resources/audit-report-template.md`: executive summary a stakeholder reads in 30 seconds, findings by principle, and a remediation plan tiered Tier 1 (Level A or critical/high AA — before next release), Tier 2 (remaining AA — this quarter), Tier 3 (AAA/best-practice — backlog). Write `ux/design/accessibility-audit.md`, artifact header per PIPELINE.md (`artifact: accessibility-audit`), `status: draft`.

## Quality bar

- Every finding cites criterion + level, names who's excluded, and has a concrete fix — no "improve accessibility".
- Contrast findings carry measured ratios; target-size findings carry measured px.
- The report separates verified findings from build-stage annotations — no false assurance from a design-stage audit.
- Healthcare items (timeouts, color-only status, viewing distance) explicitly checked or explicitly N/A.
- The client's a11y lead could hand this to eng without translating it.

## Handoff

End with: produced `ux/design/accessibility-audit.md` (status), conformance verdict against the client bar, counts by severity with Tier 1 named, build-only checks deferred to QA, and the suggested next step — fix Tier 1, then `/design-qa-checklist` pre-handoff ("QA re-verifies the a11y annotations in the real build"). Suggest, don't auto-run.
