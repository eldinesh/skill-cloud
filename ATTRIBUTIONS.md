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
| ux-pipeline | — | original SkillCloud work | — | — |

**System patterns:** the self-update + snooze mechanism, description routing grammar, and orchestrator pattern are closely modeled on [gstack](https://github.com/garrytan/gstack) — reimplemented in our own shell; no code vendored.

## License notes

MIT requires preserving copyright notices for adapted material:

- designer-skills — `MIT License — Copyright (c) 2026 MC Dean`
- design-skills — `MIT License — Copyright (c) 2026 Carlos C.`

This repository itself is a private, internal company asset — not for external distribution.
