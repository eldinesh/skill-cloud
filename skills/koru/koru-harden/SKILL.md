---
name: koru-harden
version: 3.0.0-alpha.1
bundle: koru
stage: harden
description: |
  Koru stage 3, Harden: turn "looks right" into rows a checker can count. Builds the state
  matrix (screen × role × state with the Koru state taxonomy), runs the slow-motion walk and
  feasibility review, the trust audit for AI, WCAG 2.2 AA and element classification against
  the client's design system, and sets Steer metrics.
  Use when asked to "harden the design", "what states are missing", "edge cases", "accessibility
  pass", "classify the components", "is this feasible", or "get us to the Harden gate".
  Proactively invoke when a Koru project has a chosen, signed Direction and its Screens have no
  State cards yet. (skillcloud)
---

## Preamble (run first)

```bash
command -v koru >/dev/null 2>&1 || koru() { node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" "$@"; }
koru where --brief 2>/dev/null || echo "NO_KORU_PROJECT"
koru list --type SCR 2>/dev/null; koru list --type STA 2>/dev/null | tail -n 3
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

## Contract
- **Consumes:** the chosen DIR (final), its SCR cards and prototype, `koru/design-system.md`, `koru/engagement.md` (`design_system`, `ai_in_product`, `product_state`), `ux/project-context.md` when present (data rules per `engagement-guardrails`)
- **Produces:** STA cards (one per matrix cell), classified Elements on every SCR, MET cards, DEC cards for feasibility limits, an updated prototype showing every state, a REV signed by the engineer, rulebook owner and design lead
- **Next:** the harden checker, the Harden gate, then `koru-ship`

# Harden: where prototypes break, made checkable

Harden's depth comes from three things: a state taxonomy, a slow-motion walk that hunts hidden problems, and a classification of every element against the client's design system. Here you are most useful at enumerating; the designer completes each cell.

## Who does what (AI Fluency: delegation)

| Step | Claude | Shared | People only |
| --- | --- | --- | --- |
| State matrix | Enumerates every cell, adds states to the prototype | Designer completes each cell | |
| Slow-motion walk | Asks the four questions at every step | Dispositions | Engineer's feasibility answer |
| Trust audit (AI) | Audits each touchpoint | Risk class | Autonomy level |
| Accessibility | Automated scan, design-time checks | | Keyboard pass by a person |
| Classification | Proposes a class per element | | Design engineer confirms; "new" needs the client's system owner |
| Metrics | Drafts from Steer | | Thresholds |

## Entry and exit

- **Entry:** the chosen Direction is final.
- **Exit:** every State cell designed or "n/a: reason"; every element classified; at least one Metric final; the review record signed by the engineer, rulebook owner and design lead. The gate counts these; a blank cell or an unclassified element stops it.

## H1. State matrix with a taxonomy

For every Screen, enumerate screen × role × state and create one STA card per cell:
`koru new STA "<screen> · <role> · <state>" --field screen=SCR-001 --field role=<role> --field state=<state>`

The taxonomy:
- **Data:** first-use empty (with the next action) · zero results (with "clear filter") · initial loading · refresh loading · partial · success · stale or offline · concurrent edit.
- **Errors:** field-level · page-level · recoverable · fatal. An empty state is never used for an error.
- **Roles and permissions:** who can see, change, approve and undo; whether a forbidden control is hidden or disabled, and why.
- **Enterprise scale:** 1 and 10,000 rows, long names, text expansion for translation, bulk actions across pages with partial failure and undo, an audit trail with AI actions attributed to AI.
- **AI states** (when `ai_in_product` is not none): thinking, low confidence, wrong answer, user override, undo, agent action log, model unavailable.

The designer resolves each cell: `resolution: designed`, or `resolution: n/a: <reason>`. A blank cell always means a gap. Then add the missing states to the prototype so its review bar shows every row. Coach point: ask the designer to resolve the first three cells before you propose any.

## H2. The slow-motion walk and feasibility

Walk the flow step by step and ask four questions of each step: does it need new technical work? does it assume how parts fit together? does it assume a design solution exists? does it hide a hard decision? Each hole gets one disposition: patch it, declare it out of bounds, or cut it. The engineer reviews feasibility by answering "is this possible in N days?", never "is this possible?". Each limit becomes a Decision (`koru decide new "…" --affects SCR-…`), which flags the cards it touches.

## H3. Trust audit (AI products)

Audit every AI touchpoint against SHAPE's four principles (predictable, controllable, explainable, conversational) and Microsoft's guidelines for when AI is wrong and over time. Classify each touchpoint by risk: high means less autonomy, medium means AI suggests and a person approves, low can be automated. A Direction goes back to Explore only when it fails the trust audit or feasibility in a way no state or pattern can fix.

## H4. Accessibility and system fit

- **WCAG 2.2 AA at design time** with `accessibility-audit`: focus not obscured (2.4.11), dragging alternatives (2.5.7), 24-pixel targets (2.5.8), consistent help (3.2.6), no redundant entry (3.3.7), accessible authentication (3.3.8), and status messages for loading, success and errors. An automated scan, plus a person on the keyboard.
- **Element classification** on each SCR card's Elements table, one class per element: **use** (exists, works) · **configure** (exists, needs settings) · **extend** (exists, lacks a state or variant) · **recipe** (a combination of existing parts) · **snowflake** (a one-off, with a review date) · **new** (needs a Decision and the client's system owner) · **work-around** (legacy shells: records the constraint). Elements marked "use" that are detached or override tokens fail.
- **No design system** (`design_system: none` or `brand only`): snowflakes collect into a Koru seed library with an owner, in W3C design token format.
- Run `ux-writing` for every state's copy; placeholder text never crosses this gate.
- **Run the tools, not just the checklist.** `koru ds check` (every token pair through WCAG contrast, every new component has its spec card, approval current) and `koru audit` (each prototype opened in a real browser, in every declared state, at 1440, 1366 × 768, 1024 and 390 wide: axe-core WCAG 2.2 A/AA rules, keyboard order, visible focus and traps, 24-pixel targets, sideways scrolling, script errors, the design-system lint, and every designed State card reachable). The Harden gate counts both: every prototype audited as it stands, with no blocking findings. Screenshots land in `koru/generated/audit/`.
- **Owed by people** (the audit prints the list): a screen-reader pass on the main flow, zoom to 200% and 400%, forced colours, reduced motion, and a plain-language read of every state's copy. Record each in the review's findings.

## H5. Steer plan

Every product gets at least its Problem's measure as a Metric: `koru new MET "…" --field level=core --field threshold="…"` with its feedback loop. AI products add Steer's levels with `sense-shape-steer` (Steer): core performance, health (override rate, latency), feedback loops, and a north-star sentence.

## Pause-point checklist (killer items)

| Pause point | Check |
| --- | --- |
| Harden exit | No blank cells · every element classified · `koru audit` clean on every prototype · `koru ds check` clean and approved · person-owed passes recorded · trust audit passed (AI) · every hole has a disposition · feasibility answered by the engineer |

## The gate

Run the **harden-checker** agent; it enumerates the matrix and lists gaps, never fills them. Record with `koru review harden --checker harden-checker --file <findings.md>`. Each finding gets fixed, accepted risk, or deferred to a ticket. Small fixes travel to Ship as recorded dispositions, not loose notes. The review needs three signatures: the engineer, the rulebook owner and the design lead each choose to sign when Koru asks them (you run `koru sign REV-… --name "…" --role "…"` after each yes). Then ask the design lead to pass the gate and run `koru gate harden --pass …` on yes.
