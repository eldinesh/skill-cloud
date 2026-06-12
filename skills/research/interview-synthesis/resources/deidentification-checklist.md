# De-identification checklist (Safe Harbor habits)

Run this sweep on every transcript, recording note, or pasted excerpt **before analysis**. It applies on every engagement tier — it's how we work, not an extra step.

## Replace

| Found in source | Replace with |
|---|---|
| Participant names | `P01`, `P02`, … (stable per project — check existing `ux/interviews/` before assigning) |
| Colleague/stakeholder names | Role descriptors ("their team lead", "the intake coordinator") |
| Client org, sites, facilities | Codename from `ux/project-context.md` glossary (add one if missing) |
| Products / internal system names | Glossary codenames ("the EHR", "the scheduling tool") |
| Patient details inside stories | Generalize: age → band, condition → category only if analytically relevant, else drop |

## Strip or generalize (HIPAA Safe Harbor categories)

Names · geography smaller than a state · all date elements except year (month/year only when the timeline matters) · phone/fax · email · SSN · MRN · health-plan/account numbers · certificate/license numbers · vehicle and device identifiers · URLs · IP addresses · biometric identifiers · full-face photos · any other unique identifying number, characteristic, or code.

## Rules

1. De-identify **on intake** — the raw text never enters an artifact, a quote, or a chat reply.
2. Quotes are quoted *after* cleaning: "I page the charge nurse twice a shift" — P04.
3. Keep a consistent mapping in your head per session, but **never write the mapping down** in `ux/` — the mapping is itself identifying.
4. If the material looks like live patient data (charts, MRNs, schedules) on a *limited* engagement: stop and flag it to the user before processing.
5. The `ux/` folder holds only de-identified content. Raw recordings/transcripts live wherever the engagement's data rules say — not here.
