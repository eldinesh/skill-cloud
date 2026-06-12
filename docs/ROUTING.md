# Skill routing (optional, per project)

Claude routes to skills from their descriptions alone, but a routing block in the **project's** CLAUDE.md makes it decisive — especially mid-conversation, when a transcript gets pasted or someone asks "does this design work?". Paste the block below into the client project's `CLAUDE.md` (create the file if the project has none). One block per project; edit freely.

```markdown
## Skill routing (SkillCloud)

When the user's request matches a skill below, invoke it via the Skill tool. When in doubt, invoke the skill — a structured workflow beats an ad-hoc answer.

- New client project, "can I use AI for this client", AI-tier questions → /engagement-guardrails
- "Where are we", "what's next", run several steps end to end → /ux-pipeline
- Planning a study, "what method should we use" → /research-plan
- Writing interview questions → /interview-guide
- A transcript or session notes appear → /interview-synthesis
- "Cluster these findings", "what themes do we have" → /affinity-mapping
- "What do we know across studies" → /cross-study-synthesis
- "What jobs are users hiring this for" → /jobs-to-be-done
- "Make personas", "who are our users" → /persona
- "Map the journey", end-to-end experience questions → /journey-map
- "Plan the usability test" → /usability-test-plan
- "Write up the research", stakeholder readout → /insight-report
- Starting design from research, "write the brief" → /design-brief
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

Company policy and client-data rules always apply: the engagement AI tier in `ux/project-context.md` gates everything (see /engagement-guardrails).
