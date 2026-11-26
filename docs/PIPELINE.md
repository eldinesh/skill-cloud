# PIPELINE.md — Artifact Contracts & Skill Authoring Standard

This is the spec that makes 34 skills and an 8-agent design team behave like one system. Every skill, adapted or written from scratch, follows it exactly. `tools/validate.sh` enforces the mechanical parts. How the team runs (stages, gates, sign-off, the board) lives in `docs/TEAM.md` and `skills/core/design-lead/resources/`.

## 1. The map

Projects run **Frame → Explore → Harden → Ship** (→ Learn). Each stage starts only from the previous stage's signed-off output.

```
ux/project-context.md  ← keystone. Created on first use. EVERY skill reads it first.
ux/rulebook/           ← the brain (/project-rulebook). Agents load the chapters their job needs.

FRAME     /requirement-call (TRACES) · /research-plan → /interview-guide → [fieldwork: people] →
          /interview-synthesis → /affinity-mapping → /cross-study-synthesis → /jobs-to-be-done →
          /persona · /journey-map · /insight-report → /experience-strategy (+ competitive scan) →
          /design-brief (the one-page framed brief)                 ── gate: senior + research owner
EXPLORE   /information-architecture → /explore-directions (cards → prototypes) →
          /usability-test-plan (quick) → [sessions: people] → feedback log  ── gate: team lead
HARDEN    /harden-review (feasibility · matrix · rulebook check · scans) → /explore-directions (harden fixes)
          · /heuristic-evaluation · /accessibility-audit · /component-spec · /ux-writing · /design-rationale
                                                                    ── gate: engineer + rulebook owner + design lead
SHIP      /ship-code → /ship-tickets → /design-qa-checklist · /handoff-spec  ── gate: engineer
LEARN     post-release signals → /cross-study-synthesis → next FRAME
AI entry  /sense-shape-steer before or inside Frame; its blueprint feeds /design-brief
```

`/design-lead` reads this map and the board, places the project, plans the stage as tickets, dispatches each job to its specialist agent, has every handoff challenged, and stops at each gate for the named person. Working without agents, it runs each step inline with the same gates.

## 2. The artifact tree

All pipeline outputs live in the project's `ux/` folder. The coded deliverable lives in `deliverable/`.

```
ux/
├── project-context.md            # keystone (template in engagement-guardrails/resources/)
├── decisions-log.md              # every sign-off, overrule, choice, writeback: people only
├── rulebook/<chapter>.md         # the project's rulebook + index.md
├── intake/
│   ├── raw/                      # as received (excluded from checks; delete per contract)
│   ├── clean/                    # de-identified, speaker-labelled markdown
│   └── calls/<date>-<slug>.md    # requirement-call prep + recap (TRACES)
├── research-plan.md
├── interviews/guide.md, P01.md … # de-identified per-participant records (NEVER raw names)
├── synthesis/interview-synthesis.md, affinity-map.md, cross-study.md, jobs-to-be-done.md
├── personas/<slug>.md · journeys/<slug>.md · insight-report.md
├── strategy/experience-strategy.md, competitive-scan.md
├── sprint/                       # /sense-shape-steer artifacts
├── design/
│   ├── brief.md                  # page one = the framed brief
│   ├── tokens.css, design-system.md   # when the project had no system (from the chosen direction)
│   ├── critiques/ · heuristic-eval.md · accessibility-audit.md · components/ · copy/ · rationale.md
├── structure/ia.md, flows/<flow>.md
├── explore/directions.md, feedback-log.md, test-script.md, <dir>/prototype.html + notes.md
├── harden/hardening-matrix.md, rulebook-check.md, feasibility.md, scans/
├── ship/build-report.md, tickets/TKT-nn-<slug>.md, handoff-note.md
├── validation/usability-test-plan.md
├── delivery/handoff-<scope>.md, qa-checklist.md
├── team/                         # design lead only
│   ├── board/<id>.md             # tickets: jobs, gates, human tasks (board.html renders them)
│   ├── checks/<id>-C.md          # checker reports
│   ├── gates/ · handoffs/ · ledger.md · routing.txt (optional override)
├── archive/<name>-v<n>.md        # replaced finals, never deleted
└── publish/                      # finals named <project>-<stage>-<artifact>-v<n>-final for a Claude project
deliverable/                      # /ship-code: the coded deliverable
```

