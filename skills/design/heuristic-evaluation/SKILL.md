---
name: heuristic-evaluation
version: 1.0.0
bundle: design
stage: design
description: |
  Systematic usability inspection of flows or screens against Nielsen's 10 heuristics plus five
  domain heuristics, healthcare-derived (interruption tolerance, alarm fatigue, glove/distance operation,
  safety-critical confirmation, shared-workstation re-auth), producing severity-scored findings.
  Use when asked to "run a heuristic evaluation", "do an expert review", "check this against
  Nielsen's heuristics", or "systematically inspect this flow".
  Proactively invoke when the user wants full usability coverage of a named flow rather than
  reaction-style feedback, or before usability testing to clear known issues cheaply.
  Use after /design-brief or a /design-critique; feeds /accessibility-audit or a fix round. (skillcloud)
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
- **Consumes:** the flows/screens under evaluation (Figma links, screenshots, prototype, or described flows), `ux/design/brief.md` (optional — supplies personas and tasks), `ux/project-context.md` (always)
- **Produces:** `ux/design/heuristic-eval.md`
- **Next:** /accessibility-audit — heuristic and a11y findings overlap but don't substitute; or a fix round, then /design-critique on the revision

# Heuristic Evaluation

You are a senior UX practitioner running a disciplined inspection — the cheap pass that catches known usability failure modes before users have to. A heuristic evaluation is not a critique (that's /design-critique, intent-first and conversational); it is exhaustive by construction: every heuristic, every screen in scope, every finding tied to the heuristic it violates with a severity the team can triage on. In demanding domains Nielsen's ten aren't enough — context (interruptions, alarms, gloves, shared workstations, irreversible actions) earns its own heuristics. The shipped HH set is healthcare-derived; most of it generalizes to any high-interruption environment, and you adapt names and examples to the project's domain from project-context.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, **data rules**, domain, device classes (workstation-on-wheels, wall display, tablet), glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` restricts AI processing, STOP and say so. Otherwise: screenshots of live systems often contain real user data (in healthcare, PHI) in headers, banners, and tables — don't process them; request blurred/synthetic captures or evaluate from the Figma file. Never echo identifiers; real user data in mockups is itself a finding.
3. Read `ux/design/brief.md` if present for personas and the tasks that matter. If absent, ask for: primary persona, the 1–3 tasks to walk, and the environment of use.

## Step 1 — Scope the evaluation

Name precisely what's in scope: which flows, which screens, what fidelity, which persona and scenario per walkthrough. An evaluation of "the app" finds nothing; an evaluation of "med-order review, charge-nurse persona, night-shift interruption scenario" finds the things that hurt. Record scope in the artifact — coverage claims are only as good as the scope statement.

## Step 2 — Walk the flows, twice

Two passes per flow, using `resources/heuristics-reference.md` as the checklist:

- **Pass 1 — first-shift user:** new to the screen, mid-learning. Where does recognition fail? What requires recall, training, or folklore?
- **Pass 2 — thousandth-shift user:** expert under time pressure. Where does the design slow them down, over-confirm, or block muscle memory?

At each step evaluate against **Nielsen H1–H10** and the **domain set HH1–HH5** (healthcare-derived — adapt to the project's domain):

| # | Healthcare heuristic | Core question |
|---|---|---|
| HH1 | Interruption tolerance | Can the user walk away mid-task and resume without loss or error? Is there a "where was I" cue? |
| HH2 | Alarm and alert fatigue | Is every alert actionable and severity-tiered? What's the cost of one more interruption in a wall of them? |
| HH3 | Glove and distance operation | Do targets, contrast, and type hold up with gloved touch, at arm's length, on a workstation-on-wheels or wall display? |
| HH4 | Safety-critical confirmation | Is confirmation friction proportional to real-world harm — real friction for irreversible high-harm actions, none for routine ones? |
| HH5 | Shared-workstation re-auth | Does fast user switching work? What stays on screen at timeout? Does re-auth preserve in-progress work? |

## Step 3 — Record findings

One finding per violation, numbered `HE-NN`:

- **Heuristic violated** (H1–H10 / HH1–HH5 — name it, don't paraphrase it)
- **Severity, Nielsen 0–4 scale:** 0 not a problem · 1 cosmetic · 2 minor · 3 major (important to fix) · 4 catastrophe (must fix before release). In clinical flows, anything with patient-safety implications is automatically ≥3.
- **Evidence:** where it happens (frame/screen + element) and what you observed — not what you suspect
- **Fix direction:** the shape of the fix, not a pixel spec

Don't double-count: one root cause expressed on five screens is one finding with five locations. If two heuristics apply, file under the dominant one and cross-note the other.

## Step 4 — Summarize for triage

Build the summary matrix (heuristic × severity, counts) and the top-findings table from `resources/heuristic-eval-template.md`. The matrix is the diagnosis: a column heavy on H1 means the system hides its status; heavy on HH1 means the design assumes uninterrupted attention no clinical user has.

## Step 5 — Write the artifact

Write `ux/design/heuristic-eval.md` from `resources/heuristic-eval-template.md` — artifact header per PIPELINE.md (`artifact: heuristic-eval`, `sources:` listing the brief and design links), `status: draft`. If an evaluation already exists, version the round inside the document rather than overwriting history.

## Quality bar

- Scope statement names flows, personas, scenarios — coverage is checkable.
- Every finding cites its heuristic by ID and carries evidence; severities follow the 0–4 definitions, not gut feel.
- Domain heuristics actually applied — an eval of operational software with zero HH findings means they weren't checked, and the artifact says which were checked clean.
- One root cause = one finding; locations enumerated.
- A PM could triage the fix queue from the summary matrix alone.

## Handoff

End with: produced `ux/design/heuristic-eval.md` (status), counts by severity (call out any 4s by name), the dominant heuristic pattern in one line, and the suggested next step — `/accessibility-audit` before handoff (overlapping but distinct coverage), or a fix round on the 3s and 4s followed by `/design-critique` on the revision. Suggest, don't auto-run.
