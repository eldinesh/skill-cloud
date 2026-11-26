'use strict';
// koru scaffold: the front-end foundation Ship builds on, generated from the design system and
// the cards, so code starts with the same tokens, components and states the design used.
//
//   tokens      src/styles/tokens.css + tailwind.preset.js (copied from koru ds build; never edited)
//   ui          src/ui/<Component>.tsx: the only place raw HTML controls appear; one per manifest entry
//   patterns    src/patterns/: recipes made of ui components (no raw controls, no literals)
//   features    src/features/<screen>/: one folder per Screen card, states from the State cards
//   quality     ESLint (jsx-a11y, raw controls outside ui, foreign UI libraries), Stylelint (tokens
//               only), TypeScript strict, Vitest + Testing Library + axe per component, stories per state
//
// Stacks: react-tailwind (client system or koru-neutral or shadcn) and react-library (MUI, Carbon,
// Fluent, Ant: the ui layer wraps the library and its theme reads the tokens).

const fs = require('fs');
const path = require('path');
const K = require('./core');
const D = require('./ds');

const VERSIONS = {
  react: '18.3.1', 'react-dom': '18.3.1', typescript: '5.6.3', vite: '5.4.11', '@vitejs/plugin-react': '4.3.4',
  tailwindcss: '3.4.17', postcss: '8.4.49', autoprefixer: '10.4.20',
  eslint: '9.17.0', '@eslint/js': '9.17.0', 'typescript-eslint': '8.18.1', 'eslint-plugin-jsx-a11y': '6.10.2', 'eslint-plugin-react-hooks': '5.1.0', globals: '15.14.0',
  stylelint: '16.12.0', 'stylelint-config-standard': '36.0.1', 'stylelint-declaration-strict-value': '1.10.6',
  vitest: '2.1.8', jsdom: '25.0.1', '@testing-library/react': '16.1.0', '@testing-library/dom': '10.4.0', 'axe-core': '4.10.3',
  '@types/react': '18.3.18', '@types/react-dom': '18.3.5',
};

