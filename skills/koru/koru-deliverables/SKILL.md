---
name: koru-deliverables
version: 3.0.0-alpha.1
bundle: koru
disable-model-invocation: true
stage: explore
description: |
  How Koru builds and shares what clients see: a standalone HTML prototype, Figma frames,
  full front-end code with tickets, or any mix, all rendered from the same Screen and State
  cards, and shared as password-protected links rather than files.
  Use when asked to "build the prototype", "make the HTML", "push frames to Figma", "build the
  front end", "send it to the client", "share a link", or "which deliverable should we use".
  Proactively invoke when Explore reaches E4 or Ship reaches S2 in a Koru project. (skillcloud)
---

## Preamble (run first)

```bash
command -v koru >/dev/null 2>&1 || koru() { node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" "$@"; }
grep -E '^(deliverables|design_system|ai_tier):' koru/engagement.md 2>/dev/null || echo "NO_KORU_PROJECT"
ls koru/deliverables 2>/dev/null
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

## Contract
- **Consumes:** the `deliverables` switch and contract tier in `koru/engagement.md`; DIR, SCR and STA cards; `koru/design-system.md` and tokens; `ux/project-context.md` when present (data rules per `engagement-guardrails`)
- **Produces:** `koru/deliverables/<name>/` (one self-contained `index.html` per prototype, or the front-end source), Figma frames when allowed, protected share pages in `koru/generated/share/`
- **Next:** the stage checker, then `/koru:share` (a person sends it)

# Deliverables: one source, several forms, links not files

## Choosing the mix

The `deliverables` switch lists one or more of `html`, `figma`, `frontend`. Propose a mix from the kind of work; the engagement lead decides, and a gate can add another later.

| Kind of work | Usual mix | Why |
| --- | --- | --- |
| Discovery, early validation, user testing | html | Fastest to build and change; clients click a link |
| Client team designs in Figma | html for testing, then figma | Their designers keep working in their tool |
| Build partner or client engineering | html, then frontend with tickets | Engineers get code and criteria, not pictures |
| End-to-end engagement | all three | Each audience gets its form; one source behind them |

Whatever the mix, every form renders from the same SCR and STA cards: screen ids and state names appear in the HTML, the Figma frame names and the code. A change to one is a Decision that flags the others, so they never drift.

## Standalone HTML prototype

- One file: `koru/deliverables/<direction-or-flow>/index.html`, with styles, scripts, data and icons inline. It must open by double-click with no server and no network.
- Tokens first: run `koru ds inline <file>` so the page carries the project's token block and component kit (or the open-source system's own CSS). Styles use only `var(--…)`; components carry `data-ds="Name"`. The hook refuses anything else; `koru ds lint` shows why.
- A small **review bar** (top or bottom, collapsible) lists every Screen and every State from the cards, so a reviewer can jump to "SCR-002 · team lead · zero results" without hunting.
- Hard cases from the DIR card are switchable states, not separate files.
- Realistic, synthetic data at enterprise scale (1 row and 10,000 rows). Never real client or participant data.
- Accessible by default: semantic HTML, visible focus, 24-pixel targets, labels on every control, status messages announced.
- No "DRAFT" watermark on client versions; `koru share` refuses files that look like drafts unless a person overrides it for an internal review.

## Figma frames

- Only when `deliverables` includes figma **and** the contract tier is full. Every write asks a person first; with any other tier the hook blocks it, so say so and offer the HTML link instead.
- Build on the client's library components; name frames `SCR-001 · <state>`; one page per flow.
- Hand edits designers make in Figma come back as Decisions on the Screen card, so the next round starts from them.

## Full front-end code

- Built in the client's own components when the design system is code-based, otherwise clean HTML and CSS with tokens. Screen ids and state names match the cards.
- Every component marked provisional when it has no Code Connect mapping; state the coverage in the handoff note.
- Ships with the Tickets (`koru-ship`); the code alone is not the handover.
- To preview it for a client, build a self-contained `index.html` preview and share that.

## Sharing: password-protected links, never files

Sharing leaves Koru, so a person does it. Prepare everything, then hand them the line to type.

1. **Teach-back.** Ask the sender to state the deliverable's key claim and its evidence in one or two sentences. If it is weak, ask one Socratic question; do not block.
2. **Checker.** Run the stage's checker on what is being shared and record it (`koru review <stage> …`).
3. **Refresh.** `koru index` rebuilds the client page from signed cards only, with the AI-use note drawn from the provenance stamps.
4. **The person shares:**
   - `! koru share koru/deliverables/<name>/index.html --to "<client>" --teachback "<their sentence>" --publish`
   - or the whole client page: `! koru share client --to "<client>" --publish`

`koru share` wraps the file in a page that only opens with the password (AES-256 in the browser; the password never leaves the viewer's machine), records which card versions it showed, and, when Koru's hosted service is configured (`KORU_SHARE_URL`, `KORU_SHARE_TOKEN`), publishes it and prints the link. Without the service it writes the protected file for the person to upload. Remind them to send the password separately from the link.
