# Frame v2: reference (full detail)

Step numbers match the Frame playbook. Section numbers match the board.

## 0. Input scenarios: when the inputs are messy

Real projects don't give us one clean source of truth. Claude proposes the scenario(s) at step 3 from the intake register, and the team lead confirms. Scenarios combine (I5 + I6 + I7 is common), so take every change that applies.

| # | What we get | The risk | What Frame does | Confidence ceiling |
|---|---|---|---|---|
| I1 | Rich and clean: PRD, recent research, access to users | Redoing work, or trusting it blindly | Verify, don't redo: check the research's age, method and who was studied; spot-check claims against users | As the evidence allows |
| I2 | PRD or requirements only, no users | PRD assertions taken as facts | Every PRD claim about users goes under "What we're assuming". Ask for 3 user calls or proxies (support, sales). Flag "no user voice" as the biggest gap | Medium on user claims |
| I3 | Kick-off call transcripts only | Loudest voice becomes the brief | Standard run: Distill → source map → conflict log. Count voices per claim | Medium unless 2+ sources agree |
| I4 | A one-line ask ("we want an AI that…") | We frame our guess, not their problem | Discovery path. Sparr-prepped kick-off with the full question list. Park the ask as a client solution | Low until the kick-off |
| I5 | Client brings a solution | The solution becomes the brief | Park it. Write down the problem it implies, and test that problem like any other claim. If sources agree on the problem, the solution becomes a hypothesis (roadmap path) | — |
| I6 | Sources conflict (PRD vs stakeholders vs users vs research) | Someone picks silently | Conflict rule (§3b, §4). If the problem itself is contested → discovery | Low on contested claims |
| I7 | Stakeholders only, no access to users | Personas made of opinion | Proxies: support tickets, reviews, sales and support staff, analytics. Personas marked low. Ask for users before Explore's testing | Low on personas |
| I8 | Existing research of unknown age or quality | Old findings treated as current | Note date, method, sample. Older than 18 months or method unknown → medium at best. Re-check the 3 claims the brief leans on most [decide: 18 months] | Medium |
| I9 | Legacy product, no documentation | Nobody knows how it really works | Designer records a walkthrough; analytics and support tickets; "what must survive" list. Hand it to Explore's heuristic review | As observed |
| I10 | Client sends visuals, mockups, "make it like X" | Look or layout copied before the problem is framed | Park the visuals. Ask what they like about it, log that as a preference. Named competitors go into the scan | — |
| I11 | Very capable client (own research, own AI, strong team) | We repeat what they've done; we add nothing | See §5b: Frame shrinks to verify, fill gaps and draw out decisions | As their evidence allows |
| I12 | No clear decision owner, or stakeholders split | Nobody can resolve a conflict; Explore gets stuck later | Name the decision owner before sign-off. The gate can't pass without one (outcome: Back to client) | — |
| I13 | Regulated or sensitive domain (health, finance, children, aged care) | A design that can't legally ship | Regulatory source is authoritative on rules; compliance review named in constraints; data limits for AI written down | High on rules from the source |
| I14 | Moving target: roadmap or scope changes during Frame | Brief out of date before it's signed | Changes logged in the intake register with dates; scope frozen at sign-off; later changes through write-back or a change request | — |

## 1. Context sweep: the questions "context" must answer

Context is a set of questions, each with an owner and a source, not a topic list. **Design context** is what Explore designs *from* (brief + pack). **Design foundation** is what Explore designs *with* (foundation card). Logistics go to project setup, not the brief.

**Design context (question → owner · best source)**

