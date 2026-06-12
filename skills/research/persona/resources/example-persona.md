# Worked example — persona (fully synthetic)

Fictitious throughout: "Project LANTERN" is an invented engagement; participants are P-numbers; no real people, organizations, or patient data. Calibrate tagging density and context-of-use specificity against this.

---

# The Coordinating Nurse — primary persona

**Scope:** inpatient order tracking and shift handoff (LANTERN)
**Built from:** P01, P03, P05, P07 (4 of 7 participants, S1–S2) · **Evidence strength:** solid

> "If I don't write it down myself, it didn't happen as far as my shift is concerned." — P03

## Goals
- **End:** hand off the unit with zero pending items unaccounted for (P01, P03, P05)
- **End:** know within a minute whether an order has landed, without leaving the floor (P01, P07)
- **Experience:** feel defensible — every status answer backed by something she can point to (P03, P05)

## Behaviors
- Maintains a personal paper sheet reconciled against the system at shift start and end; the sheet, not the system, is the handoff source of truth (P01, P03, P05)
- Walks to the receiving department or phones when status is ambiguous rather than waiting on the system (P01, P07)
- Batches documentation to end of shift, reconstructing from the sheet and memory (P03, P05)
- Checks the worklist on arrival even before coffee `[assumption]` — implied by P01's timeline; confirm by observation

## Pain points
| Pain | Severity | Consequence | Evidence |
|---|---|---|---|
| Order status invisible across role boundaries | blocker | walking/phoning interrupts care; status guesswork at handoff | P01, P03, P07 |
| Badge-tap session reset loses screen context | friction | re-navigation after every interruption; abandons mid-task lookups | P05, P07 |
| End-of-shift documentation from memory | friction | detail loss; overtime minutes pile up | P03, P05 |

## Context of use
- **Shift pattern:** 12-hour shifts, handoff ~7a/7p; nights run leaner so cross-role answers take longer (P01, P03)
- **Interruption profile:** pulled away every few minutes — call lights, phone, colleagues; resumption means re-finding both the patient and the screen (P05, P07)
- **Workstation reality:** shared workstations and a roaming cart; badge-tap auth resets the session and any unsaved state; personal phones barred from clinical use on the unit (P05, P07)
- **Protocol constraints:** unit policy requires handoff against the standard checklist; her sheet mirrors it informally (P03)

## Relationships
- Depends on: pharmacy for order verification timing (P01, P07); unit clerk for incoming-call triage (P05)
- Depended on by: oncoming nurse, who inherits exactly what the sheet says (P01, P03)

## Design implications
1. Therefore, cross-role status must be glanceable from the floor — the competition is a phone call, not another module.
2. Therefore, any flow longer than ~30 seconds must survive a badge-tap session reset mid-task.
3. Therefore, handoff support should formalize what the paper sheet already does, not replace it with a new mental model.
4. Therefore, documentation capture closer to the moment of care reduces the end-of-shift memory tax — but must not add mid-care interaction cost.
