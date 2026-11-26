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

  if [ "$group" = "research" ] || [ "$group" = "design" ] || [ "$group" = "ai" ] || [ "$group" = "koru" ]; then
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

# Koru plugin: manifest is valid JSON, every agent and command has frontmatter, and the engine tests pass.
if [ -f "$REPO_ROOT/.claude-plugin/plugin.json" ]; then
  for j in "$REPO_ROOT/.claude-plugin/plugin.json" "$REPO_ROOT/.claude-plugin/marketplace.json" "$REPO_ROOT/hooks/hooks.json"; do
    node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$j" 2>/dev/null || fail "${j#$REPO_ROOT/}" "not valid JSON"
  done
  for f in "$REPO_ROOT"/agents/*.md "$REPO_ROOT"/commands/*.md "$REPO_ROOT"/output-styles/*.md; do
    [ -f "$f" ] || continue
    head -1 "$f" | grep -q '^---$' || fail "${f#$REPO_ROOT/}" "missing frontmatter"
    awk '/^---$/{n++; next} n==1' "$f" | grep -qE '^description:' || fail "${f#$REPO_ROOT/}" "frontmatter missing description:"
  done
  if command -v claude >/dev/null 2>&1; then
    claude plugin validate "$REPO_ROOT" >/tmp/koru-validate.log 2>&1 || { cat /tmp/koru-validate.log; fail "plugin" "claude plugin validate failed"; }
  fi
  if command -v node >/dev/null 2>&1; then
    node "$REPO_ROOT/tools/weave.js" --check || fail "tools/weave" "a method skill is out of date with lib/methods.js (run node tools/weave.js)"
    for a in $(node -e "console.log(Object.keys(require('$REPO_ROOT/lib/methods').AGENTS).join(' '))"); do [ -f "$REPO_ROOT/agents/$a.md" ] || fail "agents/$a" "agent named in lib/methods.js has no file"; done
    node "$REPO_ROOT/tests/koru/test.js" >/tmp/koru-test.log 2>&1 || { tail -40 /tmp/koru-test.log; fail "tests/koru" "engine tests failed"; }
    echo "koru: $(tail -1 /tmp/koru-test.log)"
  fi
fi

echo ""
if [ "$FAIL" -gt 0 ]; then
  echo "validate: $CHECKED skills checked, $FAIL failure(s)."
  exit 1
fi
echo "validate: $CHECKED skills checked, all green."
