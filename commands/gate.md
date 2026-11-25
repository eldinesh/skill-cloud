---
description: Run a stage's exit contract and its independent checker
argument-hint: "[frame|explore|harden|ship]"
---

The person typed: `/koru:gate $ARGUMENTS`

You run the Koru playbook. The `koru` command is on the shell path (if not: `node "$HOME/.skillcloud/repo/lib/koru.js"`). Speak plainly, in designer language. When a step needs a person (signing, passing a gate, the contract, sharing), give them the exact line to type, starting with `!`.

Stage = the second word, or the current stage from `koru where`.
1. Run `koru gate <stage>` and show the exit contract.
2. Run the stage's checker agent with fresh context on the stage's cards and deliverables: frame → `research-checker`, explore → `direction-checker`, harden → `harden-checker`, ship → `spec-checker`. Do not argue with or soften its findings.
3. Save its numbered findings, exactly as it wrote them, to a scratch file outside `koru/` (for example `/tmp/koru-findings-<stage>.md`), then record them: `koru review <stage> --checker <name> --file <that file>`.
4. Walk the person through each finding; they choose a disposition (fixed · accepted risk · deferred TKT-000). Fix what they ask you to fix. Write the dispositions into the REV card.
5. Run `koru gate <stage>` again. When every line is ✓, the signer types: `! koru gate <stage> --pass --name "…" --role "…"`.
