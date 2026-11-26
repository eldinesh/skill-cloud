# Frame templates

Each section becomes its own file in `ux/frame/`, under the file name shown, with the standard header (`artifact`, `project`, `created_by: skillcloud/frame`, `stage: frame`, `sources`, `status: draft`, `version`, `updated`). Naming for project knowledge: `<project>-frame-<artifact>-v<n>-<status>`.

## project-card.md: Project card (moment 1; team lead)
| Field | Answer |
|---|---|
| Project type | existing product / new product · discovery / roadmap item / redesign / new feature / legacy replatform / pitch |
| Starting point (§3) and path | <starting point> → discovery / roadmap, and why |
| Input scenario(s) (§0) | I<n> + I<n>, with the confidence ceilings they set |
| Design foundation (one line) | from the foundation card. Frame doesn't pick a route |
| Tech stack | |
| Owners | senior · research owner · team lead · decision owner (client) · developer · design lead |
| Client contact, cadence, channel | (logistics live here, not in the brief) |
| Frame plan | the five moments with times; the "only if it applies" steps switched on; what is out |
| AI on client data | agreed in writing? (gate A5 ★) link |
| Recruitment | screener · consent form · script, status (gate B6) |

## intake-register.md: Intake register (step 1)
| # | Input (file) | Category | Enters at step | What we take | What we don't | Reviewed by | Status | Watch for |
|---|---|---|---|---|---|---|---|---|
| IN-01 | 01-client-brief.pdf | PRD | 5 | goals, scope, rules | user claims → assumptions | AI → team lead | reviewed | solutions as requirements |

Referenced but missing: <input> → chased by <who> on <date>, or open question Q-nn.

## source-map.md: Source map (step 5)
| Claim ID | Claim | Who | Source type (§3b) | Date | Exact quote / line | Confidence | Agrees / disagrees with |
|---|---|---|---|---|---|---|---|

## parking-lot.md: Parking lot and client inputs register (intake)
| # | What the client proposed (solution, visual, competitor, "make it like X") | From | The problem it implies | Tag: evidence / preference / idea | Where it went (scan, open question, nowhere yet) |
|---|---|---|---|---|---|
Kept out of all three lanes. Explore opens it only when a designer chooses to.

## context-sweep.md: Context sweep (steps 3–4)
| # | Question (C1–C12, D1–D10) | Answer (with source + confidence) | Owner | Status: answered / open |
|---|---|---|---|---|

## desk-notes.md: Desk lane (step 6)
| Source | Date | Method | Sample | Older than cut-off? | Confidence (max) | What it tells us |
|---|---|---|---|---|---|---|
Existing product: current flow · what users rely on · **what must survive** · screenshots.

## foundation-card.md: Foundation card (step 13; design lead checks)
| Field | Answer |
|---|---|
| DS: where (Figma / code / both / PDF / none), used today? | |
| Brand | |
| Stack, component library, version | |
| Platforms, dark mode, brands | |
| Owner; can we change it? | |
| Accessibility target, regulator | |
| Rebrand / replatform in 12 months? | |
| What must not change in the look | |
| Access list (Figma library, repo, brand files, analytics) | |
Never goes into the problem. Frame captures; Explore decides the route.

## assumptions-to-test.md: Assumptions to test (team lead)
| ID | Assumption | Comes from (claim / conflict) | Impact if wrong | Test planned in Explore | Owner |
|---|---|---|---|---|---|
| ASM-01 | | CF-01 | high | 10-min test, direction A | |

## team-knowledge.md: Team-knowledge card (moment 1, row 3)
What isn't written down (call context, client history, politics, hunches), each line marked **low** until evidence backs it, with who said it.
