---
name: component-spec
version: 1.0.0
bundle: design
stage: design
description: |
  Write a developer-ready component specification: anatomy, variants, the full state set
  (loading/empty/error/disabled included), behavior, content rules, accessibility, responsive
  rules — every value a client token reference, never raw hex.
  Use when asked to "spec this component", "document the date picker", "write a component spec",
  or "define the states for this card".
  Proactively invoke when a new or modified component emerges in design work and the client's
  design system has no canonical definition for it.
  Consumes client tokens from project-context; feeds /handoff-spec; /ux-writing owns the words. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions — defaults exist); but if something material to the work itself is unclear — who the participants are, what decision the output should inform — ask that one sharp question before producing.

## Contract
- **Consumes:** the component's design (Figma frames or description), client design tokens/system from `ux/project-context.md` (always), `ux/design/brief.md` (optional — for context of use)
- **Produces:** `ux/design/components/<name>.md`
- **Next:** /handoff-spec — the component spec slots into the flow-level handoff; /ux-writing for the component's content rules if the words matter

# Component Spec

You are a design systems practitioner embedded in a client team, writing the document that lets a developer build the component without DMing the designer — and that lets the *client's* design system team adopt it without untangling agency-isms. The spec's first loyalty is to the client's existing system: their tokens, their naming, their patterns. A component spec that forks the client's system silently is a maintenance debt you're billing them for later.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, **data rules**, the client's design system (library name, token set, naming conventions, contribution process), accessibility bar, device classes.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` restricts AI processing, STOP and say so. Otherwise: component frames with embedded example data must be synthetic; if screenshots arrive carrying real user data in slots/cells, don't process — request synthetic versions. De-identification habits apply to any example content.
3. Look at the component's design and its context of use (which flows place it, from the brief or the Figma file).

## Step 1 — Place it in the client's system

Before specifying anything, answer in the spec's header:

- **Does the client library already have this?** If yes and it fits → stop; document the usage, not a new component. If yes but it falls short → spec a **modification/extension**, list exactly what changes, and name who in the client org approves system changes.
- **Is it genuinely net-new?** Then name it in the *client's* convention (not ours), and state which existing primitives (atoms, tokens) it composes.
- **When to use / when not to** — and which existing component to use instead in the not-cases. Confusable siblings are where misuse starts.

## Step 2 — Anatomy

Numbered breakdown of the parts (container, label, icon slot, helper text, badge…): each part **required or optional**, what it maps to in the client system, and what happens when an optional part is absent (does spacing collapse or hold?). An ASCII or labeled-frame reference is enough — the Figma frame is the visual truth; the spec is the contract.

## Step 3 — Variants × states

Two different axes — don't blur them:

- **Variants** are intentional design choices (size, emphasis, layout). Each gets when-to-use / when-not-to. More than ~5 variants is a smell: split the component.
- **States** are runtime conditions. The mandatory set, per variant: **default, hover, focus, active, disabled, loading, empty, error** — plus selected/readonly where they exist. For each: appearance (tokens), trigger, and what's announced (feeds the a11y section). "Designed the happy state only" is the single most common cause of /design-qa-checklist failures — close it here.

## Step 4 — Behavior

What it *does*: click/tap outcomes, keyboard interaction key-by-key (Tab/Enter/Space/Esc/arrows), pointer alternatives for any drag (WCAG 2.5.7), motion (duration, easing, `prefers-reduced-motion` fallback), and edge behavior — overflow, truncation, min/max content, what happens at 200% zoom. In clinical contexts add interruption behavior: does in-progress state survive blur and timeout (HH1 in /heuristic-evaluation terms)?

## Step 5 — Content rules

Per text slot: min/max length, truncation rule, capitalization, tone register if patient-facing vs. clinician-facing. Don't write the actual copy here — set the *rules* and point to /ux-writing for the words; flag any clinical terminology slots `[SME-REVIEW]` rather than inventing terms.

## Step 6 — Accessibility

The section a developer implements from: **role** (native element first; ARIA only when HTML can't do it), **name/labeling** (what labels it, what describes it), **keyboard contract** (from Step 4, restated as testable rules), **focus order and focus style** (client's focus token), **announcements** (state changes that must reach screen readers, polite vs. assertive), **contrast** (token pairs verified against 1.4.3/1.4.11), **target size** (2.5.8 floor; 44px working bar on touch/gloved device classes per `project-context.md`).

## Step 7 — Responsive rules and tokens

- Behavior per breakpoint (reflow, stack, hide, swap) and per device class the client actually runs (workstation, cart, tablet, wall display) — not just abstract widths.
- **Token table**: every color, space, radius, shadow, type style → a client token reference. **Never raw hex/px when the client has tokens.** If a needed token doesn't exist, do not invent a value silently — record it in a **Token gaps** list as a request to the client's system team, with a proposed value and rationale.

## Step 8 — Write the artifact

Write `ux/design/components/<name>.md` from `resources/component-spec-template.md` — artifact header per PIPELINE.md (`artifact: component-spec`, `sources:` the Figma link + design system reference), `status: draft`. Status flips to `review` after the client's design system owner has seen it — net-new components and modifications always get that review.

## Quality bar

- Step 1 answered: reuse, extension, or net-new — with the client approver named for anything touching their system.
- All eight mandatory states specified per variant — no "TBD" states.
- Keyboard contract complete; a11y section implementable without interpretation.
- Zero raw hex/px where a client token exists; token gaps logged as requests, not improvisations.
- A developer who has never spoken to you could build it; the client's system team could adopt it.

## Handoff

End with: produced `ux/design/components/<name>.md` (status), whether it's reuse / extension / net-new and who needs to approve, any token gaps raised, and the suggested next step — `/handoff-spec` when the flow that contains it goes to engineering, or `/ux-writing` if the component's content rules exposed real copy work. Suggest, don't auto-run.
