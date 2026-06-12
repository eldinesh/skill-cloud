# Benchmark results — v0.9.0 (2026-06-12)

What was actually tested before release, and how. Two layers: **mechanical** (scripted, objective) and **behavioral** (skills executed live against the synthetic fixtures by a fresh-session model following the SKILL.md files as written).

## Mechanical (scripted)

| Check | Method | Result |
|---|---|---|
| Structure of all 24 skills | `tools/validate.sh` (frontmatter, name==folder, routing grammar, Contract blocks, guardrail refs, PHI tripwires) | PASS — 24/24 |
| Install / role switch / prune | sandboxed `./setup` (`SKILLCLOUD_*` env overrides) | PASS — 24 linked on `both`; switch to `researcher` prunes exactly the 10 design skills |
| Self-update contract | `skillcloud-update-check` with test remote | PASS — prompts on newer; snooze honored; `--force` overrides; kill-switch silences; no downgrade nag; `JUST_UPGRADED` fires once then clears |
| CLAUDE.md section | sandboxed install/refresh/uninstall | PASS — added on consent, refreshed on role switch, stripped on uninstall |
| Repo-shadow guard | clone-as-`skillcloud` collision | PASS — skipped with explicit fix message |

## Behavioral (live execution on fixtures)

Fixture: synthetic healthcare client (codename BEACON, tier **limited**), 3 interview transcripts with **planted identifiers** (names, MRN, city, phone, exact date — list in `fixtures/README.md`).

| Test | Result |
|---|---|
| `interview-synthesis` on 3 transcripts | PASS — produced P01–P03 + synthesis at contract paths with artifact headers; themes carry evidence lines; single-source finding correctly labeled "signal" not theme |
| **De-identification leak grep** over every produced artifact | **PASS — zero hits** on all planted identifiers; people → P-codes, orgs/systems → glossary codenames, date/MRN/phone stripped or generalized |
| `affinity-mapping` on the records | PASS — 4 strong + 1 moderate clusters named as claims with P-codes, tension flagged, 2 outliers classified; correct next-step handoff (/jobs-to-be-done, since single study) |
| Chain integrity | PASS — every artifact's `sources:` traces to its upstream files; handoffs name the right next skill; nothing auto-ran |
| Negative: **prohibited** tier | PASS — Step 0 gate unambiguous; executor refuses to process the transcript and points to engagement-guardrails |
| Negative: `design-brief` with missing insight-report | PASS — Step 0.3 explicitly handles it: name the gap, offer /insight-report, or proceed tagging claims `[unvalidated]` |
| Real Skill-tool invocation (`skillcloud` → status) | PASS — skill resolves through `~/.claude/skills` symlink, preamble update-check runs against live origin, status matches `./setup` output |

## Not yet tested (honest gaps — pilot's job, sheet in SCENARIOS.md)

- Live trigger precision in natural conversation for most skills (descriptions follow the tested grammar, but only the pilot proves routing in the wild).
- 18 of 24 skills not yet behaviorally executed end-to-end (the spine — guardrails, synthesis, clustering, the orchestrator's inputs — is what this round covered).
- Cowork execution of preamble bash (architecture says it works; verify on one Cowork machine during pilot).
- The full upgrade prompt UX in a real session (mechanics proven; the AskUserQuestion flow needs one live VERSION bump, which the first real release provides).

Re-run this benchmark on any release that touches the spine: fixtures are in `tests/fixtures/`, expected behaviors above.
