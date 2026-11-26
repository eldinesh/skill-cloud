---
name: koru-design-system
version: 3.0.0-alpha.2
bundle: koru
stage: frame
description: |
  Koru design-system workflow: set up the one system every prototype and every line of front-end
  code must use, then keep it honest. Three paths: extend the client's own system (import its
  tokens, fill its gaps as marked additions), adopt one of ten open-source systems exactly
  (shadcn/ui, Material 3, Carbon, Fluent 2, Primer, Ant Design, Spectrum, GOV.UK, USWDS, NHS.UK),
  or build one from scratch with Claude Code from brand inputs. Tokens are the only place values
  live; a component manifest is the only list of components; a hook refuses anything else.
  Use when asked to "set up the design system", "we have no design system", "use Material/Carbon/
  shadcn", "import their tokens", "audit their component library", "add a component", "make it
  match their brand", or when a prototype is about to be built and `koru ds status` says none.
  Proactively invoke at the end of Frame (F3, design-system audit) and whenever the design-system
  lint refuses a write. (skillcloud)
---

## Preamble (run first)

```bash
command -v koru >/dev/null 2>&1 || koru() { node "$HOME/.skillcloud/repo/lib/koru.js" "$@"; }
koru where --brief 2>/dev/null || echo "NO_KORU_PROJECT"
koru ds status 2>/dev/null
grep -E '^(design_system|tech_stack|frontend_dir|deliverables):' koru/engagement.md 2>/dev/null
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

## Contract
- **Consumes:** `koru/engagement.md` (`design_system`, `tech_stack`, `frontend_dir`, `deliverables`), the client's library files in `inbox/` (tokens, Tailwind config, component docs, Figma library), brand inputs, the Context card's answers on brand and accessibility, `ux/project-context.md` when present (data rules per `engagement-guardrails`)
- **Produces:** `koru/design-system.md` (profile and audit), `koru/design-system/tokens.json` (W3C DTCG tokens), `koru/design-system/components.json` (the manifest), the generated `build/` (tokens.css, tailwind.preset.js, components.css, gallery.html), Decision cards for every deviation, a person's approval
- **Next:** `koru-explore` builds prototypes on it; `koru-harden` audits against it; `koru-ship` turns it into the code component library

# The design system is the floor, not a suggestion

Everything a deliverable shows is made of two things: **tokens** (every colour, space, size, radius, shadow and type value) and **components** (the manifest). The lint behind the hook refuses, on every write to `koru/deliverables/` and to the front-end folder:

| Rule | What it refuses |
| --- | --- |
| `raw-colour` | any hex, rgb, hsl or oklch value outside the token files, in CSS, inline styles or scripts |
| `off-scale` | margin, padding, gap or font-size not on the token scale; Tailwind spacing keys not in the scale |
| `off-palette`, `arbitrary-value` | Tailwind's own palette (`bg-blue-500`) and `[13px]`-style values |
| `contrast` | text-on-background class pairs under 4.5:1 (3:1 for large text) |
| `bare-control`, `unknown-component` | a `<button>`, `<input>`, `<select>`, `<dialog>` not marked as a system component; any component not in the manifest |
| `foreign-library` | importing another UI library (MUI in a Carbon project, Radix in an Ant project) |
| `no-tokens`, `token-block` | a page that does not load the system, or a hand-edited token block |
| `a11y-alt`, `a11y-click`, `native-dialog` | images without alt, clickable divs, `confirm()` |

Problems already in a file are reported, not blocked, so fixing one thing is never refused because of an older one. `koru ds lint` shows everything.

## Pick the path (ask once, record the answer)

Read `design_system` from the engagement. If it is unset, ask the person one question: "Does the client have a design system in code, only in Figma, only a brand guide, or nothing?" Then:

| The client has | Path | Command |
| --- | --- | --- |
| A system in code (even partial) | **A. Extend theirs** | `koru ds extend --css … --components … --components-doc …` |
| Nothing, and the product should look like a known system, or the client names one | **B. Adopt open source** | `koru ds catalog`, then `koru ds adopt <id>` |
| A brand guide or Figma only, or nothing and a long engagement | **C. Build with Claude Code** | `koru ds adopt koru-neutral`, then the steps below |
| Nothing, and this is a short discovery | **B with koru-neutral** | `koru ds adopt koru-neutral` (behaviour first, AA-checked, swapped later) |

### Path A. Extend the client's system

1. **Audit first** (Frame F3). Write the audit into `koru/design-system.md` under "Audit": what exists in code, what exists only in Figma, what is missing, known defects, who owns it. Use their component docs; never guess.
2. **Import:** `koru ds extend --css inbox/<lib>/tokens.css --name "<Name>" --version <v> --components Button,TextInput,… --components-doc inbox/<lib>/components.md [--tailwind]`. Koru keeps every client token, maps its semantic roles (accent → brand, ink → neutral …) and fills gaps (spacing, type, missing shades, AI colours) from the seed, each marked `added` with a reason. Nothing the client has is overwritten.
3. **Read `koru ds check`.** It runs every semantic pair and every text-on-background pair in the client's own markup through WCAG contrast. A failure in the client's markup (white on their 500 blue at 3.9:1, say) is reported back to their system owner and suggests the passing shade; deliverables can no longer use it because the lint refuses the pair.
4. **Gaps become components with reasons.** When a Screen needs something the system lacks (a data table, a status badge, an AI suggestion), record it: `koru ds component add StatusBadge --spec SCR-002 --states default,success,warning,danger`. Every addition is listed as "to contribute back" in the gallery and the handoff.
5. **One-offs** are `--status snowflake --spec DEC-…` and need a signed Decision. Prefer a **recipe** (a combination of existing components) over a snowflake, and a snowflake over a quiet override.

### Path B. Adopt an open-source system exactly

`koru ds catalog` lists ten systems with pinned versions, licences and limits. Choose with the person using the "use when" line, then `koru ds adopt <id>`. What "exactly" means here:

- **Prototypes load the real library** (CDN mode: Material Web, Carbon, Primer, Spectrum, GOV.UK, USWDS, NHS.UK) or are **built from the real components** into one HTML file (bundle mode: shadcn/ui, Fluent 2, Ant Design; Vite + React + `vite-plugin-singlefile`). Never re-draw a system's components by hand.
- **Only the system's components count.** The lint recognises each system by its class or tag prefix (`cds--`, `md-`, `govuk-`, `ant-`, `data-slot` for shadcn) and refuses components from anywhere else.
- **Brand changes go through the system's own theming** (Carbon themes, MUI `createTheme`, shadcn CSS variables, Ant `ConfigProvider` tokens) and are recorded as tokens in `tokens.json`. Never override a component's CSS.
- **Respect the limits** shown on adopt: no crown, logotype or restricted fonts for GOV.UK and NHS.UK outside those services; no Google, IBM, Microsoft, GitHub or Adobe logos; Adobe Clean and Segoe UI are not licensed for clients' products, so use the system's documented fallback.

### Path C. Build one with Claude Code

Start from `koru ds adopt koru-neutral` (a complete, AA-checked token set and a component kit covering forms, tables, status, overlays, empty and loading states, and AI patterns), then make it the client's in five steps. Each step ends with `koru ds build` and `koru ds check`.

1. **Brand inputs into colour tokens.** From the brand guide take one or two brand colours. Build each into a 50 to 900 scale; keep the brand hue at the shade that passes 4.5:1 against white for text and buttons (often 600 or 700, rarely 500). Add semantic roles on top (`accent`, `ink`, `danger`, `warning`, `success`, `ai`, `surface`, `canvas`, `focus`). Never point a component at a raw scale step.
2. **Space, type, radius, size.** Keep a 4-pixel base unless the brand says otherwise. Type: at most six sizes; body 16px for content-heavy apps and 14px for dense enterprise tables, decided once in a Decision. Targets at least 24px (WCAG 2.5.8), 44px for touch.
3. **Pairs.** List every foreground and background pair the components use in `tokens.json` → `$extensions.koru.pairs`. `koru ds check` must show every pair passing.
4. **Components.** Keep the kit's components and change only tokens. Add a component only for a Screen that needs it (`koru ds component add … --spec SCR-…`), with its states listed (default, hover, focus, active, disabled, loading, error, and empty where it holds data).
5. **Gallery and governance.** `build/gallery.html` shows every token and component. The design lead reviews it with the client and then types `! koru ds approve --name … --role "design lead"`. Any later change to tokens or components needs a new approval; the gates check this.

## Using it in prototypes

- Start every standalone prototype with `koru ds inline <file>`. It adds the token block and kit (or the system's CDN links). Re-run it after `koru ds build`; never edit the block.
- Mark every component: `data-ds="Button"` with the kit class (`k-btn k-btn--primary`) or the system's own markup (`<md-filled-button>`, `class="cds--btn"`). Mark every state: `data-koru-state="STA-004"` on the element that shows it, and make each state reachable by URL (`?state=STA-004`) so the audit can open it.
- Styles inside the page use only `var(--…)` tokens.

## Using it in code (Ship)

`koru-ship` turns the manifest into the code library: tokens to CSS variables and the Tailwind preset (which replaces Tailwind's palette and spacing, so `bg-blue-500` and `p-7` do not exist), one component per manifest entry in the ui folder, stories for every state, and the same lint in CI. See `koru-ship`.

## People own

- The path (A, B or C) and any switch of system later (a Decision).
- Approval of the system (`! koru ds approve`), and of every "new" component with the client's system owner.
- Brand choices (the brand hue, body size, density).

## Coach points

- Ask the designer which three components the first screen needs before you list the gaps.
- When the lint refuses a write, show the person the rule and the token to use; do not work around it with an inline style or a "temporary" class.
