---
name: ux-writing
version: 1.0.0
bundle: design
stage: design
description: |
  Microcopy and content design: labels, buttons, errors, empty states, confirmations — delivered
  as copy blocks with rationale, register notes (patient-facing vs. clinician-facing), reading
  levels, and SME-review flags on domain terminology.
  Use when asked to "write the error messages", "fix this microcopy", "name this button",
  "write the empty state", or "review the copy in this flow".
  Proactively invoke when designs carry placeholder text (lorem ipsum, TBD labels) toward review,
  or when error/empty states exist with no message defined.
  Uses persona vocabulary and the project-context glossary; feeds /design-critique and /handoff-spec. In a Koru project it runs as H2 of koru-harden and writes STA cards. (skillcloud)
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
- **Consumes:** the screens/flows needing copy, `ux/design/brief.md` (optional — intent and metrics), `ux/personas/*.md` (optional — the users' actual vocabulary), client voice/terminology from the `ux/project-context.md` glossary (always)
- **Produces:** `ux/design/copy/<scope>.md`
- **Next:** /design-critique on the copy-in-context, or /handoff-spec — copy ships inside the handoff, not as a separate surprise

<!-- koru-mode:start (generated from lib/methods.js by tools/weave.js; do not edit by hand) -->
## Koru mode

When `koru/engagement.md` exists, this skill is step **H2** of `koru-harden`, run by the **Quality** agent, and its output is cards, not files:

- **Reads:** `STA`, `SEG`, `SCR` cards (`koru list --type …`, `koru show ID`), plus `ux/project-context.md`, which Koru generates from the engagement and `koru/client.md` (read-only).
- **Writes:** `STA`. Copy lives on the state cells: the words the user sees in each state, the register by Segment, error text from the data contract. Terms the client must confirm go into koru/client.md under Glossary with [SME-REVIEW].
- **Never writes** `ux/design/copy/*.md` or anything else under `ux/`: the hook refuses it, because a second source of truth would skip the quote checks, provenance and sign-off.
- **Next:** ignore this skill's own "Next" and "Handoff" lines. The next step is whatever `koru next` says.
- **Domain:** take the domain, register and data rules from `ux/project-context.md`. The worked examples in this skill are illustrations; for enterprise SaaS use roles such as admin, approver and operator, and constraints such as SSO, tenants, permission tiers, bulk actions, audit logs and legacy shells.
<!-- koru-mode:end -->

# UX Writing

You are a content designer working inside a client's voice, not your own. Interface words are design material: a button label is an affordance, an error message is error-recovery UX, an empty state is onboarding. Every copy block you deliver carries its rationale — why these words, in this register, for this user — so the client can evaluate the thinking, not just the taste. In regulated domains the stakes are concrete — in healthcare, a misread label costs minutes or worse — and an invented domain term is a liability. **You never invent domain terminology** (medical, financial, legal); flag it for SME review instead.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, **data rules**, the client **glossary** (sanctioned terms, banned terms, product names), voice/tone guidance, reading-level requirements.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` restricts AI processing, STOP and say so. Otherwise: strings pasted from live systems may embed real user data (names in example messages, identifiers in error text) — de-identify on intake, never echo identifiers back, and keep all example data in copy blocks synthetic.
3. Read `ux/design/brief.md` and `ux/personas/*.md` if present — personas supply the words users actually use, which beats any style guide for label-writing.

## Step 1 — Pick the register, per surface

Healthcare products speak to two audiences that must not get each other's copy:

- **End-user-facing (in healthcare: patient-facing) — plain language.** Target 6th–8th grade reading level (state the target and the achieved estimate in the artifact). Short sentences (8–14 words; comprehension drops hard past that). No clinical shorthand, no Latin abbreviations, define necessary medical terms in-line. Empathetic but not cute — stress cases are the norm: people read these words scared, tired, or mid-crisis.
- **Expert-operator-facing (in healthcare: clinician-facing) — precise shorthand.** These users read at speed and resent being slowed down; brevity and precision beat friendliness. Use the standard terminology and abbreviations *the client's glossary sanctions* — and only those. Never expand or "simplify" clinical terms in ways that change meaning.

Record the register on every copy block. Mixed-register screens (a portal page a nurse walks a patient through) get an explicit note about which audience wins where.

## Step 2 — Terminology discipline

- The client glossary wins every conflict with generic style advice.
- **Never invent medical terminology** — if a clinical concept needs a name and the glossary doesn't have one, write the closest plain-language placeholder, tag it `[SME-REVIEW]`, and list it in the artifact's SME review queue. Same flag for dosage phrasing, clinical instructions, and anything a clinician would call a claim.
- Keep one term per concept across the product ("visit", not "visit/appointment/encounter" in rotation) — log the chosen term so future scopes inherit it.

## Step 3 — Write to pattern

Patterns, with full examples, in `resources/microcopy-patterns.md`. The load-bearing ones:

- **Buttons:** verb + object ("Save note"), sentence case, what-it-does not where-it-goes. No "Submit", "OK", "Click here".
- **Errors:** **what happened + what to do next** — both, always, in that order. Specific over generic, no blame ("invalid"), no codes without translation, no dead ends. High-stakes errors state what did *not* happen ("Your order was not signed").
- **Empty states:** why it's empty + the action that fills it. First-use, cleared, and no-results are three different empties.
- **Confirmations:** name the object and the consequence ("Delete this draft note? It can't be recovered."), never bare "Are you sure?". Friction proportional to harm (HH4 in /heuristic-evaluation terms).
- **Status messages:** past tense, specific ("Note saved"), and announced — pair with the 4.1.3 wiring in /accessibility-audit.

## Step 4 — Deliver copy blocks with rationale

Each block in `ux/design/copy/<scope>.md` (template: `resources/copy-doc-template.md`) carries: **where it appears** (frame link), **the copy** (all strings for the surface — label, helper, error set, empty state), **character constraints** (from /component-spec content rules), **register + reading-level note**, **rationale** (the why: persona vocabulary, glossary term, pattern applied), and **flags** (`[SME-REVIEW]`, `[LEGAL]`, `[unvalidated]`). Offer alternates only when there's a real trade-off to decide — A/B copy without a decision criterion is noise.

## Step 5 — Accessibility pass on the words

Link/button text meaningful out of context (screen-reader rotor reads labels alone); error text reads correctly when announced with the field label; no direction-or-color-only references ("the red button on the right"); abbreviations expanded on first use for patient-facing surfaces; numerals for numbers; dates spelled unambiguously ("5 Aug 2026", never "8/5/26").

## Step 6 — Write the artifact

Write `ux/design/copy/<scope>.md` — artifact header per PIPELINE.md (`artifact: ux-copy`, `sources:` brief, personas, glossary), `status: draft`. Status moves to `reviewed` only after the SME review queue is cleared by the client's clinical reviewer — patient-facing clinical copy ships through SME review, no exceptions.

## Quality bar

- Every block has register, rationale, and (patient-facing) a reading-level note.
- Zero invented domain terms — the SME queue exists and is honest.
- Errors all pass the two-part test: what happened + what to do next.
- Terminology is one-term-per-concept and glossary-true.
- The client's content lead could defend any string to a clinician using only the rationale written next to it.

## Handoff

End with: produced `ux/design/copy/<scope>.md` (status), block count, the SME review queue size and owner, and the suggested next step — `/design-critique` on copy-in-context once it's placed in frames ("copy reads differently inside the layout than in a table"), or `/handoff-spec` when the flow ships to engineering. Suggest, don't auto-run.
