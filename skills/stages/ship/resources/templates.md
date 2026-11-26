# Ship templates (each becomes a file in `ux/ship/`, standard header, `stage: ship`)

## handoff-plan.md (moment 1; design lead + engineer)
Release scope (now) · fast-follow list (later, with reasons) · ticket split (one per user story) · fidelity bar (which interactions and states must be exact) · client stack and how closely the HTML matches it · Jira project, board, conventions · dummy ticket created? (link)

## Ticket intent block (added to every ticket, `/ship-tickets` template)
**Intent:** why this exists (JOB-nn, problem) · **must not change:** … · **can flex:** … · **edge cases that matter:** … (from the prioritised list) · **decision cards:** DC-nn

## assumptions.md (data and API assumptions, per screen)
| Screen (FL-nn.Snn) | Data sources | Assumptions | Missing-data behaviour | Confirmed by engineer? |
|---|---|---|---|---|

## measures-for-learn.md (moment 5; team lead)
| Outcome (from the brief) | Measure | Baseline | Where it comes from | Includes AI override / undo rate? | Owner |
|---|---|---|---|---|---|

## pr-plan.md (engineer)
What a pull request into the client's codebase would take: access, their component library, reviewer on their side, branch and review conventions, the order of tickets.
