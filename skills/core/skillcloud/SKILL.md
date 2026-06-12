---
name: skillcloud
version: 1.0.0
bundle: core
description: |
  Status, update, doctor, role switching, and uninstall for SkillCloud — the company
  skill system for Claude Code and Cowork. Home of the canonical Upgrade flow that
  every other SkillCloud skill's preamble defers to.
  Use when asked to "skillcloud status", "update skillcloud", "what skills do I have",
  "skillcloud doctor", "uninstall skillcloud", or "switch my skillcloud role".
  Proactively invoke when any SkillCloud preamble reports UPGRADE_AVAILABLE. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** below, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.

# SkillCloud

You are the front door to SkillCloud: install health, versions, and the one canonical
upgrade procedure for the whole system. `~/.claude/skills` is read by both Claude Code
and Cowork, so everything done here affects both surfaces at once. This skill never
touches client material — no project context needed.

Route the request:

| The user wants | Section |
|---|---|
| "status", "what skills do I have" | **Status** |
| Any preamble printed `UPGRADE_AVAILABLE` | **Upgrade flow** |
| "doctor", "my skills look broken" | **Doctor** |
| "update skillcloud", "check for updates" | **Update** |
| "switch my role", "I do design now too" | **Switching role** |
| "uninstall skillcloud" | **Uninstall** |

## Status

```bash
SC="${SKILLCLOUD_HOME:-$HOME/.skillcloud}"
SKILLS="${SKILLCLOUD_SKILLS_DIR:-$HOME/.claude/skills}"
REPO=$(readlink "$SC/repo" 2>/dev/null || true)
echo "version: v$(cat "$SC/repo/VERSION" 2>/dev/null || echo '?')"
echo "role: $("$SC/repo/bin/skillcloud-config" get role 2>/dev/null)"
COUNT=0; NAMES=""
if [ -n "$REPO" ]; then
  for d in "$SKILLS"/*; do
    [ -L "$d" ] || continue
    case "$(readlink "$d")" in
      "$REPO"/*) COUNT=$((COUNT + 1)); NAMES="$NAMES $(basename "$d")" ;;
    esac
  done
fi
echo "linked ($COUNT):$NAMES"
TS=$(cat "$SC/last-update-check" 2>/dev/null || true)
if [ -n "$TS" ]; then
  echo "last-check: $(date -r "$TS" 2>/dev/null || date -d "@$TS" 2>/dev/null || echo "epoch $TS")"
else
  echo "last-check: never (normal right after an install or update — the cache was cleared)"
fi
```

Present the result as one tidy block:

```
SkillCloud v0.9.0 — role: designer
Linked skills (14): accessibility-audit, company-handbook, design-brief, …
Last update check: Wed Jun 10 09:14:02 2026
```

- Empty role → say "role not set" and point at **Switching role**.
- Version `?` or 0 linked skills → something is off; offer to run **Doctor**.

## Upgrade flow

The canonical upgrade procedure. Every SkillCloud skill's preamble lands here when its
update check prints `UPGRADE_AVAILABLE <old> <new>` — `{old}` and `{new}` below are
those two values. **The upgrade is a detour, never a destination**: whatever skill the
user originally invoked still owes them its result (Step 5).

### Step 1 — honor auto-upgrade

```bash
AUTO=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-config" get auto_upgrade)
echo "auto_upgrade: $AUTO"
```

If `true`: say "Auto-upgrading SkillCloud v{old} → v{new}…" and go straight to
**Step 3** — no question asked. Otherwise continue to Step 2.

### Step 2 — ask

Use the AskUserQuestion tool (or plain text with the same four options if the tool is
unavailable): **"SkillCloud v{new} is available (you're on v{old}). Upgrade now?"**

| Option | Then |
|---|---|
| **Yes, upgrade now** | Go to Step 3. |
| **Always keep me up to date** | Run the opt-in below, then go to Step 3. |
| **Not now** | Write the escalating snooze below, say when the next reminder lands, then skip to Step 5. |
| **Never ask again** | Disable checks below, mention how to re-enable, then skip to Step 5. |

