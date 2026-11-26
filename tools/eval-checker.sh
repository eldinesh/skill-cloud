#!/bin/bash
# Score a Koru checker against a project with planted defects.
#   tools/eval-checker.sh frame-meridian            run the checker headless, then score it
#   tools/eval-checker.sh frame-meridian FILE.md    score findings you already have
# Needs Claude Code on PATH for a live run. Exits 1 when recall falls under MIN_RECALL (default 0.75).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FX="$ROOT/tests/koru/evals/${1:?name a fixture in tests/koru/evals}"
[ -f "$FX/planted.json" ] || { echo "No planted.json in $FX"; exit 2; }
WORK="$(mktemp -d)"; cp -r "$FX/project/." "$WORK/"
CHECKER="$(node -e "console.log(require('$FX/planted.json').checker)")"
STAGE="$(node -e "console.log(require('$FX/planted.json').stage || 'frame')")"
if [ -n "${2:-}" ]; then FIND="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"; else
  ( cd "$WORK" && claude --plugin-dir "$ROOT" -p "Run the $STAGE stage checker only. Build the pack with koru pack $STAGE, then dispatch the koru:$CHECKER agent on $STAGE with no hints about what to look for. Save its findings, exactly as it returns them, to koru/reviews/eval.md. Do not fix any card and do not record a review." \
      --permission-mode acceptEdits --allowedTools Bash Read Write Edit Glob Grep Task Agent Skill > "$WORK/run.log" )
  FIND="$WORK/koru/reviews/eval.md"
fi
cd "$WORK" && node "$ROOT/lib/koru.js" eval score --expected "$FX/planted.json" --file "$FIND" --min "${MIN_RECALL:-0.75}"
