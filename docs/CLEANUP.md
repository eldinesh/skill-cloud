# Cleanup — retiring ad-hoc skill installs

SkillCloud replaces the personal patchwork of community skill packs. Run this once, before or right after installing SkillCloud. Ten minutes, surgical, reversible.

## 1. Inventory what you have

```bash
claude plugin list                       # installed plugins + their marketplaces
ls ~/.claude/skills                      # personal skill folders
ls ~/.claude/plugins/marketplaces        # marketplace sources
```

## 2. Retire community packs SkillCloud now covers

Typical finds at our company, and the calls:

| Found | Call | Why |
|---|---|---|
| `ce@claude-essentials` | **Remove** | Engineering-leaning pack; the pieces we valued are rebuilt into SkillCloud |
| `designer-skills` plugins (design-research, design-ops, …) | **Remove** | SkillCloud's research/design bundles are the curated, pipeline-wired successors (adapted with attribution) |
| `ruflo` / `ruflo-core` | **Remove** (unless you use it for eng work) | Agent-orchestration platform, not UX skills |
| `figma@claude-plugins-official` | **Keep** | Complementary tooling (design↔code bridge), no overlap with SkillCloud skills |
| `gstack` personal skills | **Keep if you use them** | Eng/QA tool, no name collisions with SkillCloud |

```bash
claude plugin uninstall ce@claude-essentials
claude plugin marketplace remove claude-essentials
claude plugin uninstall design-ops@designer-skills      # repeat per installed designer-skills plugin
claude plugin marketplace remove designer-skills
claude plugin uninstall ruflo-core@ruflo
claude plugin marketplace remove ruflo
```

## 3. Delete stale CLAUDE.md blocks

Removed packs often leave instructions behind in `~/.claude/CLAUDE.md` that still tell Claude to use them — burning tokens on every session and failing when invoked.

**Known case on several machines here:** a "MANDATORY SKILL ACTIVATION SEQUENCE" block listing 25 `ce:*` skills while `ce@claude-essentials` is disabled or removed. Symptom: Claude "evaluates" skills every turn that it can never actually invoke.

How to spot the pattern: open `~/.claude/CLAUDE.md`, look for skill names that no longer appear in your session's skill list. Delete the whole block (in the known case: from `### Available Skills (Auto-Generated)` through `<!-- DYNAMIC_SKILLS_END -->`).

## 4. Personal skills that collide

If `setup.sh` reported `skipping '<name>' — something else already lives there`: look at the folder, keep your version (SkillCloud skips it) or adopt the company one (`rm -rf ~/.claude/skills/<name>` then re-run `setup.sh`).

## 5. Verify

Restart your Claude session, then:

- `/skillcloud doctor` → all PASS (offline git = WARN, fine)
- Skill list shows SkillCloud skills, no ghosts from removed packs
- Ask something like "what's our PTO policy?" → `/company-handbook` triggers

Done. One source of truth from here on.