## 3. Artifact header (every produced file starts with this)

```yaml
---
artifact: <kind>                  # e.g. persona, insight-report
project: <project name>           # from project-context.md: a codename when the data rules call for one
created_by: skillcloud/<skill> v<VERSION>
stage: frame | explore | harden | ship | learn
sources: [ux/synthesis/interview-synthesis.md, ...]   # upstream artifacts this was built from
status: draft                     # draft (AI output nobody reviewed) | review | final (signed by a named person)
version: 1                        # bump for any change someone else will use; finals are never edited in place
updated: <yyyy-mm-dd>
# written only by /design-lead from a person's typed sign-off; never by an agent:
signed_off_by: <name> (<role>)
signed_off: <yyyy-mm-dd>
conditions: <optional>
# when a person allowed work on unsigned inputs:
built_on_unsigned: [<paths>]
---
```

`sources:` is what makes insights evidence-linked end to end. A ticket traces to a flow step and a job, the job traces to the synthesis, and the synthesis traces to the de-identified interviews. `skillcloud-check trace` follows the chain.

**Only final artifacts are sources** for the next stage. **Claude never signs.**

### 3.1 IDs (stable, never reused; cited instead of restated)

| ID | What | Defined in |
|---|---|---|
| `P01` | participant | `ux/interviews/P01.md` |
| `INS-nn` | insight | cross-study registry / insight report |
| `JOB-nn` | job | `synthesis/jobs-to-be-done.md` (heading `### JOB-01 — …`) |
| `HMW-nn` `OPP-nn` `PRIN-nn` `BET-nn` `ASM-nn` | strategy | `strategy/experience-strategy.md` |
| `N1.2` | IA node | `structure/ia.md` sitemap (line starts with the ID) |
| `FL-nn`, `FL-nn.Snn` | flow, flow step | `structure/flows/<flow>.md` |
| `DIR-A` | direction | `explore/directions.md` |
| `DEC-nn` | design decision | `design/rationale.md` |
| `D-nnn` | logged decision / sign-off | `decisions-log.md` |
| `TKT-nn` | ticket | `ship/tickets/` |
| `J-nnn`, `G-<stage>-n` | board job, gate | `team/board/` |
| `<PREFIX>-Rnn`, `-Cnn` | rulebook rule, check | `rulebook/<chapter>.md` |

An ID is *defined* where it appears as a heading, the first cell of a table row, a bold list lead, or `id:` in a header. Anywhere else it is a citation, and it must resolve (`skillcloud-check trace`).

## 4. SKILL.md authoring standard

### 4.1 Frontmatter

```yaml
---
name: <folder-name>               # must match the folder exactly
version: 1.0.0
bundle: core | research | design | build | ai
stage: frame | explore | harden | ship | learn   # pipeline skills (older skills may still say discover…deliver)
description: |
  <One-liner: what it does and what it produces.>
  Use when asked to "<phrase>", "<phrase>", "<phrase>".
  Proactively invoke when <observable condition in the conversation>.
  <Chain note: Use after /x; feeds /y.> (skillcloud)
---
```

Description rules: ≤ 8 lines, must contain `Use when`, must end with `(skillcloud)`. The description is the router — write trigger phrases people actually say, and make the proactive condition observable ("the user pastes an interview transcript"), not vague ("when relevant").

### 4.2 Standard preamble (immediately after frontmatter, verbatim)

````markdown
## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions — defaults exist); but if something material to the work itself is unclear — who the participants are, what decision the output should inform — ask that one sharp question before producing.
````

