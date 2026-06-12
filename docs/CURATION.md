# Curation — how skills get in, stay in, or leave

SkillCloud stays an asset only if it stays curated. This rubric is the gate for every skill — adapted or original, at v1 or proposed next year.

## The rubric (all seven, or it doesn't ship)

1. **Serves a priority workflow.** Research, design craft, or core company function. "Neat" is not a workflow.
2. **Trigger-precise description.** Real phrases people say + an observable proactive condition. Tested in live sessions: it fires when it should and stays quiet when it shouldn't.
3. **Templates and examples, not just advice.** A skill that only philosophizes is a blog post.
4. **Pipeline-compatible.** Reads `ux/project-context.md`, declares its Contract (Consumes / Produces / Next), writes standard artifacts to standard paths, hands off to the next step. See `docs/PIPELINE.md`.
5. **Guardrails-compatible.** Honors engagement tiers; de-identification habits wherever people data flows; synthetic examples only.
6. **Non-overlapping.** One skill per job. A near-duplicate must merge into or replace the incumbent — never sit beside it.
7. **Earns its context cost.** Every installed skill's description loads into every session (~100 tokens). If it won't be used most weeks by its bundle's audience, it doesn't earn the rent.

## Selection policy

Best-of-breed wins regardless of source — quality first. Adapted skills are rebuilt to this spec, never vendored as-is, and recorded in `ATTRIBUTIONS.md` (source, license, what changed).

## Bundle caps

core ≤ 6 · research ≤ 12 · design ≤ 12. At the cap: add one, remove one. The cap is the feature — it's what keeps this from becoming the pile it replaced.

## Lifecycle

1. **Proposal** — issue or PR (see `docs/CONTRIBUTING.md`), stating the workflow served and the rubric self-assessment.
2. **Champion review** — the role champion scores it against the rubric; owner breaks ties.
3. **Pilot** — used in at least one real project before it merges. Trigger precision verified there.
4. **Merge + release** — `VERSION` bump + `CHANGELOG` entry; the fleet updates via the upgrade prompt.
5. **Quarterly review** — champions walk the catalog: Would anyone miss it? Has upstream source improved? Are descriptions still trigger-precise? Prune without sentiment; record removals in the CHANGELOG.
