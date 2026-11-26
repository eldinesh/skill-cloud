---
artifact: ticket
id: TKT-01
project: <project>
created_by: skillcloud/ship-tickets v<VERSION>
stage: ship
sources: [ux/harden/hardening-matrix.md, ux/ship/build-report.md, ux/structure/flows/<flow>.md, ux/synthesis/jobs-to-be-done.md]
status: draft
tracker_key: ""            # filled after a person approves the push
updated: <yyyy-mm-dd>
---

# TKT-01 · <Verb + object>

**User story:** As a <role>, I want <thing>, so that <outcome>.
**Traces:** FL-01.S01, FL-01.S02 · JOB-01 · D-007, DEC-03

**Intent:** why this exists (JOB-01: book a suitable room fast at peak times)
- **Must not change:** <what the design protects, e.g. "the reason line sits above the Book button">
- **Can flex:** <where engineering judgement is welcome, e.g. "skeleton shimmer, list page size 25–100">
- **Edge cases that matter:** <from the prioritised list: now cases this ticket owns>

**Context:** brief `ux/design/brief.md` · prototype `ux/explore/<dir>/prototype.html?state=ready` · deliverable route `/` · Figma <frame link or none>

## Acceptance criteria
| # | Given / when / then | e2e test |
|---|---|---|
| 1 | Given rooms are free, when a member opens Today, then one suggestion shows above the list with its reason. | FL-01.S01 · ready · member |
| 2 | Given no room fits, when a member opens Today, then no suggestion shows and the empty message offers tomorrow. | FL-01.S01 · empty · member |

## States covered
ready · empty · loading · error · ai-thinking · ai-low-confidence · ai-off

## Screenshots
| State | File |
|---|---|
| ready | img/TKT-01-ready.png |

## Tokens used
`--color-ai`, `--color-ai-subtle`, `--space-4`, `--radius-md` · token requests: none

## API / data assumptions (unconfirmed)
- <assumption> (from feasibility FL-01.S01)

## Out of scope
- <what, and which ticket or release has it>

## Open questions
| Question | Who | By when |
|---|---|---|
