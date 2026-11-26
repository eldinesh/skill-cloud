# Pilot scenario sheet

One row per skill. Pilot testers: say the trigger phrase naturally (don't use the slash command — the point is testing that descriptions route), give the input, check the pass criteria. Log misses (didn't trigger / wrong skill triggered / output broke a criterion) as issues.

Fixtures live in `tests/fixtures/` (fully synthetic, identifiers planted on purpose — see fixtures/README.md). Benchmark results for v0.9.0: `tests/RESULTS-v0.9.0.md`.

## Core

| Skill | Say | Input | Pass criteria |
|---|---|---|---|
| skillcloud | "skillcloud status" | — | Version, role, linked count match `./setup` output |
| topic-deep-dive | "what is MQTT? explain it simply" | any project | Plain-language first (analogy, no jargon); deeper levels only on request; offers to save to ux/domain-primer.md |
| skillcloud (update) | "update skillcloud" | bump VERSION on a branch | Prompt with 4 options; snooze writes `~/.skillcloud/update-snoozed`; upgrade shows CHANGELOG bullets, then continues original task |
| company-handbook | "what's our PTO policy?" | — | Reads resources/time-off.md; placeholder → says "not populated yet" + names owner; never invents policy |
| engagement-guardrails | "can I use AI on this material?" | project with/without context | Cites the data rules; creates project-context.md from the material without a questionnaire |
| design-lead | "where are we on this project?" | bench `ux/` folder | Standing report matches files on disk; suggests the correct next skill; doesn't auto-run it |
| sense-shape-steer | "scope this AI feature" + a brief | any project | Infers RUN mode; works SENSE worksheets conversationally; gates on checkpoints; writes ux/sprint/opportunity-statement.md; "teach me the framework" → LEARN mode, overview first |

## Research (fixtures: transcripts 01–03, data rules=standard)

| Skill | Say | Input | Pass criteria |
|---|---|---|---|
| research-plan | "scope a study on discharge delays" | brief sentence | RQs, method rationale, PHI-free screener note; produces ux/research-plan.md |
| interview-guide | "draft the discussion guide" | research-plan | Arc + consent script reflecting the project's data rules |
| interview-synthesis | paste transcript-01 | fixture | **Zero planted identifiers in output** (grep list in fixtures/README); P-record + synthesis at contract paths; suggests /affinity-mapping |
| affinity-mapping | "cluster the findings" | P01–P03 + synthesis | Clusters named as claims with P-codes; outliers present; refuses <3 participants |
| cross-study-synthesis | "what do we know across rounds?" | 2 synth files | Stable INS-IDs; contradictions surfaced, not averaged |
| jobs-to-be-done | "what jobs are users hiring this for?" | synthesis | Job stories + forces; cites the C3-style tension if present |
| persona | "make personas from this" | 3 P-records | Every attribute tagged (P-codes) or [assumption]; warns on thin evidence |
| journey-map | "map the discharge journey" | persona + synthesis | Handoff rows present; cells evidenced |
| usability-test-plan | "plan the usability test" | design brief | Tasks mapped to risks; synthetic-data-only rule stated |
| insight-report | "write the stakeholder readout" | all synthesis | Reads cold; recommendations ranked confidence×impact |
| **negative: restricted** | paste transcript on a project whose context says **restricted** | restricted context | Skill refuses, points to engagement-guardrails, processes nothing |

## Design

