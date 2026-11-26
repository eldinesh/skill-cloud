---
name: frame
version: 2.0.0
bundle: stages
stage: frame
description: |
  Frame v2: turn messy client material into a one-page framed brief and a small research pack
  the whole project can trust. Three lanes (Evidence, Desk, Foundation) join at the interpretations,
  client solutions wait in the parking lot, every conflict leaves with a status, and the stage
  runs as five designer moments: Claude proposes with sources and confidence, the designer decides.
  Use when asked to "frame this", "start the project", "here's the brief / PRD / transcripts",
  or "what are we actually solving".
  Proactively invoke when raw client material lands in ux/intake/raw/ and no final brief exists. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
ls ux/intake/raw 2>/dev/null | head -30 || echo "RAW: none"
ls ux/frame 2>/dev/null || echo "FRAME: not started"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then continue.
- If `JUST_UPGRADED <old> <new>`: summarize the changes from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets, then continue.
- If `PROJECT_CONTEXT: missing`: run the start flow (`~/.skillcloud/repo/commands/start.md`) first. Nobody builds folders by hand.

## Contract
- **Consumes:** everything in `ux/intake/raw/` (PRD and requirement docs, call recordings or transcripts, existing research and analytics, brand and design-system links, product screenshots or access, client references, emails and Slack), Koru knowledge (Sense-Shape-Steer canvases, patterns from past projects), `ux/project-context.md` (always), and the data rules in `engagement-guardrails`
- **Produces:** `ux/frame/`: the project card, intake register, source map, conflict log with decision cards, parking lot, context sweep, desk notes, foundation card, framed brief, research pack, heuristic evaluation and UX audit (existing product), assumptions to test, the team-knowledge card, and the handoff card. Plus `ux/design/brief.md` (the framed brief) and the research pack in its usual `ux/` paths.
- **Next:** Gate 1, Frame → Explore (`/design-lead` runs it: an AI audit, then people decide), then /explore

# Frame v2

**What Frame hands on:** a one-page framed brief and a small research pack, both marked final. A senior signs the framing. A named research owner signs the pack. Those are two separate sign-offs.

**How it runs:** Frame runs as **three lanes that join at the interpretations**. Messy, partial or conflicting inputs are sorted before anything is written. The client's own solutions never steer the framing.

| Lane | Holds | Steps |
|---|---|---|
| **Evidence** | what's true about users and the business | 2 Clean (Distill) → 5 Source map → sources disagree? → 7 Decide each conflict |
| **Desk** | what's already known outside our calls | 6 Desk plan → existing research → existing product → 12 Competitive scan |
| **Foundation** | what Explore designs *with*: DS, brand, stack | 13 Foundation capture → pre-answer Explore's intake questions → access list |
| **Parking lot** | client-proposed solutions and visuals | logged at intake, kept out of all three lanes; Explore opens it only when a designer chooses to |
| **Join** | the interpretations | 8 path → 9 brief → 10 where AI fits → 11 research pack → 14 challenge → 15 gate |

Full detail, every table and the step numbers: `resources/reference.md`. Templates: `resources/templates.md`. Step numbers match the Frame playbook.

## The rules (on every step)

1. Every fact has a confidence level and a source. Nothing goes in without a source.
2. Claude never resolves a conflict, averages two numbers, or invents one.
3. Seniority and PRDs aren't evidence about users.
4. Client solutions and visuals are parked on intake, never in the problem.
5. Design context (what Explore designs *from*) and design foundation (what it designs *with*) stay apart. Frame doesn't pick a design-system route. Explore does.
6. Say plainly what we don't know, especially when no users were heard.
7. Review is 30 minutes. Then the research owner (pack) and the senior (brief) decide.
8. Only `-final` files go into project knowledge. No full PRD: leave room for Explore.

**Never delegated** (always a person): the problem sentence and success (senior) · the starting point and path (team lead) · deciding a conflict (team lead, or the decision owner for business and scope) · accepting a finding (research owner) · scope (decision owner) · where AI fits, final call (team lead) · what AI can't know about a person (research owner) · signing off (the named person).

## Step 0: Context and data-rules gate

1. Read `ux/project-context.md` and `engagement-guardrails`. If the project's material is restricted, stop.
2. **Regulated domain** (health, finance, children, aged care): the regulatory source is authoritative on rules, the compliance reviewer is named in the constraints, and the data limits for AI are written down before anything is processed.
3. **Does the client agree to AI on their data?** It must be in writing (gate A5 ★). If nobody has asked, put it at the top of the open questions now.

