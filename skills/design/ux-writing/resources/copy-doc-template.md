---
artifact: ux-copy
project: <client codename>
created_by: skillcloud/ux-writing v<VERSION>
sources: [ux/design/brief.md, ux/personas/<slug>.md, "project-context glossary"]
status: draft
updated: <yyyy-mm-dd>
---

# Copy — <client codename>: <scope, e.g. "appointment-booking flow">

**Registers in scope:** patient-facing (target: 6th–8th grade) · clinician-facing (glossary shorthand)
**Glossary version/date used:** <from project-context.md>
**Review gate:** patient-facing clinical copy requires SME sign-off before `status: reviewed`

## Copy blocks

### CB-01 — <surface, e.g. "Booking confirmation screen"> · patient-facing

**Where:** <Figma frame link>
**Constraints:** <from component content rules — e.g. title ≤40 chars, body ≤2 lines>

| String | Copy |
|---|---|
| Title | <…> |
| Body | <…> |
| Primary action | <verb + object> |
| Secondary action | <…> |

- **Reading level:** target 6th–8th grade; achieved ≈ <estimate + how estimated>
- **Rationale:** <why these words — persona vocabulary ("P03 says 'visit', never 'encounter'"), pattern applied, glossary terms used>
- **Flags:** <none / [SME-REVIEW] / [LEGAL] / [unvalidated]>

### CB-02 — <surface, e.g. "Order save failure"> · clinician-facing

**Where:** <Figma frame link>
**Constraints:** <…>

| String | Copy |
|---|---|
| Error title | <what happened — e.g. "Order not signed"> |
| Error body | <what to do next — specific> |
| Action | <recovery verb> |

- **Rationale:** <high-stakes error: states what did NOT happen; terminology per glossary entry "<term>">
- **Flags:** <…>

<!-- Repeat per surface. Keep error sets together: every failure mode for the surface in one block. -->

## Error message inventory — two-part test

Every error in scope, checked: **what happened + what to do next.**

| # | Where | What happened (copy) | What to do next (copy) | Register | Pass |
|---|---|---|---|---|---|
| E-01 | | | | | yes/no |

## Terminology decisions (this scope — future scopes inherit)

| Concept | Term used | Rejected alternatives | Source |
|---|---|---|---|
| <e.g. scheduled clinical interaction> | visit | appointment, encounter | persona vocabulary P01/P03; glossary |

## SME review queue

| # | Block | String | Question for SME | Owner | Status |
|---|---|---|---|---|---|
| 1 | CB-__ | <…> | <e.g. "is this plain-language gloss of the procedure name clinically accurate?"> | <client clinical reviewer> | open |

## Accessibility notes

- <links/buttons meaningful out of context — confirmed per block>
- <error strings read correctly with field label announced first>
- <no color/direction-only references; abbreviations expanded on first patient-facing use>
