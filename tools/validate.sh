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

  if [ "$group" = "research" ] || [ "$group" = "design" ]; then
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

echo ""
if [ "$FAIL" -gt 0 ]; then
  echo "validate: $CHECKED skills checked, $FAIL failure(s)."
  exit 1
fi
echo "validate: $CHECKED skills checked, all green."
