#!/bin/bash
# Tool self-tests: run skillcloud-check and skillcloud-board against a fixture project with
# planted defects, and assert each defect is caught (and clean things stay clean).
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../.." && pwd)
CHECK="$REPO/bin/skillcloud-check"
BOARD="$REPO/bin/skillcloud-board"
WORK=$(mktemp -d "${TMPDIR:-/tmp}/sc team test.XXXXXX")   # a space on purpose: real project folders have them
trap 'rm -rf "$WORK"' EXIT
cp -R "$HERE/fixture/." "$WORK/"
cd "$WORK" || exit 2
PASS=0; FAILN=0
expect() { # expect <description> <grep-pattern> <output>
  if printf '%s\n' "$3" | grep -qE "$2"; then PASS=$((PASS+1)); else FAILN=$((FAILN+1)); echo "MISSED: $1 (wanted /$2/)"; printf '%s\n' "$3" | sed 's/^/    /'; fi
}
refute() { # refute <description> <grep-pattern> <output>
  if printf '%s\n' "$3" | grep -qE "$2"; then FAILN=$((FAILN+1)); echo "FALSE POSITIVE: $1 (/$2/ matched)"; printf '%s\n' "$3" | grep -E "$2" | sed 's/^/    /'; else PASS=$((PASS+1)); fi
}
exit_is() { # exit_is <description> <want> <got>
  if [ "$2" = "$3" ]; then PASS=$((PASS+1)); else FAILN=$((FAILN+1)); echo "WRONG EXIT: $1 (want $2, got $3)"; fi
}

# trace: quotes verbatim, IDs resolve, final-on-draft
out=$("$CHECK" trace ux/synthesis/interview-synthesis.md 2>&1); rc=$?
expect "paraphrased quote caught" 'QUOTE-MISSING .*interview-synthesis.md:.* P02' "$out"
refute "verbatim quote (with ellipsis cut) accepted" 'QUOTE-MISSING .* P01' "$out"
expect "undefined insight ID caught" 'UNRESOLVED-ID .*INS-09' "$out"
expect "undefined job ID caught" 'UNRESOLVED-ID .*JOB-01' "$out"
refute "defined insight ID accepted" 'UNRESOLVED-ID .*INS-01' "$out"
exit_is "trace exits 1 on failures" 1 "$rc"
out=$("$CHECK" trace ux/personas/member.md 2>&1)
expect "final built on a draft source caught" 'SOURCE-UNSIGNED ux/personas/member.md' "$out"
out=$("$CHECK" trace ux/structure/flows/book-a-room.md 2>&1); rc=$?
refute "flow's own step IDs resolve" 'UNRESOLVED-ID' "$out"

# pii
out=$("$CHECK" pii ux 2>&1)
expect "email in an interview record caught" 'PII-EMAIL ux/interviews/P01.md' "$out"
refute "dates in headers not flagged as phones" 'PII-PHONE' "$out"

# signoffs
out=$("$CHECK" signoffs 2>&1)
expect "AI signer caught" 'AI-SIGNER ux/personas/admin.md' "$out"
expect "final with no log line caught" 'NO-LOG-LINE ux/personas/admin.md' "$out"
refute "properly signed persona accepted" 'ux/personas/member.md' "$out"

# stale
out=$("$CHECK" stale 2>&1)
expect "persona signed before its source changed is stale" 'STALE ux/personas/member.md' "$out"

# lanes
mkdir -p ux/team && touch ux/team/.dispatch-J-009 && sleep 1
echo "x" > ux/research-plan.md; echo "x" > ux/personas/sneaky.md
out=$("$CHECK" lanes researcher ux/team/.dispatch-J-009 2>&1)
expect "researcher writing a persona is out of lane" 'OUT-OF-LANE researcher wrote ux/personas/sneaky.md' "$out"
refute "researcher writing the research plan is in lane" 'OUT-OF-LANE .*research-plan' "$out"

# ia
out=$("$CHECK" ia 2>&1)
expect "flow step on a node that doesn't exist caught" 'UNKNOWN-NODE .*N9' "$out"
refute "existing node accepted" 'UNKNOWN-NODE .*N1\.2' "$out"

# tokens
out=$("$CHECK" tokens ux/explore 2>&1)
expect "raw colour outside :root caught" 'RAW-COLOUR .*prototype.html:4' "$out"
expect "raw spacing caught" 'RAW-SPACING .*prototype.html:4' "$out"
expect "placeholder copy caught" 'PLACEHOLDER .*prototype.html' "$out"
refute ":root token definitions not flagged" 'prototype.html:2:' "$out"

# contrast
out=$("$CHECK" contrast '#161b24' '#ffffff' '#777777' '#ffffff' '#999999' '#ffffff' 2>&1)
expect "AA pass reported" 'OK   #161b24 on #ffffff  17\.26:1' "$out"
expect "4.48:1 flagged as UI-only" 'LOW-CONTRAST #777777 on #ffffff  4\.48:1' "$out"
expect "2.85:1 fails" 'FAIL CONTRAST #999999 on #ffffff  2\.85:1' "$out"

# board
out=$("$BOARD" frontier 2>&1)
expect "unblocked ready ticket is on the frontier" '^J-003' "$out"
refute "ticket blocked by an unfinished ticket is not" '^J-002' "$out"
refute "ticket whose resource is held by a doing ticket is not" '^J-004' "$out"
refute "hitl gate is never on the frontier" 'G-frame' "$out"
out=$("$BOARD" waiting 2>&1)
expect "unblocked gate waits on people, with its question" 'G-frame-1 .*Sign off the research pack' "$out"
refute "blocked gate does not wait yet" 'G-frame-2' "$out"
"$BOARD" html >/dev/null 2>&1
out=$(cat ux/team/board.html 2>/dev/null)
expect "board page renders the waiting gate" 'G-frame-1' "$out"
expect "board page escapes and closes" '</html>' "$out"

# history: version control for what the project produces
H="$REPO/bin/skillcloud-history"
"$H" init >/dev/null 2>&1
echo "v1" > ux/brief-test.md
out=$("$H" record --kind job --title "Brief drafted" --ticket J-005 --actor sc-strategist 2>&1)
expect "an event is recorded" 'RECORDED [0-9a-f]+ job: Brief drafted' "$out"
v1=$(git --git-dir=ux/.history log -1 --format=%h)
"$H" record --kind decision --title "Chose A" --chose DIR-A --over DIR-B >/dev/null
echo "v2" > ux/brief-test.md
out=$("$H" checkpoint 2>&1)
expect "unrecorded changes are kept as a checkpoint" 'checkpoint: 1 file' "$out"
out=$("$H" log --json 2>&1)
expect "history exports the decision fork" '"chose":"DIR-A","over":"DIR-B"' "$out"
expect "history exports files per event" '"p":"ux/brief-test.md"' "$out"
"$H" restore "$v1" ux/brief-test.md >/dev/null 2>&1
expect "restore brings the old version back" '^v1$' "$(cat ux/brief-test.md)"
out=$("$H" log 2>&1)
expect "restore is a new event, nothing rewritten" 'restore .*Restored ux/brief-test.md' "$out"
"$BOARD" html >/dev/null 2>&1
expect "board page carries the history" '"kind":"decision"' "$(cat ux/team/board.html)"

echo "tests/team: $PASS passed, $FAILN failed"
[ "$FAILN" -eq 0 ]
