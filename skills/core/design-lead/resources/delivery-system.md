# The delivery system — stages, handoffs, sign-offs

> **Koru Studio:** each stage's full playbook (five designer moments, steps, tables, checks) is its stage skill in `skills/stages/`, and the gates are in `resources/gates/` (AI audits, people decide Fix or Waive). Where this file and a stage skill disagree on a stage's content, the stage skill wins.

Every project runs the same way, from brief to build: **Frame → Explore → Harden → Ship**, with **Learn** after release feeding the next Frame. Each stage starts only from the previous stage's **signed-off** output and hands one output on. AI drafts and checks the work. Named people decide.

This file is the reference the design lead (orchestrator), every specialist agent and every checker reads. When a rule here and a skill disagree, this file wins for *sequencing and sign-off*, and the skill wins for *how the work is done*.

---

## 1. The four rules that hold it together

1. **Only final artifacts are sources.** Nothing AI-generated feeds the next stage until a named person signs it off. An agent that needs an unsigned input stops and says so. The only exception is a recorded override (§7). This stops AI output from becoming unchecked input for more AI output.
2. **Claude never signs.** Sign-off is a human act. A person types it, and the design lead records it in `ux/decisions-log.md` and in the artifact header. No agent writes `status: final`, `signed_off_by:` or a sign-off line in the log. `skillcloud-check signoffs` audits this.
3. **Every handoff is challenged.** An independent checker sees only the signed-off inputs and the work under review. It doesn't see the producer's reasoning or the chat. It tries to break the handoff before a person spends time on it. Real tools run where they exist: the trace, quote, identifier, IA, contrast, build and test checks. A checker's opinion never replaces a tool result that could have been produced.
4. **Changes flow both ways.** A decision made at any stage becomes a decision-log entry, for example an engineer finding at Ship that a sync interval makes a state impossible. Each artifact the decision touches is marked stale until its owner accepts, rejects or notes the change. A final artifact is never edited in place. The next version is made and signed (§6).

---

## 2. Stages

### FRAME — get to a brief the team can trust

| | |
|---|---|
| **Starts from** | Raw material: requirement docs, call transcripts or notes, a roadmap item, a discovery request, existing research |
| **Hands on** | `ux/design/brief.md` (the framed brief, one page) **and** the research pack: 1–2 personas, 5–8 jobs, competitive scan of 3–5 products, plus `ux/strategy/experience-strategy.md` |
| **Two paths** | **Roadmap item** → start from a hypothesis ("we believe X; we'll know when Y"). **Discovery** → start from a question ("what makes Z hard?"). The brief records which path it took. Hypotheses are tested in Explore, and questions are answered in research. |
| **Agents** | researcher (requirement call prep and recap, research plan, intake), synthesiser (intake clean-up, synthesis, personas, jobs, insight report), strategist (experience strategy, competitive scan, framed brief) |
| **Checker protocol** | `handoffs.md` → H1 Research pack, H2 Framed brief |
| **Signs off** | **Senior** signs the framing (brief). **Research owner** signs the research pack. These are two separate sign-offs, and neither substitutes for the other. |
| **Done when** | Brief fits one page and every section is filled · every fact carries a confidence level and a source · pack inside the limits · both sign-offs in the decisions log · only signed-off files are marked final |

Fresh research inside Frame is a loop of its own: the research plan is approved by the research owner **before fieldwork**. People run the sessions. Agents plan, clean, synthesise and challenge, but never stand in for a participant.

### EXPLORE — several directions fast, one with evidence

