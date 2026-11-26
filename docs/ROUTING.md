# Skill routing (optional, per project)

Claude routes to skills from their descriptions alone, but a routing block in the **project's** CLAUDE.md makes it decisive — especially mid-conversation, when a transcript gets pasted or someone asks "does this design work?". Paste the block below into the client project's `CLAUDE.md` (create the file if the project has none). One block per project; edit freely.

```markdown
## Skill routing (SkillCloud)

When the user's request matches a skill below, invoke it via the Skill tool. When in doubt, invoke the skill — a structured workflow beats an ad-hoc answer.

- New project setup, "can I use AI on this material", data-rules questions → /engagement-guardrails
- "Where are we", "what's next", "run the team", take a project to a stage, sign off, overrule, record a decision, publish finals → /design-lead
- Set up or change the project's rules, "what are the rules for X" → /project-rulebook
- A requirement or discovery call coming up, or call notes pasted → /requirement-call
- "What is X", explain a technical or domain topic simply, jargon decoding → /topic-deep-dive
- An AI feature/opportunity whose role, risks, or success criteria aren't defined; "run an AI design sprint", "scope this AI feature", "teach me sense-shape-steer" → /sense-shape-steer
- Planning a study, "what method should we use" → /research-plan
- Writing interview questions → /interview-guide
- A transcript or session notes appear → /interview-synthesis
- "Cluster these findings", "what themes do we have" → /affinity-mapping
- "What do we know across studies" → /cross-study-synthesis
- "What jobs are users hiring this for" → /jobs-to-be-done
- "What should we build", prioritise opportunities, design principles, competitive scan → /experience-strategy
- "Make personas", "who are our users" → /persona
- "Map the journey", end-to-end experience questions → /journey-map
- "Plan the usability test" → /usability-test-plan
- "Write up the research", stakeholder readout → /insight-report
- Starting design from research, "write the brief", "frame this" → /design-brief
- Sitemap, navigation, labels, task flows → /information-architecture
- "Explore directions", "two concepts", "prototype this", "make it look real" → /explore-directions
- "Harden this", missing states, rulebook check, feasibility, edge cases → /harden-review
- "Build it", designs as code, HTML deliverable → /ship-code
- "Write the tickets", user stories, handoff note, "put this in Jira" → /ship-tickets
- "Critique this", "does this design work" → /design-critique
- Systematic usability pass over screens → /heuristic-evaluation
- "Is this accessible", WCAG/508 questions → /accessibility-audit
- Specifying a component → /component-spec
- Microcopy, error messages, labels → /ux-writing
- "Why did we decide X", decision records → /design-rationale
- "Prep the handoff", dev-ready specs → /handoff-spec
- "Check the build against the design" → /design-qa-checklist
- "Organize the Figma file", file conventions → /figma-hygiene
- HR, PTO, expenses, company policy questions → /company-handbook
```

Company policy and data rules always apply: the project's `ux/project-context.md` gates everything (see /engagement-guardrails).
