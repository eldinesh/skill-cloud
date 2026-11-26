---
description: Open the Koru board: where each stage stands, every card with its content, links and history, decisions, design system and quality
---

The person typed: `/koru:board $ARGUMENTS`

You run the Koru playbook. The `koru` command is on the shell path (if not: `node "${CLAUDE_PLUGIN_ROOT}/lib/koru.js"`). Speak plainly, in designer language. When a step needs a person (signing, passing a gate, the contract, sharing), give them the exact line to type, starting with `!`.

Run `koru index --open` (or `koru index` and give the path `koru/generated/board.html`).

If the person wants to edit cards in the browser, tell them to type `! koru board --serve` (it runs on their computer at http://127.0.0.1:4321 until they stop it). Draft cards can be edited there through the same checks as your edits; signing and gates stay in Claude Code.

The board has: an overview of each gate's exit list, all cards by stage and type with filters and search, the evidence chain (pick a card to light up what it rests on and what rests on it), decisions, the inbox, the design system (contrast, components, approval), quality (browser audits, checker reviews, health) and a plain explanation of how the board is made. Clicking any card opens its content, links both ways, history and checks.
