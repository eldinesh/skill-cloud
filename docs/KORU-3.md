# Koru 3.0: the Koru plugin

This branch turns SkillCloud into the Koru 3.0 delivery plugin for Claude Code (terminal and desktop app). The design source is **Koru delivery system: design spec v2**. The playbook submission links here.

One chain of evidence, from kick-off call to shipped ticket. People own judgement; Claude owns throughput. Every artefact is a card in one project graph. An orchestrator runs the playbook, specialist agents do the work with the SkillCloud method skills, four independent checkers review every gate, and hooks enforce the rules that must never break.

## How it fits together (alpha.3)

```text
/koru:run  (the orchestrator: the main Claude Code session)
   │  koru next --json      the playbook as data: which steps are ready, which wait on a person
   │  koru next --order F5  a work order: step, package, skills, card types allowed, done test
   ▼
 worker agents (up to 4 in parallel, each preloads its skills)
   researcher · synthesiser · architect · strategist · designer · quality · engineer
   │  run the SkillCloud method (interview-synthesis, affinity-mapping, journey-map, …)
   │  in "Koru mode": the method stays, its output becomes cards, never ux/ files
   ▼
 hooks (lib/guard.js) on every write and command
   │  per-agent card types, people-only steps, consent, exact quotes, thresholds before results
   ▼
 checker agent (fresh context, read-only) → koru review → people give dispositions → gate
```

- **One map.** `lib/methods.js` says which agent owns which card types and which skill runs at which step. `tools/weave.js` writes a Koru mode block into each of the 32 skills from that map, so a skill used inside Koru writes cards, and the same skill used outside Koru still writes its `ux/` file. `koru skills` prints the map; `koru doctor` fails if a block is stale.
- **The playbook as data.** `lib/plan.js` holds every step of Frame (F0 to F15), Explore (E1 to E8), Harden (H1 to H7) and Ship (S1 to S6). Each step names its agent or person, its skills, the card types it writes, what it needs first, and a done test computed from the cards. Nothing is ticked by hand. `koru plan` and the board's Workflow view show it.
- **Agents stay in their lane.** The hook reads which agent is calling. A strategist that tries to write a researcher's card is refused with the owner's name, and the orchestrator re-routes the work. Checkers can run read-only commands only.
- **Rigour profiles.** `rigour: sprint | standard | regulated` in the engagement sets the checker severity floor, whether enterprise structure (flows, objects, permissions) is required before Directions, who must sign a review, the second-method rule for Insights, and the state matrix roles.

## Install

```bash
git clone -b koru-3.0 git@github.com:eldinesh/skill-cloud.git ~/koru-plugin
claude plugin marketplace add ~/koru-plugin
claude plugin install koru@koru
```

(Or inside Claude Code: `/plugin marketplace add ~/koru-plugin`, then `/plugin install koru@koru`.) Update later with `git -C ~/koru-plugin pull` and `claude plugin marketplace update koru`. To try it without installing: `claude --plugin-dir ~/koru-plugin`. Needs Node.js 18 or newer; the `koru` engine and the hooks are plain Node with no dependencies.

If you also installed SkillCloud the old way (`./setup`), the research and design skills appear twice; run `./setup --uninstall` once the plugin is in.

## First run

Open the project folder in the Claude desktop app (Code) and type `/koru:start`. That is the only command anyone needs to remember.

- **In a new folder** it walks you through setup in a few rounds of questions you answer by clicking: what kind of project, what the client gets, the design system, how careful the gates are, who is on the team, and what the client's contract allows AI to do. It opens the folders you need to drop files into, codes participant names in transcripts automatically, and offers to start the agents.
- **In a project already set up** it greets you, says where things stand in two lines, and offers what you can do next: let the agents carry on, go through what is waiting for you (signatures, test results, checker findings, one at a time), open the boards, or add something from the client.

Claude runs every command itself. You never type one.

## How a person decides (desktop-first)

Signing, setting the contract, rating an Insight's confidence, recording a test result, answering a checker's finding, passing a gate and sharing with the client stay people's decisions. In the desktop app they are a question with options: "Sign BRF-001 as Lena Park (design lead)?" with **Sign it** and **Not yet**. When you pick yes, Claude runs the command.

