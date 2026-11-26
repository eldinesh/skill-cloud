# Handoff challenge protocols

## Koru Studio's named audits (what the boards call them → what runs)

Every audit runs in `sc-checker`, in a **fresh context, read-only**, seeing only the inputs it is given. Tools come first, as below.

| Named audit | When | Reads | Checks (source of truth) | Also runs |
|---|---|---|---|---|
| **frame-conflict-check** | Frame, moment 2 | source map, conflict log, raw sources | Frame reference §4 + the context-sweep checks in §"Checks while producing" | H1 q7 (contradictions) |
| **frame-research-challenger** | Frame step 14 | brief, research pack, source map | Frame checks table (confidence cap, solution bias, one page, traceability, limits, evidence per item, leading quotes) | H1, H2 |
| **frame-explore-readiness-audit** | Gate 1 | the handoff pack only | `gates/1-frame-explore.md`, every question | — |
| **explore-foundation-check** | Explore step 1 | Figma MCP, repo, brand docs | Explore reference §0 (F1–F12, Claude-readiness check) | — |
| **explore-direction-challenger** | Explore step 9 | the two direction cards, option sketches, pack | Explore checks table (really different, JTBD coverage, copying, card before showing) | H4 q1–q2 |
| **DS fit check** | Explore step 4 | DS + DS.md only | Explore reference §2: build a screen; any hard-coded value or invented component is a gap | `skillcloud-check tokens` |
| **explore-harden-readiness-audit** | Gate 2 | the Harden input pack only | `gates/2-explore-harden.md` | — |
| **harden-reviewer** | Harden steps 3 and 6 | prototype (review bar), role matrix | role × action × state × data gaps; Harden checks table rows Roles to Edge cases | H5 q1–q2 |
| **harden-rulebook-check** | Harden QA step | prototype, rulebook chapters, tokens | rulebook, design-system and accessibility rows; WCAG 2.2 AA scan | H5 q3, `contrast`, axe |
| **harden-ship-readiness-audit** | Gate 3 | the hardened pack only | `gates/3-harden-ship.md` | — |
| **ship-handoff-reviewer** | Ship step 5, and Gate 4 | deliverable, tickets, handoff note | reads as an engineer: every question it would still ask; Ship checks table; at Gate 4, `gates/4-ship-learn.md` | H6 (re-runs the deliverable's checks) |

**Gate audits fill the sheet's "AI verdict + evidence" column**, one row per question: `Pass: <link to file:line>`, `Gap: <what's missing>`, or `Can't tell (= Gap): <why>`. No Pass without a linked piece of evidence. Never write in the Human decision column, never waive, never sign. Count the Gaps, flagging ★ ones, at the top of the sheet.

**Judgement checks (★J) are never passed by an audit.** The audit only reports whether the designer's evidence exists (who wrote the problem sentence, a decision card with a named person). The designer passes them.

The checker agent (`sc-checker`) runs one protocol per handoff. Each protocol lists what the checker receives, the tools it runs **first**, the questions it must answer, and what counts as a blocker. Severity and verdict rules are in `team-charter.md` Article 5. Write the report to `ux/team/checks/<job-id>.md` from `check-report-template.md`.

`skillcloud-check` lives at `~/.skillcloud/repo/bin/skillcloud-check`. Run it from the project root. Paste its output literally, and never summarise a FAIL line away.

Every protocol also runs the **common checks**:

```bash
SC=~/.skillcloud/repo/bin/skillcloud-check
$SC trace <each produced file>     # sources exist and are final; cited IDs resolve; quotes verbatim
$SC pii ux                         # identifier sweep: emails, phones, SSN/MRN shapes, exact dates of birth
```

- Header present and complete (artifact, project, created_by, stage, sources, status: draft, updated).
- No `final`, `signed_off_by` or sign-off text written by an agent (charter Art. 6).
- Every `[inferred]` claim is low confidence. No inferred claim is presented as fact in a summary.
- The return packet's "Self-checks run" lines match what the tools say now. A claimed pass that now fails is a **blocker** ("misreported self-check").

---

## H0 · Research plan → fieldwork  (research owner signs before sessions)

**Receives:** `ux/research-plan.md`, `ux/interviews/guide.md`, the final brief if one exists.
**Questions:**
1. Does the plan name the decision it informs? Do the research questions, if answered, actually change that decision?
2. Is the method fit for the question? (Self-report can't answer "what do they actually do"; observation can.)
3. Recruitment: are the roles, sites, shifts or segments that would contradict the team's assumptions included? Name the missing segment.
4. Guide: leading questions ("wouldn't it help if…"), double-barrelled questions, solution pitches, hypotheticals where past behaviour was available.
5. Consent and data handling stated for the project's domain.
**Blockers:** no decision statement · a guide question that pitches the solution · a plan that would record identifiers it doesn't need.

## H1 · Research pack → Frame sign-off  (research checker)

**Receives:** `ux/interviews/P*.md`, `ux/synthesis/*`, `ux/personas/*`, `ux/synthesis/jobs-to-be-done.md`, `ux/strategy/competitive-scan.md`, `ux/insight-report.md` if present.
**Tools first:** common checks. `trace` is the quote check: every `"…" — Pnn` quote must exist verbatim in `ux/interviews/Pnn.md`.
**Questions:**
1. **Single-source claims.** List every theme, insight or persona trait that rests on one participant or one stakeholder. Each must be labelled a signal or carry **low/medium** confidence. Unlabelled is a **major**.
2. **Layer errors.** Data or findings presented as insights: no "because", no "which means", or not tied to a user need and business goal. A single quote treated as a pattern is a **major**.
3. **Leading evidence.** Quotes that answer a leading question. Check the guide. They don't count as support.
4. **Orphans.** Jobs with no evidence line. Persona attributes nobody said. Competitive claims with no source or screenshot.
5. **Confidence inflation.** A **high** that doesn't have two independent sources including direct user or client evidence is a **major**.
6. **Limits.** 1–2 personas, 5–8 jobs, 3–5 competitors. Over the limit is a **minor**, unless the gate owner has recorded why.
7. **Contradictions.** Disagreement between participants reported, or averaged away?
**Blockers:** a fabricated or non-verbatim quote · identifiers left in · a job or persona with zero evidence.

## H2 · Framed brief → Frame sign-off  (brief checker)

**Receives:** `ux/design/brief.md`, `ux/strategy/experience-strategy.md`, the research pack (final or in the same gate).
**Questions:**
1. One page? Every section filled (problem, who, what we know, assuming, where AI fits, constraints, success, open questions)?
2. Every "what we know" fact carries a confidence level **and** a source. A missing source is a **major**.
3. Solution-free test: could two materially different designs solve the problem as written?
4. Path stated: roadmap hypothesis or discovery question. Does the brief behave like that path?
5. Where AI fits: screen, agent, both or neither, with a reason traced to a job or insight. If AI is chosen, the strategy's AI opportunity is cited.
6. Success: 2–3 outcomes someone could observe, each with how it will be measured.
7. Divergence: where a stakeholder ask and the evidence disagree, does the brief say so?
**Blockers:** a fact with no source presented as known · a problem statement that is a solution.

## H3 · Structure → Explore  (IA checker)

**Receives:** `ux/structure/ia.md`, `ux/structure/flows/*.md`, the final brief, research pack, strategy.
**Tools first:** common checks plus `skillcloud-check ia` (every flow step resolves to an IA node; every node in scope reachable; no node deeper than the stated depth limit).
**Questions:**
1. Labels: do navigation labels use the users' words (cite participant vocabulary) or internal jargon?
2. Object model: are the core objects, their relationships and their actions explicit? Does every action in a flow belong to an object?
3. Flow coverage: does the in-scope flow serve the jobs the brief prioritised? List jobs with no path.
4. Error, abandon and resume paths present for every step that can fail or be interrupted?
5. Roles: does every step say which roles can reach it?
**Blockers:** a flow step pointing at a node that doesn't exist · a prioritised job with no flow.

## H4 · Directions → Explore sign-off  (direction checker)

**Receives:** `ux/explore/directions.md`, `ux/explore/*/prototype.html`, `ux/explore/feedback-log.md`, `ux/explore/test-script.md`, the final brief, pack, strategy, structure.
**Tools first:** common checks; `skillcloud-check pii ux/explore` (prototype data is synthetic); `skillcloud-check contrast` on the token pairs the prototypes use.
**Questions:**
1. **Do the directions really differ?** Name the axis: where AI sits, who's in control, the core interaction model, or the information model. Two skins of one idea are a **blocker**.
2. Every direction card filled before anything was shown: name, idea, jobs served (IDs), where AI sits and how the user stays in control, biggest risk, the one test question.
3. **Looks like the real product?** Uses the design system or starter tokens, real-shaped synthetic data and real copy. Grey-box wireframes or lorem ipsum are a **major**.
4. Each prototype covers the 3–5 screens of the in-scope flow and runs offline as one file.
5. **Evidence for the choice.** Did a person play the user? Are findings logged per direction, with simulated sessions labelled as simulated? A choice with no user evidence is a **blocker**, unless the team lead recorded an override.
6. Polished past the point of choosing? Gold-plating is a **minor**.
**Blockers:** directions that don't differ · simulated user output logged as user evidence · real-looking identifiers in prototype data.

## H5 · Hardened design → Harden sign-off  (harden checker)

**Receives:** `ux/harden/*`, the hardened prototype, `ux/design/heuristic-eval.md`, `ux/design/accessibility-audit.md`, the tokens file, the rulebook chapters cited, the final direction and structure.
**Tools first:** common checks · `skillcloud-check contrast` per token pair · where the prototype runs in a browser, the axe scan's literal output, per screen and per state.
**Questions:**
1. **Matrix completeness.** For every screen in the flow: empty, loading, error, success, partial and permission-denied, with the AI states where AI is present (thinking, low confidence, wrong, override, undo). Every role × action cell filled. A blank cell is a **major**, a "TBD" is a **blocker**.
2. Edge data: long names, no data, a lot of data, and one item vs many (bulk actions). Is the audit trail present where the domain needs it?
3. Rulebook check: is every rule in the cited chapters marked pass, fail or n/a with a reason? An "n/a" with no reason is a **major**.
4. Feasibility: is every engineer-stated limit (sync delays, API gaps) designed for on screen, not just noted?
5. System fit: does the flow match the rest of the product's patterns? Are deviations recorded as decisions?
6. Send-back test: does any finding mean the direction itself won't hold? If so, recommend Explore, not more fixes.
**Blockers:** a missing state class on any screen · an accessibility fail with no fix or decision · a feasibility limit with no design response.

## H6 · Ship spec → Ship sign-off  (spec checker)

**Receives:** `deliverable/`, `ux/ship/build-report.md`, `ux/ship/tickets/*`, `ux/ship/handoff-note.md`, the final hardened design, the rulebook (code, testing, handoff chapters).
**Tools first:** common checks, then **re-run the deliverable's checks yourself.** Do not trust the build report.

```bash
cd deliverable && npm ci && npm run check    # typecheck, lint, tokens, unit, build
npx playwright install chromium && npm run test:e2e   # flows, states, axe, keyboard
```
Paste the summary lines. If any check can't run here, say so as a finding and say why. Never substitute the build report's numbers for your own.
**Questions:**
1. **Could a coding agent build this without coming back?** Pick the two hardest tickets and list every question you'd have to ask. Each one is a finding.
2. Every ticket: verb+object title, user story, context links, given/when/then (one line each, testable), states covered, screenshots per state, tokens used, out of scope, open questions. Traced to a screen (`FL-..`) and a job (`JOB-..`).
3. Coverage: does every screen × state in the hardening matrix exist in code and have a test? List the gaps.
4. Code chapter: tokens only (no raw colours or spacing), no network calls, no secrets, synthetic data only, the accessibility rules applied.
5. Does the handoff note fit half a page and say what's in, what's out, the decisions engineers must know (DEC IDs) and who to ask?
**Blockers:** any failing check · a state in the matrix with no code · a ticket with untestable criteria · a build report that disagrees with the re-run.
