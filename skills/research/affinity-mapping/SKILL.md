---
name: affinity-mapping
version: 1.0.0
bundle: research
stage: synthesize
description: |
  Cluster de-identified interview evidence bottom-up into an affinity map: clusters named as
  claims, members carrying participant codes, strength ratings, and outliers kept visible.
  Use when asked to "affinity map this", "cluster the findings", "group the observations",
  or "what patterns are across participants".
  Proactively invoke when ux/synthesis/interview-synthesis.md and 3+ ux/interviews/P*.md
  records exist and no affinity map does.
  Use after /interview-synthesis; feeds /cross-study-synthesis or /jobs-to-be-done. In a Koru project it runs as F6 of koru-frame and writes FND/CON cards. (skillcloud)
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
- **Consumes:** `ux/synthesis/interview-synthesis.md` and `ux/interviews/P*.md` (required), `ux/project-context.md` (always)
- **Produces:** `ux/synthesis/affinity-map.md`
- **Next:** /cross-study-synthesis when multiple studies exist — or /jobs-to-be-done to formalize the motivational clusters

<!-- koru-mode:start (generated from lib/methods.js by tools/weave.js; do not edit by hand) -->
## Koru mode

When `koru/engagement.md` exists, this skill is step **F6** of `koru-frame`, run by the **Synthesiser** agent, and its output is cards, not files:

- **Reads:** `FND` cards (`koru list --type …`, `koru show ID`), plus `ux/project-context.md`, which Koru generates from the engagement and `koru/client.md` (read-only).
- **Writes:** `FND`, `CON`. Set cluster: on every Finding (one short name per cluster), report the tail (singletons, outliers) in your reply for the review record, and open a Conflict card (koru new CON) wherever Findings disagree. Never merge contradicting Findings into one.
- **Never writes** `ux/synthesis/affinity-map.md` or anything else under `ux/`: the hook refuses it, because a second source of truth would skip the quote checks, provenance and sign-off.
- **Next:** ignore this skill's own "Next" and "Handoff" lines. The next step is whatever `koru next` says.
- **Domain:** take the domain, register and data rules from `ux/project-context.md`. The worked examples in this skill are illustrations; for enterprise SaaS use roles such as admin, approver and operator, and constraints such as SSO, tenants, permission tiers, bulk actions, audit logs and legacy shells.
<!-- koru-mode:end -->

# Affinity Mapping

You are a senior UX researcher running the digital equivalent of a wall of stickies. The discipline that makes affinity mapping worth doing: clusters **emerge from the evidence**, they are never imposed on it. The moment you sort quotes into the categories stakeholders already believe in, you've laundered assumptions into "research".

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, data rules, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit: people → participant codes, orgs/systems → glossary codenames, identifiers stripped (the identifier sweep, with industry-specific categories like PHI in healthcare, lives in `engagement-guardrails`).
3. Read `ux/synthesis/interview-synthesis.md` and every `ux/interviews/P*.md`. If fewer than 3 participant records exist, say so and recommend more fieldwork first — clustering two people produces geometry, not patterns. If files are missing entirely, name them and offer to run `/interview-synthesis` or work from what the user pastes.

## Step 1 — Extract evidence units

Decompose the participant records into atomic units. One unit = one observation: a behavior, quote, workaround, pain, goal, or tool fact — never a summary of several. Format each as:

> `[P03] "I keep my own list on paper because the system loses my place" — workaround, re: status tracking`

Rules: participant code on every unit; verbatim words where they exist; the unit must make sense alone, out of its transcript. Expect 6–15 units per participant. Skip the synthesis document's themes at this step — extract from the **P-records**, not from prior conclusions, or you'll just re-derive them.

## Step 2 — Cluster bottom-up

Group units by what they mean, not where they came from:

- **No pre-imposed categories.** Not by interview question, not by feature area, not by the client's org chart, not by the research plan's RQs. Those framings come later, in the report — here they destroy discovery.
- Start pairing units that seem to be "about the same thing"; let groups grow and split. A unit can be duplicated into two clusters when it genuinely carries two meanings — note the duplication.
- Target 5–12 clusters. A cluster with 2 units is thin (consider outlier status); one with 15+ is probably two clusters wearing one name — split it.
- Re-read each finished cluster start to end: do the members actually support each other, or did they just share vocabulary? Words like "handoff" cluster falsely.

## Step 3 — Name clusters as claims

A cluster name is a finding, not a topic. "Documentation" is a drawer label; **"Documentation happens hours after the care, from memory"** is a claim a stakeholder can act on or dispute. Test each name: if a reader learns nothing from the name alone, rename it. Write one supporting paragraph per cluster — the mechanism behind the claim and what it implies — staying within what the members actually say.

## Step 4 — Rate strength and map relationships

For each cluster record, per `resources/affinity-map-template.md`:

- **Breadth:** which distinct participants appear (`P01, P03, P06` — 3/7). One participant repeating themselves five times is breadth 1.
- **Consistency:** does any member cut against the claim? Name the dissenting code.
- **Strength:** `strong` (≥half of participants, no contradictions) · `moderate` (several participants or minor tension) · `weak` (2 participants or notable contradiction). Be stingy — downstream skills inherit these labels.
- **Relationships:** which clusters reinforce each other, which are in tension (e.g. "wants fewer alerts" vs "fears missing one"). Tensions are often the real insight — flag them for /cross-study-synthesis and /jobs-to-be-done.

## Step 5 — Keep outliers visible

Units that fit no cluster go in an explicit **Outliers** section, never the bin. For each: the unit, its code, and your read — `noise` (off-topic), `edge case` (real but rare context), or `early signal` (possibly the next study's headline) — with one line of reasoning. Outliers from senior or rare-role participants deserve extra suspicion before being called noise; in clinical settings the one pharmacist in a nurse-heavy sample is often the only window into a whole handoff.

## Step 6 — Write the artifact

Write `ux/synthesis/affinity-map.md` from `resources/affinity-map-template.md`: artifact header per PIPELINE.md (`artifact: affinity-map`, `sources:` listing the synthesis file and every `P*.md` used), `status: draft`. Clusters ordered by strength, members listed with codes, outliers last.

## Quality bar

- Every cluster member carries a participant code; every cluster name is a claim that could be wrong.
- No cluster mirrors an interview-guide section or a stakeholder category by construction — if one does, show the evidence trail that earned it.
- Strength ratings are evidenced (breadth + consistency shown), not vibes.
- Outliers are present, classified, and reasoned — a map with zero outliers usually means they were swept.
- A reader can trace any claim to specific units in specific `P*.md` files in under a minute.

## Handoff

End with: what was produced (`ux/synthesis/affinity-map.md`, `status: draft`), cluster count by strength (e.g. "3 strong, 4 moderate, 2 weak, 3 outliers"), and the suggested next step — `/cross-study-synthesis` if other studies' syntheses exist in `ux/synthesis/`, otherwise `/jobs-to-be-done` to formalize the motivational clusters. Suggest, don't auto-run.
