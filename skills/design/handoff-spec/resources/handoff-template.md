---
artifact: handoff-spec
project: <client codename>
created_by: skillcloud/handoff-spec v<VERSION>
sources: ["<Figma file/branch link>", ux/design/components/<name>.md, ux/design/rationale.md, ux/design/accessibility-audit.md, ux/design/copy/<scope>.md]
status: draft
updated: <yyyy-mm-dd>
---

# Handoff — <client codename>: <scope>

**Figma:** <file link> — pinned version/branch: `<name, e.g. "handoff/<scope> v1">`
**Design system:** <client library + token set version>
**Decisions:** see `ux/design/rationale.md` — this spec cites DEC-NN, it does not re-argue them
**Walkthrough:** <date + eng lead — status flips to `review` after>

## Readiness check (per /figma-hygiene)

- [ ] Approved frames on approved page; explorations out of the link path
- [ ] Frames named as flow steps — links are stable and human-readable
- [ ] All states present per screen (empty/loading/error/offline)
- [ ] Real copy (source: `ux/design/copy/<scope>.md`), tokens applied, dev-mode annotations on
- [ ] Version/branch pinned for this handoff

## Flow inventory

### Flow F1 — <name>

**Entry:** <where users come from> · **Exits:** <completion, abandon — with what's preserved>

| Step | Frame (link) | Purpose | Components (by reference) |
|---|---|---|---|
| 01 | `<scope> / 01 — <step>` <link> | <one line> | `ux/design/components/<name>.md` |
| 02 | `<scope> / 02 — <step>` <link> | | |
| err | `<scope> / e1 — <failure>` <link> | <recovery + resume point> | |

## State matrix

Every cell: frame link or explicit rule. No blanks, no TBD.

| Screen | Empty | Loading | Error | Offline | Max data | Permission-denied |
|---|---|---|---|---|---|---|
| 01 <step> | <link> | <link> | <link> | <rule: banner per client pattern, read-only, queue writes> | <link> | <link / n.a.: why> |
| 02 <step> | | | | | | |

**Interruption / timeout (clinical):** <per flow — what survives session lock, what resumes after re-auth; cites A11Y/2.2.1 annotations>

## Interaction specs (flow-specific — component behavior lives in component specs)

| # | Where | Trigger | Behavior | Notes |
|---|---|---|---|---|
| I-01 | <step 02, save> | <click/Enter> | <optimistic? confirmed? validation timing? focus after?> | <DEC-NN> |
| I-02 | <…> | | <motion: duration/easing tokens; reduced-motion fallback> | |

**Keyboard per screen:** <tab order summary, Enter/Esc semantics, shortcuts if any>
**Concurrency:** <e.g. same-record concurrent edit rule — DEC-NN>

## Accessibility annotations (acceptance criteria — QA tests each)

| # | Requirement | WCAG | Where |
|---|---|---|---|
| AX-01 | Focus order: <…> | 2.4.3 | <screen> |
| AX-02 | <status message> announced via polite live region | 4.1.3 | <screen> |
| AX-03 | <widget> role=<…>, name from <…> | 4.1.2 | <component instance> |
| AX-04 | Targets ≥ <floor per device class> | 2.5.8 | <screen> |

## Tokens and assets

- **Tokens:** <flow-specific references not covered by component specs — never raw hex; gaps below>
- **Token requests:** <needed token + proposed value + rationale — or "none">
- **Assets:** <icon/illustration names, format (SVG), export location, naming per client convention>
- **Copy source of truth:** `ux/design/copy/<scope>.md` @ <date/version> — strings in frames are not authoritative

## Open questions for eng

| # | Question | Owner | Needed by |
|---|---|---|---|
| Q-01 | <…> | <role> | <date> |

## Intentionally NOT specified (engineering judgment welcome)

- <e.g. skeleton shimmer detail — any client-pattern-consistent treatment>
- <e.g. pagination chunk size — anything 25–100; virtualize at eng's discretion>

## Out of scope for this handoff

- <adjacent surfaces this spec deliberately excludes, and where they're tracked>
