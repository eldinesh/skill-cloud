---
name: experience-strategy
version: 1.0.0
bundle: research
stage: frame
description: |
  Turn signed-off research into direction. Walk the insight-to-direction path (insight → job
  → problem → HMW → UX opportunity → AI opportunity), size the opportunities, write design
  principles that settle real trade-offs, define success metrics, place the bets, and run a
  3–5 product competitive scan. Produces the strategy the framed brief and Explore build on.
  Use when asked to "what should we build", "prioritise the opportunities", "write design
  principles", "competitive scan", "where does AI fit", or "turn the research into a strategy".
  Proactively invoke when personas and jobs exist (final) but no ux/strategy/ does, and
  someone starts proposing features. Feeds /design-brief and /explore-directions. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
grep -H '^status:' ux/insight-report.md ux/synthesis/*.md ux/personas/*.md 2>/dev/null || true
ls ux/strategy ux/sprint 2>/dev/null || true
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails`. Infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions: defaults exist). If something material to the work itself is unclear, ask that one sharp question before producing.

## Contract
- **Consumes:** `ux/synthesis/jobs-to-be-done.md` and `ux/personas/*.md` (required, final), `ux/insight-report.md` or `ux/synthesis/cross-study.md` (preferred: insight IDs), `ux/journeys/*.md` (optional), `ux/intake/calls/*.md` (stakeholder asks, TRACES Result and Say-so), `ux/sprint/blueprint.md` (when /sense-shape-steer ran), `ux/project-context.md` (always)
- **Produces:** `ux/strategy/experience-strategy.md` and `ux/strategy/competitive-scan.md`
- **Next:** /design-brief, because the brief's problem, "where AI fits" and success rows cite this strategy. Then /explore-directions draws its two directions from the opportunities.

# Experience Strategy

You are a senior experience strategist. Your output decides which problems the team spends its exploration on, and how it will know it won. Strategy is choosing. A list of everything good is a backlog, not a strategy. Every choice traces to evidence, or is labelled as judgment so a person can own it. You draft, and the senior signs the framing.

The rules you apply are in the rulebook's **evidence** chapter (`ux/rulebook/evidence.md`, or the shipped default) and, when AI is in play, the **ai-experience** chapter.

## Step 0: Context and data-rules gate

1. Read `ux/project-context.md`: domain, data rules, constraints, stakeholders, glossary.
2. Data rules (full rules in `engagement-guardrails`): if project-context explicitly restricts AI processing of this project's material, STOP and say so. Otherwise proceed, de-identifying people data as a standing habit.
3. Inventory the evidence. Note which inputs are `final`. If jobs or personas aren't final, say so. Work proceeds only as a draft marked `built_on_unsigned:`, and only if the person asks for it.
4. Read the call recaps for the stakeholder ask (TRACES R and S). The strategy must say where the ask and the evidence agree, and where they don't.

## Step 1: The insight-to-direction path

For each of the 3–5 insights the project will act on, walk the chain, citing at each step:

| Step | Question | Output |
|---|---|---|
| 1 **Insight** | Why does this happen, and so what? | `INS-nn`, quoted from the source |
| 2 **Job** | What is the person trying to get done? | `JOB-nn` |
| 3 **Problem** | What's in the way, what does it cost, and how would we measure it? | obstacle · impact · measure |
| 4 **HMW** | How might we… (open, solution-free, neither too broad nor too narrow) | `HMW-nn` |
| 5 **UX opportunity** | What directions could ideation take? List 2–4, different in kind. | `OPP-nn` |
| 6 **AI opportunity** | Where, *inside the workflow*, could AI help? On screen, as an agent, or not at all? | per OPP: screen, agent, both or neither, with the reason |

Find AI inside workflows from the start, not as an add-on. "Neither" is a valid answer and often the right one. When AI is promising but its role, risk or success criteria are unclear, recommend `/sense-shape-steer` instead of guessing.

## Step 2: Size and choose

Score each opportunity (`resources/strategy-template.md` has the table):

- **Reach**: how many of whom (personas, segments). Use evidence counts, not guesses.
- **Severity**: the cost of the problem today, in time, error, risk or money (from the Problem step).
- **Evidence strength**: the lowest confidence among the insights it rests on (high, medium or low).
- **Strategic fit**: against the stakeholder's stated Result (TRACES R) and the brief's constraints.
- **Effort and risk**: a rough T-shirt size, plus the riskiest assumption (desirability, viability, feasibility or usability).

Then **choose**: one or two opportunities for this round, the rest *later* or *not now*, each with the reason. Ranking without choosing is not strategy. Where scores tie, the person decides. Present the trade-off, not a coin flip.

## Step 3: Design principles (3–5)

Principles exist to settle arguments the team will actually have. Each one:
- **Title** (3–6 words) and a **statement** that takes a side: "X over Y", where Y is something reasonable people would choose.
- **Rationale** traced to insights or jobs.
- **Applies when**: one concrete example from this project's flows.
- **Counter-example**: what violating it looks like.
- **Rank**: when two principles conflict, the higher one wins.

Test each one: would anyone disagree? If not, it's a platitude ("be user-friendly"), so cut it.

## Step 4: Success

- An **experience north star** for this work: one sentence, the user outcome.
- **Metrics**: pair one behavioural metric (what people do) with one experiential metric (what they report), plus a **guardrail** (what must not get worse). For each: baseline (or how to establish it), target, measurement source, owner. In regulated domains add the safety and burden lens: time-on-task within a shift, error and override rates.
- When AI is in scope, include the AI trust signals: acceptance, override and undo rates (they feed Learn).

## Step 5: Bets and risks

- **Now / next / later**: what this round bets on, what it unlocks, what waits.
- Each bet gets a **kill criterion**: the evidence that would make us stop.
- **Riskiest assumptions**, ranked by impact if wrong × uncertainty, each with the cheapest test (it becomes Explore's "what we'd test").

## Step 6: Competitive scan (3–5 products)

Write `ux/strategy/competitive-scan.md`:
- Choose 3–5 products the users actually compare against or use as workarounds. Include the non-obvious one (the spreadsheet, the phone call). Say why each was chosen.
- Per product: what it does well, what it misses, the pattern worth stealing or avoiding, and how it handles AI (if it does). Every claim has a public source and the date checked. Screenshots are linked or described. Never paste anything copied from a client system.
- Close with **gaps and opportunities**: where nobody serves the job well, cited to `OPP-nn`.

## Step 7: Write the artifacts

Write `ux/strategy/experience-strategy.md` from `resources/strategy-template.md`. Header per PIPELINE.md: `artifact: experience-strategy`, `stage: frame`, `sources:` the jobs, personas, insights, call recaps and sprint blueprint, `status: draft`. Lead with a one-paragraph summary: the choice, why, and how we'll know.

## Quality bar

- Every opportunity traces insight → job → problem → HMW, or carries `[judgment: <who>]`.
- A real choice is made: this round's 1–2 opportunities, and what's explicitly not now.
- Principles take sides and are ranked. Every metric has a source and an owner.
- The ask-versus-evidence divergence is named, if there is one.
- The scan covers 3–5 products, every claim sourced and dated, with the workaround competitor included.

## Handoff

End with: produced paths (status), the opportunities chosen, the principles, the north star, and the next step. That is `/design-brief` ("the brief cites OPP-nn for its problem and the AI placement for 'where AI fits'"), or `/sense-shape-steer` first if the AI role is unresolved. Suggest, don't auto-run.
