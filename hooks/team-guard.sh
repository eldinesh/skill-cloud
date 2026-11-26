#!/bin/bash
# SkillCloud team guard (PreToolUse on file writes). Turns two charter rules into enforcement:
#   1. Agents never sign: a team agent may not write signed_off_by, a sign-off, or status: final.
#   2. Lanes: a team agent (sc-<role>) may write only the paths lanes.txt gives its role.
# It acts only when the call comes from a SkillCloud agent (agent_type sc-* or <plugin>:sc-*).
# The main session (the design lead, recording a person's typed sign-off) is never blocked here.
# If the host doesn't report agent_type, the guard stands down and the post-job lane check still runs.
IN=$(cat)
agent=$(printf '%s' "$IN" | tr -d '\n' | sed -n 's/.*"agent_type"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
agent=${agent##*:}
case "$agent" in sc-*) ;; *) exit 0 ;; esac
role=${agent#sc-}

deny() {
  local msg; msg=$(printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g')
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$msg"
  exit 0
}

# 1. never sign
# header lines only (JSON escapes newlines as \n), so a check report quoting the rule isn't blocked
if printf '%s' "$IN" | grep -qE '(^|\\n|"(content|new_string)"[[:space:]]*:[[:space:]]*")(signed_off_by:|status:[[:space:]]*final)'; then
  deny "SkillCloud: agents never sign (team charter Art. 1 and 6). Leave the work at status: draft. Only the design lead records a named person's typed sign-off."
fi

# 2. lanes
flat=$(printf '%s' "$IN" | tr -d '\n')
file=$(printf '%s' "$flat" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
[ -z "$file" ] && file=$(printf '%s' "$flat" | sed -n 's/.*"notebook_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
[ -z "$file" ] && exit 0
cwd=$(printf '%s' "$IN" | tr -d '\n' | sed -n 's/.*"cwd"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
[ -z "$cwd" ] && cwd=$(pwd)
rel=${file#"$cwd"/}
case "$rel" in /*) exit 0 ;; esac            # outside the project (scratch files): not a lane question
case "$rel" in ux/*|deliverable/*) ;; *) exit 0 ;; esac
LANES="${CLAUDE_PLUGIN_ROOT:-$HOME/.skillcloud/repo}/skills/core/design-lead/resources/lanes.txt"
[ -f "$LANES" ] || exit 0
pats=$(awk -v r="$role" '$1==r{print $2}' "$LANES")
[ -z "$pats" ] && exit 0
for p in $pats; do
  # shellcheck disable=SC2254
  case "$rel" in $p) exit 0 ;; esac
done
deny "SkillCloud lanes: $agent may not write $rel (team charter Art. 2). Report it under 'Found outside my lane' in your return packet, and the design lead will route it to the owning role."
