---
artifact: decisions-log
project: <project>
created_by: skillcloud/design-lead v<VERSION>
stage: all
sources: []
status: review
updated: <yyyy-mm-dd>
---

# Decisions log — <project>

One running log. Every sign-off, overrule, direction choice, scope change, version replacement and rulebook change goes here. Each line: date, the decision, who made it (a named person, never Claude), and the alternative considered. Lines are appended, never edited. A correction is a new line that cites the old one.

| ID | Date | Stage | Decision | Kind | Made by | Alternative considered | Touches |
|---|---|---|---|---|---|---|---|
| D-001 | <date> | frame | Signed off `ux/design/brief.md` v1 | sign-off | <name> (senior) | Hold for client call on Monday | brief |
| D-002 | <date> | frame | Signed off research pack (P01–P06, 2 personas, 6 jobs, scan) | sign-off | <name> (research owner) | Cut JOB-07 (single source) — accepted | personas, jobs |
| D-003 | <date> | explore | Chose DIR-A "Smart suggest" over DIR-B | direction | <name> (team lead) | DIR-B: members distrusted agent booking in 3 of 4 sessions | DIR-A, DIR-B |
| D-004 | <date> | harden | Overruled J-014-C finding F3 (contrast 4.3:1 on disabled text) | overrule | <name> (design lead) | Fix now — disabled text is exempt under 1.4.3 | tokens |

Kinds: `sign-off` · `sign-off-with-conditions` · `send-back` · `direction` · `overrule` · `override-unsigned-input` · `scope` · `replaces-version` · `rulebook` · `writeback` (a later-stage decision that touches earlier artifacts. List them in Touches, and each owner records accept/reject/note as a new line).
