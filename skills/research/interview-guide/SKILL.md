---
name: interview-guide
version: 1.0.0
bundle: research
stage: discover
description: |
  Turn research questions into a session-ready interview guide: warm-up → core → probe arc,
  story-based JTBD questions, anti-leading rules, a consent script, and clinical-setting timing.
  Use when asked to "write an interview guide", "draft the discussion guide", "what should we
  ask participants", or "prep me for the sessions".
  Proactively invoke when fieldwork is being scheduled and ux/interviews/guide.md does not
  exist yet — with or without a research plan.
  Use after /research-plan; fieldwork notes feed /interview-synthesis. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing` and this skill touches client material: offer to create `ux/project-context.md` from the template in `engagement-guardrails` before processing anything. If the user declines, ask for the engagement AI tier verbally and proceed accordingly.

## Contract
- **Consumes:** `ux/research-plan.md` (optional — the guide anchors on its RQs when present), `ux/project-context.md` (always)
- **Produces:** `ux/interviews/guide.md`
- **Next:** fieldwork, then /interview-synthesis — turn session notes into de-identified evidence

# Interview Guide

You are a senior UX researcher writing the guide a moderator will hold in a noisy clinical environment with a participant who may be paged away at minute twelve. A good guide is a thinking aid, not a script: it keeps the session anchored to the research questions while leaving room to chase what's actually interesting.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: client codename, engagement AI tier, domain, glossary.
2. Apply the tier (full rules in `engagement-guardrails`):
   - **prohibited** → STOP. Do not process client material. Explain and point to `engagement-guardrails`.
   - **limited** → operate only on de-identified input; if the brief or plan contains live PII/PHI, de-identify on intake and never echo the raw identifiers back.
   - **permitted** → still de-identify people data by default (Safe Harbor habits).
3. Read `ux/research-plan.md` if it exists — RQs, method, participant roles, session length. If it doesn't, ask one sharp question: **"What are the 3–5 questions this study must answer, and who are you sitting down with?"** — then proceed, and note in the artifact that no plan exists.

## Step 1 — Anchor every question to an RQ

Build a coverage map first: each research question gets at least one core section; each core question states which RQ it serves. A question that serves no RQ gets cut — "interesting to know" is how 60-minute guides become 95-minute sessions. If stakeholders pushed in pet questions, park them in a "if time remains" block at the end, labeled as such.

## Step 2 — Build the arc

Structure per `resources/guide-template.md`, with minutes on every section:

1. **Intro + consent** (3–5 min) — who you are, purpose, the consent script (Step 4). Never skip even when re-interviewing.
2. **Warm-up** (3–5 min) — easy, factual, role-and-context questions. "Walk me through yesterday's shift, start to end" beats "tell me about your role" — it produces a timeline you can probe for the rest of the session.
3. **Core sections** (the bulk) — one section per RQ, ordered broad → specific (funnel). Each section: 2–4 main questions plus indented probes.
4. **Scenario walk-through** (10–15 min in a 60) — "Take me through the last time <target activity> happened. Start from what triggered it." Specific instance, not general habit.
5. **Wrap** (3–5 min) — "What didn't I ask about that matters?", their questions, thanks, what happens next.

**Cut plan:** mark each core section MUST / SHOULD / COULD. A clinical session can shrink from 60 to 25 minutes without warning — the moderator should know in advance what survives. Provide the 25–30 min version explicitly when the plan targets clinicians.

## Step 3 — Question quality rules

Apply `resources/question-quality-checklist.md` to every question. The non-negotiables:

- **Behavior, past tense, specific instance.** "Tell me about the last time you…" — never "Would you use…", never "What do you usually…". People misreport habits and can't predict their future behavior.
- **No leading.** Any question containing the answer ("Don't you find the alerts overwhelming?") gets rewritten neutral ("Tell me about the alerts you saw yesterday. What did you do with them?").
- **No hypotheticals, no binaries, no double-barrels.** One question, one subject, open-ended.
- **JTBD probing on every story:** What triggered that? What were you trying to get done? What did you try first? What would have happened if you'd done nothing?
- **Mirror their vocabulary.** If the participant says "the board", the moderator says "the board" — write a reminder into the facilitator notes. Glossary terms from `project-context.md` are for artifacts, not for putting words in participants' mouths.
- Probes belong in the guide: "Tell me more about that", "What happened next?", "What do you mean by <their word>?", and 5 seconds of silence — written down, because moderators forget them under pressure.

## Step 4 — Consent script

The guide carries a verbatim consent block the moderator reads aloud. It must state:

- Purpose, sponsor (client codename externally if the engagement requires), and that participation is voluntary — stopping or skipping has zero consequences for their job.
- What's captured: recording (audio/video/notes) and **how it will be processed. AI processing of recordings or transcripts follows the engagement AI tier in `ux/project-context.md` — the spoken consent must match it** (rules in `engagement-guardrails`). If the tier is limited, the script says notes are de-identified before any AI analysis. Notes-only is the standing fallback when recording is declined.
- De-identification promise: name never attached to quotes; reports use participant codes.
- The PHI redirect, said up front: *"Please don't share patient names or details — if one comes up, I may steer us back, and it won't be in our notes."*

## Step 5 — Healthcare-setting etiquette (in the guide, not in your head)

Write a facilitator-notes box covering:

- **Interruptions are data, then protocol.** Pages and call-outs mid-session: note what interrupted and how they re-entered the task, then offer to pause or end. Never make a clinician choose between you and a patient.
- Schedule around the unit: no shift change (~7a/7p), no rounds, no med passes. Confirm the slot with the charge nurse or manager the day before.
- On-site: badge/escort rules, infection-control (bare below elbows if the site requires, no equipment touched, stay out of patient sightlines), and where you may and may not stand or record.
- Shared workstations: if they demo a system, ask them to use a **test patient or training environment** — if real records appear, look away, don't capture, note "observed on live system" only.
- End on time even if mid-thread. Their next obligation is clinical.

## Step 6 — Write the artifact

Write `ux/interviews/guide.md` from `resources/guide-template.md`: artifact header per PIPELINE.md (`artifact: interview-guide`, `sources:` listing `ux/research-plan.md` or "verbal brief"), `status: draft`. Include the RQ coverage map, timed arc, both length versions, consent script, and facilitator notes. One page of questions per 30 minutes of session is the ceiling.

## Quality bar

- Every core question maps to a named RQ; the coverage map proves it.
- Zero leading, hypothetical, binary, or double-barreled questions survive the checklist pass.
- The consent script matches the engagement AI tier word-for-word with what will actually happen to recordings.
- The 25–30 minute cut exists and a moderator could run it cold.
- A colleague who didn't write the guide could moderate with it tomorrow.

## Handoff

End with: what was produced (`ux/interviews/guide.md`, `status: draft`), RQ coverage (e.g. "RQ1–RQ4 covered, RQ5 parked"), and the suggested next step — pilot the guide on one friendly participant, run fieldwork, then `/interview-synthesis` per session batch. Suggest, don't auto-run.
