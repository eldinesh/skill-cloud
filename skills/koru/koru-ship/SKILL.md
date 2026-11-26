---
name: koru-ship
version: 3.0.0-alpha.1
bundle: koru
stage: ship
description: |
  Koru stage 4, Ship: ready means machine-checkable. Splits MVP and owners, builds the chosen
  deliverables from tokens and real components, generates Tickets with one given/when/then
  criterion per state cell, runs the ambiguity and consistency checks, writes the handoff
  note with rabbit holes and no-gos, and brings build decisions back as Decisions.
  Use when asked to "write the tickets", "get this build-ready", "hand off to engineering",
  "push to Jira", "definition of ready", or "get us to the Ship gate".
  Proactively invoke when a Koru project has passed the Harden gate and has no Ticket cards. (skillcloud)
---

## Preamble (run first)

```bash
command -v koru >/dev/null 2>&1 || koru() { node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" "$@"; }
koru where --brief 2>/dev/null || echo "NO_KORU_PROJECT"
koru gate harden >/dev/null 2>&1 && echo "HARDEN: ready or passed" || echo "HARDEN: not passed"
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

## Contract
- **Consumes:** final SCR, STA, MET, JOB and DEC cards; the hardened prototype; `koru/design-system.md`; `koru/engagement.md` (`deliverables`, contract tier); `ux/project-context.md` when present (data rules per `engagement-guardrails`)
- **Produces:** TKT cards that pass Definition of Ready, the deliverables in `koru/deliverables/`, an HND card, DEC cards for MVP and build decisions, a REV for the gate; Jira issues only when a person approves each write
- **Next:** the spec checker, the Ship gate, `/koru:share` for the client, then design QA after the build

# Ship: ready means machine-checkable

Ship's bar: an engineer, or their coding agent, can build without coming back with questions. Every Ticket traces back through a Screen and a JTBD to an Insight, and forward to a Metric. `koru dor` checks this; the Jira hook refuses tickets that fail it.

## Who does what (AI Fluency: delegation)

| Step | Claude | Shared | People only |
| --- | --- | --- | --- |
| MVP split | Proposes the split and owners | | Decision by the engagement lead and engineer |
| Front end | Builds from tokens and components | Design engineer reviews structure | |
| Tickets | Generates from the state matrix | Designer scopes | Engineer signs |
| Ambiguity and consistency | Runs both | | |
| Handoff | Drafts the note | | Engineer signs |
| Jira and Figma writes | Prepares | | A person approves each write |

## Entry (Definition of Ready) and exit

- **Entry:** every State cell resolved; every element classified, with a token or code mapping; accessibility annotations complete; no stale upstream cards; no open clarification markers.
- **Exit:** every Ticket passes Definition of Ready and is signed by the engineer; no Screen without a Ticket; the deliverables built; the handoff note complete with rabbit holes and no-gos.

## S1. MVP and owners

Split the hardened design into MVP and later; confirm feasibility per item; name an owner per part; list open risks with how each will be validated (`sense-shape-steer` CONCLUDE for AI products). Each is a Decision: `koru decide new "MVP scope" …`.

## S2. Build the chosen deliverables

**Tech stack first.** Read `tech_stack` and `frontend_dir` in the engagement. If either is unknown, ask the engineer before any code: framework and version, styling (Tailwind, CSS modules, CSS-in-JS), the component library the client already uses, state and data fetching, test tools, CI. Record it, and every choice that departs from the client's existing code, as a Decision.

**Foundation before features.** `koru scaffold` (react-tailwind and react-library today) generates the foundation from the design system and the cards, and it must pass `npm run check` before any feature is written:
- **Tokens:** `src/styles/tokens.css` and `tailwind.preset.cjs`, copied from `koru ds build`. The preset replaces Tailwind's palette, spacing and type scale, so only tokens exist.
- **UI layer:** `src/ui/`, one component per manifest entry, the only place raw `<button>`, `<input>`, `<dialog>` appear, with keyboard and ARIA behaviour built in. Each has a story per state and a test that renders every state through axe.
- **Features:** `src/features/<screen>/`, one folder per Screen card, with its **data and API contract** (`contract.ts`, agreed with the engineer) and its states as `data-testid="state-STA-…"`. `src/features/states.ts` is generated from the State cards, so tests, tickets and code name the same ids.
- **Rules in the tools:** ESLint (jsx-a11y strict; no raw controls, inline styles or literal colours in features; no other UI library), Stylelint (tokens only), TypeScript strict, `npm run lint:ds` (the Koru design-system lint) in CI. The design-system hook guards `frontend_dir` as it guards prototypes.
- For other stacks, follow the same four layers by hand and run `koru ds lint <dir>`.

Read the `deliverables` switch and load `koru-deliverables`. Whatever the mix (standalone HTML, Figma frames, full front-end code), all of it renders from the same SCR and STA cards: Screen IDs and state names in the code match the cards.

- Tokens only. Raw colour and pixel values are drift; the hook and `npm run lint:ds` refuse them.
- Each Ticket names its STA ids, the contract it reads, the ui components it uses and its test ids. A component the system lacks is added with `koru ds component add` and its spec first, never built inside a feature.
- Measure **Code Connect coverage** when the client has Figma components mapped to code; code for unmapped components is marked provisional.
- Write a `component-spec` for anything classified extend, snowflake or new.

## S3. Tickets generated from the matrix

One Ticket per user story: `koru new TKT "<Verb object>" --link "implements SCR-…: …" --link "serves JOB-…: …" --link "measures MET-…: …"`.

- Title: verb plus object ("Show assignment reasons").
- User story: "As a …, I want …, so that …".
- **Acceptance criteria: one given/when/then line per State cell, each naming its STA id** (`- STA-004: Given … when … then …`). Generating criteria from the matrix means a ticket cannot silently cover only the happy path. Cells marked n/a need no line.
- Tokens and components used; out of scope; open questions (empty before handoff).
- **Ambiguity check:** words with no measure ("fast", "intuitive", "appropriate", "easy", "seamless") are refused. Say the number or behaviour that proves it.
- **Consistency pass:** tickets against Screens, States and Decisions. `koru dor` and `koru gate ship` list orphans (a Screen with no Ticket) and stale links. Handoff waits for zero blocking warnings.

## S4. Handoff note

`koru new HND "Handoff"`: half a page. What is in, what is not, the decisions engineers must know, who to ask, and the two fields that stop guessing: **rabbit holes** (known traps) and **no-gos** (things deliberately not built). Use `handoff-spec` for the detail.

## S5. Jira, Definition of Done and decisions back

- **Jira** (when the contract tier is full): create issues only from signed TKT cards, naming the card id in the issue. The hook refuses a ticket that fails Definition of Ready and asks a person to approve every write. With any other tier, export the tickets as Markdown for the client to import.
- After the build, design QA with `design-qa-checklist` compares the built UI against the **pinned** design version: visual comparison, token-usage scan, automated accessibility scan, keyboard pass, evidence for each acceptance criterion.
- Developer decisions during the build come back as Decisions (promoted from Jira comments) with `affects` links to the Tickets and Screens they touch; approved deviations supersede earlier Decisions. Nothing is edited silently.

## Pause-point checklists (killer items)

| Pause point | Check |
| --- | --- |
| Before tickets | Definition of Ready met · MVP split decided · owners named |
| Before handoff | One criterion per cell · ambiguity check clean · zero blocking warnings · rabbit holes and no-gos written · Code Connect coverage stated |
| After build | Compared to pinned version · tokens scanned · accessibility and keyboard checked · deviations recorded as Decisions |

## The gate

Run the **spec-checker** agent: it reads only the tickets and the deliverable and lists every question an engineer would still ask, plus every orphan. Record with `koru review ship --checker spec-checker --file <findings.md>`; dispositions; `koru gate ship`; ask the engineer "Pass the ship gate?" with options and run `koru gate ship --pass --name "…" --role "engineer"` on yes.
