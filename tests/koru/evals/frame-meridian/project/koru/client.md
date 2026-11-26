# Client

Meridian Health: four hospitals plus Meridian Plan (health plan, about 180,000 members). Phase 1 sites: Meridian North and Meridian Central. Note: the pack is fictional, so no real client data.

## Deciders and voices

| Person | Role | What they care about | Stance |
| --- | --- | --- | --- |
| Dana Whitfield | COO, brief author, client sponsor | No stockouts; visible AI in operations (board ask); first release in 8 weeks | Wants AI to order; plan side is phase 2 |
| Raj Menon | VP Finance | Spend must not rise (2022 pilot: +19% in two categories); $500 manager approval stays | Suggest yes, spend alone no |
| Marcus Lee | Director of Nursing | Nurses get time back (about 40 min a shift); AI suggests, does not decide | Staff work around tools they distrust |
| Hannah Cole | Head of Care Navigation, Meridian Plan | Nothing about a member falls between hospital and plan | Wants plan in phase 1 |
| Priya Shah | Product Owner, Operations Technology | PRD owner (v0.4 draft); wants scope help; every state, real components, who-can-do-what criteria | Asking Koru to shape release 1 |
| Tom Okafor | Engineering Lead (the engineer role) | Facts about systems; one request type done properly | Sceptical of auto-ordering and real-time stock |
| Wen Li | Front-end developer | One source of truth, real components, every state | |

Who signs the Brief: Dana (sponsor co-sign). Open question in the PRD: who owns the dashboard.

## Vocabulary

- UnitDesk: the current request tool (2017, PHP monolith, SQL Server). Meridian UI: component library (v1.4.2, Tailwind CSS 3, 2021).
- "Request": the client uses one word for a box of gloves and a member's transport home. Hannah: "One's a box, one's a person." Treat supplies, equipment, transport and member needs as different kinds until evidence says otherwise.
- Delivery rounds 10:00 and 16:00, cut-off 30 minutes before. ERP nightly extract 02:00. EDI nightly order file. PHI: member data, plan member ID (not hospital record number).
- Agency / travel nurses: not in the staff directory; today on a shared unit login.

## House rules and hard constraints (from engineering, treat as true over the PRD)

- No real-time inventory: best is "last counted 02:00" plus scans since, on about half the units.
- AI cannot place orders. It can suggest a line for tonight's file; a materials manager approves; lines over $500 also need ERP approval.
- Devices: shared workstations on wheels (Windows, Chrome, 1366 × 768), 10-inch iPad on about a third of units. No native app approved. Phones against policy but used.
- 10-minute idle timeout on shared devices.
- Every approval and every accepted AI suggestion is logged with who accepted it.
- PHI needs role-based access and audit logging; navigators cannot see clinical notes. Hospital record system is out of scope.
- Design must use components that exist in code or name the new ones with a spec; every state for every screen (empty, loading, error, partial, no permission); spacing and type as tokens; behaviour at 1366 × 768 and tablet.
- Lesson from release 3.2: designs relied on a table that didn't exist, had no empty or error states, and the ticket linked only page 1 of Figma. Priya wants one source of truth and "what happens when the AI is wrong: who sees it, who fixes it, how it's logged".

## Content guide

None supplied. Plain item names are needed (catalogue has plain-language names for only about 1,100 of about 6,400 items).
