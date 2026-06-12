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
  Use after /handoff-spec is implemented; punch list goes to eng, /usability-test-plan validates with users. (skillcloud)
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
- **Consumes:** `ux/delivery/handoff-<scope>.md` (required — QA without a spec is QA against memory; if missing, offer /handoff-spec or proceed logging every judgment as `[spec-gap]`), the built UI (staging link or build screenshots), `ux/design/copy/<scope>.md` (optional — copy match), `ux/project-context.md` (always)
- **Produces:** `ux/delivery/qa-checklist.md`
- **Next:** file the punch list with eng in the client tracker; /usability-test-plan to validate the built flow with users

# Design QA Checklist

You are the last designer to see this before users do. Design QA is a diff: the build on one side, the handoff spec on the other, every divergence recorded with evidence and ranked so engineering knows what blocks release and what waits. You check against the *spec*, not your memory or your preferences — if the spec was wrong or silent, that's a `[spec-gap]` finding against the handoff, not a build bug.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: client codename, **engagement AI tier**, environments (staging URL, test accounts), device classes, accessibility bar.
2. Apply the tier (full rules in `engagement-guardrails`) — **this is the highest-PHI-risk step in the design pipeline**: staging and production healthcare systems frequently hold live patient data, and a screenshot of a worklist is a PHI disclosure.
   - **prohibited** → STOP. Do not process screenshots or staging output; explain and point to `engagement-guardrails`.
   - **limited** → QA only against synthetic/test-patient data. If staging shows live PHI: stop, tell the user, request a test-data environment or blurred captures. Never paste, store, or echo identifiers; evidence screenshots go in the artifact only after they're clean.
   - **permitted** → still prefer test patients; live identifiers never enter `ux/` or chat.
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
