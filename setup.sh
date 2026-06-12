#!/bin/bash
# SkillCloud installer — role-based symlinks into ~/.claude/skills/
# (read by both Claude Code and Cowork, so one install covers both surfaces).
#
# Usage:
#   ./setup.sh                      interactive role picker
#   ./setup.sh --role researcher    researcher | designer | both | core
#   ./setup.sh --update             pull latest + relink + mark "just upgraded"
#   ./setup.sh --uninstall          remove SkillCloud symlinks and repo pointer
#   ./setup.sh --force              replace non-SkillCloud files occupying our names
#
# Compatible with macOS /bin/bash 3.2. Idempotent — safe to re-run anytime.

set -u

REPO_ROOT=$(cd "$(dirname "$0")" && pwd)
SC_HOME="${SKILLCLOUD_HOME:-$HOME/.skillcloud}"
SKILLS_DIR="${SKILLCLOUD_SKILLS_DIR:-$HOME/.claude/skills}"
CONFIG="$REPO_ROOT/bin/skillcloud-config"

ROLE=""
DO_UPDATE="no"
DO_UNINSTALL="no"
FORCE="no"

while [ $# -gt 0 ]; do
  case "$1" in
    --role) ROLE="${2:-}"; shift 2 ;;
    --update) DO_UPDATE="yes"; shift ;;
    --uninstall) DO_UNINSTALL="yes"; shift ;;
    --force) FORCE="yes"; shift ;;
    -h|--help) sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "Unknown flag: $1 (try --help)"; exit 1 ;;
  esac
done

groups_for_role() {
  case "$1" in
    researcher) echo "core research" ;;
    designer)   echo "core design" ;;
    both)       echo "core research design" ;;
    core)       echo "core" ;;
    *) echo "" ;;
  esac
}

all_skill_dirs() {
  find "$REPO_ROOT/skills" -mindepth 2 -maxdepth 2 -type d 2>/dev/null
}

link_points_to_repo() {
  # $1 = path in ~/.claude/skills; true if it's a symlink into this repo
  [ -L "$1" ] || return 1
  local target
  target=$(readlink "$1")
  case "$target" in
    "$REPO_ROOT"/*) return 0 ;;
    *) return 1 ;;
  esac
}

uninstall_all() {
  local removed=0
  for d in "$SKILLS_DIR"/*; do
    [ -e "$d" ] || continue
    if link_points_to_repo "$d"; then
      rm -f "$d"
      removed=$((removed + 1))
    fi
  done
  rm -f "$SC_HOME/repo"
  echo "Removed $removed SkillCloud skill links and the repo pointer."
  echo "Config kept at $SC_HOME/config.yaml (delete it if you're done for good)."
}

if [ "$DO_UNINSTALL" = "yes" ]; then
  uninstall_all
  exit 0
fi

if [ "$DO_UPDATE" = "yes" ]; then
  OLD_VERSION=$(cat "$REPO_ROOT/VERSION" 2>/dev/null || echo "unknown")
  if git -C "$REPO_ROOT" rev-parse --git-dir >/dev/null 2>&1; then
    if ! git -C "$REPO_ROOT" pull --ff-only 2>/dev/null; then
      echo "WARNING: git pull failed (offline, auth, or local changes). Relinking current checkout."
    fi
  fi
  mkdir -p "$SC_HOME"
  echo "$OLD_VERSION" > "$SC_HOME/just-upgraded-from"
  rm -f "$SC_HOME/last-update-check" "$SC_HOME/update-snoozed"
  ROLE=$("$CONFIG" get role)
  if [ -z "$ROLE" ]; then ROLE="core"; fi
  echo "Updating SkillCloud (was v$OLD_VERSION, role: $ROLE)..."
fi

if [ -z "$ROLE" ]; then
  SAVED_ROLE=$("$CONFIG" get role)
  echo "SkillCloud — company UX skills for Claude Code & Cowork"
  echo ""
  echo "Which bundle fits your work?"
  echo "  1) Researcher   (core + research skills)"
  echo "  2) Designer     (core + design skills)"
  echo "  3) Both         (core + research + design)"
  echo "  4) Core only    (handbook, guardrails, pipeline)"
  if [ -n "$SAVED_ROLE" ]; then
    echo ""
    echo "  [enter] keep current role: $SAVED_ROLE"
  fi
  printf "Choice: "
  read -r choice
  case "$choice" in
    1) ROLE="researcher" ;;
    2) ROLE="designer" ;;
    3) ROLE="both" ;;
    4) ROLE="core" ;;
    "") ROLE="${SAVED_ROLE:-both}" ;;
    *) echo "Unrecognized choice."; exit 1 ;;
  esac
fi

SC_GROUPS=$(groups_for_role "$ROLE")
if [ -z "$SC_GROUPS" ]; then
  echo "Invalid role: $ROLE (use researcher | designer | both | core)"
  exit 1
fi

mkdir -p "$SKILLS_DIR" "$SC_HOME"

# Stable pointer so skills can find bin/ regardless of where the repo was cloned
rm -f "$SC_HOME/repo"
ln -s "$REPO_ROOT" "$SC_HOME/repo"

"$CONFIG" set role "$ROLE"
"$CONFIG" set repo_path "$REPO_ROOT"

# Build the selected skill list
SELECTED=""
for group in $SC_GROUPS; do
  for d in "$REPO_ROOT/skills/$group"/*; do
    [ -d "$d" ] || continue
    [ -f "$d/SKILL.md" ] || continue
    SELECTED="$SELECTED $d"
  done
done

LINKED=0
SKIPPED=0
for src in $SELECTED; do
  name=$(basename "$src")
  dst="$SKILLS_DIR/$name"
  if [ -e "$dst" ] || [ -L "$dst" ]; then
    if link_points_to_repo "$dst"; then
      rm -f "$dst"
    elif [ "$FORCE" = "yes" ]; then
      echo "  ! replacing existing non-SkillCloud '$name' (--force)"
      rm -rf "$dst"
    else
      echo "  ! skipping '$name' — something else already lives at $dst (re-run with --force to replace)"
      SKIPPED=$((SKIPPED + 1))
      continue
    fi
  fi
  ln -s "$src" "$dst"
  LINKED=$((LINKED + 1))
done

# Remove our links that are no longer in the selection (e.g., role switch)
PRUNED=0
for d in "$SKILLS_DIR"/*; do
  [ -L "$d" ] || continue
  link_points_to_repo "$d" || continue
  name=$(basename "$d")
  still="no"
  for src in $SELECTED; do
    [ "$(basename "$src")" = "$name" ] && still="yes" && break
  done
  if [ "$still" = "no" ]; then
    rm -f "$d"
    PRUNED=$((PRUNED + 1))
  fi
done

VERSION=$(cat "$REPO_ROOT/VERSION" 2>/dev/null || echo "?")
echo ""
echo "SkillCloud v$VERSION installed — role: $ROLE ($LINKED skills linked, $SKIPPED skipped, $PRUNED pruned)."
echo "Works in Claude Code and Cowork. Try: ask Claude 'what can skillcloud do?' or invoke /skillcloud."