## The five designer moments

Claude proposes everything with its source and confidence. The designer corrects and decides. These five moments are where a designer changes the outcome, and they're the proof of a design team's value. Everything else either applies only to some projects or is something Claude handles.

| # | Moment | Claude proposes | **Designer decides** | Output | Time |
|---|---|---|---|---|---|
| 1 | **Setup** | Project type, starting point and brief template inferred from the uploads; a Frame plan with a time estimate | **Confirms the type and starting point; what Frame must cover and what is out** | Project card, Frame plan | 5 min |
| 2 | **Evidence and conflicts** | Answers to the research questions, each with a source and confidence; every place the sources disagree | **Which source wins for each conflict, or keeps it as an assumption; adds what is not written down** | Conflict log, decision cards | 15 min |
| 3 | **Heuristics and audit** *(existing product)* | Heuristic evaluation (usability and AI heuristics) and UX audit of the existing product, with severity | **Confirms or rejects each finding, and which ones matter for this problem** | Confirmed findings in the research pack | 10 min |
| 4 | **Framing** | A one-page brief: problem, users, JTBDs, where AI fits, success | **Writes the problem statement and decides where AI fits; sets confidence; removes solution bias** | Framed brief (review) | 15 min |
| 5 | **Sign-off** | Research pack, assumptions to test, handoff card | **The senior signs the framing, and the research owner signs the pack. Claude cannot sign** | Brief and research pack, final | 5 min |

Run each moment the same way: draft first, show it in one compact block with the decision the designer must make **marked**, wait for that decision, then move on. Never present a moment as a form to fill in.

**Added after the critique, on every project:**
- The client says yes to the brief in writing and agrees to AI on their data (★ gate A5).
- Recruit users from day 1: screener, consent form and script (gate B6).
- Start the AI quality log: every AI mistake caught, kept across all stages (`ux/team/ai-quality-log.md`).

## Steps (the playbook)

**0. Prep the kick-off (Sparr).** If a client call is coming, forecast the pushback and build the question list from the context sweep (see `/requirement-call` and the context questions C1–C12, D1–D10 in `resources/reference.md` §1).