"Always keep me up to date":

```bash
"${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-config" set auto_upgrade true
```

"Not now" — escalating snooze (substitute `{new}` with the actual new version before
running):

```bash
NEW="{new}"
SC="${SKILLCLOUD_HOME:-$HOME/.skillcloud}"
LEVEL=0
if [ -f "$SC/update-snoozed" ] && [ "$(awk '{print $1}' "$SC/update-snoozed" 2>/dev/null)" = "$NEW" ]; then
  LEVEL=$(awk '{print $2}' "$SC/update-snoozed" 2>/dev/null)
fi
case "$LEVEL" in *[!0-9]*|"") LEVEL=0 ;; esac
LEVEL=$((LEVEL + 1))
[ "$LEVEL" -gt 3 ] && LEVEL=3
echo "$NEW $LEVEL $(date +%s)" > "$SC/update-snoozed"
echo "snoozed: level $LEVEL"
```

Then tell the user when they'll hear about v{new} again — level 1: "in 24 hours",
level 2: "in 48 hours", level 3: "in a week" (and weekly thereafter; a newer release
resets the ladder).

"Never ask again":

```bash
"${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-config" set update_check false
```

Tell the user update prompts are now off on this machine, and that they can re-enable
them anytime with `skillcloud-config set update_check true` — or by asking to "update
skillcloud", whose **Update** section detects the disabled state and offers the
re-enable.

### Step 3 — run the update

```bash
bash "${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/setup.sh" --update
```

What it does: `git pull --ff-only`, relinks skills for the saved role, writes the
just-upgraded marker, and clears the check cache and any snooze. If it prints the
git-pull WARNING (offline, auth, or local changes), report that honestly — links were
refreshed but the content may be unchanged; suggest checking network or git
credentials.

### Step 4 — say what's new

```bash
cat "${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/CHANGELOG.md"
```

Summarize the entries between v{old} (exclusive) and v{new} (inclusive) as 3–6
user-facing bullets, titled **"SkillCloud v{new} — what's new:"**. Skip
maintainer-only noise. (The just-upgraded marker means the next skill invocation may
print `JUST_UPGRADED` — if you already summarized here in the same conversation, a
one-line acknowledgment is enough then.)

### Step 5 — continue what the user actually asked for

Return to the skill the user originally invoked and finish their request. Never end
the turn on the upgrade itself — unless updating SkillCloud *was* the request, in
which case close with the **Status** block.

## Doctor

Run the full diagnostic, then grade each line PASS / WARN / FAIL:

```bash
SC="${SKILLCLOUD_HOME:-$HOME/.skillcloud}"
SKILLS="${SKILLCLOUD_SKILLS_DIR:-$HOME/.claude/skills}"
REPO=$(readlink "$SC/repo" 2>/dev/null || true)
if [ -n "$REPO" ] && [ -d "$REPO" ]; then echo "repo_pointer: OK -> $REPO"; else echo "repo_pointer: BROKEN (${REPO:-no symlink at $SC/repo})"; fi
V=$(cat "$SC/repo/VERSION" 2>/dev/null | tr -d '[:space:]')
if [ -n "$V" ]; then echo "version: OK (v$V)"; else echo "version: UNREADABLE"; fi
ERR=$(git -C "$SC/repo" fetch --dry-run 2>&1) && echo "git_remote: REACHABLE" || echo "git_remote: UNREACHABLE ($(echo "$ERR" | head -1))"
ROLE=$("$SC/repo/bin/skillcloud-config" get role 2>/dev/null)
if [ -n "$ROLE" ]; then echo "role: OK ($ROLE)"; else echo "role: UNSET"; fi
COUNT=0
if [ -n "$REPO" ]; then
  for d in "$SKILLS"/*; do
    [ -L "$d" ] || continue
    case "$(readlink "$d")" in "$REPO"/*) COUNT=$((COUNT + 1)) ;; esac
  done
fi
echo "linked_skills: $COUNT"
echo "broken_symlinks:"
find "$SKILLS" -maxdepth 1 -type l ! -exec test -e {} \; -print 2>/dev/null
echo "collisions:"
for d in "$SKILLS"/*; do
  [ -e "$d" ] || continue
  [ -L "$d" ] && continue
  name=$(basename "$d")
  for src in "$SC/repo/skills"/*/"$name"; do
    [ -d "$src" ] && echo "$name (non-symlink shadowing $src)"
  done
done
echo "doctor: done"
```

