# De-identification checklist

Run this sweep on every transcript, recording note, or pasted excerpt **before analysis**. It applies on every project, every domain — it's how we work, not an extra step. The project's domain (from `ux/project-context.md`) decides which extension applies.

## Replace (every project)

| Found in source | Replace with |
|---|---|
| Participant names | `P01`, `P02`, … (stable per project — check existing `ux/interviews/` before assigning) |
| Colleague/stakeholder names | Role descriptors ("their team lead", "the intake coordinator") |
| Organizations, sites, facilities | Codename from `ux/project-context.md` glossary (add one if missing) |
| Products / internal system names | Glossary codenames ("the EHR", "the scheduling tool", "the inventory system") |
| People described inside stories | Generalize: age → band, identifying details → category only if analytically relevant, else drop |

## Strip or generalize (every project)

Names · contact details (phone/fax/email) · exact dates beyond month/year (keep month/year only when the timeline matters) · geography below region · account, license, and device identifiers · URLs and IPs tied to people · any other unique identifying number, characteristic, or code.

## Domain extensions

- **Healthcare** — the full HIPAA Safe Harbor set: all of the above plus SSN, MRN, health-plan/account numbers, certificate/license numbers, vehicle identifiers, biometric identifiers, full-face photos. Patient details mentioned *inside* a story get the same treatment ("a 54-year-old from a nearby town" → "a middle-aged patient").
- **Finance** — account and card numbers, transaction details, balances tied to people, KYC data.
- **Other domains** — apply the universal sweep plus whatever uniquely identifies a person or account in that industry; when unsure, strip it.

## Rules

1. De-identify **on intake** — raw text never enters an artifact, a quote, or a chat reply.
2. Quotes are quoted *after* cleaning: "I page the charge nurse twice a shift" — P04.
3. Keep a consistent mapping in your head per session, but **never write the mapping down** in `ux/` — the mapping is itself identifying.
4. If the material looks like a live production dataset (in healthcare: charts, MRNs, schedules): stop and flag it to the user before processing.
5. The `ux/` folder holds only de-identified content. Raw recordings/transcripts live wherever the project's data rules say — not here.
