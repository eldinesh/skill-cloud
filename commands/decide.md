---
description: Log a decision from any stage and flow it back to the artifacts it touches (writeback)
argument-hint: <the decision, e.g. "calendar syncs every 5 minutes, so suggestions can be stale">
---

Decision to record: `$ARGUMENTS`

Follow `/design-lead` → **Step 7: Decisions and writeback**. Ask who made the decision and the alternative considered, if not given, in one line. Append it to `ux/decisions-log.md` as `writeback`, list every artifact it touches (screens `FL-..`, directions `DIR-..`, jobs `JOB-..`, the brief) with their owners, mark them stale in the status report, and file a ticket for each owner to accept, reject or note it. Don't edit the touched artifacts yourself.
