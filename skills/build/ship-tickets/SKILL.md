---
name: ship-tickets
version: 1.0.0
bundle: build
stage: ship
description: |
  Turn the hardened design and deliverable into tickets a developer or coding agent builds
  from without coming back: one per user story, given/when/then mapped to e2e tests, states,
  screenshots, tokens, traced to a flow step and a job, plus the half-page handoff note.
  Drafted locally; pushed to Jira or another tracker only after a person says so.
  Use when asked to "write the tickets", "PRD to tickets", "user stories", "handoff note",
  or "put this in Jira".
  Proactively invoke when deliverable/ and ux/ship/build-report.md exist and
  ux/ship/tickets/ doesn't. Use after /ship-code. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
ls ux/ship ux/ship/tickets 2>/dev/null || true
grep -H '^status:' ux/harden/hardening-matrix.md ux/ship/build-report.md 2>/dev/null || true
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails`. Infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions: defaults exist). If something material to the work itself is unclear, ask that one sharp question before producing.

## Contract
- **Consumes:** `ux/harden/hardening-matrix.md` (required, final, which is the source of states and criteria), `deliverable/` + `ux/ship/build-report.md` (routes, e2e test names, fakes, API assumptions), `ux/structure/flows/*.md` (step IDs), `ux/synthesis/jobs-to-be-done.md` (job IDs), `ux/design/brief.md` (context link), `ux/harden/feasibility.md`, `ux/decisions-log.md` and `ux/design/rationale.md` (decisions engineers must know), the rulebook's handoff chapter, `ux/project-context.md` (always: tracker, project key)
- **Produces:** `ux/ship/tickets/<TKT-nn>-<slug>.md` (one per user story) and `ux/ship/handoff-note.md`
- **Next:** the Ship gate through /design-lead. An engineer reviews the handoff and lists anything they'd still need to ask. /design-qa-checklist checks the eventual production build against the same criteria.

# Ship Tickets

You are writing the last thing standing between the design and the build. The test is simple: **could a coding agent build this without coming back?** If you'd have to ask a question about a ticket, so would they, and the ticket isn't done. The rules are in the rulebook's **handoff** chapter (SHIP-R01 to R10).

## Step 0: Context and data-rules gate

1. Read `ux/project-context.md`: domain, data rules, the tracker (Jira, Linear or none), project key, ticket conventions, who the engineering reviewer is.
2. Data rules (full rules in `engagement-guardrails`): if project-context explicitly restricts AI processing of this project's material, STOP and say so. Otherwise proceed. Screenshots come from the deliverable's synthetic states only.
3. Readiness: the hardening matrix is final (Harden signed). Tickets are never finalised before Harden passes (SHIP-R08). User stories drafted earlier during Explore and Harden are inputs. Reconcile them with the hardened design.

## Step 1: Slice into user stories

One ticket per **user-visible outcome** for a role, not per layer and not per screen by default (SHIP-R05). For one flow, 3–5 tickets is normal. Each ticket must be finishable in about two days. Split by outcome when it isn't. Cross-cutting rules (accessibility, tokens) are acceptance criteria on every ticket, not tickets of their own.

## Step 2: Write each ticket

From `resources/ticket-template.md`:

| Field | Rule |
|---|---|
| **Title** | verb + object: "Show suggested room at the top of the booking list" |
| **User story** | As a <role>, I want <thing>, so that <outcome>. The outcome comes from the job (`JOB-nn`). |
| **Traces** | flow step(s) `FL-nn.Snn` · job `JOB-nn` · decisions `D-nnn`/`DEC-nn` (SHIP-R02) |
| **Context** | links: framed brief, the hardened prototype (`?state=`), the deliverable route, Figma frame if any |
| **Acceptance criteria** | given/when/then, one line each, one per matrix row the ticket covers, each mapped to its e2e test name (SHIP-R03) |
| **States covered** | the matrix cells this ticket owns: empty, loading, error, success, partial, permission, AI states |
| **Screenshots** | from the running deliverable at each state's URL, saved under `ux/ship/tickets/img/` |
| **Tokens used** | from the tokens file, plus any token requests |
| **API / data assumptions** | from feasibility and the build report, marked unconfirmed (SHIP-R06) |
| **Out of scope** | what this ticket doesn't cover, and where it lives instead |
| **Open questions** | for the engineer or client, each with who can answer |

Screenshots, if Playwright is available: `npx playwright screenshot "http://localhost:4317/?state=empty&review=off" ux/ship/tickets/img/TKT-02-empty.png` with the preview server running. Otherwise, list the URLs to capture.

## Step 3: Coverage check

Union of every ticket's *States covered* = every cell of the hardening matrix (SHIP-R04). Write the coverage table at the top of the first ticket file or in the handoff note. Any uncovered cell gets a ticket or an explicit "not in this release" decision.

## Step 4: The two-hardest-tickets test

Pick the two hardest tickets. As an engineer who never saw the design, list every question you'd have to ask. Answer each in the ticket, or move it to Open questions with an owner. Repeat until the list is empty or every item is owned.

## Step 5: Handoff note (half a page, SHIP-R09)

`ux/ship/handoff-note.md`: what's in the deliverable · what's not · decisions engineers must know (IDs, one line each) · fakes and assumptions to confirm · how to run the deliverable · who to ask about what. If it doesn't fit half a page, it's a spec. Link `/handoff-spec` instead.

## Step 6: Tracker (only with a yes)

Creating tickets in Jira or another tracker is outward-facing (SHIP-R07). Show the person the exact tickets, with titles and the count, and ask once: "Create these <n> tickets in <tracker> project <KEY>?" On a yes, create them through the connector if one is available. Then record the tracker keys back into each local ticket file, and log the push in the decisions log through `/design-lead`. With no connector, say so and leave the markdown ready to paste. A pull request into the client's codebase is out of scope (SHIP-R10). Note what it would take.

## Quality bar

- Every ticket uses the template, traces to a step and a job, and has testable given/when/then criteria mapped to tests.
- The tickets' states together equal the hardening matrix.
- The two-hardest-tickets question list is empty or owned.
- The handoff note fits half a page.
- Nothing was pushed to a tracker without an explicit yes.

## Handoff

End with: ticket count, coverage (cells covered / total), open questions with owners, the tracker status (drafted locally, or created as keys), and the next step. That is the Ship gate through `/design-lead`: "an engineer reviews the handoff and lists anything they'd still need to ask". Suggest, don't auto-run.
