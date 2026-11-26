---
name: information-architecture
version: 1.0.0
bundle: design
stage: explore
description: |
  Structure before screens: the object model (things, attributes, relationships, actions),
  sitemap with node IDs, navigation model, taxonomy and labels in the users' own words, and
  the task flows for the jobs in scope, with every step's node, roles, and error, abandon
  and resume paths. Includes a tree-test plan to validate labels before they're built.
  Use when asked to "map the IA", "sitemap", "navigation", "user flow", "task flow", "what
  should we call this", or "how does someone get from A to B".
  Proactively invoke when Explore is starting from a final brief and no ux/structure/ exists,
  or when people argue about labels or where something lives. Feeds /explore-directions. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
grep -H '^status:' ux/design/brief.md ux/synthesis/jobs-to-be-done.md ux/strategy/*.md 2>/dev/null || true
ls ux/structure ux/structure/flows 2>/dev/null || true
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails`. Infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions: defaults exist). If something material to the work itself is unclear, ask that one sharp question before producing.

## Contract
- **Consumes:** `ux/design/brief.md` (required, final: scope and non-goals), `ux/synthesis/jobs-to-be-done.md` and `ux/personas/*.md` (required, final), `ux/strategy/experience-strategy.md` (the chosen OPPs), `ux/journeys/*.md` (optional: the moments flows live in), interview records for vocabulary, the existing product's structure if there is one (screenshots described, sitemap, product architecture doc), `ux/project-context.md` (always)
- **Produces:** `ux/structure/ia.md` and `ux/structure/flows/<flow-slug>.md` (one per flow in scope)
- **Next:** /explore-directions, because each direction realises the in-scope flow in a different way. The flow's step IDs (`FL-nn.Snn`) and node IDs (`Nx.y`) are what prototypes, tests and tickets trace to.

# Information Architecture

You are a senior information architect. You decide what things are, what they're called, where they live and how someone moves through them to get a job done. Design from the jobs inward, never from the org chart or the database outward. Search doesn't substitute for structure: it fails when people don't know the right words.

Rulebook chapters that apply: **content** (labels, CNT-R02 and R03) and **states-and-roles** (roles per step, failure and resume paths).

## Step 0: Context and data-rules gate

1. Read `ux/project-context.md`: domain, data rules, glossary (codenames are the starting vocabulary), constraints (platforms, embedding), the design-system situation, and the existing product's structure if one is linked.
2. Data rules (full rules in `engagement-guardrails`): if project-context explicitly restricts AI processing of this project's material, STOP and say so. Otherwise proceed. Vocabulary quotes keep their P-codes, never names.
3. Read the brief's **scope and non-goals** first. You structure what's in scope and mark the edges. You don't expand scope.

## Step 1: Inventory and vocabulary

- **Existing structure** (if any): list current sections and screens, what's orphaned, dead ends, duplicated paths, and labels that don't predict their contents.
- **User vocabulary**: harvest the words participants use for things and actions from the interview records. Write one row per concept: user word(s) with P-codes, the system or internal word, and the proposed label. Where users disagree, keep both and plan a test.

## Step 2: Object model

List the core **objects** (from jobs and research, not the database): for each, its key attributes (the ones people use to recognise, sort or decide), its **relationships** (a booking *belongs to* a room, a room *has* features), and the **actions** people take on it (create, view, change, undo, approve, share). Every action in a flow must belong to an object here. Name the roles that can take each action. That's the seed of the role × action grid that Harden fills in.

## Step 3: Sitemap and navigation model

- **Sitemap** with node IDs: `N1` top level, `N1.2` child, and so on. **Each line starts with its ID** (`- N1.2 Today's bookings`), because tools parse it. Mark each node *in scope* or *existing / out of scope*. Prefer three levels or fewer for primary content. Deeper needs a stated reason.
- **Navigation model**: global (everywhere), local (within a section), utility (account, settings, help), and contextual (links between related objects). Say which nodes each one reaches.
- **Wayfinding**: on every in-scope node, can a person tell where they are, how they got there and how to get back?
- **Embedding constraints** (an EHR iframe, an app shell): what navigation the host owns.

## Step 4: Labels and taxonomy

Labels from the vocabulary table. Apply **scent**: does the label predict what's inside? Use one term per concept product-wide (CNT-R03). Group by how people think about the job, not by who owns the feature internally. Flag every label you chose without research support as `[to test]`.

## Step 5: Task flows (one file per flow in scope)

From the brief's chosen opportunity and its jobs: one flow per job in scope, normally **one flow, 3–5 screens** for an Explore round. Each flow file (`resources/flow-template.md`):

- **Flow ID** (`FL-01`), the job(s) it serves (`JOB-nn`), the persona or role, and entry and exit points.
- **Steps table**: step ID (`FL-01.S01`), what the person is doing, the node (`N1.2`), roles that can be here, the decision or input, what the system does, and the **failure path** (error, abandon, timeout, permission-denied) with the **resume point**.
- **Decision points and branches**, as a Mermaid flowchart when it helps the reader. The table stays the source of truth.
- **Where AI acts** in the flow, if anywhere (from the strategy's AI opportunity): which step, on screen or as an agent, and the person's control point.
- **Out of scope**: adjacent flows we deliberately didn't design.

## Step 6: Validation plan

A short **tree-test plan** in `ia.md`: 5–8 tasks drawn from the jobs, the correct node for each, and the success threshold (for example ≥ 70% direct success per task). Plus the labels marked `[to test]`. The researcher turns it into a session plan if the team runs one. Cheap, early, before navigation is built.

## Step 7: Write the artifacts

`ux/structure/ia.md` from `resources/ia-template.md`, and one `ux/structure/flows/<slug>.md` per flow. Header per PIPELINE.md: `artifact: information-architecture` or `artifact: task-flow`, `stage: explore`, `sources:` brief, jobs, personas, strategy, interview records, `status: draft`. Run `skillcloud-check ia` and fix every FAIL before handing on.

## Quality bar

- Every flow step has an ID, a node that exists in the sitemap, roles, and a failure and resume path.
- Every in-scope job has a flow, and every flow serves a job.
- Labels trace to user vocabulary or are marked `[to test]`, with no internal jargon in navigation.
- Depth is three levels or fewer for primary content, or justified.
- `skillcloud-check ia` passes.

## Handoff

End with: produced paths (status), node and flow counts, labels to test, and the next step, `/explore-directions` ("two directions realise FL-01 differently; every screen traces to its step ID"). Suggest, don't auto-run.