| # | Question | Owner · best source |
|---|---|---|
| C1 | What problem are we solving, in whose words, and do sources agree? | Team lead · calls, PRD, users |
| C2 | Who are the users, and who are we NOT designing for? | Research owner · calls, analytics, research |
| C3 | What do they do today (current flow, tools, workarounds)? | Researcher · users, product, tickets |
| C4 | What do we know directly from users, and how old is it? | Research owner · interviews, tests |
| C5 | What does the business need (outcome, metric, baseline)? | Team lead · decision owner, PRD |
| C6 | What has been tried before, and why did it fail? | Team lead · client team, old research |
| C7 | What must not change (what users rely on, regulated steps, brand equity)? | Designer · users, product, compliance |
| C8 | Constraints: tech, regulatory, time, budget, data access? | Developer + team lead |
| C9 | Where could AI help, what data would it need, and does it exist? | Developer + designer · AI canvas |
| C10 | Who decides, who influences, who could block? | Team lead · kick-off, Sparr |
| C11 | What does the client already believe the answer is? | Team lead → parking lot |
| C12 | Which competitors or references do they name, and why those? | Designer → scan / parking lot |

**Design foundation (what Explore designs with).** These pre-answer Explore's 8 intake questions. Explore step 1 still runs the audit and picks the route.

| # | Question |
|---|---|
| D1 | Is there a DS? In Figma, code, both, or a PDF? Is it used today? |
| D2 | Is the DS a deliverable, or only a means to design the flows? |
| D3 | Who owns and maintains it? Can we change it? |
| D4 | Does the client's team design in Figma, code, or both? |
| D5 | Platforms, dark mode, more than one brand? |
| D6 | Accessibility target, regulator? |
| D7 | Rebrand or replatform in the next 12 months? |
| D8 | What must not change in the look (brand equity)? |
| D9 | Budget and time for the DS vs the flows? |
| D10 | Tech stack and component library (Tailwind, shadcn, MUI…)? |
| — | Logistics → project setup, not the brief: point of contact, decision owner's availability, review cadence, channel, access to users, Figma, repo, analytics |

## 2. Intake: every kind of input, where it enters, what we take, who reviews it

Everything lands untouched in `ux/intake/raw/` first. The intake sorter builds the intake register. "AI → person" means Claude processes it first and a named person checks it before it's used. Client solutions and visuals go to the parking lot.

