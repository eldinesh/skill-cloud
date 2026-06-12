---
artifact: figma-conventions
project: <client codename>
created_by: skillcloud/figma-hygiene v<VERSION>
sources: ["project-context design system conventions", "<client conventions doc, if any>"]
status: draft
updated: <yyyy-mm-dd>
---

# Figma Conventions — <client codename>

Where the client has existing conventions, theirs win; this document extends, never replaces. Status flips to `reviewed` once the client design lead has agreed to it.

## Files

- One file per <scope/feature — per client convention>, named `<client codename> — <scope>`.
- FigJam for synthesis, flows, workshops, critique notes; Figma for screens. Cross-link, don't paste between mediums.
- All frame data **synthetic** — no live patient data, ever (see `engagement-guardrails`). Finding live data in a file is a flag-and-replace, not a shrug.

## Page structure (working order)

| Page | Holds | Rules |
|---|---|---|
| ⬜ cover | status block | always current; it's the thumbnail |
| 🧪 exploration | work in progress, messy on purpose | never reviewed, never linked from specs |
| 👀 ready-for-review | this round's ask | only what the client should react to |
| ✅ approved | current source of truth | only client-approved work; only page handoff links |
| 🗄 archive — <yyyy-mm-dd> | superseded rounds | date-stamped; never deleted |
| 🧩 components (local) | `_local/` pieces | each has a fate: promote or dissolve |

Flow: exploration → ready-for-review → approved → archive. Nothing skips ready-for-review. Promotion to approved happens at review, logged as `DEC-NN` in `ux/design/rationale.md`.

## Naming

- **Frames:** `<flow> / <NN> — <step>` · errors `e<N> — <failure>` · e.g. `med-admin / 02 — scan patient`, `med-admin / e1 — scan mismatch`
- **Layers:** semantic at component/inspect level (`patient-banner`, not `Group 12`); dev mode shows engineers your tree
- **Sections:** one flow per section, named for the flow
- **Don't rename approved frames** — specs and rationale cite them; supersede via archive instead

## Cover status block

```
<client codename> — <scope>
status:        exploring | in review | approved | handed off
design lead:   <name/role>
last review:   <yyyy-mm-dd> with <role>
brief:         ux/design/brief.md
rationale:     ux/design/rationale.md
handoff:       ux/delivery/handoff-<scope>.md (when it exists)
```

## Components

1. Client library first — always.
2. Missing variant → request via client contribution process; never fork silently.
3. Net-new → `_local/<name>` on the components page + one-line purpose + fate (promote via /component-spec | dissolve with scope).
4. Detach = last resort + a why-note on the frame.

## Review cycles

- **With branching:** branch `review/<yyyy-mm-dd>-<scope>` per client review; present from the branch; merge on approval. Main stays stable between reviews.
- **Without branching:** snapshot the round to `🗄 archive — <date>`; named version-history checkpoint at every review and handoff.
- Review feedback → critique notes in FigJam or `ux/design/critiques/`; decisions → `DEC-NN`.

## Handoff-readiness (the /handoff-spec gate)

- [ ] Scope frames on `✅ approved`; explorations off the link path
- [ ] Frames named as flow steps; inspectable layers semantic
- [ ] All states per screen: empty / loading / error / offline
- [ ] Real copy (source `ux/design/copy/`); client tokens applied; `_local/` resolved or flagged
- [ ] Dev-mode annotations on; version named or branch pinned
- [ ] Cover status current

## Rolloff checklist (engagement end)

- [ ] Archive pages pruned to meaningful rounds; cover updated to final status
- [ ] `_local/` components promoted or dissolved — none left ambiguous
- [ ] All spec/rationale links spot-checked against frame names
- [ ] File ownership transferred per client process
