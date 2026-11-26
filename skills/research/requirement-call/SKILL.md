---
name: requirement-call
version: 1.0.0
bundle: research
stage: frame
description: |
  Prepare for, run and recap a requirement or discovery call with TRACES: Trigger, Result,
  Audience, Confidence, Edges, Say-so, plus the designer's three extras. The call is sorted
  first (fresh start, informed by synthesis, or ad hoc), because less context means more
  listening and less committing. Produces a prep sheet, then a recap the brief can trust.
  Use when asked to "prep for the client call", "what should I ask", "recap this call",
  "turn these call notes into requirements", or "I have a call in 10 minutes".
  Proactively invoke when call notes or a call transcript are pasted, or a call is mentioned
  as upcoming, and no ux/intake/calls/ file covers it. Feeds /design-brief. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
ls ux/intake/calls 2>/dev/null | tail -5 || true
ls ux/synthesis ux/insight-report.md 2>/dev/null | head -10 || true
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails`. Infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions: defaults exist). If something material to the work itself is unclear, ask that one sharp question before producing.

## Contract
- **Consumes:** what the user knows about the call (invite, ask, attendees by role), existing research (`ux/synthesis/*`, `ux/insight-report.md`, optional, and it decides the scenario), earlier call files in `ux/intake/calls/` (optional), call notes or a transcript for the recap, `ux/project-context.md` (always)
- **Produces:** `ux/intake/calls/<yyyy-mm-dd>-<slug>.md` (prep, then the recap appended to the same file)
- **Next:** /design-brief, because the recap's TRACES are the framed brief's raw material. If the call revealed a research gap, /research-plan.

# Requirement Call

You help a designer or researcher leave a requirement call with evidence in their notes instead of a solution in their head. Two moments decide whether they can later defend the design: **what they gather** (this skill) and **how they read research** (the evidence chapter). Your method is **TRACES**: six clues every good requirement call leaves behind. You ask each one twice, once about the *request* and once about the *workflow*.

| | Clue | Ask |
|---|---|---|
| **T** | Trigger | What happened, and when? Why now? |
| **R** | Result | What changes, measurably, for the user and the business? How will we know? |
| **A** | Audience | Who does the work, where, on what? Who decides? |
| **C** | Confidence | What do we know, and what do we assume? |
| **E** | Edges | What limits the answer? Constraints, edge cases, what can't change. |
| **S** | Say-so | Who decides what, how do we stay in sync, and by when? |

**For designers, three extras:** constraints (tech, regulatory, brand) · the existing product or design system · what has already been tried. The full cheatsheet with phrasings is in `resources/traces-cheatsheet.md`.

## Step 0: Context and data-rules gate

1. Read `ux/project-context.md`: name, domain, data rules, stakeholders (roles), glossary.
2. Data rules (full rules in `engagement-guardrails`): if project-context explicitly restricts AI processing of this project's material, STOP and say so. Otherwise de-identify on intake. Client people become roles ("ops lead"), and orgs and systems become glossary codenames. Never echo names from an invite back in chat.
3. Ask yourself first, and the user if it isn't evident: **"How much do I already know about this specific problem?"** The answer sorts the call.

## Step 1: Sort the call

Two questions decide the scenario:

1. **Did they know the call was coming, with time to prepare?** No means **#1 Ad hoc**.
2. **Does research exist on this exact problem, and can they read it first?** Yes means **#2 Informed by synthesis**. No means **#3 Fresh start**.

| Scenario | Mode | Opening line | Commit to | Avoid |
|---|---|---|---|---|
| **Fresh start** ("I know the client, not this problem") | Discovering | "Our goal today is to understand the problem well enough to ask the right questions, not to jump to solutions." | A playback, a recap within 24 hours, the next touchpoint | Timelines, scope, effort, solutions |
| **Informed by synthesis** ("I have insights and a partial picture") | Refining | "Here's what we understand from earlier research. Please correct anything that's off or outdated." | Directional intent and a next-step timeline | Final solutions, and re-asking what research already answered |
| **Ad hoc** ("no warning, no prep") | Listening | "Can I ask a few questions to make sure I capture this properly?" | A recap. Nothing else. | Timelines, scope, solutions, pushing hard |

**The rule:** the less context you have, the more the call is for listening and the less it is for committing.

## Step 2: Prep sheet (before the call)

Write the file's **Prep** section from `resources/call-template.md`, by scenario:

- **Fresh start**: mine the project's history with this client (earlier `ux/` files, the glossary). Draft a 1–2 hour secondary-research list (domain, competitors, regulations, offered via /topic-deep-dive if the domain is unfamiliar). Build the **assumption list**: what the team believes, each line ending "to confirm on the call". Draft a request to the PM for context: docs, analytics, prior research.
- **Informed by synthesis**: pull the relevant insights by ID. **Pre-fill TRACES with sources and confidence** from the synthesis, so the call confirms instead of re-asking. Draft the alignment note for the PM on scope.
- **Ad hoc**: the 60-second kit. Give the TRACES ad-hoc order (T → R → S → A → E → C, which fits 10 minutes), one question per letter, plus what to scan if there's a minute: the invite and the project folder.

Each prep sheet ends with the **question list**: every TRACES letter asked about the request *and* the workflow, the three designer extras, and the scenario's opening line. Phrasings are open, past-behaviour-first and solution-free (`resources/traces-cheatsheet.md`).

## Step 3: Recap (after the call)

From notes or a transcript (de-identified on intake):

1. **TRACES table.** For each letter: what was said (cleaned, short quotes with role), confidence (high, medium or low per the evidence chapter, and a single stakeholder's belief is **low** however senior they are), and the source line. **Empty letters stay visible** as open questions. "Which letter did you leave empty?" is the first thing the reviewer asks.
2. **Request vs workflow.** Note where what was asked for and how the work actually happens diverge. That divergence is often the real problem.
3. **Commitments made**, checked against the scenario's *commit to* column. If an ad-hoc call produced a scope or timeline commitment, flag it as something to walk back or confirm properly.
4. **Assumptions**: confirmed, challenged, new or still open. For informed calls, tag each pulled insight **confirmed / challenged / new / outdated**, and list contradictions for the researcher.
5. **Open questions**, each with who can answer and by when.
6. **Recap message draft** for stakeholders (within 24 hours for fresh start). It maps what we heard to what happens next, and contains no solutions. This is a draft for the person to send. You never send it.
7. **After-call actions by scenario**: fresh start (team debrief, recap in 24 hours, one-pager within 2 days), informed (tag insights, flag contradictions, send a recap mapping insights to requirements), ad hoc (notes within the hour, recap, schedule a proper follow-up, team sync).

Header per PIPELINE.md: `artifact: requirement-call`, `stage: frame`, `sources:` (notes or transcript, as "de-identified on intake", plus any insights pulled), `status: draft`.

## Quality bar

- Every TRACES letter is filled with a source and confidence, or explicitly empty, with the open question it creates.
- No solution, timeline or scope commitment recorded beyond what the scenario allows.
- Request and workflow both captured, with the divergence named.
- Quotes carry roles, not names. Glossary codenames are used throughout.
- A designer who missed the call could start the brief from the recap alone.

## Handoff

End with: the file path (status), the scenario, which TRACES letters are empty, the open questions with owners, and the next step. That is `/design-brief` when the recap gives enough to frame (its "What we know" rows come from your TRACES with their confidence intact), or `/research-plan` when the gaps are research gaps. Suggest, don't auto-run.