Everything is failure-safe (`|| true`) — offline, Cowork, or a missing install must never break the skill.

### 4.3 Step 0 — context and data-rules gate (pipeline skills)

Every research/design skill starts its workflow with:

1. Read `ux/project-context.md` — project name, **domain/industry**, **data rules**, brand, constraints, glossary. A project is a project — internal, client, side bet: same treatment, no classification, no questions about which kind it is.
2. Data rules (full rules in `engagement-guardrails`): if the file **explicitly restricts** AI processing of this project's material → STOP, say so, point to `engagement-guardrails`. Otherwise proceed — de-identifying people data on intake as a standing habit (people → codes, orgs/systems → glossary codenames, identifiers stripped; industry-specific identifier categories, e.g. PHI in healthcare, live in `engagement-guardrails`).
3. Domain awareness: apply the project's domain from project-context to examples, registers, heuristics, and logistics. Healthcare playbooks ship as the worked example throughout — adapt to the actual domain, never assume it. Domain unknown → infer it from the material and state the inference in one line.
4. Read this skill's **Consumes** artifacts if present; if missing, say exactly what's missing and offer to either run the upstream skill or proceed with what the user provides.
5. Questions: never administrative (project type, permissions — defaults exist), always substantive when it matters — if an ambiguity would change the output, ask one sharp question first (§4.7). Everything produced lands as `status: draft` with gaps and assumptions flagged; humans promote to review/final.

### 4.4 Contract block (pipeline skills, required — validate.sh checks it)

```markdown
## Contract
- **Consumes:** `ux/<path>` (required|optional), `ux/project-context.md` (always)
- **Produces:** `ux/<path>`
- **Next:** /<skill> — <why that's the natural next step>
```

### 4.5 Next-step handoff (how chains happen)

End every pipeline-skill run by stating, in one short block: what was produced and where, its `status`, and the suggested next skill with a one-line reason ("Inputs for /persona are ready — synthesis has 6 themes across 8 participants"). **Suggest, never auto-run** — only `/design-lead` chains skills, behind its own approval gates.

### 4.6 Resources

Templates, checklists, and worked examples live in the skill's `resources/` folder and are referenced by relative path from the SKILL.md. Examples must be fully synthetic — fictitious org names, P-numbers for people, no real client material. (validate.sh tripwires SSN/MRN-shaped strings.)

### 4.7 Voice

Skills write like a senior practitioner: direct, concrete, no filler. Outputs are scannable documents a stakeholder could read cold. When a skill asks the user something, it asks one sharp question, not a survey.

## 5. Compatibility rules (the whole point)

A skill belongs in SkillCloud only if it:
1. reads `project-context.md` first,
2. consumes upstream artifacts when they exist and names what's missing when they don't,
3. produces its output at the standard path in the standard format with the artifact header,
4. ends with the next-step handoff.

That's what turns isolated intelligence into a streamlined system.

## 6. Agent authoring standard (`agents/sc-*.md`)

A design-team agent is a Claude Code subagent definition that **runs skills**. It doesn't replace them. Every agent:

1. Has frontmatter `name: sc-<role>` (matching the file), a `description` that says it's dispatched by `/design-lead`, and a `tools:` list fitted to its lane. Omit `tools:` only when the role needs connector tools (the designer, for Figma).
2. Starts every job with the shared routine in `agents/_common.md`: the ticket, `ux/project-context.md`, the engagement-guardrails gate, the team charter, final inputs, only the skills and chapters that apply.
3. Lists its jobs → skills → output paths. Those paths must match its lane in `skills/core/design-lead/resources/lanes.txt`.
4. Carries craft standards for the role, the exact self-check commands it runs before returning, and a **Never** list.
5. Ends with the return packet from the team charter, and nothing after it.

The checker is the exception: it starts from its protocol in `handoffs.md`, writes only `ux/team/checks/`, and returns a verdict. `tools/validate.sh` checks all of this, plus that every lane role has an agent and every rulebook chapter has all seven parts.
