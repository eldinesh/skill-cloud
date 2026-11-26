#!/bin/bash
# SkillCloud SessionStart: (1) point ~/.skillcloud/repo at this plugin when the plugin is the install,
# so every skill's ~/.skillcloud/repo/... path resolves; (2) in a project, show where it stands.
# Never fails the session: every step is best-effort.
ROOT="${CLAUDE_PLUGIN_ROOT:-}"
SC="${SKILLCLOUD_HOME:-$HOME/.skillcloud}"
if [ -n "$ROOT" ] && [ -d "$ROOT/skills" ]; then
  mkdir -p "$SC" 2>/dev/null
  cur=$(readlink "$SC/repo" 2>/dev/null || true)
  # A git clone installed with ./setup keeps the pointer; a missing or plugin-cache pointer follows the plugin.
  if [ -z "$cur" ] || [ ! -d "$cur" ] || case "$cur" in */.claude/plugins/*) true ;; *) false ;; esac; then
    [ "$cur" = "$ROOT" ] || { rm -f "$SC/repo" 2>/dev/null; ln -s "$ROOT" "$SC/repo" 2>/dev/null; }
  fi
fi
if [ ! -f ux/project-context.md ]; then
  # a folder with material but no SkillCloud setup: one quiet line, nothing else
  case "$(pwd)" in "$HOME"|"/"|"$HOME/Desktop"|"$HOME/Downloads"|"$HOME/Documents") exit 0 ;; esac
  [ -d .git ] && [ -f package.json ] && exit 0      # a code repo, not a project folder
  if ls *.pdf *.docx *.doc *.pptx *.xlsx *.md *.txt *.vtt 2>/dev/null | grep -qv '^CLAUDE.md$'; then
    echo "SkillCloud: this folder has project material but isn't set up. /skillcloud:start sets it up and proposes the first plan."
  fi
  exit 0
fi
B="$SC/repo/bin/skillcloud-board"
if [ -d ux/team/board ] && [ -x "$B" ]; then
  waiting=$("$B" waiting 2>/dev/null | grep -v '^(nothing' | head -5)
  frontier=$("$B" frontier 2>/dev/null | grep -v '^(frontier' | head -5)
  echo "SkillCloud project (ux/). Team board: ux/team/board/. Run /design-lead to continue."
  [ -n "$waiting" ] && { echo "Waits on people:"; echo "$waiting" | sed 's/^/  /'; }
  [ -n "$frontier" ] && { echo "Ready to run:"; echo "$frontier" | sed 's/^/  /'; }
else
  echo "SkillCloud project (ux/project-context.md found). /design-lead shows where it stands and what's next."
fi
exit 0
