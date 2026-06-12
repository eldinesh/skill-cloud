# Contributing

Anyone at the company can propose a skill, a fix, or a removal. Champions review; owner or champion merges.

## Propose a change

1. Clone, branch: `git checkout -b skill/<name>` (or `fix/<name>`).
2. New skill? Copy an existing folder under `skills/<bundle>/` as your template and follow `docs/PIPELINE.md` — frontmatter grammar, verbatim preamble, Step 0 gate, Contract block, Handoff. Match the depth of `skills/research/interview-synthesis/` — that's the bar.
3. Resources: templates/checklists with **fully synthetic** examples. No client names, no real people, nothing PHI-shaped.
4. Run `./tools/validate.sh` — must be green.
5. Open a PR with this checklist filled in:

```markdown
## Skill PR checklist
- [ ] Trigger phrases tested in a real session (fires when it should, silent when it shouldn't)
- [ ] Contract block with real artifact paths (Consumes / Produces / Next)
- [ ] Reads ux/project-context.md; engagement-guardrails referenced where client material flows
- [ ] Examples fully synthetic — no client material anywhere
- [ ] tools/validate.sh green
- [ ] ATTRIBUTIONS.md updated (if adapted from an external source)
- [ ] Rubric self-assessment vs docs/CURATION.md (one line per criterion)
```

6. Your role champion reviews against `docs/CURATION.md`. Pilot in one real project if it's a new skill. Then it merges.

## Release ritual (maintainers)

- Bump `VERSION` and add the `CHANGELOG.md` entry **in the same commit** — the upgrade prompt reads both.
- Everyone gets the prompt within ~24h of their next skill use; "what's new" comes from your CHANGELOG entry, so write it for the reader, not the diff.
- Tag releases `v<VERSION>`; CI builds per-skill zips for claude.ai users.