| | |
|---|---|
| **Starts from** | Final brief + final research pack + experience strategy |
| **Hands on** | `ux/structure/` (IA and the flow in scope), `ux/explore/directions.md` (two direction cards), one realistic HTML prototype per direction (`ux/explore/<direction>/prototype.html`), `ux/explore/feedback-log.md` with user evidence, and the choice recorded in the decisions log |
| **Agents** | information architect (object model, navigation, the flow, 3–5 screens), designer (direction cards and prototypes that look like the real product, never wireframes), researcher (10-minute test script), synthesiser (feedback log from sessions) |
| **Checker protocol** | H3 Structure, H4 Directions |
| **Signs off** | **Team lead** chooses the direction, with the client's view where available. A quick test with a person playing the user is the evidence that lets it move on. Choose only with user evidence. |
| **Done when** | Two direction cards that differ in a way that matters · prototypes for one flow, 3–5 screens · test findings logged against the chosen direction · client feedback logged · reason for the choice in the decisions log |

Limit: **two directions, no more**, unless the team lead records why a third is needed. Do not polish before choosing, and do not do Harden's job (states and edge cases come next).

### HARDEN — make the chosen direction hold up

| | |
|---|---|
| **Starts from** | The chosen direction, its user evidence, the project rulebook (`ux/rulebook/`) |
| **Hands on** | `ux/harden/hardening-matrix.md` (role × action × state, filled), `ux/harden/rulebook-check.md`, `ux/harden/feasibility.md`, the hardened prototype, the tokens file, the reviews (`ux/design/heuristic-eval.md`, `ux/design/accessibility-audit.md`) |
| **Agents** | quality reviewer (hardening matrix, rulebook check, heuristic and accessibility passes), designer (adds the missing states, components, copy), engineer (feasibility check) |
| **Checker protocol** | H5 Hardened design |
| **Signs off** | **Engineer** agrees feasibility. **Rulebook owner** passes the rulebook checks. **Design lead** approves the hardened design. These are three sign-offs. |
| **Done when** | Checklist run on every screen of the flow · gaps fixed or listed as Ship notes · rulebook checks passed or fixes listed · feasibility limits noted and designed for · checked against the product as a whole |

**Fix here or send back.** Fix it in Harden if the direction holds and the gap is a missing state, role, edge case or rule breach. Send it back to Explore only if the direction itself won't hold: a core assumption failed, feasibility kills the main interaction, or a rule makes the concept impossible. Small issues travel to Ship as notes and do not stall the run.

### SHIP — hand over with nothing left to ask

| | |
|---|---|
| **Starts from** | Final hardened design, tokens file, rulebook |
| **Hands on** | The coded deliverable (`deliverable/`, built under the code and testing chapters) with its build report (`ux/ship/build-report.md`), tickets (`ux/ship/tickets/`), the half-page handoff note (`ux/ship/handoff-note.md`), and optionally the full `/handoff-spec` |
| **Agents** | engineer (coded deliverable, tickets, handoff note), quality reviewer (design QA of the build) |
| **Checker protocol** | H6 Ship spec |
| **Signs off** | **Engineer** reviews the handoff and lists anything they'd still need to ask. The list must be empty or answered before final. |
| **Done when** | Deliverable covers the core flow and all its states as code a person or coding agent can build from · all checks green with real output in the build report · every ticket in the template, with given/when/then criteria, traced to a screen and a job · engineer review recorded |

User stories may be drafted while Explore and Harden run. Tickets are finalised only after Harden passes.

### LEARN — after release

What people do with the shipped product, where they overrule the AI, and where it fails. Signals come from analytics, support tickets, follow-up sessions and the STEER plan's metrics (`/sense-shape-steer`). The synthesiser folds them into `ux/synthesis/cross-study.md`, and the next Frame starts there. Learn has no gate. It is the source of the next brief.

---

## 3. Two situations every stage must handle

Recorded once in `ux/project-context.md` → **Design system**:

