# Koru 3.0: the Koru plugin

This branch turns SkillCloud into the Koru 3.0 delivery plugin for Claude Code (terminal and desktop app). The design source is **Koru delivery system: design spec v2**. The playbook submission links here.

One chain of evidence, from kick-off call to shipped ticket. People own judgement; Claude owns throughput. Every artefact is a card in one project graph; hooks enforce the rules that must never break; four independent checkers review every gate; skills coach.

## Install

```bash
git clone -b koru-3.0 git@github.com:eldinesh/skill-cloud.git ~/koru-plugin
claude plugin marketplace add ~/koru-plugin
claude plugin install koru@koru
```

(Or inside Claude Code: `/plugin marketplace add ~/koru-plugin`, then `/plugin install koru@koru`.) Update later with `git -C ~/koru-plugin pull` and `claude plugin marketplace update koru`. To try it without installing: `claude --plugin-dir ~/koru-plugin`. Needs Node.js 18 or newer; the `koru` engine and the hooks are plain Node with no dependencies.

If you also installed SkillCloud the old way (`./setup`), the research and design skills appear twice; run `./setup --uninstall` once the plugin is in.

## First run

In the project folder, in Claude Code:

1. `/koru:start` writes the engagement pack in `koru/`, asks the seven switches and creates the Context card.
2. A person sets the contract from the client's paperwork: `! koru contract --tier full --data-class personal --processor Anthropic`. Until then Claude cannot read research data, create Data cards or write to the client's Figma or Jira.
3. `/koru:where` any time for the recap and the next step. Claude also gives it at the start of every session.

## Commands

| Command | Does |
| --- | --- |
| `/koru:start` | Engagement pack, switches, contract, health check |
| `/koru:where` | Catch-up: what changed, what is open, the next step |
| `/koru:join` | Joining view for someone new |
| `/koru:note` | Logs an ad hoc client request as a card and sorts it |
| `/koru:decide` | Opens a Decision with an impact preview |
| `/koru:gate` | Shows the stage's exit contract, runs its checker, records the review |
| `/koru:share` | Teach-back, checker, then the line a person types to send a protected link |
| `/koru:ship` | Definition of Ready, tickets, handoff, Jira |
| `/koru:board` | Opens the board |

**Person-only commands** (the hooks stop Claude from running them; a person types them with `!` in Claude Code or in any terminal):
`koru sign` · `koru gate <stage> --pass` · `koru contract` · `koru share` · `koru pseudonymise` · `koru clear-flag`.

The full engine is `koru help`: cards (`new`, `check`, `quotes`, `dor`, `revise`), tests (`threshold`, `result`), decisions (`decide new`, `decide impact`), gates (`review`, `gate`), moments (`where`, `join`, `note`, `health`), and outputs (`index`, `share`).

## What is in the plugin

| Part | Where | What it does |
| --- | --- | --- |
| Manifest and marketplace | `.claude-plugin/` | Plugin `koru`, private marketplace `koru` |
| Engine | `lib/koru.js`, `lib/core.js`, `bin/koru` | The project graph: cards with fixed shapes, typed links, versions, sign-off, stale and writeback flags, gates, health |
| Hooks | `hooks/hooks.json`, `lib/guard.js` | Tier 1 rules (below), provenance stamps, automatic versions, the session-start recap |
| Commands | `commands/` | The nine `/koru:` commands |
| Stage skills | `skills/koru/` | `koru-frame`, `koru-explore`, `koru-harden`, `koru-ship`, plus `koru-cards` and `koru-deliverables` |
| Checkers | `agents/` | `research-checker`, `direction-checker`, `harden-checker`, `spec-checker`: fresh context, read-only, list and never fix |
| Output styles | `output-styles/` | Koru voice (plain language) and Koru coach (stops at judgement points, fades) |
| Board and outputs | `lib/board.js` | `koru index` builds the board, decision log, trace, client page and finals-only Claude project knowledge |
| Sharing | `lib/share.js` | Password-protected pages (AES-256-GCM, opened in the browser), share log, publishing to Koru's hosted service |
| Reused skills | `skills/core`, `research`, `design`, `ai` | All SkillCloud skills, called from inside the stages |
| Tests | `tests/koru/test.js` | 45 end-to-end checks with planted defects, run by `tools/validate.sh` |

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

## Not built yet

- **Koru's hosted service itself.** The plugin side is done (encryption, share log, publishing call); the service that stores the pages and serves the links is a separate build.
- **Jira comments promoted to Decisions** automatically. Today a person or Claude opens the Decision with `/koru:decide`.
- **Coach fading per person across sessions.** The coach style fades within a session only.
- **`claude plugin eval` suites** for the checkers. The checkers were tried on a seeded project (the spec checker found 30 real gaps), but there is no scored eval yet.
- **Figma and Jira tool names** are matched by pattern (`figma`, `jira`, `atlassian` plus write verbs). Check them against the connectors the team actually uses.
