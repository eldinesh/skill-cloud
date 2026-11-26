# Meridian UI components (v1.4.2)

Markup for every component that exists in code. Class names are Tailwind with Meridian colour tokens.

## Button

```html
<!-- Primary -->
<button class="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded">Submit request</button>
<!-- Secondary -->
<button class="bg-white border border-ink-300 text-ink-900 text-sm font-semibold px-4 py-2 rounded hover:bg-ink-100">Cancel</button>
<!-- Ghost -->
<button class="text-brand-600 text-sm font-semibold px-3 py-2 rounded hover:bg-brand-50">View details</button>
<!-- Disabled: add opacity-50 cursor-not-allowed -->
```

Sizes: one size only. No icon-only button.

## Text input

```html
<label class="block text-sm font-semibold text-ink-900 mb-1" for="qty">Quantity</label>
<input id="qty" class="w-full border border-ink-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
<!-- Error -->
<input class="w-full border border-danger-500 rounded px-3 py-2 text-sm" aria-invalid="true" />
<p class="text-xs text-danger-500 mt-1">Enter a quantity</p>
```

Helper text style isn't defined. Teams have used `text-xs text-ink-500`.

## Select

```html
<select class="w-full border border-ink-300 rounded px-3 py-2 text-sm bg-white">
  <option>Supplies</option><option>Equipment</option><option>Transport</option><option>Other</option>
</select>
```

Native select only. No searchable select.

## Checkbox and radio

```html
<label class="flex items-center gap-2 text-sm"><input type="checkbox" class="h-4 w-4 accent-brand-500" /> Urgent</label>
<label class="flex items-center gap-2 text-sm"><input type="radio" name="d" class="h-4 w-4 accent-brand-500" /> Next round</label>
```

## Modal

```html
<div class="fixed inset-0 bg-ink-900/40 flex items-center justify-center">
  <div class="bg-white rounded shadow-lg w-full max-w-md p-6">
    <h2 class="text-lg font-semibold text-ink-900 mb-2">Cancel this request?</h2>
    <p class="text-sm text-ink-700 mb-6">Materials will stop working on it.</p>
    <div class="flex justify-end gap-2"><!-- buttons --></div>
  </div>
</div>
```

No focus trap. Closes on overlay click only.

## Card

```html
<div class="bg-white border border-ink-100 rounded shadow-sm p-4">...</div>
```

## Tabs

```html
<div class="flex border-b border-ink-100 text-sm">
  <button class="px-4 py-2 border-b-2 border-brand-500 text-brand-600 font-semibold">Open</button>
  <button class="px-4 py-2 text-ink-500">Closed</button>
</div>
```

No keyboard arrow support.

## Avatar

```html
<span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">GM</span>
```

## Alert banner

```html
<div class="bg-warning-50 border-l-4 border-warning-500 text-ink-900 text-sm p-3">Delivery rounds are at 10:00 and 16:00.</div>
<div class="bg-danger-50 border-l-4 border-danger-500 text-ink-900 text-sm p-3">Something went wrong.</div>
```

Info and success variants don't exist.