const pascal = (s) => String(s).replace(/\s*\(.*\)$/, '').replace(/[^A-Za-z0-9]+(.)/g, (m, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase());

// Tailwind recipes for the components Koru knows. Every class is a token class from the preset.
const TW = {
  Button: () => `import { forwardRef, type ButtonHTMLAttributes } from 'react';

const variants = {
  primary: 'bg-accent-600 text-on-accent hover:bg-accent-700',
  secondary: 'bg-surface text-ink-900 border border-ink-300 hover:bg-ink-100',
  ghost: 'bg-transparent text-accent-700 hover:bg-accent-50',
  danger: 'bg-danger-700 text-on-accent',
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants; loading?: boolean };

/** Meridian-style button. One size (40px); disabled and loading keep their label for screen readers. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'primary', loading = false, disabled, className = '', children, ...rest }, ref) {
  return (
    <button ref={ref} data-ds="Button" type="button" disabled={disabled || loading} aria-busy={loading || undefined}
      className={\`inline-flex h-10 items-center justify-center gap-2 rounded-sm px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 \${variants[variant]} \${className}\`} {...rest}>
      {children}
    </button>
  );
});
`,
  TextInput: () => `import { forwardRef, useId, type InputHTMLAttributes } from 'react';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string; error?: string };

/** A labelled text field. The label is required: there is no unlabelled input in this system. */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({ label, help, error, id, className = '', ...rest }, ref) {
  const auto = useId();
  const inputId = id || auto;
  const helpId = help ? \`\${inputId}-help\` : undefined;
  const errorId = error ? \`\${inputId}-error\` : undefined;
  return (
    <div data-ds="TextInput" className={\`flex flex-col gap-1 \${className}\`}>
      <label htmlFor={inputId} className="text-sm font-semibold text-ink-900">{label}</label>
      <input ref={ref} id={inputId} aria-invalid={error ? true : undefined} aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
        className={\`h-10 rounded-sm border bg-surface px-3 text-sm text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus \${error ? 'border-danger-700' : 'border-ink-300'}\`} {...rest} />
      {help && <p id={helpId} className="text-xs text-ink-500">{help}</p>}
      {error && <p id={errorId} className="text-xs text-danger-700">{error}</p>}
    </div>
  );
});
`,
  Select: () => `import { forwardRef, useId, type SelectHTMLAttributes } from 'react';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: { value: string; label: string }[] };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, options, id, className = '', ...rest }, ref) {
  const auto = useId();
  const selectId = id || auto;
  return (
    <div data-ds="Select" className={\`flex flex-col gap-1 \${className}\`}>
      <label htmlFor={selectId} className="text-sm font-semibold text-ink-900">{label}</label>
      <select ref={ref} id={selectId} className="h-10 rounded-sm border border-ink-300 bg-surface px-3 text-sm text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus" {...rest}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
});
`,
  Checkbox: () => `import { forwardRef, type InputHTMLAttributes } from 'react';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string };

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, className = '', ...rest }, ref) {
  return (
    <label data-ds="Checkbox" className={\`inline-flex min-h-6 items-center gap-2 text-sm text-ink-900 \${className}\`}>
      <input ref={ref} type="checkbox" className="h-4 w-4 accent-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus" {...rest} />
      {label}
    </label>
  );
});
`,
  Radio: () => `import { forwardRef, type InputHTMLAttributes } from 'react';

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string };

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ label, className = '', ...rest }, ref) {
  return (
    <label data-ds="Radio" className={\`inline-flex min-h-6 items-center gap-2 text-sm text-ink-900 \${className}\`}>
      <input ref={ref} type="radio" className="h-4 w-4 accent-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus" {...rest} />
      {label}
    </label>
  );
});
`,
  Modal: () => `import { useEffect, useRef, type ReactNode } from 'react';

export type ModalProps = { open: boolean; title: string; onClose: () => void; children: ReactNode; actions?: ReactNode };

/** A real modal dialog: focus moves in and is trapped, Escape closes, focus returns on close.
 *  (Meridian UI 1.4.2's modal had no focus trap and closed on overlay click only.) */
export function Modal({ open, title, onClose, children, actions }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} data-ds="Modal" aria-labelledby="modal-title" onClose={onClose} onCancel={onClose}
      className="w-full max-w-md rounded-md bg-surface p-6 text-ink-900 shadow-3 backdrop:bg-ink-900/40">
      <h2 id="modal-title" className="mb-2 text-lg font-semibold">{title}</h2>
      <div className="mb-6 text-sm text-ink-700">{children}</div>
      {actions && <div className="flex justify-end gap-2">{actions}</div>}
    </dialog>
  );
}
`,
  Card: () => `import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div data-ds="Card" className={\`rounded-md border border-ink-100 bg-surface p-4 shadow-1 \${className}\`} {...rest} />;
}
`,
  Tabs: () => `import { useRef, type KeyboardEvent, type ReactNode } from 'react';

export type TabsProps = { tabs: { id: string; label: string; content: ReactNode }[]; selected: string; onSelect: (id: string) => void; label: string };

/** Tabs with arrow, Home and End keys (Meridian UI 1.4.2 had none), and their panels. */
export function Tabs({ tabs, selected, onSelect, label }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = (next + tabs.length) % tabs.length;
    onSelect(tabs[n].id);
    refs.current[n]?.focus();
  };
  return (
    <div data-ds="Tabs">
      <div role="tablist" aria-label={label} className="flex gap-1 border-b border-ink-100">
        {tabs.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[i] = el; }} type="button" role="tab" id={\`tab-\${t.id}\`} aria-selected={t.id === selected} aria-controls={\`panel-\${t.id}\`}
            tabIndex={t.id === selected ? 0 : -1} onClick={() => onSelect(t.id)} onKeyDown={(e) => onKey(e, i)}
            className={\`h-10 border-b-2 px-4 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus \${t.id === selected ? 'border-accent-600 font-semibold text-accent-700' : 'border-transparent text-ink-700'}\`}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={\`panel-\${t.id}\`} aria-labelledby={\`tab-\${t.id}\`} hidden={t.id !== selected} className="py-4">{t.content}</div>
      ))}
    </div>
  );
}
`,
  Avatar: () => `export function Avatar({ initials, name }: { initials: string; name: string }) {
  return <span data-ds="Avatar" role="img" aria-label={name} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-50 text-xs font-semibold text-accent-700">{initials}</span>;
}
`,
  Alert: () => `import type { ReactNode } from 'react';

const tones = { info: 'border-ink-500 bg-ink-100', warning: 'border-warning-700 bg-warning-50', danger: 'border-danger-700 bg-danger-50', success: 'border-success-700 bg-success-50' } as const;

/** A page-level message. Danger alerts are announced at once; others politely. */
export function Alert({ tone = 'info', title, children }: { tone?: keyof typeof tones; title?: string; children: ReactNode }) {
  return (
    <div data-ds="Alert" role={tone === 'danger' ? 'alert' : 'status'} className={\`flex gap-3 rounded-sm border-l-4 px-4 py-3 text-sm text-ink-900 \${tones[tone]}\`}>
      <div>{title && <p className="font-semibold">{title}</p>}{children}</div>
    </div>
  );
}
`,
  StatusBadge: () => `const tones = { neutral: 'bg-ink-100 text-ink-900', success: 'bg-success-50 text-success-700', warning: 'bg-warning-50 text-warning-700', danger: 'bg-danger-50 text-danger-700' } as const;

/** Status as text, never colour alone (WCAG 1.4.1). Koru addition: contribute back to the client's system. */
export function StatusBadge({ tone = 'neutral', children }: { tone?: keyof typeof tones; children: string }) {
  return <span data-ds="StatusBadge" className={\`inline-flex items-center gap-1 rounded-full px-2 text-xs font-semibold \${tones[tone]}\`}>{children}</span>;
}
`,
  AISuggestion: () => `import type { ReactNode } from 'react';

export type AISuggestionProps = { children: ReactNode; why: string; confidence?: 'high' | 'medium' | 'low'; onAccept: () => void; onDismiss: () => void };

/** An AI suggestion is labelled as AI, says why, says how sure it is, and the person decides.
 *  Koru addition: contribute back to the client's system. */
export function AISuggestion({ children, why, confidence, onAccept, onDismiss }: AISuggestionProps) {
  return (
    <section data-ds="AISuggestion" aria-label="Suggestion" className="rounded-md border border-ai-700 bg-ai-50 px-4 py-3">
      <p className="text-xs font-semibold text-ai-700">Suggested{confidence ? \` · \${confidence} confidence\` : ''}</p>
      <div className="mt-1 text-sm text-ink-900">{children}</div>
      <p className="mt-2 border-l-2 border-ai-700 pl-3 text-sm text-ink-700">{why}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onAccept} className="h-10 rounded-sm bg-accent-600 px-4 text-sm font-semibold text-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus">Use suggestion</button>
        <button type="button" onClick={onDismiss} className="h-10 rounded-sm px-4 text-sm font-semibold text-accent-700 hover:bg-accent-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus">Dismiss</button>
      </div>
    </section>
  );
}
`,
};
TW.TextField = TW.TextInput;
TW.Dialog = TW.Modal;
TW.Badge = TW.StatusBadge;

// Minimal props that render each component, for stories and tests.
const SAMPLE = {
  Button: { states: { default: '{ children: "Send request" }', secondary: '{ children: "Cancel", variant: "secondary" }', disabled: '{ children: "Send request", disabled: true }', loading: '{ children: "Sending", loading: true }' } },
  TextInput: { states: { default: '{ label: "Quantity" }', help: '{ label: "Quantity", help: "Whole boxes" }', error: '{ label: "Quantity", error: "Enter a quantity" }' } },
  Select: { states: { default: '{ label: "Category", options: [{ value: "s", label: "Supplies" }, { value: "e", label: "Equipment" }] }' } },
  Checkbox: { states: { default: '{ label: "Urgent" }', checked: '{ label: "Urgent", defaultChecked: true }' } },
  Radio: { states: { default: '{ label: "Next round", name: "d" }' } },
  Modal: { states: { closed: '{ open: false, title: "Cancel this request?", onClose: () => {}, children: "Materials will stop working on it." }' } },
  Card: { states: { default: '{ children: "Card content" }' } },
  Tabs: { states: { default: '{ label: "Requests", tabs: [{ id: "open", label: "Open", content: "3 open requests" }, { id: "closed", label: "Closed", content: "No closed requests" }], selected: "open", onSelect: () => {} }' } },
  Avatar: { states: { default: '{ initials: "AB", name: "Alex Brook" }' } },
  Alert: { states: { info: '{ children: "Deliveries run at 10:00 and 15:00." }', danger: '{ tone: "danger", children: "Could not send. Try again." }' } },
  StatusBadge: { states: { neutral: '{ children: "Submitted" }', success: '{ tone: "success", children: "On its way" }', warning: '{ tone: "warning", children: "Delayed" }', danger: '{ tone: "danger", children: "Cancelled" }' } },
  AISuggestion: { states: { default: '{ children: "Silicone foam dressing 10x10, box of 10", why: "Matches what you ordered last week.", confidence: "medium", onAccept: () => {}, onDismiss: () => {} }' } },
};
SAMPLE.TextField = SAMPLE.TextInput; SAMPLE.Dialog = SAMPLE.Modal; SAMPLE.Badge = SAMPLE.StatusBadge;

function write(f, s, made) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); made.push(f); }

