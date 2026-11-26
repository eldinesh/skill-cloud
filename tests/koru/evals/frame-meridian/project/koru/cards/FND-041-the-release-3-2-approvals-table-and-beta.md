---
id: FND-041
type: FND
title: The release 3.2 approvals table and beta button depart from the library
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T04:51:04Z
evidence: observed
count: 2 of 2 release 3.2 elements inspected in the mock (table, beta button)
segment: UnitDesk 3.2 screens
participants:
links:
  - supports DAT-011@1: mock of the 3.2 screens
  - supports DAT-012@1: Wen Li built the table from scratch
created: 2026-11-26T04:33:45Z
updated: 2026-11-26T04:51:04Z
---
# FND-041 · The release 3.2 approvals table and beta button depart from the library

## Observation

In the mock, the "+ New request (beta)" button, which the page says was added in 3.2 "using Meridian UI", has a gradient fill (#3b8ff0 to #2F80ED), a 6px radius and bold Segoe UI; a gradient and bold Segoe UI are not in the library (its font stack is Source Sans 3, Segoe UI, Arial). The Approvals table is a custom build: only the Date column sorts, the empty state is a grey "No data", and the page says it overflows on 1366-wide screens. Wen Li says in Slack that the table was built from scratch and that Meridian UI has none. The rest of the mock is styled in Arial 12px with its own table and form styles, outside the library.

## Quotes

No quotes: mock and Slack thread, DAT-011 and DAT-012.
