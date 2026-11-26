---
version: 1.4.2
audited: 2026-11-26
status: draft, Claude's audit; design lead (Lena Park) to confirm
proposed_switch: partial
system: Meridian UI
source: client
licence: client-owned
stack: tailwind
prototype_mode: inline
---
# Design system: Meridian UI v1.4.2

Frame audit (F3): coverage, quality, Figma-to-code sync, governance. Sources: the library pack (DAT-010), the UnitDesk mock (DAT-011), the release 3.2 Slack thread (DAT-012), Tom Okafor's notes (DAT-014, DAT-009). Findings: FND-039, FND-040, FND-041, FND-042.

**Not seen:** the Figma library (no link in the pack), the library's source repository, any changelog. Everything about Figma below is what Meridian staff say, not something we inspected.

## Verdict

**partial.** Code exists and is in use (three internal apps), but it has 10 components and one token family. The Figma library describes things the code does not have. Every screen this project needs touches at least one gap. Treat the library as a base to extend and to specify against, not as something to assemble screens from.

## 1. Coverage

Built (10): button (primary, secondary, ghost), text input, select (native), checkbox, radio, modal, card, tabs, avatar, alert banner (warning, danger).

Missing and named by the client (7): data table, status badge, timeline or activity log, toast, search with autocomplete, any AI pattern (suggestion, reason, confidence, accept, undo), success button.

What the Findings imply this project needs, with a first-cut class from the Koru element taxonomy. Harden confirms each one.

| Need | Evidence | First-cut class |
| --- | --- | --- |
| Request list with sort and filter | FND-001, FND-041 | **new**: consolidate the three home-made tables |
| Request status (seen, approved, on round, delivered) | FND-001, FND-025 | **new**: status badge |
| Request history | FND-001, FND-043 | **new**: timeline |
| Item search in plain names | FND-005 | **new**: autocomplete over the catalogue (1,100 of 6,400 plain names) |
| AI suggestion with reason, accept, undo | FND-006 | **new**: no pattern exists; needs the AI Opportunity Statement from Explore |
| One-click approve | FND-042 | **extend**: success button, or work-around with primary blue as 3.2 did |
| Duplicate flag, merge | FND-013 | **extend**: info alert variant plus a merge action |
| Confirmations and "sent" feedback | FND-013 | **new**: toast |
| Session timeout warning, locked-out state | FND-009 | **recipe**: modal plus alert; the modal needs a focus trap first |
| Empty, loading, error, no-permission, partial states | FND-042 | **recipe**: card plus text; none are defined in the library |
| Form fields, buttons, tabs, avatar | | **use**; tabs need arrow-key support |

## 2. Quality

**Tokens.** Colour only (brand, ink, danger, warning). No spacing, type or radius scale beyond one 6px default. No success colour. Sizes are Tailwind classes in markup.

**Contrast** (hand-computed from the token values; re-check with a tool before this goes to the client):

| Pair | Ratio | Result |
| --- | --- | --- |
| White on brand-500, primary button text (14px) | 3.87:1 | fails 4.5:1 |
| White on brand-600, button hover | 4.85:1 | passes |
| brand-600 on white, ghost button | 4.85:1 | passes |
| danger-500 on white, error text (12px) | 4.38:1 | fails 4.5:1 |
| ink-500 on white, helper text and inactive tab | 4.54:1 | passes narrowly |
| ink-500 on ink-100 | about 4.0:1 | fails |
| ink-300 input border on white | about 1.9:1 | below 3:1 for UI components |
| brand-500 focus ring on white | 3.87:1 | passes 3:1 |
| brand-700 on brand-100, avatar | about 5.5:1 | passes |

**Behaviour gaps in the component markup** (from components.md): modal has no focus trap and closes on overlay click only (no Escape, no close button, no dialog role); tabs have no arrow-key support; alert banners have no alert role; no info or success variants; one button size only (about 36px high), which is small for gloved use and the tablet (FND-019); checkbox and radio are 16px; helper text style undefined; no icon-only button.

**Responsive.** Components were designed at 1440 wide; the clinical workstation is 1366 × 768 and the unit tablet is a 10-inch iPad (FND-019, FND-041).

## 3. Figma-to-code sync

Reported, not inspected: Figma uses an 8-point grid and code uses Tailwind defaults, so spacing is off by a few pixels throughout; the Figma library has a Table and a Status chip that were never built; Figma designed a green Approve button that cannot be built; designs at 1440. In 3.2 the ticket linked only page 1 of the Figma file (FND-042). There is no single source of truth: Figma, the ticket and a Loom video "all said slightly different things" (Wen Li, Slack).

## 4. Governance

Owner is Operations Technology with no dedicated maintainer since the original designer left. Used by three internal apps; each built its own table. The green button has been on the roadmap since 2022. The 3.2 beta button departs from the library (gradient, Segoe UI bold) and the approvals table is a custom build (FND-041). No contribution path, versioning policy or accessibility bar was supplied. Unknown: who would accept new components from this project, and how fast.

## 5. What this means for the playbook

- Switch `design_system: partial`. Confirmed by this audit; Lena Park to agree.
- Pin the design-system version on every Screen: `ds_version: 1.4.2`.
- Every new component named in the table is specified before Harden, with every state, tokens for spacing and type, and a 1366 × 768 and tablet behaviour. This is what Tom Okafor and Wen Li asked for.
- Ask Tom to confirm whether the 8-pt scale can be added as spacing tokens, and whether a success colour can be defined, before Explore builds green buttons.

## Open questions

1. Can we have the Figma library link and the repository (read-only)? Without them the sync section stays second-hand.
2. Which front-end framework is the real target? `engagement.md` says not stated; Wen Li knows.
3. Is Source Sans 3 loaded on the workstations, or does everything render in Segoe UI?
4. Who signs off new components, and is there a release path faster than 8 weeks?