**1. Intake register.** Every input is sorted (category, where it enters, what we take, what we don't, who reviews) before it goes anywhere. Use the intake table in reference §2. Client solutions and visuals go to the **parking lot**. Missing-but-referenced inputs are chased or logged as open questions.

**2. Clean (Distill).** Speaker labels, client names removed, timestamps kept. This is `/interview-synthesis` Step 1 and the engagement-guardrails sweep. AI does it, and the research owner spot-checks one call in three.

**3–4. Starting point and input scenario.** Propose the starting point (reference §3: new product discovery, roadmap item, existing redesign, new feature, legacy replatform, pitch) and the input scenario(s) I1–I14 (reference §0). Scenarios combine (I5 + I6 + I7 is common), so take every change that applies, including its **confidence ceiling**. The context sweep (§1) becomes questions with owners. The team lead confirms.

**5. Source map.** One row per claim: who, source type, date, exact quote. Every claim gets a source type and a link to its source line.

**6. Desk lane.** A desk research plan from the open context-sweep questions. Existing research is recorded with its date, method and sample, and anything older than the cut-off (18 months unless the team decides otherwise) is medium at best. For an existing product, the walkthrough, analytics and tickets give the current flow and what must survive. Then the competitive scan: 3–5 products, including every one the client named. A person checks each.

**7. Decide each conflict.** This is the conflict rule (reference §4): log both sides → say what it's about → check the strong side is strong → decide, or not yet → the right person decides → carry it on. Whose word wins depends on the claim (§3b). Every conflict leaves Frame with a status: Resolved (decision card), Open question, Assumption to test, Contested problem (→ discovery) or Out of scope. Nothing leaves as "Logged" or "Waiting". More than three unresolved at sign-off means the senior decides whether Frame is done.

**8. Path.** Do the sources agree on the problem? Yes: roadmap item. No: discovery, even if the client brought a solution.

**9. Draft the framed brief** (`/design-brief`, page one). Confidence and source on every fact. **People write the problem and success.** Claude drafts around them and flags solution bias.

**10. Where AI fits.** Screen, agent, both or neither, as a starting position. The developer and designer check it, and the team lead decides. It must say how the user stays in control, and name what the AI can't know (gate G1 ★). The data AI needs is named, and known to exist or listed as an open question.

**11. Research pack and interpretations.** 1–2 personas, 5–8 JTBDs, insights, HMWs and problem statements, each traced to a source line or marked low/unknown (`/jobs-to-be-done`, `/persona`, `/experience-strategy`). Biggest gap first: if no users were heard, "no user voice" is the biggest gap, and it's said plainly. The research owner rewatches at least one call by hand (B3).

**12. Competitive scan.** 3–5 products, including every competitor the client named (or each excluded with a reason). A person checks every detail and adds screenshots.

**13. Foundation capture.** DS (Figma / code / PDF), brand, stack, platforms, owner. Pre-answer Explore's 8 intake questions (D1–D10). Access list: Figma library, repo, brand files, analytics. The design lead checks. The foundation card **never goes into the problem**.

**14. Challenger.** A fresh context, read-only: `sc-checker` runs the **frame-research-challenger** and **frame-conflict-check** protocols. Add a Sparr forecast of the client's pushback, and a 30-minute review. A gap only the client can close goes **Back to client**: no decision owner, scope not agreed, or a blocking open question.

**15. Gate 1, Frame → Explore.** `/design-lead` runs it: the gate sheet `~/.skillcloud/repo/skills/core/design-lead/resources/gates/1-frame-explore.md`.

**16. Write back after Explore.** The brief is updated from the feedback log, the user evidence and the decision card. The senior re-signs. Explore can send the brief back here (a wrong problem or new scope comes back as a change request). Frame changes the brief only through write-back.

## Only if it applies

| When | Add |
|---|---|
| Existing product | heuristic evaluation and UX audit (`/heuristic-evaluation`, moment 3) |
| Sources disagree | a decision card for each conflict |
| Client brought solutions or competitors | inputs to weigh, not requirements |
| Roadmap item | frame it as a hypothesis to test |
| Product has AI | where AI fits, and what happens when it's wrong |
| Regulated data | what Claude may not read |

## Claude handles it, designer checks (background)

Transcript clean-up and source index · agreement grid across all sources · draft personas, JTBDs and competitor scan · automated checks (frame-conflict-check, research challenger) · confidence caps and source links on every claim · publishing the finals and the handoff card.

## Checks while producing the output

The research challenger runs the brief and research-pack checks. frame-conflict-check runs the conflict checks. **Judgement checks can only be passed by a designer.** The sign-off refuses while any blocking check has failed. The full table, with when, what and whether it blocks, is in reference §5. Blocking checks include:
- client inputs never in the brief as requirements
- every conflict has a decision
- the confidence cap
- solution bias
- one page
- traceability
- within limits
- evidence per item
- the right starting point
- the heuristic evaluation and UX audit (existing product)
- assumption coverage
- client not overruled

The three judgement checks: problem framed by a person, conflicts decided, audit findings reviewed.

## Output (all to `ux/frame/` and the usual paths; finals into project knowledge)

| Output | What's in it | Signed off by |
|---|---|---|
| Framed brief (one page) | problem, who it's for, what we know (confidence + source), assumptions, where AI fits, constraints, success, open questions | Senior |
| Research pack | 1–2 personas, 5–8 JTBDs, a scan of 3–5 competitors, each item linked to its source line | Research owner |
| Heuristic evaluation and UX audit (existing product) | Nielsen's 10 + AI heuristics (People + AI Guidebook, Microsoft HAX), flows, consistency, content, accessibility, known pain points; each finding with evidence, severity and the brief problem it supports | Research owner |
| Conflict log | every disagreement: sources, type, who decided, decision card | Senior or research owner |
| Client inputs register | client ideas, visuals and competitors, each tagged evidence / preference / idea | Researcher |
| Assumptions to test | each paired with a planned test in Explore | Team lead |
| Project card | existing or new, starting point, design foundation, tech stack, owners, cadence | Team lead |
| Decision cards and handoff card | every sign-off, plus what Explore receives | Team lead |

Explore can start once the brief and research pack are final, every blocking check (including the designer's judgement checks) has passed, and every conflict has a decision or has become an assumption to test.

## Handoff

End with: the five moments' status (decided / waiting on whom), the outputs and their status, the conflict count by status, and the next step. That is Gate 1 through `/design-lead`, or the moment that's waiting on a designer.