| Input | Enters at | What we take | What we don't take | Reviewed by | Watch for |
|---|---|---|---|---|---|
| Call recordings and transcripts | Step 2 (clean) | Claims with quotes and speaker; pains; workarounds; who decides | Small talk; side remarks as facts | AI → research owner (1 in 3 spot-checked) | Misattributed speakers; "let's see" heard as a yes |
| Requirements doc / PRD | Step 5 (source map) | Business goals, scope, constraints, rules | Claims about users (assumptions until users confirm) | AI → team lead | Solutions written as requirements |
| Roadmap item | Step 3 | The outcome it aims at, the date, who asked | The feature as a given | Team lead | A feature with no problem behind it |
| Discovery request | Step 3 | The question and why now | — | Team lead | A hidden preferred answer |
| Emails, Slack, notes | Step 5 | Claims with sender and date | — | AI → research owner | Changed minds (latest wins only if it's the same person) |
| Existing research (reports, personas, journeys) | Step 6 (desk) | Findings with date, method, sample | Conclusions without the evidence | Researcher | Age; who was studied; sample size |
| Market research / analyst reports | Step 6 | Market size, trends, segments | Claims about these users' behaviour | AI → researcher | Market facts used as user facts |
| Analytics, product data | Step 6 | Behaviour: where people drop, what they use | Why they do it (needs users) | AI → researcher / developer | Seasonality, bots, tracking gaps |
| Support tickets, app reviews | Step 6 | Pains in users' own words, counts by theme | Single loud complaints as patterns | AI → researcher | Only unhappy users write in |
| Existing product (live, staging, screenshots) | Step 6 capture; Explore step 2 review | Current flow, what users rely on, what must survive | Patterns as answers to the new problem | Designer records → AI summarises → designer checks | Copying the current solution into the framing |
| Client-proposed solutions | Parking lot at intake | The problem it implies; the outcome they want | The solution as the answer | Team lead | It turning up in the problem sentence or a JTBD |
| Client visuals, mockups, sketches | Parking lot; Explore visual track | What they like about it (a preference) | Layout or flow | Design lead | Look and feel steering the solution |
| Named competitors / "make it like X" | Step 12 (scan) | What they do well and miss; why the client named them | Their answer to our problem | AI → designer (checks every detail) | Model knowledge out of date |
| Design system, Figma libraries, code | Step 13 (foundation); judged in Explore step 1 | What exists, in what form, who owns it | Patterns as solutions | Design lead | "We have a DS" meaning a PDF from 2019 |
| Brand guidelines, assets | Step 13 | What exists; whether applied to digital | — | Design lead | Colours that fail contrast |
| Tech stack, platforms, integrations | Step 9 constraints + step 13 | Limits on what can be built; data AI could use | — | Developer | Unknown APIs treated as available |
| Regulatory or legal rules | Step 9 constraints | The rule and its source | — | Team lead + client compliance | Rules stated second-hand |
| Logistics (contact, cadence, channel) | Project setup, not the brief | Who, when, where | — | Team lead | Logistics clogging the brief |
| Second-hand ("the CEO thinks…") | Step 5, as hearsay | The claim, low confidence | — | Research owner | Acting on it before the source confirms |
| Silence (no answer) | Open questions | The date we asked | — | Team lead | Silence read as agreement |

## 3. The starting point decides the path

Rule: if sources disagree on what the problem is, it's discovery, even if the client brought a solution.

| Starting point | What Frame does differently | Default path | Explore starts with (its step 2) |
|---|---|---|---|
| New product, discovery request | Widest context sweep; most open questions; personas may be archetypes | Discovery | Problem statements + JTBDs; references only after directions are set |
| New product, roadmap item | Turns the item into a testable hypothesis; checks the evidence behind it; parks it if it's a solution | Roadmap, unless sources disagree on the problem | The hypothesis + competitor and reference scan |
| Existing product, redesign | Current-flow capture, what users rely on, what must survive; analytics and tickets as evidence | Discovery if the problem is unclear; roadmap if it's a named fix | AI-assisted heuristic review of the current flow |
| Existing product, new feature | Captures the shell, nav and patterns the feature must live in | Roadmap item | Review of the current shell |
| Legacy replatform | "What must survive" is the main output; existing behaviour is the strongest evidence | Roadmap item | Heuristic review + what must survive |
| Pitch / proof of concept | Thin brief: problem, one persona, 3–5 JTBDs, one AI opportunity; says plainly what wasn't researched | Roadmap item (a bet) | Hero screens for the strongest opportunity |

### 3b. Conflicts: whose word wins depends on the claim

Claude logs every conflict and proposes. People decide. Claude's general knowledge can raise a question. It can't settle one.

| The claim is about | Strongest source | Then | Weakest |
|---|---|---|---|
| What users do | Observed behaviour: analytics, usability tests, the product | Users' own words (interviews, tickets) | Stakeholder opinion about users |
| What users need or feel | Users' own words, more than one | People close to users (support, site managers) | Stakeholders, PRD, market research |
| Business goal, scope, priority, budget | Client decision owner | PRD; other stakeholders | Anyone else |
| Rules and regulation | The regulation / client compliance team | Client documents | Second-hand mentions |
| Tech feasibility and data | Client engineering, the code | PRD | Stakeholders, AI general knowledge |
| The market | Recent market research with a method | Analyst reports | Anecdote |

## 4. The conflict rule (step 7): every conflict leaves Frame with a status

Covers PRD vs stakeholder, stakeholder vs stakeholder, stakeholder vs user, user vs user, market research vs users, data vs anecdote, old vs new research.

1. **Log both sides.** Exact quotes, who, source type, date. Claude never resolves silently and never averages two numbers.
2. **Say what it's about.** Users, business, rules, tech or market: look up whose word wins (§3b).
3. **Check the strong side is strong.** One anecdote, old research, or one voice against three isn't strong. Seniority isn't evidence.
4. **Decide, or not yet.** Resolved (decision card) · open question · assumption to test · contested problem → discovery.
5. **The right person decides.** Team lead for evidence about users. The client decision owner for business, scope and priority.
6. **Carry it on.** Unresolved conflicts go into the brief's "Conflicts" and Explore's direction card ("Conflict it tests"). If the same person changed their mind, the latest wins.

**Conflict log (template):** one row per conflict, in `ux/frame/conflict-log.md`

| ID | Topic | Side A (quote, who, source) | Side B (quote, who, source) | About | Proposed (by AI) | Decided by | Status | Goes to |
|---|---|---|---|---|---|---|---|---|
| CF-01 | Rota time | "3–4 hours every week" (ops head, call 1) | "maybe an hour" (manager A, call 2) | Users | Can't resolve: one voice each, no data | Team lead | Open question + assumption to test | Brief Q1; Explore direction A |

**Status values:** Logged · Waiting on decision owner · Resolved (decision card) · Open question · Assumption to test · Out of scope. Nothing leaves Frame as "Logged", or as "Waiting" on a scope conflict. Cap: more than 3 unresolved at sign-off → the senior decides whether Frame is done [decide].

## 5. Design system: the messy cases (Frame captures; Explore decides)

Frame never judges the DS or picks a route. What it captures decides how fast Explore can start.

| Foundation situation | What Frame does | What Frame hands to Explore | Risk to flag |
|---|---|---|---|
| DS that works (Figma + code, used today) | Foundation capture; ask for library and repo access before Explore | Access, owner, can we change it | Its patterns steering the framing |
| DS exists but doesn't work (missing or poor components, no tokens) | Ask what the client's own designers say about it; capture known gaps | "Quality unknown / poor" + complaints | Readiness check will likely fail (F5) |
| Legacy product, no DS | Current-flow capture; "what must survive"; screenshots | What must survive + screenshots | Legacy patterns treated as requirements |
| Brand guidelines only | Capture them; applied to digital yet? | Brand files | Colours that fail contrast |
| Off-the-shelf library (Tailwind, shadcn, MUI) | Developer records stack + version | Stack + version | "Design context" answered with the tech stack |
| Nothing | Ask what they like and dislike visually; references to the parking lot | Preferences only | References turning into the solution |
| Several conflicting systems | Ask which is the source of truth; log as a conflict | Conflict for the decision owner | Visual track can't start without a decision |
| DS owned by another team | Name the owner and how to propose changes | Owner + process | Promising changes we can't make |
| Rebrand or replatform coming | Date and what changes | Date + scope | Exploring a look about to be replaced |

### 5b. Stakeholders and clients: the hard cases

Scope freezes at sign-off. After that, changes come through Explore's feedback log or a change request, and the brief changes only through write-back.

| Case | What we do | What we need from them |
|---|---|---|
| Stakeholder keeps adding during Frame | New fact → source map + re-run the conflict check. New idea → parking lot. New problem → decision owner: now, later or out. Decision owner changes mind → decision card updated | Who owns scope |
| Very capable client (own research, AI, strong team) | Ask for their artefacts first and run the same checks. Shorter sweep; more time on conflicts (7) and challenge (14). Sparr forecasts pushback on our reading of their research | Decisions, constraints, hidden knowledge (what failed before, politics), baselines, access to users |
| What Koru adds to a capable client | Outside view of their framing; conflicts they stopped seeing; evidence discipline; the AI-fit call; a brief Explore can start from without asking | — |
| Client can't or won't answer | Open questions get an owner and a date. Silence ≠ agreement: log "no response". A blocking question → gate outcome Back to client | Answers by a date |
| No access to users | Frame finishes, but personas and JTBDs are low and "no user voice" is the biggest gap. Explore's test is the first time users are heard (gate B4) | 3 users, or proxies |

## Checks while producing the output (moment by moment)

The research challenger runs the brief and research-pack checks. frame-conflict-check runs the conflict checks. Judgement checks (★J) can only be passed by a designer. The sign-off refuses while any check marked "Yes" has failed.

| When | Check | What it does | Blocks sign-off? |
|---|---|---|---|
| Intake | Source tagging | Every claim gets a source type and a link to the source line | — |
| Intake | Client inputs | Client ideas are tagged as inputs, never as requirements | Yes, if one reaches the brief as a requirement |
| Context sweep | Agreement grid | For each topic, shows which sources agree, disagree or are silent | — |
| Context sweep | Conflict flag | Every disagreement gets a conflict card naming who must decide | Yes, if a conflict has no decision |
| Context sweep | Stale source | Flags research or PRD content older than 18 months or written before a pivot | Warning only |
| Context sweep | Opinion vs fact | Stakeholder opinions are labelled and never used as facts | Warning only |
| Drafting the brief | Confidence cap | Nothing is high confidence without 2+ sources including user evidence; anything AI inferred stays low | Yes |
| Drafting the brief | Solution bias | The problem statement does not already name a solution | Yes |
| Drafting the brief | One page | Every section is filled and the brief fits on one page | Yes |
| Drafting the brief | Traceability | Brief lines that touch a conflict link to its decision card | Yes |
| Research pack | Within limits | 1–2 personas, 5–8 JTBDs, 3–5 competitors | Yes |
| Research pack | Evidence per item | Every JTBD and persona trait has a source line | Yes |
| Research pack | Leading quotes | Flags quotes that came from leading questions or were picked to fit a conclusion | Warning only |
| Existing vs new | Right starting point | Existing product: heuristic evaluation and UX audit done. New product: competitor scan present | Yes |
| Existing product | Heuristic evaluation | Scores the current product against usability heuristics (Nielsen's 10) and AI heuristics; every finding names the heuristic, shows evidence and has a severity; rejected findings removed | Yes, for an existing product |
| Existing product | UX audit | Flows, consistency, content, accessibility and research pain points; each confirmed finding links to a problem or JTBD in the brief | Yes, for an existing product |
| Before sign-off | Assumption coverage | Every assumption has a test planned in Explore | Yes |
| Before sign-off | Client not overruled | Client inputs that were overruled appear in "Open questions" | Yes |
| ★J Judgement | Problem framed by a person | The problem statement and where AI fits were written or edited by a designer, not accepted as drafted | Yes |
| ★J Judgement | Conflicts decided | Every conflict has a decision card with a named person | Yes |
| ★J Judgement | Audit findings reviewed | Every heuristic and UX audit finding was confirmed or rejected by a designer | Yes, for an existing product |
| Publish | Only finals published | Only signed-off cards reach project knowledge | Automatic |

## 2 & 3. What the designer brings, and what Claude does with it

| # | Designer brings (decides or does) | When | Claude does | Claude shares |
|---|---|---|---|---|
| 1 | Uploads the raw material; confirms the project type and starting point Claude inferred | Start | Cleans transcripts, indexes everything, picks the brief template; turns on the heuristic evaluation for an existing product | Source index, project card |
| 2 | Names the owners, the client contact, the time Frame gets and what is off limits | Start | Sets the owners, the depth of the context sweep and the sharing rules | Project card with owners and rules |
| 3 | Adds what is not written down: call context, client history, politics, hunches | Start | Records it as team knowledge, low confidence until evidence backs it | Team-knowledge card |
| 4 | Reviews Claude's answers to the research questions; corrects what is wrong | After intake | Answers the problem, users, JTBDs, current behaviour, constraints, foundation and success, each with a source and confidence | Research answers with sources |
| 5 | Decides each conflict: which source wins, or keeps it as an assumption to test | After the conflict check | Writes the decision cards and updates the answers | Conflict log |
| 6 | Confirms or rejects each heuristic and UX audit finding; picks the ones that matter | After the audit | Runs the heuristic evaluation and UX audit; drops rejected findings; links confirmed ones to the brief | Heuristic evaluation and UX audit report |
| 7 | Writes or sharpens the problem statement; decides where AI fits | After the evidence | Drafts the one-page brief around it and flags solution bias | Draft framed brief |
| 8 | Sets the confidence levels; nothing is high without evidence | Brief review | Updates the brief and the research pack | Brief ready for review |
| 9 | Picks the personas and JTBDs that matter | Pack review | Drafts personas, JTBDs and the competitor scan, each linked to its source | Draft research pack |
| 10 | Brings the client's answers to the open questions | When the client replies | Creates a new brief version | Updated brief |
| 11 | The senior signs off the framing; the research owner signs off the pack | End | Publishes only final cards and drafts the handoff card | Final brief and pack, handoff card for Explore |
