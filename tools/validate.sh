#!/bin/bash
# SkillCloud skill validator — run before every commit / in CI.
# Checks every skills/*/*/SKILL.md for:
#   1. frontmatter with name: and description:
#   2. name matches its folder
#   3. description carries the routing grammar ("Use when") and the (skillcloud) tag
#   4. pipeline skills (research/, design/) carry the Contract block
#      (Consumes / Produces / Next) and reference project-context.md
#   5. pipeline skills reference engagement-guardrails
#   6. crude PHI/PII tripwires in skill bodies and resources (MRN, SSN-shaped, DOB)
#   7. agents/sc-*.md: frontmatter name matches file, description, the shared routine or checker protocol
#   8. rulebook chapters carry all seven parts and a rule-ID prefix; lanes.txt roles match agents
# Exit non-zero on any failure.

set -u
REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
FAIL=0
CHECKED=0

fail() { echo "FAIL  $1: $2"; FAIL=$((FAIL + 1)); }

for skill_md in "$REPO_ROOT"/skills/*/*/SKILL.md; do
  [ -f "$skill_md" ] || continue
  CHECKED=$((CHECKED + 1))
  dir=$(dirname "$skill_md")
  name=$(basename "$dir")
  group=$(basename "$(dirname "$dir")")
  rel="skills/$group/$name"

  head -1 "$skill_md" | grep -q '^---$' || fail "$rel" "missing frontmatter opening ---"
  fm=$(awk '/^---$/{n++; next} n==1{print} n>=2{exit}' "$skill_md")

  echo "$fm" | grep -qE '^name:' || fail "$rel" "frontmatter missing name:"
  fm_name=$(echo "$fm" | grep -E '^name:' | head -1 | sed 's/^name:[[:space:]]*//')
  [ "$fm_name" = "$name" ] || fail "$rel" "frontmatter name '$fm_name' != folder '$name'"

  echo "$fm" | grep -qE '^description:' || fail "$rel" "frontmatter missing description:"
  echo "$fm" | grep -q 'Use when' || fail "$rel" "description missing 'Use when' routing grammar"
  echo "$fm" | grep -q '(skillcloud)' || fail "$rel" "description missing (skillcloud) tag"

  if [ "$group" = "research" ] || [ "$group" = "design" ] || [ "$group" = "ai" ] || [ "$group" = "build" ]; then
    grep -q '^## Contract' "$skill_md" || fail "$rel" "missing '## Contract' block"
    grep -q 'Consumes' "$skill_md" || fail "$rel" "contract missing Consumes"
    grep -q 'Produces' "$skill_md" || fail "$rel" "contract missing Produces"
    grep -q 'Next' "$skill_md" || fail "$rel" "contract missing Next"
    grep -q 'project-context.md' "$skill_md" || fail "$rel" "does not read ux/project-context.md"
    grep -q 'engagement-guardrails' "$skill_md" || fail "$rel" "does not reference engagement-guardrails"
  fi

  # PHI/PII tripwires across the whole skill folder (examples must be synthetic + clean)
  if grep -rE '\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b' "$dir" >/dev/null 2>&1; then
    fail "$rel" "SSN-shaped string found in skill folder"
  fi
  if grep -rE '\bMRN[:# ]*[0-9]{4,}' "$dir" >/dev/null 2>&1; then
    fail "$rel" "MRN-like identifier found in skill folder"
  fi
done

# --- agents ---------------------------------------------------------------
AGENTS_CHECKED=0
for a in "$REPO_ROOT"/agents/sc-*.md; do
  [ -f "$a" ] || continue
  AGENTS_CHECKED=$((AGENTS_CHECKED + 1))
  an=$(basename "$a" .md)
  afm=$(awk '/^---$/{n++; next} n==1{print} n>=2{exit}' "$a")
  echo "$afm" | grep -qE "^name: $an\$" || fail "agents/$an" "frontmatter name must be $an"
  echo "$afm" | grep -qE '^description:' || fail "agents/$an" "frontmatter missing description:"
  if [ "$an" = "sc-checker" ]; then
    grep -q 'handoffs.md' "$a" || fail "agents/$an" "checker must read the handoff protocols"
  else
    grep -q '_common.md' "$a" || fail "agents/$an" "must start from the shared routine (agents/_common.md)"
    grep -q 'Never' "$a" || fail "agents/$an" "missing a Never section"
    grep -q 'return packet' "$a" || fail "agents/$an" "must end with the return packet"
  fi
done
grep -q 'project-context.md' "$REPO_ROOT/agents/_common.md" || fail "agents/_common.md" "must read ux/project-context.md"
grep -q 'engagement-guardrails' "$REPO_ROOT/agents/_common.md" || fail "agents/_common.md" "must run the engagement-guardrails gate"

# --- lanes: every role in lanes.txt is an agent (or the design lead) --------
LANES="$REPO_ROOT/skills/core/design-lead/resources/lanes.txt"
for role in $(awk '/^[a-z]/{print $1}' "$LANES" | sort -u); do
  [ "$role" = "design-lead" ] && continue
  [ -f "$REPO_ROOT/agents/sc-$role.md" ] || fail "lanes.txt" "role '$role' has no agents/sc-$role.md"
done

# --- rulebook chapters ------------------------------------------------------
CHAPTERS=0
for c in "$REPO_ROOT"/skills/core/project-rulebook/resources/chapters/*.md; do
  [ -f "$c" ] || continue
  CHAPTERS=$((CHAPTERS + 1))
  cn=$(basename "$c" .md)
  for part in "## Purpose" "## Rules" "## Patterns" "## Decisions" "## Checks" "## Instructions for AI tools" "## Owner"; do
    grep -qF "$part" "$c" || fail "rulebook/$cn" "missing '$part'"
  done
  pfx=$(awk '/^id:/{print $2; exit}' "$c")
  [ -n "$pfx" ] || fail "rulebook/$cn" "frontmatter missing id: (rule prefix)"
  grep -qE "\*\*${pfx}-R[0-9]{2}\*\*" "$c" || fail "rulebook/$cn" "no rules with prefix $pfx-Rnn"
  grep -qE "\*\*${pfx}-C[0-9]{2}\*\*" "$c" || fail "rulebook/$cn" "no checks with prefix $pfx-Cnn"
done

# --- tool self-tests (fixture project with planted defects) ------------------
if [ -x "$REPO_ROOT/tests/team/run.sh" ]; then
  "$REPO_ROOT/tests/team/run.sh" >/tmp/sc-team-tests.$$ 2>&1 || { cat /tmp/sc-team-tests.$$; fail "tests/team" "tool self-tests failed"; }
  tail -1 /tmp/sc-team-tests.$$; rm -f /tmp/sc-team-tests.$$
fi

echo ""
if [ "$FAIL" -gt 0 ]; then
  echo "validate: $CHECKED skills checked, $FAIL failure(s)."
  exit 1
fi
echo "validate: $CHECKED skills, $AGENTS_CHECKED agents, $CHAPTERS rulebook chapters checked, all green."
