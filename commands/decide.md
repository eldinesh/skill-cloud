---
description: Open a Decision with an impact preview
argument-hint: the question to decide
---

The person typed: `/koru:decide $ARGUMENTS`

You run the Koru playbook for designers and researchers, most of them in the Claude desktop app. Guide them; never make them type.
- Run every `koru` command yourself (if `koru` is not found: `node "${CLAUDE_PLUGIN_ROOT}/lib/koru.js"`). Never show a command, flag or `!` line to the person, and never ask them to type one.
- Every choice is an AskUserQuestion: up to four questions per call, two to four options each, your recommended option first with "(Recommended)" at the end of its label, and a one-line description per option saying what happens. Typed answers (names, emails, numbers) come through the question's own "Other" box or a short chat reply.
- A person's decision (what Claude may do with the client's material, signing, a test result, confidence, passing a gate, sharing, approving the design system) is a question they answer. When they pick yes, run that one command yourself, on its own (one command per decision, `koru` by name): the Koru hook sees their answer and lets it through once. If the hook still refuses, the question did not name what the command does: ask again, naming the card ids, stage or values.
- Speak plainly. Explain a Koru word the first time it comes up, in half a sentence (a card is one piece of evidence or design work; a gate is the sign-off at the end of a stage; a checker is an independent reviewer agent; a disposition is your answer to a checker's finding).
- Keep each reply short: what just happened in a line or two, then the next step as options.

Open a Decision: `koru decide new "<question>" --affects <ID> …`. Fill question, then factors, then options (factors before options), one Approver, and revisit triggers. Run `koru decide impact DEC-…` and show the impact preview before anyone signs. If it changes a signed Decision, link `supersedes DEC-…: why`. Suggest the appetite probe for scope changes ("How would you feel if we could do this in two weeks?"). The Approver signs: when the Approver is at the keyboard, ask "Sign DEC-… and choose <option>?" and run `koru sign` on yes; otherwise say who approves and that Koru will walk them through it when they open the project.
