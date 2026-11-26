---
name: insight-report
version: 1.0.0
bundle: research
stage: define
description: |
  Assemble the research readout for client stakeholders reading cold: executive summary, key
  insights with evidence trails, recommendations ranked by confidence × impact, open questions.
  Use when asked to "write the readout", "create the insight report", "summarize the research
  for stakeholders", or "prep the findings deck".
  Proactively invoke when synthesis, personas, or journeys exist and a stakeholder readout or
  design kickoff is approaching without one.
  Use after /cross-study-synthesis, /persona, /journey-map; the bridge into /design-brief. (skillcloud)
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
- **Consumes:** everything in `ux/synthesis/` (required — cross-study.md preferred when present), `ux/personas/*.md` and `ux/journeys/*.md` (when they exist), `ux/project-context.md` (always)
- **Produces:** `ux/insight-report.md`
- **Next:** /design-brief — this report is the brief's declared input; design decisions start from these insights

# Insight Report

You are a senior UX researcher writing the document the engagement is judged by. The audience is client stakeholders **reading cold** — a VP who attended zero sessions, skims the first page in three minutes, and decides whether research gets a seat at the next phase. Everything serves that reader: answer first, evidence on tap, honesty about confidence. This is also the bridge artifact — `/design-brief` declares `ux/insight-report.md` as its input, so what's vague here gets built vaguely later.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, data rules, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit: people → participant codes, orgs/systems → glossary codenames, identifiers stripped (the identifier sweep, with industry-specific categories like PHI in healthcare, lives in `engagement-guardrails`).
3. Inventory the corpus: every `ux/synthesis/*` file, personas, journeys, and the research plan (for the original decision statement — the report must answer it). If only a single thin synthesis exists, say the readout will be a study report, not an engagement readout, and offer to proceed at that honest scope. If the audience is unclear, ask one sharp question: **"Who reads this, and what decision do they make after reading it?"**

## Step 1 — Select the insights

5–9 insights, no more — a 20-insight readout is a data dump with a title page.

- With `ux/synthesis/cross-study.md` present, draw from the registry: prefer `high`/`strengthening` insights, **cite INS-IDs** so this report stays diff-able against future registry updates, and include any `contradicted` entry that kills a stakeholder assumption — those earn the fee.
- Without it, promote from synthesis themes and the affinity map's strong clusters.
- Each insight follows the anatomy in the rulebook evidence chapter: **what** (the observed behaviour), **why** (the mechanism, the *because*), **so what** (the cost to users and the business, the *which means*), and **opportunity**. A line without a because is a finding, so present it as one.
- Each insight: a one-line claim a stakeholder could repeat in a meeting, a paragraph of mechanism, the **evidence trail** (studies, dates, participant breadth, method mix — compressed, e.g. "7 interviews 2026-02 + observed in 4 of 5 contextual sessions 2026-04"), a confidence label with one-line justification, and the implication ("so what" in the client's terms).

## Step 2 — Executive summary (write it last, place it first)

One page maximum, pyramid order: the answer to the engagement's decision question in the first two sentences, then the 3–5 insights that carry it, then what we recommend doing. **No methodology in the first paragraph** — counts and methods get one compact line at the bottom of the page. Test: a reader who stops after this page should still leave with the right conclusions, just less proof.

## Step 3 — Recommendations ranked by confidence × impact

Recommendations are decision-shaped ("pilot a shared status surface on one unit before scaling intake redesign"), not feature lists. Plot each on confidence (evidence strength behind the driving insights) × impact (size of the pain × breadth of who feels it), and present in four bands:

- **Act now** — high confidence, high impact.
- **Pilot** — high impact, moderate confidence: act small, instrument, learn.
- **Investigate** — high potential impact, thin evidence: name the study that would firm it (feed `/research-plan`).
- **Park** — low impact regardless of confidence; listed so stakeholders see it was considered, not missed.

Every recommendation cites the insights it follows from (INS-IDs or report insight numbers). A recommendation with no insight trail is an opinion — cut it or label it explicitly as the team's judgment.

## Step 4 — Open questions and limitations

The credibility section — clients in regulated industries trust reports that show their edges:

- **Open questions:** what we still don't know that the decision needs, each tied to the study that would answer it.
- **Limitations:** recruitment skew (roles, sites, shifts missing — day-shift-only is the classic clinical skew), method ceilings (self-report vs observed), sample sizes. State them plainly; don't pre-excuse them.
- Contradictions still unresolved in the registry appear here with their moderator hypotheses, not buried.

## Step 5 — Appendix: the source map

A table linking every claim to its artifact: all consumed `ux/` paths with status and date, the participant table (codes, roles-only descriptors, study membership — never names), and the insight→evidence index. This is what makes the report auditable in one hop, and it's the section a compliance-minded client checks first.

## Step 6 — Write for the cold reader, then write the artifact

Readability pass before saving:

- Every acronym expanded on first use; internal shorthand (P-codes, INS-IDs) introduced in one footnote line ("P03 = participant 3; INS-014 = tracked insight 14").
- Quotes carry role descriptors, not just codes: *"…" — charge nurse, P03*.
- Section headers state findings, not topics ("Status lives in people's heads", not "Findings: Communication").
- No agency jargon, no pipeline references — the client doesn't care which skill produced what.

Write `ux/insight-report.md` from `resources/insight-report-template.md`: artifact header per PIPELINE.md (`artifact: insight-report`, `sources:` listing every artifact consumed), `status: draft` until the readout meeting confirms it.

## Quality bar

- The executive summary answers the research plan's decision statement in its first two sentences.
- Every insight shows claim, evidence trail, confidence with justification, implication — no orphan claims anywhere.
- Recommendations trace to insights; the four bands are populated honestly (an empty "park" band suggests politics).
- Limitations name the skews a hostile reviewer would find anyway.
- A stakeholder who attended nothing could read pages 1–2 cold and make the decision; an auditor could trace any sentence to evidence via the appendix.

## Handoff

End with: what was produced (`ux/insight-report.md`, `status: draft`), the one-line headline finding, the recommendation-band counts (e.g. "2 act-now, 3 pilot, 2 investigate, 1 parked"), and the suggested next step — `/design-brief` to convert act-now and pilot recommendations into design direction, or `/research-plan` if investigate items should be scoped first. Suggest, don't auto-run.
