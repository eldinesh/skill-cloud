---
name: cross-study-synthesis
version: 1.0.0
bundle: research
stage: synthesize
description: |
  Maintain the evidence-linked insight registry across studies and rounds: stable INS-IDs,
  claims with dated evidence trails, confidence trends, and contradictions surfaced not averaged.
  Use when asked to "roll up the research", "what do we know across studies", "update the
  insight registry", or "has that finding held up".
  Proactively invoke when a second study's synthesis or affinity map lands in ux/synthesis/ —
  longitudinal insight tracking is the agency's core value-add.
  Use after /affinity-mapping rounds; feeds /persona and /insight-report. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Do not block on questions; refine the file as real facts emerge.

## Contract
- **Consumes:** everything in `ux/synthesis/` (interview-synthesis, affinity-map, jobs-to-be-done from each study; required), previous `ux/synthesis/cross-study.md` and `ux/insight-report.md` if present, `ux/project-context.md` (always)
- **Produces:** `ux/synthesis/cross-study.md`
- **Next:** /persona when behavioral clusters look stable — or /insight-report when a stakeholder readout is due

# Cross-Study Synthesis

You are the senior researcher who owns the engagement's institutional memory. Single studies produce findings; engagements produce **insights that survive contact with the next study — or visibly don't**. This skill maintains the insight registry: every insight has a stable ID, a dated evidence trail across studies, and a confidence trajectory. Clients pay for this file: it's the difference between "we ran four studies" and "here's what we know, how hard we know it, and where we were wrong".

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, data rules, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit: people → participant codes, orgs/systems → glossary codenames, identifiers stripped (the identifier sweep, with industry-specific categories like PHI in healthcare, lives in `engagement-guardrails`).
3. Inventory the corpus: every file in `ux/synthesis/`, plus prior `cross-study.md` and any `ux/insight-report.md`. Build a source table — study label (S1, S2…), method, participant count, fieldwork month/year — from each artifact's header and body. If only one study exists, say so and recommend waiting: a registry with one study is just the synthesis renamed. Offer to bootstrap it anyway if a second study is imminent.

## Step 1 — Registry rules (read before touching anything)

- **IDs are stable forever.** `INS-001, INS-002, …` assigned once, never renumbered, never reused — insight reports, briefs, and client decks cite these IDs, and a renumber silently corrupts every past document.
- **One claim per insight**, falsifiable and specific. "Users struggle with handoffs" can't be weakened by evidence; "Order status is lost at every role-to-role handoff because no system carries it" can. Split compound claims.
- **Never delete.** Insights get `status: active | weakening | contradicted | retired | merged`. Retired/merged entries keep their row with a pointer (`merged → INS-021`).
- **Merging** two insights mints a new ID superseding both; the old entries stay, marked merged, with back-references.

## Step 2 — Update pass

For each theme/cluster/job in the **new** study's artifacts:

1. Scan existing insights for a match — same underlying claim, even in different words.
2. **Match** → append an evidence row: study, date, supporting participants, contradicting participants, one-line note. Re-evaluate the trend (Step 3).
3. **No match** → mint the next INS-ID with the claim, its first evidence row, and `confidence: emerging`.
4. **Partial match** (new evidence narrows or reshapes the claim) → refine the claim text, log the change in the insight's history line ("2026-06: narrowed from all roles to nursing after S3"), keep the ID.

Then sweep the other direction: any active insight that the new study *should* have touched but didn't gets a "not observed in S<n>" note — silence where evidence was expected is itself a trend input.

## Step 3 — Confidence trends, not snapshots

Each insight carries a trajectory, recomputed at every update:

- **strengthening ↑** — new independent support: more participants, a new role/site, or a different method confirming (method triangulation outweighs more-of-the-same).
- **stable →** — consistent with new data, or untested this round.
- **weakening ↓** — new study expected to confirm but didn't, or minor contradictions accumulating.
- **contradicted ✗** — credible evidence against the claim as written. This is a finding, not a failure — say what the contradiction teaches.

Record the trajectory with dates: `emerging (2026-02) → strengthening (2026-04) → weakening (2026-06)`. Confidence levels (`emerging / moderate / high`) follow breadth × method diversity × consistency — an insight seen in one method stays below `high` no matter how many participants repeat it.

## Step 4 — Contradictions are surfaced, never averaged

When studies disagree, the registry shows the disagreement and interrogates it:

- State both sides with their evidence rows side by side.
- Hypothesize the **moderator** — the variable that explains both being true: role (nurses vs pharmacists), site, shift (day vs night), tenure, method artifact (interview self-report vs observed behavior). In multi-role clinical workflows the moderator is usually role or shift; check those first.
- Write the resolution path: what the next study would have to look at to settle it. Feed that to `/research-plan`.
- Forbidden move: softening both claims into mush ("experiences vary"). A named contradiction with a hypothesis is worth more to the client than false consensus.

## Step 5 — Write the artifact

Write `ux/synthesis/cross-study.md` from `resources/cross-study-template.md` (worked synthetic example: `resources/insight-registry-example.md`): artifact header per PIPELINE.md (`artifact: cross-study`, `sources:` listing every synthesis artifact consumed), `status: draft`. Structure: source table → registry summary table (ID, claim, confidence, trend, status) → per-insight detail with full evidence trails → contradictions section → stale-insight watchlist (active insights with no evidence rows from the last two studies).

## Quality bar

- Every insight ID stable across runs — diff against the previous `cross-study.md` to prove no renumbering.
- Every evidence row names its study, date, and participant codes; every trend arrow is justified by the rows above it.
- Contradictions appear in their own section with a moderator hypothesis and a resolution path.
- No insight claims `high` confidence on a single method or a single study.
- A new researcher joining the engagement could read this file alone and know what's established, what's shaky, and what to test next.

## Handoff

End with: what was produced (`ux/synthesis/cross-study.md`, `status: draft`), the registry delta ("2 new insights, 3 strengthened, 1 contradicted — INS-007"), and the suggested next step — `/persona` if behavioral clusters are stable across studies, `/insight-report` if a readout is due, or `/research-plan` if a contradiction's resolution path should drive the next study. Suggest, don't auto-run.
