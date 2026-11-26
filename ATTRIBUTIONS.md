# Attributions

Per-skill provenance. Selection is quality-first; licenses are recorded here for diligence. Adapted skills were rebuilt to SkillCloud's pipeline contracts (see `docs/PIPELINE.md`) — none are vendored as-is.

| Skill | Based on | Source | License | What we changed |
|---|---|---|---|---|
| interview-guide | interview-script | [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills) | MIT | Rebuilt to pipeline contracts; healthcare consent/etiquette; tier-aware recording consent; depth extended |
| affinity-mapping | affinity-diagram | Owl-Listener/designer-skills | MIT | Same + evidence-unit method, outlier handling |
| jobs-to-be-done | jobs-to-be-done | Owl-Listener/designer-skills | MIT | Same + forces analysis, job map, testable outcomes |
| persona | user-persona | Owl-Listener/designer-skills | MIT | Same + evidence tagging per attribute, anti-fiction rules, healthcare context-of-use |
| journey-map | journey-map | Owl-Listener/designer-skills | MIT | Same + per-cell evidence, handoffs as first-class rows |
| usability-test-plan | usability-test-plan | Owl-Listener/designer-skills | MIT | Same + risk→task mapping, clinical logistics, synthetic-data rule |
| design-brief | design-brief | Owl-Listener/designer-skills + [cuellarfr/design-skills](https://github.com/cuellarfr/design-skills) | MIT | Rebuilt as the research→design bridge (consumes insight-report) |
| design-critique | design-critique | Owl-Listener/designer-skills + cuellarfr/design-skills | MIT | Intent-first method, severity ratings, PHI-screenshot gate |
| heuristic-evaluation | heuristic-evaluation | Owl-Listener/designer-skills | MIT | + healthcare heuristics HH1–HH5, severity floors for safety |
| accessibility-audit | accessibility-audit | Owl-Listener/designer-skills + cuellarfr/design-skills | MIT | WCAG 2.2 AA/508 focus, design-vs-build split, healthcare emphases |
| component-spec | component-spec | Owl-Listener/designer-skills | MIT | + client-system triage, token discipline, mandatory states |
| ux-writing | ux-writing | Owl-Listener/designer-skills + cuellarfr/design-skills | MIT | + register discipline (patient/clinician), SME-review queue |
| design-rationale | design-rationale | Owl-Listener/designer-skills | MIT | + DEC-NN decision log, supersede-never-erase |
| handoff-spec | handoff-spec | Owl-Listener/designer-skills | MIT | Figma-fluent, state matrix, a11y annotations as acceptance criteria |
| design-qa-checklist | design-qa-checklist | Owl-Listener/designer-skills | MIT | + evidence-per-check, spec-gap routing, PHI-in-staging warning |
| research-plan | — | original SkillCloud work | — | — |
| interview-synthesis | — (structure informed by summarize-interview, Owl-Listener) | original SkillCloud work | MIT (informing source) | De-identification-on-intake pipeline is ours |
| cross-study-synthesis | — | original SkillCloud work | — | — |
| insight-report | — | original SkillCloud work | — | — |
| figma-hygiene | — | original SkillCloud work | — | — |
| engagement-guardrails | — | original SkillCloud work | — | — |
| company-handbook | — | original SkillCloud work | — | — |
| skillcloud | — | original SkillCloud work | — | — |
| design-lead | company design-ops delivery system; sidequest ticket board | original; [sidequest](https://github.com/Eigenwise/eigenwise-toolshed) for board concepts | MIT (sidequest) | stages, handoff cards, naming and sign-off follow the company standard; board concepts (plain-file tickets, afk/hitl, frontier, "For you", role routing) reimplemented in shell, no code vendored |
| project-rulebook | company design-ops rulebook format | original SkillCloud work | — | nine default chapters written for SkillCloud; format (purpose, rules, patterns, decisions, checks, AI instructions, owner) per the company standard |
| requirement-call | company UX research training (TRACES) | original SkillCloud work | — | TRACES, call scenarios and the rule "less context, more listening" encoded as prep and recap workflow |
| experience-strategy | designer-skills: opportunity-framework, design-principles, competitive-analysis | [designer-skills](https://github.com/Owl-Listener/designer-skills) | MIT | principle qualities and sizing lenses adapted; insight-to-direction path from company research training; rebuilt to spec |
| information-architecture | designer-skills: information-architecture | [designer-skills](https://github.com/Owl-Listener/designer-skills) | MIT | IA heuristics adapted; object model, node/flow IDs, failure paths, tool check original |
| explore-directions | designer-skills: parallel-concepts | [designer-skills](https://github.com/Owl-Listener/designer-skills) | MIT | behavioural-distinctness axes adapted; cards, prototypes, review bar, two design-system situations original |
| harden-review | designer-skills: state-machine | [designer-skills](https://github.com/Owl-Listener/designer-skills) | MIT | explicit states/events/guards framing adapted; matrix, rulebook check, feasibility original |
| ship-code | — | original SkillCloud work | — | scaffold uses React, Vite, Playwright, axe-core, ESLint as dependencies (not vendored) |
| ship-tickets | company design-ops ticket template | original SkillCloud work | — | — |
| agents (sc-*) | — | original SkillCloud work | — | — |

**System patterns:** the self-update + snooze mechanism, description routing grammar, and orchestrator pattern are closely modeled on [gstack](https://github.com/garrytan/gstack) — reimplemented in our own shell; no code vendored.

## License notes

MIT requires preserving copyright notices for adapted material:

- designer-skills — `MIT License — Copyright (c) 2026 MC Dean`
- design-skills — `MIT License — Copyright (c) 2026 Carlos C.`

This repository itself is a private, internal company asset — not for external distribution.