function scaffold(root, opt) {
  const ds = D.load(root);
  if (!ds.ready) throw new Error('No design system yet. Run the koru-design-system skill first (koru ds status).');
  const eng = K.readEngagement(root);
  const stack = opt.stack || eng.tech_stack;
  if (!stack || stack === 'unknown') throw new Error('The tech stack is not recorded. Ask the engineer (framework, styling, component library, tests), write tech_stack in koru/engagement.md, then run koru scaffold again.');
  if (!/^react-(tailwind|library)$/.test(stack)) throw new Error(`koru scaffold builds react-tailwind and react-library today. For "${stack}", follow koru-ship's architecture rules by hand and run koru ds lint on the code.`);
  const dir = path.resolve(root, opt.dir || eng.frontend_dir || 'app');
  const made = [];
  const man = ds.manifest;
  const comps = man.components.map((c) => ({ ...c, id: pascal(c.name) }));
  const rel = (f) => path.relative(root, f);

  // Tokens: copied from the build, never edited here.
  const tokensCss = fs.readFileSync(ds.paths.css, 'utf8');
  write(path.join(dir, 'src/styles/tokens.css'), tokensCss, made);
  write(path.join(dir, 'tailwind.preset.cjs'), fs.readFileSync(ds.paths.preset, 'utf8'), made);
  write(path.join(dir, 'src/styles/global.css'), `@import './tokens.css';\n\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  font-family: var(--font-family-base);\n  font-size: var(--font-size-md);\n  line-height: var(--font-line-body);\n  color: var(--color-ink-900);\n  background: var(--color-canvas);\n}\n`, made);
  write(path.join(dir, 'tailwind.config.cjs'), `// Only the design system's tokens exist: the preset replaces Tailwind's palette, spacing and type scale.\nmodule.exports = {\n  presets: [require('./tailwind.preset.cjs')],\n  content: ['./index.html', './src/**/*.{ts,tsx}'],\n  corePlugins: { preflight: true },\n};\n`, made);
  write(path.join(dir, 'postcss.config.cjs'), `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };\n`, made);

  // ui layer.
  const built = [];
  const todo = [];
  for (const c of comps) {
    const tpl = stack === 'react-tailwind' ? TW[c.id] : null;
    if (tpl) { write(path.join(dir, `src/ui/${c.id}.tsx`), `// ${man.system} · ${c.name} · ${c.status === 'exists' ? 'exists in the system' : `Koru ${c.status}, spec ${c.spec}`}. Generated by koru scaffold; owned by the team from here.\n${tpl()}`, made); built.push(c); }
    else todo.push(c);
  }
  write(path.join(dir, 'src/ui/index.ts'), `// The only door to UI primitives. Features import from here, never from a library directly.\n${built.map((c) => `export * from './${c.id}';`).join('\n')}\n`, made);

  // Stories and tests per component state.
  for (const c of built) {
    const states = (SAMPLE[c.id] || { states: { default: '{}' } }).states;
    write(path.join(dir, `src/ui/${c.id}.stories.tsx`), `import { ${c.id} } from './${c.id}';\n\nexport default { title: 'UI/${c.id}', component: ${c.id} };\n${Object.entries(states).map(([k, v]) => `export const ${pascal(k)} = { args: ${v} };`).join('\n')}\n`, made);
    write(path.join(dir, `src/ui/${c.id}.test.tsx`), `import { describe, it, expect } from 'vitest';\nimport { render } from '@testing-library/react';\nimport { axe } from '../test/axe';\nimport { ${c.id} } from './${c.id}';\n\ndescribe('${c.id}', () => {\n${Object.entries(states).map(([k, v]) => `  it('${k}: renders with no accessibility violations', async () => {\n    const { container } = render(<${c.id} {...(${v} as any)} />);\n    expect(container.querySelector('[data-ds="${c.id}"]')).not.toBeNull();\n    expect(await axe(container)).toEqual([]);\n  });`).join('\n')}\n});\n`, made);
  }
  write(path.join(dir, 'src/test/axe.ts'), `import axeCore from 'axe-core';\n\n// Serious and critical WCAG A/AA violations in a rendered container.\nexport async function axe(container: Element): Promise<string[]> {\n  const r = await axeCore.run(container, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }, rules: { region: { enabled: false } } });\n  return r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => \`\${v.id}: \${v.help}\`);\n}\n`, made);

  // Features: one folder per live Screen, its states from the State cards.
  const cards = K.loadCards(root);
  const screens = K.liveScreens(cards);
  const states = K.active(cards, 'STA');
  const stateMap = {};
  for (const s of states) stateMap[s.id] = { screen: s.meta.screen || '', title: s.meta.title || '', resolution: String(s.meta.resolution || '') };
  write(path.join(dir, 'src/features/states.ts'), `// Generated from the State cards. Test ids and acceptance criteria name these ids.\nexport const STATES = ${JSON.stringify(stateMap, null, 2)} as const;\nexport type StateId = keyof typeof STATES;\nexport const testId = (id: StateId) => \`state-\${id}\`;\n`, made);
  for (const s of screens) {
    const folder = path.join(dir, 'src/features', `${s.id.toLowerCase()}-${String(s.meta.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30)}`);
    const mine = states.filter((x) => x.meta.screen === s.id && !/^n\/a/i.test(String(x.meta.resolution || '')));
    write(path.join(folder, 'README.md'), `# ${s.id} ${s.meta.title}\n\nBuilt from ${s.id} (v${s.version}). States to implement, each with its test id:\n\n${mine.map((x) => `- ${x.id} ${x.meta.title} → \`data-testid="state-${x.id}"\``).join('\n') || '- (no State cards yet)'}\n\nData and API contract: fill \`contract.ts\` with the engineer before building the screen.\n`, made);
    write(path.join(folder, 'contract.ts'), `// ${s.id}: what this screen reads and writes. Agree it with the engineer; tickets cite it.\nexport interface ${pascal(s.meta.title || s.id)}Data {\n  // e.g. requests: Request[];\n}\n`, made);
  }

  // App shell.
  write(path.join(dir, 'index.html'), `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <title>${eng.client || 'App'}</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`, made);
  write(path.join(dir, 'src/main.tsx'), `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport './styles/global.css';\nimport { App } from './App';\n\ncreateRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);\n`, made);
  const first = built.find((c) => c.id === 'Card') ? 'Card' : null;
  write(path.join(dir, 'src/App.tsx'), `${first ? `import { Card } from './ui';\n\n` : ''}export function App() {\n  return (\n    <main className="p-6">\n      <h1 className="text-xl font-semibold text-ink-900">${eng.client || 'App'}</h1>\n      ${first ? '<Card className="mt-4">Screens go in src/features, built from the ui layer.</Card>' : ''}\n    </main>\n  );\n}\n`, made);

  // Quality gates.
  const uiLibs = ['@mui/*', '@material/*', '@carbon/*', '@fluentui/*', '@primer/*', 'antd', '@adobe/*', '@react-spectrum/*', '@chakra-ui/*', '@mantine/*', 'react-bootstrap', 'bootstrap', '@headlessui/*', '@radix-ui/*'];
  write(path.join(dir, 'eslint.config.js'), `import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

// Architecture rules: raw controls live only in src/ui; features use the ui layer; no other UI library.
const RAW_CONTROLS = 'JSXOpeningElement[name.name=/^(button|input|select|textarea|dialog|table)$/]';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '*.cjs'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.strict,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-restricted-imports': ['error', { patterns: [{ group: ${JSON.stringify(uiLibs)}, message: 'Not part of ${man.system}. Use src/ui.' }] }],
      'no-restricted-syntax': ['error', { selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\\\b|rgba?\\\\(/]", message: 'Literal colour. Use a token.' }],
    },
  },
  {
    files: ['src/features/**/*.tsx', 'src/patterns/**/*.tsx', 'src/App.tsx'],
    rules: {
      'no-restricted-syntax': ['error',
        { selector: RAW_CONTROLS, message: 'Use the ${man.system} component from src/ui, not a raw HTML control.' },
        { selector: "JSXAttribute[name.name='style']", message: 'No inline styles in features. Use token classes or a ui component.' },
        { selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\\\b|rgba?\\\\(/]", message: 'Literal colour. Use a token.' }],
    },
  },
  { files: ['src/**/*.test.tsx', 'src/**/*.stories.tsx'], rules: { '@typescript-eslint/no-explicit-any': 'off' } },
);
`, made);
  write(path.join(dir, '.stylelintrc.json'), JSON.stringify({
    extends: ['stylelint-config-standard'],
    plugins: ['stylelint-declaration-strict-value'],
    ignoreFiles: ['src/styles/tokens.css'],
    rules: {
      'at-rule-no-unknown': [true, { ignoreAtRules: ['tailwind', 'apply', 'layer'] }],
      'import-notation': 'string',
      'color-no-hex': true,
      'scale-unlimited/declaration-strict-value': [['/color$/', 'fill', 'stroke', 'font-size', 'font-family', '/^margin/', '/^padding/', 'gap', 'border-radius', 'box-shadow'], { ignoreValues: ['inherit', 'transparent', 'currentColor', '0', 'none', 'auto', '100%'] }],
    },
  }, null, 2) + '\n', made);
  write(path.join(dir, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, noUnusedLocals: true, noUnusedParameters: true, noFallthroughCasesInSwitch: true, skipLibCheck: true, isolatedModules: true, noEmit: true, types: ['vitest/globals'] },
    include: ['src'],
  }, null, 2) + '\n', made);
  write(path.join(dir, 'vite.config.ts'), `import { defineConfig } from 'vitest/config';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  test: { environment: 'jsdom', globals: true },\n});\n`, made);
  const dev = ['typescript', 'vite', '@vitejs/plugin-react', 'tailwindcss', 'postcss', 'autoprefixer', 'eslint', '@eslint/js', 'typescript-eslint', 'eslint-plugin-jsx-a11y', 'eslint-plugin-react-hooks', 'globals', 'stylelint', 'stylelint-config-standard', 'stylelint-declaration-strict-value', 'vitest', 'jsdom', '@testing-library/react', '@testing-library/dom', 'axe-core', '@types/react', '@types/react-dom'];
  write(path.join(dir, 'package.json'), JSON.stringify({
    name: String(eng.project || 'app').replace(/[^a-z0-9-]/g, '-'), private: true, type: 'module',
    scripts: { dev: 'vite', build: 'tsc && vite build', typecheck: 'tsc', lint: 'eslint . && stylelint "src/**/*.css"', 'lint:ds': 'koru ds lint src', test: 'vitest run', check: 'npm run typecheck && npm run lint && npm run test' },
    dependencies: { react: VERSIONS.react, 'react-dom': VERSIONS['react-dom'] },
    devDependencies: Object.fromEntries(dev.map((d) => [d, VERSIONS[d]])),
  }, null, 2) + '\n', made);
  write(path.join(dir, 'ARCHITECTURE.md'), `# Architecture

Generated by \`koru scaffold\` from ${man.system} ${man.version} and the Koru cards. Stack: ${stack}.

## Layers (imports only go down)

| Layer | Folder | May contain | May not contain |
| --- | --- | --- | --- |
| Tokens | \`src/styles/tokens.css\`, \`tailwind.preset.cjs\` | values, generated by \`koru ds build\` | hand edits |
| UI | \`src/ui/\` | one component per ${man.system} manifest entry; the only place raw \`<button>\`, \`<input>\`, \`<dialog>\` appear | literal colours, sizes, features |
| Patterns | \`src/patterns/\` | recipes: combinations of ui components | raw controls, literals |
| Features | \`src/features/<screen>/\` | one folder per Screen card, its data contract, its states by STA id | raw controls, inline styles, literals, other UI libraries |

## Rules the tools enforce

- \`npm run lint\`: ESLint (jsx-a11y strict, raw controls outside ui, inline styles in features, other UI libraries, literal colours) and Stylelint (tokens only).
- \`npm run lint:ds\`: the Koru design-system lint (palette, spacing scale, arbitrary Tailwind values, contrast, unknown components).
- \`npm test\`: every ui component renders each state with no serious or critical axe violation.
- \`npm run typecheck\`: TypeScript strict.

## Components

${comps.map((c) => `- **${c.id}**: ${c.status === 'exists' ? `in ${man.system}` : `Koru ${c.status} (${c.spec}); contribute back`}${todo.includes(c) ? ' · **not generated: build it in src/ui from its spec, with stories and a test, before any feature uses it**' : ''}`).join('\n')}

## States

\`src/features/states.ts\` lists every State card. Each state renders an element with \`data-testid="state-STA-…"\` so tests and acceptance criteria name the same ids.
`, made);
  return { dir: rel(dir), made: made.map(rel), built: built.map((c) => c.id), todo: todo.map((c) => c.id), stack };
}

function cmdScaffold(root, pos, opt) {
  try {
    const r = scaffold(root, opt);
    console.log(`Scaffolded ${r.dir} (${r.stack}): ${r.made.length} files.`);
    console.log(`UI layer: ${r.built.join(', ')}`);
    if (r.todo.length) console.log(`Not generated (build from their specs before use): ${r.todo.join(', ')}`);
    console.log(`Next: cd ${r.dir} && npm install && npm run check && npm run lint:ds`);
    console.log('Set frontend_dir in koru/engagement.md to this folder so the design-system hook guards it.');
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}

module.exports = { scaffold, cmdScaffold };