| Situation | Explore | Harden | Ship |
|---|---|---|---|
| **Library in code** (tokens + components in a repo) | Prototypes use its components and tokens. The designer writes a component map, and any new component needs a decision-log entry. | Rulebook check includes "uses library components where one exists". | Deliverable imports the library. No re-implementation. |
| **Figma library only** | Components and variables are read through the Figma connector into the prototype's tokens. | Same check, against the Figma library. | Tokens exported to `deliverable/src/styles/tokens.css`, and components built to match the library's names. |
| **None yet** | Explore runs on the neutral starter tokens (`project-rulebook/resources/starter-tokens.css`), so it looks like a real product from day one. | When a direction is chosen, its tokens become the project's design-system record with an owner. New components are logged as library candidates. | Deliverable uses that tokens file. Candidates are listed in the handoff note. |

Either way: **explorations look like the real product.** No stripped-back wireframes.

---

## 4. Sign-off roles

Named in `ux/project-context.md` → **Team**. One person can hold several roles, but a role with no name means its gate can't close. The design lead asks for the name at the gate. It never asks earlier, and never asks administrative questions.

| Role | Signs |
|---|---|
| Senior | Framing (the brief) |
| Research owner | Research plan (before fieldwork), the research pack |
| Team lead | Direction choice |
| Design lead | Hardened design |
| Rulebook owner | Rulebook checks; rulebook chapter changes |
| Engineer | Feasibility (Harden); handoff review (Ship) |
| Decision owner (client) | Scope, business, priority; the brief and AI on their data, in writing |
| Explore / Harden / Ship lead | Accepts the previous stage's handoff at its gate |
| Decision owner (client) | Scope, business, priority; the brief and AI on their data, in writing |
| Explore / Harden / Ship lead | Accepts the previous stage's handoff at its gate |

---

## 5. Confidence and evidence

Every claim in Frame artifacts carries a confidence level and a source:

- **high**: two or more independent sources, including direct user or client evidence
- **medium**: one direct source
- **low**: anecdote, a single stakeholder's belief, or anything AI inferred that no person has checked

AI-inferred claims stay **low** until a person confirms them. Evidence comes in three layers, defined in the rulebook's evidence chapter: **data** (what was recorded), **finding** (a pattern across data) and **insight** (why, and so what). Every design decision traces back to an insight or is labelled as the team's judgment.

---

## 6. Status, versions, naming

- `status: draft` is AI output nobody has reviewed. `review` means being discussed. `final` means signed off by the named person. (`reviewed` is accepted as a legacy spelling of `review`.)
- Every change that someone else will use bumps `version:`. Never overwrite a final artifact: copy it to `ux/archive/<name>-v<n>.md`, make the next version, and record "replaces v<n>" in the decisions log.
- Publishing to a Claude project's knowledge (or any shared space) uses `<project>-<stage>-<artifact>-v<n>-<status>`, for example `deskly-frame-brief-v2-final`. Only `final` files are published. `/design-lead` → PUBLISH builds the set.

---

## 7. Overrides (people can always overrule)

A person can overrule anything the system does, and the override is recorded, never silent:

- **Overrule a checker finding:** accept the work despite the finding. The decisions log gets the finding ID, who overruled and why.
- **Overrule an agent:** reject or rewrite its output. The design lead re-dispatches with the person's direction, or the person edits by hand and says so.
- **Proceed on an unsigned input:** allowed only when the gate owner says so for a stated reason, for example "client workshop tomorrow, sign-off Friday". The downstream artifact's header carries `built_on_unsigned: [paths]` until the inputs are signed.
- **Skip a stage or collapse gates:** allowed for small work, for example one person signing Frame and Explore together. It is recorded with the reason.

---

## 8. Handoff card (end of every stage)

Written by the design lead from the stage's artifacts, at `ux/team/handoffs/<stage>.md`:

| Field | Answer |
|---|---|
| What we hand on | |
| Format and template | |
| Where it lives, what it's called | |
| What the next stage must be able to do with it | |
| What it doesn't include | |
| Open notes travelling forward | (e.g. Harden fixes for Ship) |
| Checker verdict | (link to `ux/team/checks/…`) |
| Signed off by | (names and dates, from the decisions log) |
| Checked by the next stage | (agent or person who confirmed it's usable) |
