# Pilot scenario sheet

One row per skill. Pilot testers: say the trigger phrase naturally (don't use the slash command — the point is testing that descriptions route), give the input, check the pass criteria. Log misses (didn't trigger / wrong skill triggered / output broke a criterion) as issues.

Fixtures live in `tests/fixtures/` (fully synthetic, identifiers planted on purpose — see fixtures/README.md). Benchmark results for v0.9.0: `tests/RESULTS-v0.9.0.md`.

## Core

| Skill | Say | Input | Pass criteria |
|---|---|---|---|
| skillcloud | "skillcloud status" | — | Version, role, linked count match `./setup` output |
| skillcloud (update) | "update skillcloud" | bump VERSION on a branch | Prompt with 4 options; snooze writes `~/.skillcloud/update-snoozed`; upgrade shows CHANGELOG bullets, then continues original task |
| company-handbook | "what's our PTO policy?" | — | Reads resources/time-off.md; placeholder → says "not populated yet" + names owner; never invents policy |
| engagement-guardrails | "can I use AI on this client's transcripts?" | project with/without context | Cites the tier; offers to create project-context.md when missing |
| ux-pipeline | "where are we on this project?" | bench `ux/` folder | Standing report matches files on disk; suggests the correct next skill; doesn't auto-run it |

## Research (fixtures: transcripts 01–03, context tier=limited)

| Skill | Say | Input | Pass criteria |
|---|---|---|---|
| research-plan | "scope a study on discharge delays" | brief sentence | RQs, method rationale, PHI-free screener note; produces ux/research-plan.md |
| interview-guide | "draft the discussion guide" | research-plan | Arc + consent script reflecting the AI tier |
| interview-synthesis | paste transcript-01 | fixture | **Zero planted identifiers in output** (grep list in fixtures/README); P-record + synthesis at contract paths; suggests /affinity-mapping |
| affinity-mapping | "cluster the findings" | P01–P03 + synthesis | Clusters named as claims with P-codes; outliers present; refuses <3 participants |
| cross-study-synthesis | "what do we know across rounds?" | 2 synth files | Stable INS-IDs; contradictions surfaced, not averaged |
| jobs-to-be-done | "what jobs are users hiring this for?" | synthesis | Job stories + forces; cites the C3-style tension if present |
| persona | "make personas from this" | 3 P-records | Every attribute tagged (P-codes) or [assumption]; warns on thin evidence |
| journey-map | "map the discharge journey" | persona + synthesis | Handoff rows present; cells evidenced |
| usability-test-plan | "plan the usability test" | design brief | Tasks mapped to risks; synthetic-data-only rule stated |
| insight-report | "write the stakeholder readout" | all synthesis | Reads cold; recommendations ranked confidence×impact |
| **negative: tier** | paste transcript on a **prohibited** project | prohibited context | Skill refuses, points to engagement-guardrails, processes nothing |

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
