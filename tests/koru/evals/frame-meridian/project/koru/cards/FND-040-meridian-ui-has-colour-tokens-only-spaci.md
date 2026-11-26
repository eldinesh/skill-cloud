---
id: FND-040
type: FND
title: Meridian UI has colour tokens only; spacing and type are hard-coded and primary blue fails small-text contrast
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T04:51:04Z
evidence: document
count: 1 library, v1.4.2; 5 colour families tokenised, 0 spacing, 0 type
segment: design system
participants:
links:
  - supports DAT-010@1: tokens.css, tailwind.config.js, README
created: 2026-11-26T04:33:45Z
updated: 2026-11-26T04:51:04Z
---
# FND-040 · Meridian UI has colour tokens only; spacing and type are hard-coded and primary blue fails small-text contrast

## Observation

tokens.css and tailwind.config.js define colour tokens for brand (50, 100, 500, 600, 700), ink (900, 700, 500, 300, 100), danger and warning; success is not defined. No spacing or type tokens exist: sizes and padding are Tailwind default classes written into markup, and the radius is one 6px default. The README gives primary blue (brand-500) on white as about 3.9:1. Hand-computed from the token values: white on brand-500 3.87:1 (button text, 14px semibold, below 4.5:1); brand-600 on white 4.85:1; danger-500 error text on white 4.38:1 at 12px (below 4.5:1); ink-500 on white 4.54:1 and about 4.0:1 on ink-100; ink-300 input border on white about 1.9:1 (below the 3:1 non-text minimum). Ratios were computed by hand, not by a tool: re-check with a tool before they go in a client document.

## Quotes

No quotes: library files, DAT-010.
