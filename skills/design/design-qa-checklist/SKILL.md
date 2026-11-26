---
name: design-qa-checklist
version: 1.0.0
bundle: design
stage: deliver
description: |
  Implementation QA against the handoff spec: per-flow pass/fail/n.a. checks with evidence for
  visual fidelity, spacing/typography vs. tokens, states, responsive, a11y spot checks, and copy
  match — ending in a severity-ranked punch list engineering can work straight down.
  Use when asked to "QA the build", "check the implementation against the design",
  "design QA this staging link", or "does the build match Figma".
  Proactively invoke when the user shares staging links or build screenshots for designs that
  have a handoff spec on file.
  Use after /handoff-spec is implemented; punch list goes to eng, /usability-test-plan validates with users. In a Koru project it runs as S5 of koru-ship and writes QAR cards. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$(command -v skillcloud-update-check >/dev/null 2>&1 && skillcloud-update-check 2>/dev/null || "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f koru/engagement.md ] && { (command -v koru >/dev/null 2>&1 && koru context || node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" context) >/dev/null 2>&1; echo "KORU_PROJECT: yes (follow Koru mode)"; }
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `${CLAUDE_PLUGIN_ROOT}/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `KORU_PROJECT: yes`: read **Koru mode** below before anything else. It overrides this skill's Produces, Next and Handoff.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions — defaults exist); but if something material to the work itself is unclear — who the participants are, what decision the output should inform — ask that one sharp question before producing.

## Contract
- **Consumes:** `ux/delivery/handoff-<scope>.md` (required — QA without a spec is QA against memory; if missing, offer /handoff-spec or proceed logging every judgment as `[spec-gap]`), the built UI (staging link or build screenshots), `ux/design/copy/<scope>.md` (optional — copy match), `ux/project-context.md` (always)
- **Produces:** `ux/delivery/qa-checklist.md`
- **Next:** file the punch list with eng in the client tracker; /usability-test-plan to validate the built flow with users

<!-- koru-mode:start (generated from lib/methods.js by tools/weave.js; do not edit by hand) -->
## Koru mode

When `koru/engagement.md` exists, this skill is step **S5** of `koru-ship`, run by the **Engineer** agent, and its output is cards, not files:

- **Reads:** `TKT`, `STA`, `API` cards (`koru list --type …`, `koru show ID`), plus `ux/project-context.md`, which Koru generates from the engagement and `koru/client.md` (read-only).
- **Writes:** `QAR`. One QA record per build (koru new QAR "…"): the build URL, the card versions compared, and one evidence row per acceptance criterion with pass or fail.
- **Never writes** `ux/delivery/qa-checklist.md` or anything else under `ux/`: the hook refuses it, because a second source of truth would skip the quote checks, provenance and sign-off.
- **Next:** ignore this skill's own "Next" and "Handoff" lines. The next step is whatever `koru next` says.
- **Domain:** take the domain, register and data rules from `ux/project-context.md`. The worked examples in this skill are illustrations; for enterprise SaaS use roles such as admin, approver and operator, and constraints such as SSO, tenants, permission tiers, bulk actions, audit logs and legacy shells.
<!-- koru-mode:end -->

# Design QA Checklist

You are the last designer to see this before users do. Design QA is a diff: the build on one side, the handoff spec on the other, every divergence recorded with evidence and ranked so engineering knows what blocks release and what waits. You check against the *spec*, not your memory or your preferences — if the spec was wrong or silent, that's a `[spec-gap]` finding against the handoff, not a build bug.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, **data rules**, environments (staging URL, test accounts), device classes, accessibility bar.
2. Data rules (full rules in `engagement-guardrails`) — **this is the highest-exposure step in the pipeline**: staging and production systems frequently hold real user data (in healthcare, live PHI), and a screenshot of a live worklist is a disclosure. If `project-context.md` restricts AI processing, STOP. Otherwise QA from scrubbed captures (blurred/synthetic), never echo visible identifiers, and file live data found in the build's demo content as a defect.
3. Read `ux/delivery/handoff-<scope>.md` — the spec under test. Note its state matrix, a11y annotations (`AX-NN`), interaction specs (`I-NN`), and open questions (unanswered ones are about to become findings).

## Step 1 — Scope the pass

From the handoff's flow inventory: which flows, which environments (browsers, viewports, device classes — include the workstation-on-wheels/tablet classes from `project-context.md`, not just desktop Chrome), and which build version (commit/release tag — QA against a moving target is unrepeatable). Record all of it in the artifact.

## Step 2 — Run the checks, per flow

Work through `resources/qa-checklist-template.md`. Every check gets **pass / fail / n.a.** — n.a. requires a reason — and every fail gets an **evidence note**: where (URL + screen), expected (spec reference: frame link, token, `AX-NN`), actual (measured value or clean screenshot). The six check families:

1. **Visual fidelity** — layout, alignment, hierarchy against the linked frames. Eyeball first, then measure where it looks off.
2. **Spacing/typography vs. tokens** — inspect computed values; divergences reported as token deltas ("16px where `space-md` (24) specced"), and hardcoded values where tokens exist are findings even when visually identical — they break the next theme update.
3. **States** — walk the handoff's state matrix cell by cell: empty, loading, error, offline, max-data, permission-denied. Force them (throttle, kill network, seed data) rather than trusting they exist. Include the clinical interruption checks: lock/timeout and resume behavior as specced.
4. **Responsive/device classes** — each breakpoint and device class in scope: reflow, overflow, target sizes at touch/glove class.
5. **A11y spot checks** — the handoff's `AX-NN` annotations as acceptance criteria: keyboard walk (order, visible focus, no traps), contrast spot-measure on suspect pairs, status announcements via screen reader or live-region inspection, automated scan (axe or equivalent) for regressions. This verifies the `[build]` items /accessibility-audit deferred; it does not replace a full audit.
6. **Copy match** — strings against `ux/design/copy/<scope>.md`: exact text, casing, punctuation; error messages still pass the two-part test in situ; no lorem ipsum, no stale strings from drafts.

## Step 3 — Rank the punch list

Each fail becomes a punch-list item, severity-ranked:

| Severity | Meaning | SLA framing |
|---|---|---|
| **blocker** | Broken function, missing critical state, a11y failure that excludes a user group, PHI exposure | before release |
| **major** | Wrong behavior or state, misleading copy, spec'd interaction absent | this sprint |
| **minor** | Token deltas, spacing drift, non-blocking visual divergence | next sprint |
| **cosmetic** | Pixel-level polish only designers notice | backlog |

Batch items by screen, cite the spec line each violates, and write the suggested fix where it's cheap to name (the token, the property). Tag `[spec-gap]` items separately — those route back to /handoff-spec, not to eng.

## Step 4 — Write the artifact and file the issues

Write `ux/delivery/qa-checklist.md` from the template — artifact header per PIPELINE.md (`artifact: qa-checklist`, `sources:` the handoff spec + build version), `status: draft`. Then offer the punch list formatted for the client's tracker (one issue per item, batched by screen, evidence attached). Re-QA after fixes appends a new round to the same artifact — first-pass rate is a number the client cares about.

## Quality bar

- Every check pass/fail/n.a. — no blanks, every n.a. justified, every fail evidenced with expected-vs-actual.
- Checked against the pinned spec and build version; both recorded.
- State matrix walked completely — forced, not assumed.
- All `AX-NN` annotations verified or explicitly blocked-with-reason.
- Punch list workable by an engineer who never saw the designs; spec-gaps routed to the spec, not blamed on the build.

## Handoff

End with: produced `ux/delivery/qa-checklist.md` (status), pass/fail counts per flow, blocker count by name, spec-gaps found, and the suggested next step — file the punch list with eng (offer the formatted batch), re-QA after the blocker fixes, and `/usability-test-plan` once the build is faithful ("fidelity confirmed — now test whether the design itself works for users"). Suggest, don't auto-run.
