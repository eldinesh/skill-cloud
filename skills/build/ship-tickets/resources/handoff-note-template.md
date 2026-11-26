---
artifact: handoff-note
project: <project>
created_by: skillcloud/ship-tickets v<VERSION>
stage: ship
sources: [ux/ship/build-report.md, ux/ship/tickets/, ux/decisions-log.md]
status: draft
updated: <yyyy-mm-dd>
---

# Handoff · <flow> · <date>

**In the deliverable:** <flows, screens, states, roles: one or two lines>
**Not in it:** <what, and where it lives>
**Decisions you need to know:** <D-nnn: one line> · <DEC-nn: one line>
**Faked, to replace:** <persistence, APIs, AI responses>
**Assumptions to confirm:** <API shapes, sync intervals>
**Run it:** `cd deliverable && npm ci && npm run dev` · states via `?state=&role=&volume=&ai=off`
**Tickets:** TKT-01 … TKT-0n (<tracker keys, or "drafted locally">) · coverage <n>/<n> matrix cells
**Ask:** design → <name> · research → <name> · this build → <name>
