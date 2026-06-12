---
artifact: design-rationale
project: <client codename>
created_by: skillcloud/design-rationale v<VERSION>
sources: [ux/design/brief.md, ux/design/critiques/<yyyy-mm-dd>-<scope>.md]
status: draft
updated: <yyyy-mm-dd>
---

# Design Rationale — <client codename>

Running decision log. Newest first. Superseded entries stay — the trail is the point.

## Index

| ID | Decision | Status | Date |
|---|---|---|---|
| DEC-03 | <…> | proposed | <yyyy-mm-dd> |
| DEC-02 | <…> | accepted | <yyyy-mm-dd> |
| DEC-01 | <…> | superseded by DEC-03 | <yyyy-mm-dd> |

---

## DEC-NN — <decision title>

- **Status:** proposed / accepted / superseded by DEC-NN
- **Date:** <yyyy-mm-dd>
- **What was decided:** <specific and actionable — the thing a developer or designer would build differently because of this entry>
- **Alternatives considered:**
  - <alternative A> — <why it lost, stated fairly>
  - <alternative B> — <…>
- **Why:** <the reasoning, traced to evidence: INS-NN / C-NN / HE-NN / A11Y-NN / brief metric / usability result / constraint. If untraced: [judgment call] + the logic>
- **Evidence link:** <artifact path or Figma frame link>
- **Trade-offs accepted:** <what this costs; the condition that should trigger a revisit>
- **Signed off:** <role, e.g. "client design lead"> — <date> — <written / verbal, where>

---

## Worked example (synthetic — delete in real use)

## DEC-02 — Worklist keeps single-column layout; acuity moves to leading badge

- **Status:** accepted
- **Date:** 2026-03-12
- **What was decided:** The nurse worklist stays single-column ordered by acuity, with a text+icon acuity badge leading each row. The two-pane "list + preview" layout is rejected for v1.
- **Alternatives considered:**
  - Two-pane list + preview — better for reviewing detail without navigation, but eats horizontal space the workstation-on-wheels screens don't have, and testing showed preview content was read instead of acted on.
  - Color-coded row backgrounds for acuity — fastest to scan, but fails 1.4.1 (color-only) and washed out on ward displays.
- **Why:** Cart screens are 1366px and shared (project-context, device classes); C-04 found row-level actions were missed in the two-pane variant; A11Y-03 flagged color-only acuity. Badge with text+icon answers both. [INS-07: nurses triage by acuity first, name second.]
- **Evidence link:** ux/design/critiques/2026-03-05-worklist.md; Figma frame `worklist / 04 — acuity badge`
- **Trade-offs accepted:** Detail review costs one navigation; revisit if per-shift order volume makes round-trips a measured time sink.
- **Signed off:** client design lead — 2026-03-12 — verbal, design review; confirmed in review notes.
