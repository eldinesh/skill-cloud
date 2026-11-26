# Meridian UI (v1.4.2)

Meridian's internal component library. Built in 2021 on Tailwind CSS 3. Used by three internal apps, including UnitDesk's newer screens.

**Owner:** Operations Technology (no dedicated maintainer since the original designer left)

## What's in this folder

| File | What it is |
| --- | --- |
| tailwind.config.js | Tailwind config. Colour tokens only. |
| tokens.css | The same colour tokens as CSS variables |
| components.md | Every component that exists in code, with its markup |
| gallery.html | All components on one page. Open it in a browser. |

## What exists in code

Button (primary, secondary, ghost), Text input, Select, Checkbox, Radio, Modal, Card, Tabs, Avatar, Alert banner.

## What doesn't exist

- Data table (three apps each built their own)
- Status badge or pill
- Timeline or activity log
- Toast notification
- Search with autocomplete
- Anything for AI: suggestion, confidence, explanation, accept or undo
- Success (green) button. It's been on the roadmap since 2022.

## Known issues

- **Spacing:** the Figma library uses an 8-point grid. Code uses Tailwind's default scale, written straight into class names. Nothing is tokenised, so spacing drifts by a few pixels between Figma and the build.
- **Type:** no type tokens. Font sizes are Tailwind defaults, set per component.
- **Contrast:** `brand-500` (#2F80ED) on white is about 3.9:1, which fails WCAG AA for small text. Buttons use white text on it.
- **Figma drift:** the Figma library has a "Table" and a "Status chip" that were never built in code.
- **Screens:** components were designed at 1440 wide. Most clinical workstations are 1366 × 768.
