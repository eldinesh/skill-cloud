# Explore v1: reference (full detail)

Step numbers match the Explore playbook.

## 0. Foundation audit: what exists, and which route it puts us on

Claude runs the audit before anyone designs. It uses Figma MCP (libraries, variables, components, Code Connect), the repo (package.json, tailwind.config, theme files, Storybook) and the brand docs. Scenarios combine (e.g. F4 + F12, F6 + F11): take every route that applies. The design lead fills and agrees the route card before stage 1.

| # | What exists | How Claude detects it | Route | What happens in Explore | Figma library deliverable? | Watch out for |
|---|---|---|---|---|---|---|
| F1 | Mature DS: Figma library + coded components, in sync, tokens as variables | Library + variables via Figma MCP; component package / Storybook in repo; Code Connect present | **A · Use** | Map components to the flows; log gaps as candidates. Skip visual direction unless a refresh is in scope | Exists: extend only | "In sync" is claimed but rarely true: Claude diffs Figma vs code tokens and lists drift |
| F2 | Figma library only, no code library | Library found; no package; devs build by hand | **A' · Use + flag parity** | Use the library; export its variables to CSS vars so HTML prototypes match | Exists | Prototypes won't match what devs build. Harden needs a code-token plan |
| F3 | Code only: custom components / Storybook, nothing in Figma | Repo + Storybook, no library | **B · Mirror** | Extract tokens from code. If the client's designers work in Figma, mirror ONLY the components the flows use (code → Figma). Otherwise prototype straight from code | Decide with client: yes if their team keeps designing in Figma | Mirroring the whole catalogue = scope creep |
| F4 | Off-the-shelf library (Tailwind, shadcn, MUI, Chakra, Ant, Bootstrap) with light theming | package.json, tailwind.config, theme file | **C · Theme the library** | Visual direction = theming the library (tokens → config). Use the official Figma kit + our variables if Figma is needed | Usually yes for handover: official kit + our variables; never redraw components | Library defaults look generic. Explorations must push the theme past the defaults |
| F5 | Basic DS: colours, type, a few components; no semantic tokens, no variables, no states | Small library, hardcoded values, no variables | **D · Formalise + extend** | Keep the brand look; add a semantic token layer and the components the flows need; make it Claude-readable | Yes: upgrade the existing one | Looks "present" but Claude will hardcode values. Fails the Claude-readiness check |
| F6 | Legacy DS that has to be redesigned / modernised | Old library, dated patterns; client asks for a refresh | **E · Redesign** | Audit (keep / evolve / kill), visual direction (evolution vs revolution), new DS, migration map old → new | Yes: new | Capture what must survive (brand equity, muscle memory) BEFORE exploring |
| F7 | Brand guidelines only: logo, colour, type, no UI | Brand PDF / site; no library, no code | **F · Brand → UI** | Visual direction translates the brand into UI (2–3 interpretations), then build the DS | Yes: new | Brand colours often fail contrast in UI: Claude checks WCAG in stage 1, not in Harden |
| F8 | Nothing: no brand, no library, no code | Nothing found; client confirms | **G · Direction from scratch** | References → style tiles → chosen look → DS. Until chosen, explorations use neutral Koru tokens (never wireframes) | Yes: new | Jumping into flows with no direction: everything gets redone |
| F9 | Several or conflicting systems (acquired products, diverged teams) | Multiple libraries / themes; same component drawn 3 ways | **H · Consolidate** | Client chooses the source of truth (decision card); explore only on the unified set; log conflicts | Depends on the chosen source | Picking silently. This is the client's decision |
| F10 | DS owned and locked by another team (we can't change it) | Client names a DS team; library is read-only | **I · Use + propose** | Use as-is; new components go on a separate "Proposals" page, never into their library | No: proposals only | Designing components their team will reject. Get the governance contact in week 1 |
| F11 | Rebrand in progress / brand not final | Client mentions a new brand coming | **J · Token-first, swappable** | Semantic tokens with a replaceable brand layer; explore structure, not skin | Yes, with a brand mode | Locking visuals that change next month |
| F12 | Multi-brand, white-label, dark mode or multi-platform required | Brief lists brands, themes, iOS / Android / web | **K · Multi-mode tokens** | Variables with modes (brand × theme); platform conventions noted; prototype in 2 modes to prove it holds | Yes, with modes | Single-mode explorations that break when the second brand or theme lands |

**Intake questions (asked in every engagement):** Is the DS a deliverable, or just a means to get the flows designed? · Who owns and maintains it after us? Can we change it? · Does the client's team design in Figma, code, or both? · Platforms: web, responsive, iOS, Android? Dark mode? Brands? · Accessibility target (WCAG 2.2 AA / AAA)? Any regulator? · Is a rebrand or a replatform coming in the next 12 months? · What must NOT change (brand equity, patterns users rely on)? · Budget / time for the DS vs the flows?

**Claude-readiness check** (run on ANY existing DS; decides F1 vs F5):
1. Tokens exist as Figma variables AND in code, with the same names.
2. A semantic layer exists (surface, text, border, brand, status), and components never use raw primitives.
3. Components have variants named semantically, plus descriptions.
4. A component map or Code Connect links Figma ↔ code.
5. A rules doc (DS.md) Claude can read: tokens, components, do / don't, AI patterns.
6. **Test:** Claude builds one screen from the DS only, with zero hardcoded values and zero invented components.

Result → **Ready** (A) · **Partial** (D formalise) · **Not ready** (E or G).

**Route × stage: how much of each stage a route needs.** Full = run the stage properly with a client gate. Light = confirm / small changes, internal gate only. Skip = go straight on. Flows are always Full.

| Route | 1 Visual direction | 2 Build / align DS | 3 UI direction | 4–5 Flows + prototypes |
|---|---|---|---|---|
| A · Use | Skip (unless refresh in scope) | Light: component map + gap list | Light: fit the existing shell | Full |
| A' · Use + parity | Skip | Light: export variables to code tokens | Light | Full |
| B · Mirror | Skip | Medium: extract tokens; mirror only used components | Light | Full |
| C · Theme library | Full: 3 themes on one key screen | Medium: config + kit variables | Full | Full |
| D · Formalise | Light: tune only | Full: semantic tokens + missing components | Medium | Full |
| E · Redesign | Full: evolution vs revolution | Full: new DS + migration map | Full | Full |
| F · Brand → UI | Full: 2–3 brand interpretations | Full | Full | Full |
| G · From scratch | Full: references → style tiles | Full | Full | Full |
| H · Consolidate | Light: unify looks | Full: one source of truth | Medium | Full |
| I · Use + propose | Skip | Light: Proposals page only | Light | Full |
| J · Swappable | Light: structure, not skin | Full: semantic tokens + brand mode | Full | Full |
| K · Multi-mode | Medium: prove 2 modes | Full: modes (brand × theme) | Full: per-platform patterns | Full |

## 1. Visual direction: when the look isn't decided yet

Runs before the DS for routes C, E, F, G, J, K. Always on ONE key screen with real content, never a moodboard alone. Claude renders each option from a token set, so the winner becomes the DS seed directly. Output: a visual direction card (principles, token set v0, key screen, what we're NOT doing).

| Situation | Approach | What Claude makes | Client chooses by |
|---|---|---|---|
| No direction at all (G) | Reference hunt → 3 distinct style tiles (e.g. calm / warm / bold) | Key screen in 3 themes from 3 token sets (HTML + Figma) | Picking a tile and naming what they like / dislike in each |
| Brand exists, never applied to digital (F) | 2–3 interpretations, restrained → expressive | Same key screen per interpretation, contrast-checked | Pick one + adjust the "dial" |
| Legacy refresh (E) | Evolution vs revolution: conservative / moderate / bold | Before / after on the most-used screen | Picking the level of change |
| Client brings references ("like Linear") | Extract principles (density, colour use, type, motion), never copy | Principle card + 2 interpretations | Confirming the principles, then a pick |
| Library theming (C) | Vary tokens only: colour, radius, density, type scale | Theme variants as config files | Pick a theme |
| One stakeholder has strong taste | Their ask is one option, plus alternatives with rationale | Options labelled with their source | Decision owner chooses; logged with reason |
| Rebrand pending (J) / multi-brand (K) | Explore structure + one swappable skin; prove a 2nd mode | Key screen in 2 modes | Confirm the structure holds |
| Look already set (A, A', B, I) | Skip. Confirm one screen in the existing look | — | — |

## 2. Build / align the DS from the chosen direction

Explore builds what the flows need to look real, and builds it only from the DS. The full catalogue, every state and every edge case are Harden's job. **Gate: DS fit check.** A fresh-context Claude builds a sample screen from the DS + rules doc only. Any hardcoded value or invented component is a gap. The design lead signs.

| Layer | What it holds | Where it lives | Claude-ready when |
|---|---|---|---|
| Primitives | Raw colour, type, space, radius, shadow scales | Figma variables + tokens.json / CSS vars / tailwind.config | Same names in Figma and code |
| Semantic tokens | Surface, text, border, brand, status, by mode | Figma variables (modes) + code | No component uses a primitive directly |
| Component tokens (only K, J) | Per-component overrides for multi-brand | Figma + code | Only exists when a route needs it |
| Base components | Only those the explored flows use | Figma library and / or code (shadcn, MUI, custom) | Semantic variant names, descriptions filled |
| Patterns | App shell, nav, AI surfaces (suggestion, side panel, chat, agent confirm) | Figma page + HTML | Documented with when-to-use |
| Rules doc (DS.md) | Tokens, components, do / don't, AI patterns, accessibility | Claude project knowledge + repo | Claude builds a screen from it with zero hardcoded values |
| Component map / Code Connect | Figma component ↔ code component | Code Connect or map table | Every component in the prototypes is mapped |
| Candidates log | New components needed, not built yet | DS card | Each has an owner + a spec stub for Harden |

## 3. UI direction: how the system shows up in the product

Depends on the engagement, not the DS. Output: 1–2 UI direction cards (shell, IA, density, where AI sits) on 2–3 key screens, built from the DS.

| Engagement | What we explore | Constraint | Output |
|---|---|---|---|
| Greenfield product | App shell, IA, navigation model, density, home | None: widest exploration | 2 UI directions on 2–3 key screens |
| New feature in an existing product | Where the feature lives: inline / new page / panel / modal | Must not break current nav or patterns | Placement options in the real shell |
| Redesign of an existing product | IA changes, before / after | Users must still find things (migration) | Side-by-side current vs proposed |
| AI feature added | Where AI sits: inline suggestion / side panel / chat / agent acting | User stays in control; trust + undo visible | AI surface options, with a real model where it matters |
| Multi-platform | Responsive web vs native conventions | Platform guidelines (HIG / Material) | Key screen per platform |
| Data-heavy / enterprise | Density, tables, filters, bulk actions | Power-user speed | Density options (comfortable / compact) |
| Pitch / proof of concept | Hero screens only | Speed over coverage | 1 direction, polished enough to sell |

## 4–5. Flows: ideate → variations → crit → 2 directions → prototypes

Each designer takes a problem statement. Divergence first, then convergence. Internal crit is logged in the same feedback log as client feedback (`from: team`), so nothing gets lost.

| Step | What happens | Who / which AI | Output |
|---|---|---|---|
| Ideate | Happy path + 3 genuinely different ideas per problem statement, built only from the DS, realistic data | Designer + Claude | Option sketches (HTML), stay in the folder |
| Variations | Within each idea: layout, AI placement, content density, entry point | Claude | 2–3 variations per idea |
| Internal crit | Structured: JTBD fit, AI opportunity, DS compliance, feasibility, accessibility | Team + design lead; AI direction challenger (fresh context) | Crit rows in the feedback log |
| Converge | 2 direction cards that differ meaningfully (idea, JTBDs, where AI sits, risk, what we'd test) | Team lead picks | EX-DIR-A, EX-DIR-B |
| Prototype | One flow, 3–5 screens per direction; HTML → Figma; real model where the AI matters. Fidelity matches the question being asked | Claude Code | Prototype v1 per direction + Figma page per round |
| User test | 10-min script per direction; findings logged | Researcher (organiser plays the user) | User evidence |
| Stakeholder review | Demo live, async artifact link, or Figma: whatever the client uses | Team lead | Raw feedback → intake (section 6) |

## 6. Feedback intake: any source, any level of detail, one log

Feedback arrives as calls, transcripts, Claude artifact comments, Figma comments, docs, emails, Slack, screenshots, photos of sketches, voice notes, or second-hand. Claude runs every piece through the same pipeline, so nothing is lost or over-read. The log is the single source of truth, and it is what Harden inherits.

**Capture** (pull every source for the round: transcript, comments, docs, images; no source = no feedback, note it) → **Normalise** (transcribe audio, read annotated images by vision, map "this one" to the exact frame / screen) → **Atomise** (one row per point, exact quote + link + who said it) → **Classify** (layer: look / DS / UI / flow / content / scope / state; kind (below); confidence high / med / low) → **Clarify & resolve** (vague → clarifying questions; conflicts → decision owner; hearsay → confirm with the source) → **Route** (the lowest layer that fixes it; states / edge cases parked for Harden) → **Decide** (accept · adapt · reject with reason · park for Harden · change request; team lead confirms) → **Confirm back** (24h recap to the client: what we heard, what we'll change, what we won't and why, open questions).

**Sources: how Claude takes each one in**

| Source | How Claude ingests it | Watch for |
|---|---|---|
| Live call (verbal) | Claude Meetings / Fathom / Zoom transcript → extraction (TRACES-style, each point with a source line). No transcript: designer notes within 1h | Who said it (decision owner vs opinion); tone and sarcasm; "let's see" is not a yes |
| Recording, no transcript | Transcribe first, then the same as a call | "This one": map to the frame via timestamp + screen share |
| Claude HTML artifact comments | Read the artifact's comment threads; each is pinned to an element | Comments on the prototype's rough edges vs on the idea |
| Figma comments | Figma MCP get_comments, linked to nodes | Resolved in Figma ≠ addressed in the design |
| Docs / email / Slack | Read and quote exact text; keep the thread order | Changed minds in long threads: the latest wins only if it's the same person |
| Screenshots, annotated images, photos of sketches | Vision reads the marks; maps them to the frame | Ambiguous arrows: confirm what they point at |
| Voice notes | Transcribe, then as a call | Missing context: which version they were looking at |
| Second-hand ("the CEO said…") | Logged as hearsay, low confidence | Needs confirming from the source before any change |
| Silence / no response | Logged as "no response" with the date | Silence is not approval |

**Kinds of feedback: what we do with each**

| Kind | Example | What we do |
|---|---|---|
| Specific + actionable | "Move the CTA above the fold" | Change it, log it |
| Directional | "Make it feel more premium" | Translate into 2–3 concrete options; client confirms one |
| Vague / emotional | "It doesn't feel right" | No change yet. Claude drafts clarifying questions; ask within 24h |
| Contradictory | Two stakeholders disagree | Log both; escalate to the decision owner; no change until decided |
| Out of scope / new requirement | "Can it also do invoicing?" | Change request → brief / backlog, not this round |
| Question | "What happens if…?" | Answer it. If it's a state / edge case → park for Harden |
| Rejects the direction | "Neither of these works" | Diagnose which layer failed (look, UI, flow, concept) before redoing anything |
| Approval with conditions | "Yes, if we can…" | Each condition becomes a tracked item |
| Praise | "Love the summary card" | Log it: it protects that element from later changes |

**Feedback log (expanded): one row per point, every source.** `ux/explore/feedback-log.md`

| ID | Round | Source + link | From (name, role, decision owner?) | Exact quote | Screen / frame | Layer | Kind | Confidence | Decision + reason | Change made | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FB-001 | R2 | Call transcript 12:04 | Alex, Head of Ops, decision owner | "Too many steps to book" | Booking / step 2 | Flow | Specific | High | Accept: merge steps 2 + 3 | v3, frames 4–5 | Done |

**Status values:** Open · Clarifying · Waiting on decision owner · Decided · Done · Rejected (reason) · Parked for Harden (owner) · Change request. Nothing leaves Explore as Open, Clarifying or Waiting.

## 7. Harden input pack: the gate that protects the next stage

Whatever leaves Explore is Harden's input. A fresh-context, read-only Claude (the Harden readiness auditor) tries to start Harden from the pack alone and lists the blockers. The team lead signs via sign-off, and the Harden lead accepts ("checked by next team"). Claude cannot sign.

| Item | Contents | Done when | Checked by |
|---|---|---|---|
| Direction + decision card | Chosen direction, why, rejected alternative, user evidence; **the runner-up kept as a fallback if Harden finds the direction won't hold** | Signed by team lead with client agreement | Team lead |
| Final prototype | HTML + Figma page, named `[project]-explore-[artefact]-v[n]-final` | Matches the last feedback round; no WIP frames left on the page | Designer + auditor |
| Screen trace | Every screen → problem statement / JTBD / AI opportunity | No orphan screens; no unserved JTBD without a reason | AI auditor |
| DS package | Tokens (Figma variables + code), components used, DS.md rules doc, component map / Code Connect, route card | DS fit check passed; zero hardcoded values in the prototype | Design lead + AI auditor |
| Candidates log | New components with spec stubs | Each has an owner | Design lead |
| Feedback log | All rounds, all sources (client, user, team) | No Open / Clarifying / Waiting rows; conflicts decided; parked items tagged for Harden with owner | Team lead |
| User evidence | Test script + findings per direction | Logged against the chosen direction | Researcher |
| Open questions + risks | Untested assumptions, known gaps, things the client hasn't seen | Each has an owner and a "test in Harden" or "accept" note | Team lead |
| Scope boundary | What is NOT included: states, edge cases, platforms, modes | Written explicitly | Harden lead |
| Brief write-back | What we learnt; updated brief / PRD | Brief updated, change log noted | Team lead |

## 8. Checks while producing the output

`explore-foundation-check` runs the foundation checks, and `explore-direction-challenger` runs the direction checks. Judgement checks (★J) can only be passed by a designer. The sign-off refuses while any check marked "Yes" has failed.

| When | Check | What it does | Blocks sign-off? |
|---|---|---|---|
| Foundation | Foundation reality | Records the real state of the foundation, including legacy and broken components, instead of assuming it works | Yes |
| Foundation | Visual vs UX | Visual exploration only picks the look; it never chooses solutions | Warning only |
| Before building | Designer brief present | No option is generated without a designer's direction | Yes |
| Options | Hard path included | Every option shows at least one path that is not the happy path | Yes |
| Options | Realistic data | No placeholder text; data looks like the real product | Warning only |
| Options | Foundation use | Styled only through tokens or the design system, with no hard-coded colours | Warning only |
| Direction cards | Card before showing | Nothing is shown to the client without a filled direction card | Yes |
| Direction cards | Really different | The two directions differ in the idea or where AI sits, not just in styling | Yes |
| Direction cards | JTBD coverage | Lists the JTBDs that neither direction serves | Warning only |
| Direction cards | Copying | Flags a direction that copies a client idea or competitor without weighing it | Warning only |
| Prototype | Looks like the real product | No stripped-back wireframes | Yes |
| Prototype | Hand-built work logged | Anything built by hand in Figma is logged as a break | Warning only |
| Testing | User evidence before choice | Test findings are logged before the client chooses | Yes |
| Feedback | Feedback logged | Every client comment is in the feedback log with a status | Yes |
| Choice | Decision card | The chosen direction has a reason and the alternative recorded | Yes |
| Scope | No Harden work | No polish, no full state coverage yet | Warning only |
| ★J Judgement | Direction from a designer | Every option started from a designer's direction, not a blank prompt | Yes |
| ★J Judgement | Choice backed by evidence | The reason for the chosen direction cites user evidence, written by a designer | Yes |
| ★J Judgement | Client ideas weighed | Every client idea or competitor reference was borrowed, adapted or rejected by a designer, with a reason | Yes |
| Write-back | Brief updated | Learnings that change the brief create a new brief version | Yes |

## 2 & 3. What the designer brings, and what Claude does with it

| # | Designer brings | When | Claude does | Claude shares |
|---|---|---|---|---|
| 1 | Confirms the design foundation and flags components that don't really work | Start | Builds the foundation card and component map; seeds neutral tokens if nothing exists | Foundation card |
| 2 | If there's no foundation: picks a look from Claude's themes of one key screen | Start, only if no foundation | Turns the chosen theme into tokens | Approved visual direction |
| 3 | Decides which problem statements to explore and who takes which | Start | Splits the work so directions don't overlap unless intended | Who explores what |
| 4 | Gives a direction for their problem: a prompt, sketch, reference or idea | Before each round | Generates options from it on realistic data, using the foundation | HTML option sketches |
| 5 | Names the hard path to stress-test alongside the happy path | Before each round | Builds the hard path into every option | Options with happy and hard paths |
| 6 | Keeps, drops or combines options, and says why | After each round | Drafts 2 direction cards; the challenger checks they really differ | 2 direction cards, challenger report |
| 7 | Weighs the client's ideas and competitors: what to borrow, what not to copy | While exploring | Flags directions that copy without weighing | Client references notes |
| 8 | Picks the 2 directions and sets how interactive each prototype needs to be | After the challenger | Builds one HTML prototype per direction and pushes it to Figma | Prototypes and a Figma page for the round |
| 9 | Runs the user test and reads what users actually did | After the prototypes | Writes the script beforehand; summarises findings into the feedback log | User evidence |
| 10 | Presents to the client and steers feedback towards the problem, not the colours | Client demo | Turns the call into feedback-log rows; flags clashes with user evidence | Updated feedback log |
| 11 | Chooses the direction with the client, asks for changes, or restarts | After the demo | Drafts the decision card, seeds tokens, drafts the brief write-back | Decision card, tokens, new brief version |
| 12 | The team lead signs off the chosen direction. Claude cannot sign | End | Drafts the handoff card | Chosen direction (final), handoff card |
