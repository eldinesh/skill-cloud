---
artifact: build-report
project: <project>
created_by: skillcloud/ship-code v<VERSION>
stage: ship
sources: [ux/harden/hardening-matrix.md, ux/explore/<dir>/prototype.html, ux/design/tokens.css, ux/structure/flows/<flow>.md]
status: draft
updated: <yyyy-mm-dd>
---

# Build report · <project> · <flow(s)>

**Run it:** `cd deliverable && npm ci && npm run dev` · review any state with `?state=&role=&volume=&ai=off` · `?review=off` for demos

## What's built
| Route | Flow step(s) | IA node | Component(s) |
|---|---|---|---|
| `/` (routes/today) | FL-01.S01, S02 | N1.2 | Button, RoomList |

## State coverage
| Step | State | Role | Built | Test |
|---|---|---|---|---|
| FL-01.S01 | empty | member | ✓ | states.spec: "FL-01.S01 · empty · member" |

Cells: <n> in matrix · <n> built · <n> tested · gaps: <list or none>

## Check results (literal)
```
npm run check        → <paste the OK/✓ summary lines, sizes>
npm run test:e2e     → <paste the runner summary: N passed / failed>
skillcloud-check pii → <paste>
```
Not run: <command: reason>, or none

## Fakes
| What | How it's simulated | Real system would |
|---|---|---|

## API and data assumptions (unconfirmed until an engineer confirms)
| Assumption | Source (feasibility / scenario) | Confirmed by |
|---|---|---|

## Stack mapping (client stack only)
| Rule | How it applies in <stack> |
|---|---|

## Dependencies added beyond the scaffold
| Package | Why | Licence | Maintained |
|---|---|---|---|

## Performance (CODE-R25)
| Chunk | gzip | Budget |
|---|---|---|

## Token requests · component candidates · known gaps
- <item> → <Ship note / finding ID>