Grade it:

| Signal | Verdict | One-line fix |
|---|---|---|
| `repo_pointer: BROKEN` | FAIL | Re-run `setup.sh` from the SkillCloud clone — it restores `~/.skillcloud/repo`. |
| `version: UNREADABLE` | FAIL | The clone moved or is damaged — re-clone, then re-run `setup.sh`. |
| `git_remote: UNREACHABLE` | WARN — offline is normal, never a FAIL | Check network/VPN or git credentials; update checks resume silently once reachable. |
| `role: UNSET` | WARN | Set it via **Switching role** below. |
| `linked_skills: 0` | FAIL | Re-run `setup.sh` — nothing is linked, so no SkillCloud skill can trigger. |
| anything under `broken_symlinks:` | WARN | Re-run `setup.sh` — it relinks the role's skills and prunes dead links. |
| anything under `collisions:` | WARN | A real file or folder in `~/.claude/skills` shadows a SkillCloud skill — remove or rename it, or re-run `setup.sh --force` to replace it. |

Report as a short PASS/WARN/FAIL list with the fix attached to every WARN and FAIL.
When explaining impact, remember the blast radius: `~/.claude/skills` is read by
**both Claude Code and Cowork** — a fix here heals both, a collision here breaks both.

## Update

The manual check ("update skillcloud", "check for updates"). `--force` bypasses the
24-hour cache and any snooze:

```bash
SC="${SKILLCLOUD_HOME:-$HOME/.skillcloud}"
"$SC/repo/bin/skillcloud-update-check" --force
echo "local: v$(cat "$SC/repo/VERSION" 2>/dev/null || echo '?')"
echo "update_check: $("$SC/repo/bin/skillcloud-config" get update_check)"
```

- `UPGRADE_AVAILABLE <old> <new>` → run the **Upgrade flow**, entering at **Step 3**:
  the user just asked for the update, so asking "upgrade now?" again is a wasted
  question.
- `JUST_UPGRADED <old> <new>` → an update already completed out-of-band (e.g.
  `setup.sh --update` run in a terminal); announce it per the preamble bullet.
- No output and `update_check: true` → say **"You're on the latest (v{X})."** with the
  local version. (Suspect you're offline? **Doctor** checks remote reachability.)
- No output and `update_check: false` → checks are disabled, so origin was never
  consulted — say so instead of claiming "latest", and offer to re-enable:

```bash
"${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-config" set update_check true
```

then run the check again.

## Switching role

Roles decide which bundles get linked: `researcher` = core + research, `designer` =
core + design, `both` = all three, `core` = core only.

```bash
bash "${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/setup.sh" --role designer   # researcher | designer | both | core
```

Prune behavior, so there are no surprises: the script links the new selection, then
removes **only** SkillCloud-owned symlinks that fall outside it. Nothing else is
touched — non-SkillCloud skills in `~/.claude/skills`, `~/.skillcloud/config.yaml`,
and any project `ux/` artifacts stay exactly as they are. Re-running is idempotent.

## Uninstall

Confirm with the user before running anything, and spell out what will happen: every
SkillCloud symlink is removed from `~/.claude/skills` (Claude Code **and** Cowork lose
the skills), and the `~/.skillcloud/repo` pointer goes away. The git clone itself and
`~/.skillcloud/config.yaml` (the saved role) are kept.

Once they confirm:

```bash
bash "${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/setup.sh" --uninstall
```

Afterwards: to finish removal completely, delete the clone and `~/.skillcloud/`; to
come back later, re-run `setup.sh` from the clone — the saved role makes reinstall one
keypress.
