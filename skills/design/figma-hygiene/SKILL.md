---
name: figma-hygiene
version: 1.0.0
bundle: design
stage: design
description: |
  File organization for client Figma work: page structure (exploration → ready-for-review →
  approved → archive), frames named as flow steps, branching for client review cycles, local
  components vs. client library discipline, cover status block, FigJam/Figma split.
  Use when asked to "set up the figma file", "clean up this figma file", "figma conventions",
  "organize our figma", or "is this file ready for handoff".
  Proactively invoke when shared Figma links reveal unnamed frames ("Frame 482") or a single
  page holding everything — especially before a client review or handoff.
  Cross-cutting: pairs with every design-stage skill; gates /handoff-spec readiness. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Do not block on questions; refine the file as real facts emerge.

## Contract
- **Consumes:** the Figma file under discussion (link or description of its state), the client design system and conventions from `ux/project-context.md` (always)
- **Produces:** applied conventions + advice in conversation; optionally `ux/design/figma-conventions.md` when the team wants the conventions written down
- **Next:** /handoff-spec — once the file meets the handoff-readiness definition below

# Figma Hygiene

You are the designer whose files the client inherits. Embedded work has a brutal property: the Figma file *is* the deliverable the client lives with after you roll off — and a file only you can navigate is a file the client pays to reverse-engineer. Hygiene isn't tidiness for its own sake; it's what makes review cycles fast (the client always knows what's ready for their eyes), links durable (handoff specs and rationale entries cite frames for years), and rolloff cheap (the next designer orients in minutes).

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, **data rules**, the client's design library and any existing file conventions (theirs win — extend, don't replace), team plan capabilities (branching available?).
2. Data rules (full rules in `engagement-guardrails`): file *structure* is low-risk, but file *content* isn't — frames must carry **synthetic data only**; pasted-in screenshots of live systems carry real user data (in healthcare, PHI) into a file the whole org can open. If you find live data while organizing, flag it for replacement as a finding, and don't echo the identifiers. If `project-context.md` restricts AI processing: advise on conventions only; don't process file contents.
3. Ask which mode you're in: **set up** a new file, **clean up** an existing one, or **write down** team conventions (`ux/design/figma-conventions.md`).

## Step 1 — Diagnose (clean-up mode)

The smells, in descending order of cost:

- "Frame 482" everywhere — links in specs and tickets point at names nobody can verify
- One page holding exploration, finals, and graveyard — the client reviews work-in-progress by accident
- Dead explorations interleaved with approved work — every reviewer asks "is this current?"
- Local components shadowing the client library — same button, three sources of truth
- No cover, no status — every open starts with archaeology

Report what you find before changing anything; renaming and moving frames breaks nothing technically (links follow node ids) but changes meaning — agree on the target structure first.

## Step 2 — Page structure

One file per scope/feature (per client convention), pages in working order:

```
⬜ cover                      — status block (Step 5)
🧪 exploration                — messy on purpose; never reviewed, never linked
👀 ready-for-review           — what the client is being asked to react to, this round
✅ approved                   — the current source of truth; only state that handoff links
🗄 archive — <yyyy-mm-dd>     — superseded rounds, kept honest (date-stamped, never deleted)
🧩 components (local)         — the _local/ holding pen (Step 4)
```

Work flows downward: exploration → ready-for-review → approved → archive. Nothing skips ready-for-review into approved (that's how unreviewed work ships), and nothing lives on approved that the client hasn't actually approved — the page name is a promise. Promotion to approved happens at review, ideally with the decision logged as a `DEC-NN` in /design-rationale.

## Step 3 — Naming: frames as flow steps

- **Frames:** `<flow> / <NN> — <step>` (`order-entry / 03 — review`, error paths as `e1 — save failed`). Numbered steps read as the flow; links pasted into /handoff-spec, rationale entries, and tickets stay *humanly* meaningful — a renamed "Frame 482" still resolves technically, but nobody can tell what the link was supposed to show. Frame names are the contract; don't rename approved frames casually (specs cite them) — supersede via archive instead.
- **Layers:** semantic names for anything inspectable or referenced (`patient-banner`, not `Group 12`) — dev mode exposes your layer tree to engineers. Deep decoration can stay messy; the contract is at component and frame level.
- **Sections:** group frames by flow on each page; one flow per section, named for the flow.

## Step 4 — Components: client library first

- Instantiate from the **client's library** by default. Need a variant that doesn't exist? Request it through the client's contribution process — don't fork it silently (same rule as /component-spec Step 1).
- Genuinely new pieces live on the local components page, prefixed `_local/` so they're unmistakably not-library, each carrying a one-line note: what it's for, and its fate — **promote** (to the client library, via /component-spec) or **dissolve** (one-off, dies with the scope).
- **Detaching** a library instance is a last resort and gets a note on the frame saying why — an unexplained detach is where design-system drift is born.

## Step 5 — Cover, branching, and the FigJam split

- **Cover page status block:** scope + client codename, status (exploring / in review / approved / handed off), design lead, last client review date, links to `ux/design/brief.md`, the rationale log, and the handoff spec when it exists. The cover answers "what is this and can I trust it" in five seconds — it's also what the file browser thumbnail shows.
- **Branching (org/enterprise plans):** branch per client review cycle (`review/<yyyy-mm-dd>-<scope>`), present from the branch, merge on approval — approved-main stays the stable truth between reviews, and review feedback lands against a frozen picture. No branching on the client's plan? Simulate: snapshot the round to `🗄 archive — <date>` and use named version history checkpoints at each review and handoff.
- **FigJam vs. Figma:** synthesis, flows, workshops, and critique notes live in FigJam; screens live in Figma. Cross-link rather than pasting journey maps between screen frames — mixed-medium pages rot fastest.

## Step 6 — Handoff-readiness definition

The file is handoff-ready when (this is the gate /handoff-spec Step 1 checks):

- [ ] Scope's frames live on `✅ approved`; explorations are off the link path
- [ ] Frames named as flow steps; layers semantic at component/inspect level
- [ ] All states present per screen (empty/loading/error/offline) — missing states are design work
- [ ] Real copy (source: `ux/design/copy/`), client tokens applied, `_local/` components resolved or consciously flagged
- [ ] Dev-mode annotations on; version named or branch pinned for the handoff
- [ ] Cover status current

If asked to write conventions down, produce `ux/design/figma-conventions.md` from `resources/figma-conventions-template.md` — artifact header per PIPELINE.md, `status: draft`, then `reviewed` once the client design lead agrees (their conventions take precedence where they exist).

## Quality bar

- A stranger orients from the cover in under a minute; "what's current?" has exactly one answer (`✅ approved`).
- Zero "Frame 482" on review/approved pages; every link in specs and rationale resolves to a named frame.
- One source of truth per component; every `_local/` item has a fate.
- Review rounds reconstructable from branches/archive — the client can see what changed between rounds.
- All frame data synthetic — the file could be screen-shared with anyone at the client without a PHI scrub.

## Handoff

End with: what was set up/cleaned (pages, renames, component triage) or produced (`ux/design/figma-conventions.md`, status), anything flagged (live data found, detaches without notes, library gaps), and the suggested next step — `/handoff-spec` if the readiness gate now passes ("file is link-stable — specs written against it will hold"), or the named fix list if it doesn't. Suggest, don't auto-run.
