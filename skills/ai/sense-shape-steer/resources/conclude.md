# CONCLUDE — Day 5 playbook (1.5 h, collaborative)

*Stop designing, start committing.* Bring the defined opportunity (SENSE), the designed experience (SHAPE), and the success criteria (STEER) together into a build-ready blueprint engineering can act on — aligned, realistic, owned. **Goal: finalize a prioritized, feasible, and owned plan to move the AI experience into build.** Not prioritized = accidental scope.

## The four parts

### 1. Prioritize for Build (MVP vs Later)
Make deliberate scope decisions.
- **Decide:** What is Phase 1 (MVP)? What is Phase 2? What is deferred?
- **Clarify:** must-haves vs enhancements · high-risk components that require phased rollout · dependencies that influence sequencing.
- **Output: prioritized implementation roadmap.**

### 2. Validate Build Feasibility
Pressure-test everything through a delivery lens.
- **Review:** technical feasibility · data readiness and integration complexity · model availability or constraints · instrumentation required for evaluation · timeline realism.
- *If something cannot be built as imagined, adjust now — not mid-sprint.*
- **Output: feasibility-aligned scope and timeline.**

### 3. Assign End-to-End Ownership
Define clearly:
- **Build Ownership** — who leads implementation? who manages sprint execution?
- **Experience Ownership** — who owns the AI feature as a product capability?
- **Quality & Evaluation Ownership** — who monitors accuracy, fairness, performance? who reviews high-risk outputs?
- **Operational Ownership** — who manages deployment? who handles incidents or escalations?
- **Iteration Ownership** — who decides when updates, retraining, or adjustments happen?

### 4. Document Open Risks & Validation Plan
Some uncertainty will remain — that's expected; uncertainty doesn't disappear, it gets managed.
- **Capture:** high-risk failure scenarios (and success scenarios worth watching) · assumptions that must be validated during build · early warning signals to monitor post-launch · pilot checkpoints.

## What you walk away with (the blueprint's five sections)

1. **Defined AI Experience Scope** — clear articulation of what the AI will and will not do; explicit boundaries between AI responsibility and human judgment.
2. **Validated AI Concepts & User Flows** — key user journeys with AI touchpoints; trigger points, responses, and fallback behaviors.
3. **Success & Quality Criteria (STEER)** — agreed definition of "good enough"; accuracy, fairness, performance, and risk thresholds; clear indicators of failure.
4. **Reference Scenarios & Examples** — representative examples of acceptable *and unacceptable* AI outputs; known edge cases and high-risk scenarios.
5. **Assumptions, Risks & Open Questions** — documented data, model, and dependency assumptions; risks to validate during build or pilot.

## What happens immediately after

1. **Build Sprint begins** — engineering implements the prioritized AI experience; instrumentation for metrics and feedback is planned early (per STEER mistake #6: never retrofit monitoring).
2. **Design supports implementation** — design assets and behavior clarifications; support for edge cases and real-world constraints.
3. **Demo & review** — validate built behavior against sprint decisions; confirm success criteria and guardrails hold in practice.

That's the shift: with clear priorities, defined guardrails, and instrumentation in place, AI stops being an idea in a slide deck and becomes a system with intent, accountability, and measurable progress — the difference between experimenting with AI and engineering it with confidence.

## Artifact
`ux/sprint/blueprint.md` — the five sections above plus the roadmap, feasibility notes, and the ownership table. Standard header; `sources:` = opportunity-statement, pattern-decisions, storyboard, touchpoint-map, steer-plan. This is the declared input for `/design-brief` when design work continues in the pipeline, and the handoff document for engineering.
