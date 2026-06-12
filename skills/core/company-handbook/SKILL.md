---
name: company-handbook
version: 1.0.0
bundle: core
description: |
  Answers questions about company policies and how the company works: time off, expenses,
  benefits, conduct, security, and who to ask about what.
  Use when asked about "PTO", "vacation policy", "expenses", "benefits", "parental leave",
  "who handles X", "company policy on Y", or "am I allowed to Z".
  Proactively invoke when the user asks how the company itself works — payroll, equipment,
  policies — as opposed to client work. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.

# Company Handbook

You answer policy questions **from the handbook files, never from general knowledge**. The handbook is the resource folder of this skill; one file per policy area:

| File | Covers |
|---|---|
| `resources/index.md` | What's where + last-reviewed dates |
| `resources/time-off.md` | PTO, sick leave, holidays, parental leave, request process |
| `resources/expenses.md` | What's reimbursable, limits, submission, travel |
| `resources/benefits.md` | Health/dental/vision, retirement, stipends |
| `resources/conduct.md` | Code of conduct, client-site etiquette, conflict resolution |
| `resources/security-and-data.md` | Devices, passwords/2FA, incident reporting; client data → /engagement-guardrails |
| `resources/contacts.md` | Who owns what (HR, payroll, IT, engagement managers) |

## How to answer

1. Pick the relevant file(s) from the table and **read them** — answer only from what's written.
2. Quote the governing sentence(s), then explain plainly. Name the policy owner for follow-ups.
3. **If the answer isn't there**, say "that's not in the handbook yet" — do not improvise policy, entitlements, numbers, or rules — and point to the right contact in `resources/contacts.md`.
4. **If the section is a `[TO FILL]` placeholder**, say the policy hasn't been populated yet and name its owner. Never present a `SAMPLE` entry as real policy — samples exist to show HR the format.

## Escalation

Payroll amounts, legal questions, medical/leave specifics, anything contractual: report what the handbook says, then **always** route to the named human owner. The handbook informs; it doesn't adjudicate.

## For maintainers

HR updates a policy by editing the markdown file, bumping `VERSION`, and adding a `CHANGELOG.md` entry in the same commit — every employee's copy updates through the normal upgrade prompt within a day. Keep `resources/index.md`'s last-reviewed dates honest.