The hooks make this safe. They record the option a person picked (and the person's own chat messages), and a person-only command goes through only when a fresh answer from that session names what the command does (the card ids, the stage, the contract values) and says yes. Each answer is used once. An agent can never use one, and a "Not yet" is never read as yes. An Insight's claim must be words the person wrote or the reading they picked. The log records each decision with the question and the answer.

Power users can still run any `koru` command in a terminal.

## Commands

| Command | Does |
| --- | --- |
| `/koru:start` | Start here: guided setup with options in a new folder; in a project, where it stands and what you can do next |
| `/koru:run [stage]` | The orchestrator: dispatches agents step by step until only people's steps are left, runs the checker, then asks the person at the keyboard about their decisions and says what others owe |
| `/koru:run watch` | Watch mode: waits for tickets people put up next on the live board and runs them as they arrive |
| `/koru:where` | Catch-up: what changed, what is open, the next step |
| `/koru:join` | Joining view for someone new |
| `/koru:note` | Logs an ad hoc client request as a card and sorts it |
| `/koru:decide` | Opens a Decision with an impact preview |
| `/koru:gate` | Shows the stage's exit contract, runs its checker, records the review |
| `/koru:share` | Teach-back, checker, then asks whether to send the protected link |
| `/koru:ship` | Definition of Ready, tickets, handoff, Jira |
| `/koru:board` | Starts the boards on your computer and gives the links: the live agent board and the cards board |

**Person-only commands** run only after the person picks yes (or types them in a terminal):
`koru sign` · `koru gate <stage> --pass` · `koru contract` · `koru share` · `koru pseudonymise` · `koru clear-flag` · `koru result` · `koru caught` · `koru ds approve`.

The full engine is `koru help`: cards, tests and decisions, gates, moments, the workflow (`next`, `plan`, `skills`, `pack`), the evidence loops (`result`, `playback import`, `compare`, `matrix`, `caught`, `stats`, `eval`), the team (`verify`, `ids`, `git-setup`) and the design system.

## What is in the plugin

| Part | Where | What it does |
| --- | --- | --- |
| Manifest and marketplace | `.claude-plugin/` | Plugin `koru`, private marketplace `koru` |
| Engine | `lib/koru.js`, `lib/core.js`, `bin/koru` | The project graph: cards with fixed shapes, typed links, versions, sign-off, stale and writeback flags, gates, health |
| Hooks | `hooks/hooks.json`, `lib/guard.js` | Tier 1 rules (below), provenance stamps, automatic versions, the session-start recap |
| Commands | `commands/` | The ten `/koru:` commands, `/koru:run` is the orchestrator |
| Method map and planner | `lib/methods.js`, `lib/plan.js`, `tools/weave.js` | Which agent runs which skill and writes which cards; every step of the playbook with its done test; the Koru mode block woven into each skill |
| Stage skills | `skills/koru/` | `koru-frame`, `koru-explore`, `koru-harden`, `koru-ship`, plus `koru-cards` and `koru-deliverables` |
| Worker agents | `agents/` | `researcher`, `synthesiser`, `architect`, `strategist`, `designer`, `quality`, `engineer`: each preloads its method skills and may write only its card types |
| Checkers | `agents/` | `research-checker`, `direction-checker`, `harden-checker`, `spec-checker`: fresh context, read-only, numbered rules (RC-01 and on), findings as `[SEV][RULE][CARD] finding · evidence · confidence — disposition` |
| Team and evidence | `lib/team.js`, `lib/evidence.js` | Signer identity against roles, signatures, duplicate ids; test results, playback import, comparisons, state matrix, AI accuracy |
| Output styles | `output-styles/` | Koru voice (plain language) and Koru coach (stops at judgement points, fades) |
| Board and outputs | `lib/board.js` | `koru index` builds the board, decision log, trace, client page and finals-only Claude project knowledge |
| Sharing | `lib/share.js` | Password-protected pages (AES-256-GCM, opened in the browser), share log, publishing to Koru's hosted service |
| Reused skills | `skills/core`, `research`, `design`, `ai` | All SkillCloud skills, called from inside the stages |
| Tests | `tests/koru/test.js` | 74 end-to-end checks with planted defects, run by `tools/validate.sh` with the weave check |

## Tier 1 rules the hooks enforce

| Rule | How |
| --- | --- |
| Claude never signs, sets confidence, writes an Insight, or passes a gate | Edits that touch `status: final`, sign-off fields or confidence, any INS card write, and the person-only commands are refused |
| A signed card changes only as a new version; an accepted Decision only by a superseding one | Edits to final cards are refused; `koru revise` and `supersedes` links are the way |
| Consent before AI sees research | Research data is closed until a person sets the contract; Data cards need consent naming the AI processor |
| Pseudonymise first | Originals and the name map live in `koru/raw/originals` and `koru/private`, which Claude can never read; `koru pseudonymise` makes the readable copy |
| Quotes are exact | Every Finding quote is checked word for word against its transcript, with speaker and timestamp, before the card is saved |
| Synthetic output is never evidence | Synthetic Findings and any "supports" link to a Hypothesis are refused |
| Thresholds before results | Thresholds and results go through `koru threshold` and `koru result`; a saved threshold cannot change |
| Client tools follow the contract | Figma and Jira writes are refused unless the tier is full, and each allowed write asks a person |
| Definition of Ready before tickets | Jira issue creation is refused for a ticket card that fails it or is unsigned |
| Every AI write is stamped and versioned | Each Claude edit to a card is logged with session and sources and saved in `koru/history/` |
| Each agent writes only its own card types; checkers write nothing | The hook reads the calling agent from the hook payload and names the right owner when it refuses |
| The SkillCloud skills write cards, not `ux/` files, inside a Koru project | Writes into `ux/` are refused; `ux/project-context.md` is generated from the engagement |
| A signature is the signer's, on the text they signed | The signer's git email must belong to a person holding that role in `engagement.md`; the signature is a hash of the card at signing, and `koru verify` and the finish gate catch any later change |
| Generated views are never hand-edited | Writes into `koru/generated`, `koru/state` and `koru/history`, and shell writes into `koru/`, are refused |

Gates are deterministic too: `koru gate` refuses to pass without a checker review newer than the stage's last change, a disposition for every finding, and no stale cards.

## Project layout (in each client project)

```text
koru/
  engagement.md        switches and contract (contract fields: people only)
  client.md            deciders, vocabulary, house rules
  design-system.md     audit result and pinned version
  cards/               the graph: one Markdown file per card
  raw/                 pseudonymised transcripts Claude may read (when the contract allows)
  raw/originals/       never shown to AI
  private/             the re-identification key; never shown to AI
  deliverables/        prototypes and front-end builds
  history/             every version of every card
  state/               log, provenance, gates, flags, shares
  generated/           board.html, decisions.md, trace.md, client/, knowledge/, share/
```

## Deliverables and hosting

Each project picks one or more by the kind of work: a standalone HTML prototype, Figma frames, full front-end code with tickets. All render from the same Screen and State cards. Client shares go out as password-protected pages: `koru share` encrypts the file, records which card versions it shows, and, when `KORU_SHARE_URL` and `KORU_SHARE_TOKEN` are set, posts it to Koru's hosted service and prints the link. The service must accept a POST of the HTML and answer `{"url": "…"}`.

## Design system, quality and build (alpha.2)

- `koru ds`: one design system per project. Extend the client's own (`ds extend --css …`), adopt one of ten open-source systems exactly (`ds catalog`, `ds adopt <id>`: shadcn/ui, Material 3, Carbon, Fluent 2, Primer, Ant Design, Spectrum, GOV.UK, USWDS, NHS.UK), or build one from `koru-neutral`. Tokens (W3C DTCG) are the only place values live; `components.json` is the only list of components. The design lead approves it when Claude asks; any change needs a new approval.
- The design-system hook lints every write to `koru/deliverables/` and `frontend_dir`: raw colours, off-scale sizes, Tailwind's own palette and arbitrary values, text contrast under AA, bare controls, components outside the manifest, other UI libraries, images without alt, clickable divs, native dialogs.
- `koru audit`: opens each prototype in a real browser in every declared state at four screen sizes and runs axe-core (WCAG 2.2 A/AA), keyboard order and focus, target size and overflow checks. Needs `npm --prefix tools install && npx --prefix tools playwright install chromium` once.
- `koru scaffold`: the front-end foundation from the design system and the cards (react-tailwind, react-library): tokens, a ui layer with stories and axe tests per state, features per Screen with data contracts and state test ids, ESLint/Stylelint/TypeScript rules that keep features on the system.
- `koru board --serve`: the board on your computer; draft cards can be edited in the browser through the same checks. Signing stays in Claude Code.
- `koru discard ID`: remove a draft made by mistake (never signed, nothing cites it).

## The live agent board (alpha.3)

Every playbook step is a ticket, so the team sees the work the way they see a sprint board: what waits, what an agent can take, what is up next, which agents are working right now, what a person owes, and what is done.

- **Open it.** Choose **Open the boards** from `/koru:start`, or run `/koru:board`. Claude starts it on your computer and gives the link: http://127.0.0.1:4321/live (the cards board is at `/`). `koru index` also writes a snapshot to `koru/generated/live.html`.
- **Tickets come from the planner.** A step that splits into packages (one per interview, one per Direction, one per inbox file) becomes one ticket per package once agents can take it, so you see four researchers on four interviews. Steps of a later stage wait in the first column until the gate passes.
- **"Working" is real.** The hooks see the orchestrator start each agent (the work order's first line names the step and package) and see it report back, so the ticket moves to Agents working and back without anyone typing anything. The ticket shows how long the agent has run and the cards it has written so far, from the provenance each write leaves.
- **Put a ticket up next.** Press **Run next** on a ready ticket (or `koru queue F5 --package "P03"`). `/koru:run` dispatches queued tickets before anything else; `/koru:run watch` waits for them and runs each one as it arrives. Person steps cannot be queued: the ticket shows who owes it, what they decide, and a message to paste into Claude to be walked through it.
- **The work order is one click away.** Open any ticket to read what the agent will be told: skills, card types it may write, inputs and the done test.
- **The activity feed** lists queued tickets, agent starts and reports, and every card write with the agent that made it.

## Team, evidence loops and AI accuracy (alpha.3)

- **Many people, one graph.** `engagement.md` lists people with their emails and roles. `koru git-setup` adds a pre-commit check, a post-merge id check and union merges for logs. Ids are reserved atomically and checked across branches; `koru ids --fix` repairs duplicates after a merge.
- **Enterprise structure.** Study, Segment, Flow (current and future, with actors and handoffs), Object model and Permissions cards. At standard rigour they are required before Directions; the state matrix (`koru matrix`) is drafted from the Permissions roles.
- **Tests and results come back as evidence.** A Test card has a numeric threshold saved before any session. `koru result TST-001 --passed 5 --of 8` computes met or not met; a miss drafts a Decision for the design lead.
- **Client feedback comes back as evidence.** Every shared page carries a feedback layer: the client pins a comment to a screen, state or component, then downloads the file. `koru playback import feedback.json` turns it into a Playback card where each row is typed (evidence, constraint, idea, preference) and becomes a Finding, Request, Idea or Decision.
- **The checker can be wrong.** A finding can be closed as `rejected: why`. `koru stats` and the board's Agents view show how often people rejected each rule, how much they edited AI drafts before signing (word diff against the AI's last draft), and mistakes they logged with `koru caught`. `koru eval score` measures a checker's recall and precision against planted defects.

## Not built yet

- **Koru's hosted service itself.** The plugin side is done (encryption, share log, publishing call); the service that stores the pages and serves the links is a separate build.
- **Jira comments promoted to Decisions** automatically. Today a person or Claude opens the Decision with `/koru:decide`.
- **Coach fading per person across sessions.** The coach style fades within a session only.
- **Planted-defect fixtures for the other three checkers.** The research checker has one (`tests/koru/evals/frame-meridian`, run with `tools/eval-checker.sh`): 8 of 8 defects found after one fix to the pack.
- **Role bundles** through plugin user settings, so a researcher sees only the research commands first.
- **Figma and Jira tool names** are matched by pattern (`figma`, `jira`, `atlassian` plus write verbs). Check them against the connectors the team actually uses.