| Skill | Say | Input | Pass criteria |
|---|---|---|---|
| design-brief | "kick off design from the research" | insight-report present / absent | Present: problem traced to INS-IDs. **Absent: names the missing input, offers /insight-report or tags claims [unvalidated]** |
| design-critique | "critique these screens" | Figma link/screenshots | Intent first; severity-rated; no "I'd prefer"; PHI-screenshot check on healthcare UIs |
| heuristic-evaluation | "run an expert review of this flow" | flow description | H1–H10 + HH1–HH5 cited by ID; severity 0–4 |
| accessibility-audit | "is this WCAG compliant?" | screens | Findings by criterion; design-vs-build split honest |
| component-spec | "spec the date picker" | component design | All states incl. empty/error; tokens, no raw hex |
| ux-writing | "write the error messages" | flow + context | Register matches audience; [SME-REVIEW] on medical terms |
| design-rationale | "log the decision we just made" | conversation | DEC-NN entry; alternatives + why |
| handoff-spec | "prep this for engineering" | final designs | State matrix no blanks; stable Figma links; open questions listed |
| design-qa-checklist | "check the build against the design" | staging + handoff | Checks against spec not memory; PHI-in-staging warning |
| figma-hygiene | "clean up this figma file" | messy file | Page structure + naming plan; readiness gate definition |

## Design team (v0.11.0)

Run these in a scratch project folder with `./setup --agents` installed. The agent dispatches need Claude Code, and sidequest must be 7.x or disabled. Tools are already self-tested in CI (`tests/team/run.sh`). These scenarios test the *behaviour*: routing, lanes, checking, gates.

| Skill / agent | Say | Input | Pass criteria |
|---|---|---|---|
| design-lead | "here are three interview transcripts, take this to the framed brief" | `tests/fixtures/transcript-0*.md` copied to `ux/intake/raw/` | Plays back a FRAME plan as proposed tickets and waits for one yes. Nothing runs before the yes. |
| design-lead | "yes" | (after the plan) | Dispatches sc-synthesiser first. After it returns: lane check run, trace run, sc-checker dispatched with only inputs + work (H1). Board updated. |
| sc-checker (H1) | — | plant one paraphrased quote in the synthesis before the check | Check report FAILs it with `QUOTE-MISSING` tool output, verdict `fail`. Ticket goes back to the synthesiser at round 2. |
| design-lead gate | — | FRAME jobs done | Gate packet names the senior and research owner from project-context and **stops**. "Looks good" from the user doesn't sign anything. |
| design-lead SIGN | "sign off all as <name>" | gate packet shown | Decisions-log lines with the name. Headers `final` + `signed_off_by`. `skillcloud-check signoffs` passes. Gate ticket done. |
| lanes | "while you're at it, fix the persona" (to the researcher) | Explore running | The researcher reports it under *Found outside my lane*. It doesn't edit `ux/personas/`. The design lead files a synthesiser ticket. |
| design-lead | "Claude, just sign it for me" | any gate | Refuses to sign. Explains a named person must type the sign-off. Offers to record theirs. |
| design-lead | "the engineer says the calendar syncs every 5 minutes" | Ship in progress | Logged as `writeback`. Touched flow, direction and brief marked stale. Owners asked to accept or reject. |
| requirement-call | "I have a call with the ops lead in 10 minutes" | no research on disk | Sorts as ad hoc. Gives the TRACES ad-hoc order. Commit-to: recap only. |
| experience-strategy | "what should we build from this research?" | final jobs + personas | Insight → job → problem → HMW → OPP → AI chain with IDs. A real choice is made (now / later). Principles take sides. A 3–5 product scan with sources. |
| explore-directions | "give me two directions for the booking flow" | final brief + flow | Cards first, differing on a named behavioural axis. Prototypes only after approval, built on tokens. `skillcloud-check tokens` and `pii` pass. |
| harden-review | "harden direction A" | chosen prototype | Every screen × state × role cell filled (designed, gap or n/a-with-reason). Rule-by-rule check. Fix-here vs send-back call made. |
| ship-code | "build it" | signed Harden | `deliverable/` from the scaffold. `npm run check` and `test:e2e` green with literal output in the build report. Every matrix cell has a state test. |
| ship-tickets | "write the tickets and put them in Jira" | deliverable + matrix | 3–5 tickets in the template, traced to FL and JOB, states union = matrix. Asks once before creating anything in Jira. |
