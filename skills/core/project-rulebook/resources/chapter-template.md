---
artifact: rulebook-chapter
id: <PREFIX>                     # 2–5 capitals; rule IDs are <PREFIX>-Rnn, checks <PREFIX>-Cnn
project: <project, or "SkillCloud default">
created_by: skillcloud/project-rulebook v<VERSION>
stage: <frame | explore | harden | ship | all>
applies_to: [<roles that load this chapter>]
sources: [<decisions, research, standards this chapter rests on>]
status: draft                    # final only when the rulebook owner signs
owner: <named person>
version: 1
updated: <yyyy-mm-dd>
---

# <Chapter name>

## Purpose
<Why this chapter exists, in one sentence.>

## Rules
<!-- Must and must-not statements. Each one changes a design or build decision, or it doesn't belong. -->
- **<PREFIX>-R01** MUST …
- **<PREFIX>-R02** MUST NOT …

## Patterns
<!-- Approved ways of solving common problems, each with a short example. -->
### <Pattern name>
<When to use it> · <example>

## Decisions
<!-- What this project decided and why. Each line links to the decisions log. -->
| Decision | Why | Log |
|---|---|---|

## Checks
<!-- What to verify before work moves on. Each check says how: a tool command, or which person. -->
| Check | Verifies | How |
|---|---|---|
| **<PREFIX>-C01** | R01 | tool: `<command>` · or person: <role> |

## Instructions for AI tools
<!-- How Claude should apply this chapter, written as instructions. -->
- When <situation>, <do this>. Flag any <screen/file/claim> that <breaks it>.

## Owner
<Name> · review cadence: <e.g. at every Harden gate, and quarterly>
