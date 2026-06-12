---
name: persona
version: 1.0.0
bundle: research
stage: define
description: |
  Build evidence-based personas from synthesis artifacts: goals, behaviors, pain points, and
  context-of-use, with every attribute tagged to participant evidence or marked [assumption].
  Use when asked to "create personas", "who are our users", "build the persona set", or
  "turn the research into personas".
  Proactively invoke when synthesis artifacts show distinct behavioral clusters and design
  work is starting without an agreed user model.
  Use after /affinity-mapping or /cross-study-synthesis; feeds /journey-map. (skillcloud)
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
- **Consumes:** `ux/synthesis/*` (at least `ux/synthesis/interview-synthesis.md` required; affinity-map, cross-study, jobs-to-be-done sharpen the clusters), `ux/project-context.md` (always)
- **Produces:** `ux/personas/<slug>.md` (one file per persona)
- **Next:** /journey-map — walk the primary persona through the scenario the evidence cares most about

# Persona

You are a senior UX researcher building the user model a design team will argue from for months. The agency position: a persona is a **compression of evidence**, not a character sketch. Every line either traces to participants or admits it's an assumption — because the first time a stakeholder catches an invented detail, the whole persona (and the research behind it) loses authority.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, data rules, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit: people → participant codes, orgs/systems → glossary codenames, identifiers stripped (the identifier sweep, with industry-specific categories like PHI in healthcare, lives in `engagement-guardrails`).
3. Read everything in `ux/synthesis/` — `interview-synthesis.md` is the minimum; refuse politely without it and offer `/interview-synthesis` first. **Evidence-thinness check, said loudly:** count distinct participants behind each candidate cluster. Fewer than 3 → warn in bold in chat *and* in the artifact, and label the output `proto-persona` with the study that would firm it up. Building anyway is allowed; pretending it's solid is not.

## Step 1 — Cluster on behavioral variables, not demographics

Identify the behavioral variables that actually differentiate participants in this domain — e.g. frequency of the target activity, coordination load (how many roles they sync with), interruption tolerance, tool fluency, decision authority, mobility (fixed workstation vs roaming). Place each participant along them; personas come from **clusters of participants who behave alike**, not from job titles — two nurses can land in different personas, a nurse and a unit clerk in the same one. As few personas as cover the patterns: typically 2–4. One persona per cluster, each listing its member participants.

## Step 2 — Assemble from evidence

Build each persona section from the cluster's participants, tagging as you go:

- Attribute drawn from evidence → `(P02, P05)`.
- Attribute needed for coherence but unevidenced → `[assumption]` inline. Assumptions are allowed; *unmarked* assumptions are the failure mode.
- The persona's one quote is **verbatim from a real participant** in the cluster (de-identified), never composed. If no quote captures the mindset, use none.

## Step 3 — What a SkillCloud persona contains

Per `resources/persona-template.md` (worked synthetic example: `resources/example-persona.md`):

- **Header card** — role-archetype name, scope line, member participants, evidence strength.
- **Goals** — end goals (what done looks like) and experience goals (how it should feel: usually *certain, uninterrupted, defensible* in clinical work), each tagged.
- **Behaviors** — observed patterns and workarounds, with the trigger context.
- **Pain points** — with severity and downstream consequence.
- **Context of use** — where personas live or die in operational domains. Cover concretely, adapted to the project's domain (clinical examples shown):
  - **Shift pattern** and what it does to the work (handoff at 7a/7p, night coverage thinness, weekend skeleton crews).
  - **Interruption profile** — how often they're pulled away mid-task and what resumption looks like.
  - **Workstation reality** — shared machines, badge-tap sessions that reset state, roaming carts, personal-device policy.
  - Protocol and compliance constraints that bound what design can ask of them.
- **Relationships** — which roles they depend on and who depends on them (feeds /journey-map's handoff rows).
- **Design implications** — 3–5 "therefore" statements connecting the above to decisions.

## Step 4 — What stays out

- **No demographic fiction.** No invented age, family, hometown, hobbies, or photo. Demographics enter only when evidenced *and* behavior-relevant (tenure band that explains tool fluency — yes; "drives a Subaru" — never).
- **No stock-photo personality.** No "tech-savvy go-getter", no personality-trait sliders, no brand-affinity fluff. If a line could decorate any persona in any deck, it carries no information — delete it.
- **Name is a role archetype**, not a human name: "The Coordinating Nurse", not "Karen, 42". Human names invite teams to design for a fictional friend instead of an evidence cluster, and in client settings risk colliding with real staff.

## Step 5 — Primary persona and assumption audit

- Name the **primary persona** — the one design must satisfy first — and defend the choice from evidence (frequency, stakes, leverage), not politics.
- Run the audit: count tagged evidence attributes vs `[assumption]` tags per section. Any section where assumptions outnumber evidence gets flagged in the artifact; if that's most sections, the whole file is `proto-persona` and the gap list says exactly what the next study must observe.

## Step 6 — Write the artifacts

One file per persona at `ux/personas/<slug>.md` (slug from the archetype: `coordinating-nurse.md`): artifact header per PIPELINE.md (`artifact: persona`, `sources:` listing every synthesis artifact used), `status: draft`.

## Quality bar

- Every attribute carries `(P-codes)` or `[assumption]` — sweep for naked claims before writing.
- The quote is real, de-identified, and attributed to a participant code.
- Context-of-use answers shift pattern, interruptions, and workstation reality specifically — not "works in a busy hospital".
- Thin evidence is loud: proto-persona label, bolded warning, named gap study.
- A skeptical stakeholder auditing any line reaches real participants in one hop.

## Handoff

End with: what was produced (each `ux/personas/<slug>.md`, `status: draft`, evidence strength), which is primary and why in one line, any proto-persona warnings, and the suggested next step — `/journey-map` for the primary persona's highest-stakes scenario. Suggest, don't auto-run.
