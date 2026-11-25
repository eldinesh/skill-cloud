# Koru 3.0: SkillCloud becomes the Koru plugin

This branch turns SkillCloud into the Koru 3.0 delivery plugin for Claude Code (terminal and desktop app). The design source is **Koru delivery system: design spec v2**. The playbook submission links here.

## What gets built on this branch

| Part | What it is | Status |
|---|---|---|
| Plugin manifest | `.claude-plugin/plugin.json`, versioned, private marketplace | Planned |
| Commands | `/koru start`, `where`, `join`, `note`, `decide`, `gate`, `share`, `ship`, `board` | Planned |
| Stage skills | Frame, Explore, Harden, Ship skills (below) | Planned |
| Checkers | research, direction, harden and spec checker subagents: fresh context, read-only, list issues, never fix | Planned |
| Hooks | Tier 1 rules: no AI sign-off, consent before AI sees research, exact quotes, provenance stamp, client limits on Figma and Jira, Definition of Ready before tickets | Planned |
| Output styles | Koru voice (plain language, forced) and Coach (opt-in, fades) | Planned |
| Project graph | Markdown cards with fixed headers, `koru index` to generate the board, decision log, trace and client page | Planned |
| Evals | Planted-defect fixtures each checker must catch, run in CI with `tools/validate.sh` | Planned |

## Skills: reused and new

| Stage | Existing SkillCloud skills reused | New |
|---|---|---|
| Frame | research-plan, interview-guide, interview-synthesis, affinity-mapping, cross-study-synthesis, jobs-to-be-done, persona, journey-map, sense-shape-steer (Sense), engagement-guardrails | intake sort, TRACES prep and recap, tail report, conflict weighing, confidence signals, design-system audit |
| Explore | design-brief, sense-shape-steer (Shape), usability-test-plan, design-critique, heuristic-evaluation | context pack and manifest, seed and widen, hypothesis and assumption map, failure scenarios, scoped prototype build, visual track |
| Harden | accessibility-audit (extend to WCAG 2.2), ux-writing, design-rationale, sense-shape-steer (Steer) | state matrix with taxonomy, slow-motion walk, element classification, trust audit |
| Ship | component-spec, handoff-spec, design-qa-checklist, figma-hygiene | tickets from the state matrix, ambiguity check, consistency pass, deliverable packaging and hosted links |
| Any stage | ux-pipeline, skillcloud | catch-up, join, decide, failure capture, coach |

## Deliverables

Each project picks one or more: Figma frames, a standalone HTML prototype, full front-end code with tickets. Any of them can be published to Koru's hosted service as a password-protected link, so clients get links rather than files.
