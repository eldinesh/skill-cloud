# Ticket format: the team board

Every piece of team work is a ticket: one markdown file in `ux/team/board/<id>.md` with flat frontmatter. The board is plain files, so anyone can read or edit them by hand, and `skillcloud-board` only renders them. The ticket **is** the dispatch brief: the design lead sends its path, and the agent reads it.

```markdown
---
id: J-007
title: Synthesise sessions P01–P06 into themes and jobs
stage: frame                 # frame | explore | harden | ship | learn
kind: job                    # job (an agent does it) · moment (a designer decides) · gate (AI audit + people decide) · human (people do it: fieldwork, a test, a client call)
moment: 2                    # which of the stage's five designer moments this serves (1–5)
mode: afk                    # afk: an agent can finish it alone · hitl: needs a person, never dispatched
role: synthesiser            # who works it (job) or who signs (gate: senior | research-owner | team-lead | design-lead | rulebook-owner | engineer)
status: ready                # proposed | ready | doing | review | done | needs-you | dropped
route: opus/high             # model/effort, filled from routing at start
skills: [/interview-synthesis, /affinity-mapping]
inputs: [ux/intake/clean/session-01.md, ux/intake/clean/session-02.md]
produces: [ux/interviews/P01.md, ux/synthesis/interview-synthesis.md]
chapters: [evidence]         # rulebook chapters that apply
protocol: H1                 # checker protocol, or none
blockedBy: [J-004]           # tickets that must be done first
uses: []                     # things only one job can hold at a time (e.g. deliverable-dev-server)
round: 1
check: ""                    # ux/team/checks/J-007-C.md once checked
verdict: ""                  # pass | pass-with-notes | fail
created: 2026-11-26
updated: 2026-11-26
---

## What
<the job in two or three sentences: what the next stage needs from it, the inputs that matter most, the trap to avoid>

## Done when
- <observable outcome, e.g. "every theme cites ≥2 P-codes or is labelled a signal">
- passes protocol H1 · `skillcloud-check trace` clean · lane clean

## For you
<!-- hitl tickets only: what a person must answer, written so they can answer it cold -->
**Question:** Sign off the research pack?
**Why now:** Explore can't start until the pack is final.
**Options:**
- **A. Sign off.** Explore starts on 2 personas and 6 jobs. Costs nothing more.
- **B. Sign off with condition** "JOB-06 stays low until the second ops interview". Explore treats it as a risk.
- **C. Send back F2** (JOB-06 single-source) to the synthesiser. Costs about 1 job round.
**Recommended:** B. The finding is honest-labelled. It isn't a blocker.
**If nobody answers:** nothing moves. Explore stays blocked.

## Log
- 2026-11-26 created by design-lead (plan for FRAME, approved D-001)
- 2026-11-26 started → sc-synthesiser on opus/high
- 2026-11-26 returned: 6 records, synthesis with 5 themes · lane ok · trace ok
- 2026-11-26 check J-007-C: pass-with-notes (F2 major → gate)
```

## Status flow

```
proposed ──yes──▶ ready ──start──▶ doing ──return──▶ review ──pass──▶ done
                    ▲                                    │
                    └────────────── fail (round 2) ──────┘
                                                         └─ fail twice ─▶ needs-you
hitl tickets: proposed ─▶ ready (waits on a person) ─▶ done | dropped
```

- **proposed**: part of a plan nobody has said yes to yet. Nothing starts.
- **frontier**: every `ready` + `afk` ticket whose `blockedBy` are all `done`, and whose `uses` aren't held by a `doing` ticket. `skillcloud-board frontier` lists it.
- **needs-you**: an agent ticket that failed twice, or hit a human call. It carries a **For you** section.
- A ticket moved by hand stays where the person put it. The design lead reads the board before every move and never overwrites a person's edit.

## IDs

- `J-nnn` for jobs and human tickets, and `G-<stage>-<n>` for gates (`G-frame-1`). Numbers never reuse.
- A stage's tickets are its story. The board groups by stage.
