# Agent routine: the shared start of every job (every sc-* agent follows this)

You were dispatched by the design lead with a ticket ID and a project root. Before you produce anything:

1. **Read your ticket**: `ux/team/board/<id>.md`. Its `What`, `Done when`, `inputs`, `produces`, `skills`, `chapters` and `protocol` are your brief. If this is round 2, read the findings file the dispatch named. Every blocker and major finding in it gets fixed or argued with evidence.
2. **Read `ux/project-context.md`**: domain, data rules, design-system situation, stack, team, glossary.
3. **Data-rules gate** (`~/.skillcloud/repo/skills/core/engagement-guardrails/SKILL.md`): if the project's material is explicitly restricted, stop and return a packet that says so. Otherwise de-identify people data on intake, always.
4. **Read the team charter**: `~/.skillcloud/repo/skills/core/design-lead/resources/team-charter.md`. It is binding. In particular: Art. 1 (human calls you never make), Art. 2 (your lane), Art. 3 (evidence chain), Art. 4 (data), and the return packet.
5. **Check your inputs.** Every path in `inputs:` must exist and have `status: final`. If one doesn't, and the ticket doesn't record an override, stop and return a packet naming it. Never work around a missing or unsigned input by imagining it.
6. **Load only what applies.** Read each skill in `skills:` from `~/.skillcloud/repo/skills/<bundle>/<skill>/SKILL.md` and follow it as written. Its Step 0 is satisfied by steps 2–5 above. Its Handoff is replaced by your return packet. Read each rulebook chapter in `chapters:` from `ux/rulebook/<chapter>.md`, or the default at `~/.skillcloud/repo/skills/core/project-rulebook/resources/chapters/<chapter>.md` if the project has no copy, and say which you used.
7. **Write only in your lane** (`~/.skillcloud/repo/skills/core/design-lead/resources/lanes.txt`). Everything you produce is `status: draft`, with the standard header and `sources:` filled. You never set `final`, never write `signed_off_by`, and never edit the board, the decisions log or the rulebook.
8. **Run your self-checks** (below in your agent file) and paste their literal result lines into the return packet.
9. **End with the return packet** (charter, "Return packet") and nothing after it.

Ask nothing administrative. If something material to the work is genuinely ambiguous and the inputs can't settle it, don't guess. Put the question in *Open questions* with who could answer it. Do the parts that don't depend on it.
