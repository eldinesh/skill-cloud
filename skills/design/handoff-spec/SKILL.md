---
name: handoff-spec
version: 1.0.0
bundle: design
stage: deliver
description: |
  Figma-fluent developer handoff: flow inventory with stable frame links, every state and edge
  case enumerated (empty/loading/error/offline), interaction specs, a11y annotations, token and
  asset references, open questions for eng, and what's intentionally not specified.
  Use when asked to "write the handoff", "spec this for developers", "prepare this for eng",
  or "what does engineering need to build this".
  Proactively invoke when designs are called final or approved and implementation is next,
  with no ux/delivery/handoff-*.md covering that scope.
  Use after /design-rationale; /figma-hygiene gates readiness; /design-qa-checklist verifies the build. (skillcloud)
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
- **Consumes:** the final designs (Figma), `ux/design/components/*.md` (optional — slot in by reference), `ux/design/rationale.md` (optional — cite DEC entries instead of re-arguing), `ux/design/accessibility-audit.md` (optional — build-stage annotations land here), `ux/design/copy/*.md` (optional), `ux/project-context.md` (always)
- **Produces:** `ux/delivery/handoff-<scope>.md`
- **Next:** /design-qa-checklist after implementation — the QA pass checks the build against exactly this document

# Handoff Spec

You are a designer writing the document engineering builds from — the goal is that no developer has to guess, and no guess ships silently. A handoff is not a Figma link with "let me know if questions"; it is an inventory of everything the static frames can't say: states, edges, behavior, announcements, and the boundary line of what's deliberately left to engineering judgment. Equally important is what it doesn't do: it doesn't re-litigate decisions (`DEC-NN` covers why) and it doesn't over-specify things the client's design system already defines.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, **data rules**, client design system + token pipeline, eng conventions (ticket tracker, Storybook?), accessibility bar.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` restricts AI processing, STOP and say so. Otherwise: all example data in handoff frames and screenshots must be synthetic; if final designs still carry pasted-in live data, that's a pre-handoff defect — flag it, don't propagate it. Handoff documents travel far — hold the standard everywhere.
3. Read components, rationale, a11y audit, and copy artifacts if present — the handoff assembles them; it doesn't rewrite them.

## Step 1 — Readiness gate (don't hand off design debt)

Check before writing a word, per /figma-hygiene's handoff-readiness definition:

- File organized: approved work on the approved page, explorations out of the link path
- **Frames named as flow steps** (`order-entry / 03 — review`) — deep links break socially when frames are "Frame 482": nobody can tell eng *which* frame moved. Stable, semantic names keep links meaningful across edits
- All states exist in the file: empty, loading, error, offline per screen — **missing states are design work, not handoff work**; stop and finish them
- Copy is real (no lorem ipsum), tokens applied, dev-mode annotations in place, a named version/branch pinned for this handoff

If the gate fails, say exactly what's missing and offer /figma-hygiene or the fix round first.

## Step 2 — Flow inventory

For each flow in scope: entry points, exit points, and the step list — each step with its **Figma frame link**, the screen's purpose in one line, and the components it instantiates (by reference to `ux/design/components/*.md`, not by re-describing them). Error and abandon paths are steps too, with resume points.

## Step 3 — States and edge cases, enumerated

The state matrix is the heart of the handoff. Per screen: **empty / loading / error / offline** plus partial data, max data (40-row worklist, year-long history), permission-denied, and stale/concurrent-edit where they apply. Each cell: a frame link or an explicit textual rule ("offline: banner per client pattern, read-only mode, queue writes") — a dash means *designed-and-linked*, never "didn't think about it". In clinical software, add interruption/timeout behavior per flow: what survives, what resumes (this is where the a11y audit's 2.2.1 annotations land).

## Step 4 — Interaction and behavior specs

What static frames can't show: triggers and outcomes, optimistic vs. confirmed updates, validation timing (on blur? on submit?), keyboard interaction per screen (tab order, Enter/Esc semantics), motion (duration/easing tokens, reduced-motion fallback), scroll/sticky behavior, and concurrency rules ("two nurses open the same order: last-write warning per DEC-09"). Reference component specs for component-level behavior; specify only what's flow-specific here.

## Step 5 — Accessibility annotations

Pull the build-stage annotations from `ux/design/accessibility-audit.md` (or write them now if no audit ran — and say so): focus order per screen, roles/names for custom widgets, which status messages announce politely vs. assertively, contrast-verified token pairs, target-size floors per device class. These are acceptance criteria, not suggestions — /design-qa-checklist will test each one.

## Step 6 — Tokens, assets, copy

Token references for anything the component specs don't already cover (never raw hex when the client has tokens — gaps go to the token-request list, same rule as /component-spec). Asset list: icons/illustrations with export format and names per client convention. Copy: link `ux/design/copy/<scope>.md` as the source of truth and pin the version — strings in frames drift.

## Step 7 — Open questions and the not-specified list

Two honest lists that prevent silent guessing:

- **Open questions for eng** — each with an owner and needed-by date; unanswered questions become punch-list items later.
- **Intentionally NOT specified** — where engineering judgment is welcome ("exact skeleton shimmer", "pagination chunk size — anything 25–100"). Naming the discretion zone stops both over-asking and silent invention.

## Step 8 — Write, then walk through

Write `ux/delivery/handoff-<scope>.md` from `resources/handoff-template.md` — artifact header per PIPELINE.md (`artifact: handoff-spec`, `sources:` the designs, components, rationale, audit, copy), `status: draft`. Then book a 30-minute walkthrough with the eng lead — the questions raised there get folded in, and status flips to `reviewed`. A handoff nobody walked through is a handoff nobody read.

## Quality bar

- Every frame link points at a named, stable frame on the approved page or pinned branch.
- State matrix complete — no blank cells, no "TBD"; offline and timeout behavior explicit for interruption-prone (e.g. clinical) flows.
- A11y annotations testable as acceptance criteria.
- Decisions cited as `DEC-NN`, not re-argued; components referenced, not re-specified.
- The not-specified list exists — engineering knows exactly where their judgment is invited.

## Handoff

End with: produced `ux/delivery/handoff-<scope>.md` (status), flow/screen/state counts, open questions and their owners, and the suggested next step — the eng walkthrough, then `/design-qa-checklist` once a build exists ("QA checks the build against this spec, line by line"). Suggest, don't auto-run.
