---
artifact: feasibility
project: <project>
created_by: skillcloud/harden-review v<VERSION>
stage: harden
sources: [ux/explore/<dir>/prototype.html, ux/structure/flows/<flow>.md, <system architecture doc>]
status: draft
updated: <yyyy-mm-dd>
---

# Feasibility · <DIR-x> · <FL-nn>

**Checked against:** <APIs, data sources, stack, host, by doc or conversation; mark anything assumed>

| Step | Rating | Limit found | Design response required | Unblock by |
|---|---|---|---|---|
| FL-01.S01 | needs work | Calendar syncs every 5 min, so suggestions can be stale | Show "checked N min ago"; handle room-taken at confirm (STR-R02 stale) | — |
| FL-01.S03 | straightforward | | | |

## API and data assumptions (to confirm with the client's engineers)
| Assumption | Used by | Confirmed? |
|---|---|---|

## Engineer's sign-off note
<the engineer (person) records agreement or conditions at the gate>
