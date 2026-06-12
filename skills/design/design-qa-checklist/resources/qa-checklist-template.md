---
artifact: qa-checklist
project: <client codename>
created_by: skillcloud/design-qa-checklist v<VERSION>
sources: [ux/delivery/handoff-<scope>.md, "build <version/commit/tag>", ux/design/copy/<scope>.md]
status: draft
updated: <yyyy-mm-dd>
---

# Design QA — <client codename>: <scope>

**Spec under test:** `ux/delivery/handoff-<scope>.md` @ <date/status>
**Build:** <staging URL + version/commit/tag>
**Environments:** <browsers × viewports × device classes — incl. cart/tablet classes where in scope>
**Data:** synthetic/test patients only — PHI rules per `engagement-guardrails`
**Round:** <1 | 2 — prior round items referenced by QA-NN>

## Per-flow checks

### Flow F1 — <name>

#### Visual fidelity

| Check | Result | Evidence (expected vs. actual) |
|---|---|---|
| Layout matches `<frame link>` (01–NN) | pass / fail / n.a. | |
| Hierarchy: primary action dominant per spec | | |
| Icons/imagery correct asset + size | | |

#### Spacing & typography vs. tokens

| Check | Result | Evidence |
|---|---|---|
| Spacing = spec'd tokens (inspect computed) | | <e.g. "row gap 16px; spec `space-md` = 24 — QA-03"> |
| Type styles = spec'd tokens (family/size/weight/line-height) | | |
| No hardcoded values where tokens exist (visually identical still fails) | | |

#### States (walk the handoff matrix — force each, don't assume)

| Screen | Empty | Loading | Error | Offline | Max data | Permission-denied | Interruption/timeout |
|---|---|---|---|---|---|---|---|
| 01 <step> | p/f/n.a. | | | | | | <survives lock + resumes per spec?> |
| 02 <step> | | | | | | | |

#### Responsive & device classes

| Context | Result | Evidence |
|---|---|---|
| <breakpoint / device class> reflow per spec | | |
| No overflow/clip at min width | | |
| Touch targets ≥ class floor (measure) | | |

#### A11y spot checks (handoff AX-NN = acceptance criteria)

| Check | Result | Evidence |
|---|---|---|
| AX-01 focus order as annotated (keyboard walk) | | |
| Focus visible everywhere; no traps; nothing hidden under sticky UI | | |
| AX-0_ status announcements (live region present + fires) | | |
| Contrast spot-measure on suspect pairs | | <measured ratio> |
| Automated scan (axe or equiv.): no new critical/serious | | |

#### Copy match (source: ux/design/copy/<scope>.md)

| Check | Result | Evidence |
|---|---|---|
| Strings exact (text, case, punctuation) | | |
| Errors still pass two-part test in situ | | |
| No lorem ipsum / stale draft strings | | |

<!-- Repeat per flow. -->

## Punch list (severity-ranked, batched by screen)

| # | Sev | Screen | Finding | Spec ref | Suggested fix | Status |
|---|---|---|---|---|---|---|
| QA-01 | blocker | <…> | <…> | <frame / AX-NN / I-NN / copy block> | <token/property where cheap to name> | open |
| QA-02 | major | | | | | open |
| QA-03 | minor | | | | | open |

**Severity:** blocker — before release · major — this sprint · minor — next sprint · cosmetic — backlog

## Spec gaps (route to /handoff-spec, not eng)

| # | Where | What the spec didn't say | Proposed resolution |
|---|---|---|---|
| SG-01 | | | |

## Summary

| | blocker | major | minor | cosmetic | total |
|---|---|---|---|---|---|
| Round 1 | | | | | |

**Verdict:** <ship-ready / ship after blockers / needs a fix round> — <one line>
**First-pass rate:** <checks passed / checks run>
