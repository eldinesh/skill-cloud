# Tech constraints and component library notes

**Author:** Tom Okafor, Engineering Lead, Operations Technology
**Audience:** Koru design and engineering

These are the facts you'll need. Where the PRD assumes something different, these notes are correct.

## Systems

| System | What it does | How we can use it |
| --- | --- | --- |
| UnitDesk | Current request tool (2017). PHP monolith, SQL Server. | Read and write through our internal API. Three years of request history. Item names are free text. |
| ERP | Inventory, purchasing, finance | Read stock levels through a nightly extract (refreshed at 02:00). **No API to create purchase orders.** Orders go to suppliers in a nightly EDI file. PO lines over $500 need approval inside the ERP. |
| Item catalogue | Master list of stocked items with catalogue numbers | Read-only API. About 6,400 active items. Plain-language names exist for only about 1,100 of them. |
| Staff directory | Employee accounts and roles | SSO for employees. Agency and travel nurses aren't in it. |
| Plan member system | Member eligibility and benefits | Read-only API. Contains PHI: role-based access and audit logging required. Uses plan member ID, not the hospital record number. |
| Hospital record system | Patient records | Out of scope for this project. No integration approved. |
| Unit scanners | Scan items out of supply rooms | Installed on about half the units at North and Central. |

## Constraints

- **No real-time inventory.** The best we can show is "last counted at 02:00" plus scans since, on units that scan.
- **AI can't place orders directly.** It can suggest a line for tonight's order file. A materials manager approves it, and lines over $500 also need ERP approval.
- **Delivery rounds** are fixed at 10:00 and 16:00. Requests approved after the cut-off (30 minutes before each round) go on the next one.
- **Devices:** shared workstations on wheels (Windows, Chrome, 1366 × 768 screens), unit tablets (iPad, 10 inch) on about a third of units. No native mobile app approved. Phones are against policy but widely used.
- **Session timeouts:** security requires a 10-minute idle timeout on shared devices.
- **Agency staff:** need individual access for accountability. Security will approve time-limited accounts if we build the flow. Today they use a shared login per unit.
- **Audit:** every approval and every AI suggestion that's accepted must be logged with who accepted it.

## Meridian UI (component library)

Built in 2021 on Tailwind CSS. Used by three internal apps.

**What exists in code**

- Button (primary, secondary, ghost), Text input, Select, Checkbox, Radio, Modal, Card, Tabs, Avatar, basic Alert banner

**What doesn't exist in code**

- Data table (each app built its own, three different versions)
- Status badge or pill
- Timeline or activity log
- Toast notifications
- Search with autocomplete
- Any pattern for AI: suggestion, confidence, explanation, accept or undo

**Known issues**

- The Figma library and the code have drifted. Figma uses an 8-point spacing grid. Code uses Tailwind defaults, so spacing is off by a few pixels in many places.
- Colour tokens exist in code. Spacing and type tokens don't: values are hard-coded.
- Primary blue on white fails contrast at small sizes (3.9:1).
- No dark mode. Not needed.

**What engineering needs from design**

- Use components that exist in code, or say clearly which new ones we're building and spec them
- Every state for every screen: empty, loading, error, partial data, no permission
- Spacing and type as tokens we can add to the library
- Behaviour on the 1366 × 768 workstation and the tablet, as well as large screens
