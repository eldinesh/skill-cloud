---
id: FND-039
type: FND
title: Meridian UI v1.4.2 ships 10 components; seven things this project needs are not built
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T04:51:04Z
evidence: document
count: 10 built; 7 absent (data table, status badge, timeline, toast, search with autocomplete, any AI pattern, success button)
segment: design system
participants:
links:
  - supports DAT-010@1: README and components.md list what exists and what does not
  - supports DAT-014@1: engineering note lists the same gaps
created: 2026-11-26T04:33:45Z
updated: 2026-11-26T04:51:04Z
---
# FND-039 · Meridian UI v1.4.2 ships 10 components; seven things this project needs are not built

## Observation

The library README and components.md list what exists in code: button (primary, secondary, ghost; one size; no icon-only), text input, select (native only), checkbox, radio, modal, card, tabs, avatar, alert banner (warning and danger only). They list as absent: data table (three apps each built their own), status badge or pill, timeline or activity log, toast, search with autocomplete, any AI pattern (suggestion, confidence, explanation, accept, undo) and a success (green) button, on the roadmap since 2022. Tom Okafor's engineering note lists the same gaps. The Figma library, not supplied, is reported to hold a Table and a Status chip that were never built.

## Quotes

No quotes: library documents, DAT-010 and DAT-014.
