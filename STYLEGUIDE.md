# sw-admin Design System & Styleguide

> **Stack:** Vue 3.4 · TypeScript · Vite · PrimeVue 4 · Tailwind CSS 4
>
> **Core rule:** Everything styling-related flows through this system. Before writing a raw CSS value, check if a token, utility, or component class already covers it.

---

## How to change things globally

This is the most important section. Every major design decision is controlled from a single location. When you want to change something across the entire app, here's where to go:

| What to change | Where | Example |
|---|---|---|
| Hover/interactive speed | `tokens.css` → `--sw-duration-fast` | All button hovers, row highlights |
| Standard fade speed | `tokens.css` → `--sw-duration-base` | All Vue `<Transition>` fades |
| Slide/panel speed | `tokens.css` → `--sw-duration-slow` | Slide-in panels, collapse animations |
| Easing function | `tokens.css` → `--sw-ease` | All transitions that use `var(--sw-ease)` |
| All text colors | `tokens.css` → `--sw-text-*` | Headings, labels, muted text, accent |
| All border colors | `tokens.css` → `--sw-border-*` | Dividers, card borders, inputs |
| All backgrounds | `tokens.css` → `--sw-bg-*` | Cards, page fill, hover states |
| Drawer form field gap | `drawer.css` → `.drw-scroll` → `gap-3` | Space between all drawer form fields |
| Section gap inside drawer | `drawer.css` → `.drw-section` → `gap-4` | Space between grouped sections |
| Card body padding | `cards.css` → `.view-card-body` → `px-5 py-3.5` | Padding inside all view cards |
| Field row height | `cards.css` → `.fr-row` → `py-1.5` | Row height in all edit card fields |
| Page header height | `edit.css` / `add.css` → `.edit-hdr` / `.add-hdr` → `min-h-[75px]` | All page header heights |
| Status badge style | `overview.css` → `.status-badge--*` | Colors for all overview badges |
| Status pill style | `edit.css` → `.status-pill--*` | Colors for all edit page pills |
| Tab badge style | `edit.css` → `.edit-tab-badge` | All tab count badges |
| Primary button color | PrimeVue theme (not in this repo) | — |
| Outlined/back button | `style.css` → `.p-button.btn-outlined` | All `.btn-outlined` buttons |

> **Adding a new global design decision?** Add a `--sw-*` token to `tokens.css` and use it everywhere. That way, one edit in the future changes all instances.

---

## 1. Design Tokens (`src/assets/tokens.css`)

Single source of truth for colors and timing. Always use `--sw-*` variables. Never use raw `--p-gray-*` or `--p-surface-*` outside of `tokens.css` itself.

### Text

| Token | Use |
|---|---|
| `--sw-text` | Headings, values, primary body text |
| `--sw-text-strong` | Strong labels (drawer field labels) |
| `--sw-text-sub` | Secondary interactive text, hover states |
| `--sw-text-label` | Form labels, nav items, card titles |
| `--sw-text-muted` | Hints, descriptions, captions |
| `--sw-text-faint` | Nav group labels, very subtle text |
| `--sw-text-accent` | Active nav, links, accent text |

### Borders

| Token | Use |
|---|---|
| `--sw-border` | Inner dividers, subtle separators |
| `--sw-border-md` | Card outer borders, table row separators |
| `--sw-border-input` | Input fields, interactive mode-cards |

### Backgrounds

| Token | Use |
|---|---|
| `--sw-bg` | Cards, panels, primary surfaces |
| `--sw-bg-subtle` | Card headers, inset areas, row hover |
| `--sw-bg-page` | Tab scroll area, page fill |
| `--sw-bg-muted` | Badges, avatar backgrounds |

### Transitions

| Token | Value | Use |
|---|---|---|
| `--sw-duration-fast` | `0.1s` | Hover effects: color, background, border |
| `--sw-duration-base` | `0.15s` | Standard visibility: opacity, Vue transitions |
| `--sw-duration-slow` | `0.2s` | Larger movements: slides, max-height reveals |
| `--sw-ease` | `ease` | Standard easing function |

**Usage in templates:**
```html
<div class="bg-(--sw-bg) border border-(--sw-border) text-(--sw-text-label)">
```

**Usage in CSS:**
```css
.my-class {
  @apply bg-(--sw-bg) text-(--sw-text-muted);
  transition: background var(--sw-duration-fast), color var(--sw-duration-fast);
}
```

---

## 2. Typography Utilities (`src/assets/tokens.css`)

Defined with `@utility` — use as class names in templates or with `@apply` in CSS.

| Utility | Size | Weight | Transform | Use |
|---|---|---|---|---|
| `sw-title` | `xs` (0.75rem) | 600 | uppercase | Card/section headers (ALL CAPS) |
| `sw-heading` | `base` (1rem) | 600 | — | Page/card headings |
| `sw-label` | `sm` (0.875rem) | — | — | Standard form field labels |
| `sw-caption` | `xs` (0.75rem) | — | — | Hints, descriptions, empty states |
| `sw-nano` | 0.625rem (10px) | 700 | uppercase | Step numbers, SOON badges, filter labels |

```html
<h2 class="sw-heading">Klantgegevens</h2>
<p class="sw-caption">Geen resultaten gevonden</p>
<span class="sw-title">Omzet per jaar</span>
<span class="sw-nano">soon</span>
```

**For sizes not covered by utilities**, use Tailwind arbitrary values. Allowed set:
- `text-[0.8125rem]` — compact table/list text (13px)
- `text-[0.6875rem]` — dense UI labels (11px)
- `text-[0.7rem]` — icon-scale text (≈11px)
- `text-[0.6rem]` — micro icons (e.g. pending clock dot)

> Do not invent new arbitrary rem values. Use the nearest defined size above.

---

## 3. Spacing Scale

Always use Tailwind's spacing scale. Never use raw `rem` or `px` values for padding/margin/gap.

| Tailwind | rem | px | Use |
|---|---|---|---|
| `0.5` | 0.125rem | 2px | Micro gaps (badge padding) |
| `1` | 0.25rem | 4px | Tight inline gaps |
| `1.5` | 0.375rem | 6px | Field label–input gap (`.drw-field`) |
| `2` | 0.5rem | 8px | Small component gaps |
| `2.5` | 0.625rem | 10px | Filter module gaps |
| `3` | 0.75rem | 12px | Standard form gap (`.drw-scroll`) |
| `3.5` | 0.875rem | 14px | Card body padding |
| `4` | 1rem | 16px | Section padding, large gaps |
| `5` | 1.25rem | 20px | Header padding (px), card outer |
| `6` | 1.5rem | 24px | Full-section padding |

### Form spacing conventions

These are the agreed-upon gaps. Changing a class definition changes it everywhere that class is used.

| Context | Gap | Defined in |
|---|---|---|
| Between drawer form fields | `gap-3` | `.drw-scroll` in `drawer.css` |
| Between sections within a drawer | `gap-4` | `.drw-section` in `drawer.css` |
| Between label and input | `gap-1.5` | `.drw-field` in `drawer.css` |
| Between `fr-row` fields (view cards) | `gap-2 py-1.5` per row | `.fr-row` in `cards.css` |
| Between cards on a tab | `mb-5` | `.view-card` in `cards.css` |

---

## 4. Transitions & Animations

### Transition tokens

All `transition:` declarations must use the token variables from `tokens.css`. This means changing a single token value in `tokens.css` updates every hover effect, fade, and animation in the app simultaneously.

```css
/* ✅ Correct — uses tokens */
.my-btn {
  transition: background var(--sw-duration-fast), color var(--sw-duration-fast);
}

/* ❌ Wrong — hardcoded, won't update globally */
.my-btn {
  transition: background 0.1s, color 0.1s;
}
```

**Speed tier guide:**

| Token | When to use |
|---|---|
| `--sw-duration-fast` | Hover color/background/border changes — should feel instant |
| `--sw-duration-base` | Opacity fades, Vue `<Transition>` visibility changes |
| `--sw-duration-slow` | Transforms, max-height reveals, larger movements |
| Keep as-is | `cubic-bezier(...)` spring animations (`pill-pop`, `slide-up`) — intentional |

### Named Vue transitions

All reusable transition names are defined globally and ready to use. Component-specific ones are noted.

| Name | Defined in | Use |
|---|---|---|
| `collapse` | `cards.css` | Reveal/hide sub-sections (expandable fields, form conditionals) |
| `card-fade` | `cards.css` | Toggle between view/edit states of a card |
| `fade-slide` | `cards.css` | Conditional sections sliding in from below |
| `fade` | `filter.css` | Simple opacity fade (popovers, overlays) |
| `slide-fade` | `filter.css` | Filter chips sliding in from above |
| `feature` | `GroupFeatureCards.vue` (scoped) | Feature card list reordering |
| `pill-pop` | `OrdersAdd_Products.vue` (scoped) | Bouncy tag creation (spring easing) |
| `toolbar-slide` | `QuotationOfferTab.vue` (scoped) | Toolbar expand/collapse via max-height |
| `slide-up` | `OfferProductTable.vue` (scoped) | Context menu popup (spring easing) |

```html
<!-- Standard reveal of a sub-section (e.g. conditional form field) -->
<Transition name="collapse">
  <div v-if="showSubSection">...</div>
</Transition>

<!-- Card view/edit toggle -->
<Transition name="card-fade">
  <div v-if="!editing" key="view">...</div>
  <div v-else key="edit">...</div>
</Transition>

<!-- List of items appearing/disappearing -->
<TransitionGroup name="fade-slide" tag="div">
  <div v-for="item in items" :key="item.id">...</div>
</TransitionGroup>
```

### Adding a new transition

1. Define it in the appropriate global CSS asset file (not scoped) if it will be reused.
2. Use `var(--sw-duration-*)` for all timing values.
3. Add it to the table above.

```css
/* Example: new transition in cards.css */
.my-new-enter-active {
  transition: opacity var(--sw-duration-base) var(--sw-ease), transform var(--sw-duration-base) var(--sw-ease);
}
.my-new-leave-active {
  transition: opacity var(--sw-duration-fast) var(--sw-ease), transform var(--sw-duration-fast) var(--sw-ease);
}
.my-new-enter-from,
.my-new-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}
```

---

## 5. Buttons

PrimeVue's `<Button>` component covers all cases. There are 7 established archetypes — use these consistently and do not invent new combinations.

### Button archetypes

**1. Primary action (save, confirm)**
```html
<Button label="Opslaan" icon="pi pi-check" />
<Button label="Toevoegen" icon="pi pi-plus" />
```

**2. Cancel / secondary**
```html
<Button label="Annuleren" severity="secondary" outlined />
```

**3. Subtle secondary (non-destructive action in header)**
```html
<Button label="Bewerken" severity="secondary" outlined size="small" />
```

**4. Icon-only action (in rows, toolbars)**
```html
<!-- Edit -->
<Button icon="pi pi-pencil" severity="secondary" text size="small" rounded />
<!-- Delete -->
<Button icon="pi pi-trash" severity="danger" text size="small" rounded />
<!-- Menu trigger -->
<Button icon="pi pi-ellipsis-v" severity="secondary" text rounded />
<!-- Copy -->
<Button icon="pi pi-copy" text size="small" rounded />
```

**5. Danger (destructive action)**
```html
<!-- Prominent -->
<Button label="Verwijderen" severity="danger" outlined />
<!-- Subtle -->
<Button label="Verwijderen" severity="danger" text />
```

**6. Outlined gray — `btn-outlined` (subtle secondary actions, search triggers)**

Defined in `style.css` as `.p-button.btn-outlined`. Use when an action needs a border but should not compete with the primary button.
```html
<Button label="Klant zoeken" icon="pi pi-search" class="btn-outlined" />
<Button label="HM nummer" class="btn-outlined" />
```

**7. Back button — `btn-back` (navigation)**

Defined in `style.css`. Use in page headers for the back action.
```html
<Button label="Terug" icon="pi pi-arrow-left" class="btn-back" size="small" />
```

### Button sizing

| When | Size |
|---|---|
| Page headers, primary CTAs | default (no `size` prop) |
| Toolbars, secondary actions, icon-only | `size="small"` |
| Standalone forms, add pages | default |

### Footer button order

Always: **secondary/cancel on the left, primary action on the right**.
```html
<div class="drawer-footer">
  <Button label="Annuleren" severity="secondary" outlined />
  <Button label="Opslaan" icon="pi pi-check" />
</div>
```

---

## 6. Page Layout Patterns

### Overview pages
```html
<OverviewLayout>
  <template #header>
    <OverviewHeader title="Klanten">
      <template #actions><Button label="Nieuw" icon="pi pi-plus" /></template>
    </OverviewHeader>
  </template>
  <OverviewToolbar :count="total" label="klanten" />
  <OverviewTable>
    <Column ... />
  </OverviewTable>
</OverviewLayout>
```

### Edit pages
```html
<EditPageLayout>
  <EditPageHeader title="Jan de Vries" subtitle="..." :back="..." avatar-class="...">
    <template #pills><span class="status-pill status-pill--active">Actief</span></template>
    <template #stats>...</template>
    <template #actions><Button label="Opslaan" icon="pi pi-check" /></template>
  </EditPageHeader>
  <!-- Use EditPageTabs for ≤4 tabs, EditPageNav for >4 -->
  <EditPageNav :sections="navSections" />
</EditPageLayout>
```

### Add pages
```html
<AddPageLayout>
  <template #header><AddPageHeader title="..." subtitle="..." :back="..." /></template>
  <template #nav><AddPageNav :sections="navSections" /></template>
  <!-- sections go here -->
  <template #footer>
    <Button label="Annuleren" severity="secondary" outlined @click="router.push(back)" />
    <Button label="Opslaan" icon="pi pi-check" @click="handleSave" />
  </template>
</AddPageLayout>
```

---

## 7. CSS Asset Files

Each file has a single responsibility. Always include `@reference "tailwindcss"` at the top.

| File | Responsibility |
|---|---|
| `tokens.css` | Design tokens (`--sw-*`) and typography `@utility` definitions |
| `edit.css` | Edit page layout, header, tabs, nav, status pills |
| `add.css` | Add page layout, header, nav, sections, footer |
| `cards.css` | View cards, field rows (`fr-row`), shared tables, **all global Vue transitions** |
| `drawer.css` | Drawer/dialog form layout (`drw-*`, `drawer-footer`) |
| `overview.css` | Overview table, status badges, site tags |
| `filter.css` | Filter bar, chips, popover customize menu, **filter-specific transitions** |
| `cart-accordion.css` | Order cart accordion (order-specific) |
| `offers-edit.css` | Offers edit page (offers-specific) |
| `style.css` | Global Tailwind imports, root theme, custom button classes |

**Rule:** New shared patterns go into the appropriate asset file. Component-specific styles go in `<style scoped>` within the `.vue` file. New Vue transitions that could be reused go into `cards.css`.

---

## 8. Custom Class Rules

### Always use `@apply`
Every custom class must use `@apply` for Tailwind utilities. Raw CSS properties are only acceptable when there is no Tailwind equivalent.

```css
/* ✅ Correct */
.my-btn {
  @apply flex items-center gap-2 px-3 py-1.5 text-sm rounded-md;
  transition: background var(--sw-duration-fast), color var(--sw-duration-fast);
}

/* ❌ Wrong */
.my-btn {
  display: flex;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}
```

### Acceptable raw CSS (no Tailwind equivalent)
- `transition: var(--sw-duration-*) var(--sw-ease)` — always with tokens
- `transform: translateY(...)` — in animation from/to states
- `grid-template-columns: ...` — custom grid definitions
- `padding: 0.05rem 0.375rem` — sub-pixel values with no Tailwind step

---

## 9. PrimeVue Styling — `pt` vs Global CSS

PrimeVue 4 exposes every internal DOM element through the **PassThrough (pt)** API. This is the correct way to apply Tailwind classes or override styles on PrimeVue internals — not `:style` bindings or deep CSS selectors.

### Decision tree

| Goal | Approach |
|---|---|
| Style an internal part of one component instance | `:pt="{ root: { class: '...' } }"` |
| Style an internal part of every instance of a component | Global pt in `main.ts` via `app.use(PrimeVue, { pt: { ... } })` |
| Style a PrimeVue element that has no pt key | Scoped `<style>` with `:deep(.p-xxx)` |
| Style a custom button variant globally | `style.css` — `.p-button.btn-*` class |
| Dynamic sizing (computed from data) | `:style="{ width: ... }"` — only when truly dynamic |

### Using `pt` on a single instance

```html
<!-- Apply Tailwind classes to PrimeVue internals without :style or :deep -->
<Drawer
  :pt="{
    content: { class: 'flex flex-col p-0 overflow-hidden' },
    header: { class: 'border-b border-(--sw-border-md) px-5 py-4' },
  }"
/>

<DataTable
  :pt="{
    thead: { class: 'bg-(--sw-bg-subtle)' },
  }"
/>
```

### Finding `pt` keys

Run a component in the browser, inspect the DOM, and look for `data-pc-section` attributes — those are the `pt` key names.

```html
<!-- In the rendered DOM you'll see: -->
<div data-pc-section="content">...</div>
<!-- → use pt key: content -->
```

### When `:deep()` is still acceptable

Use `:deep()` only when:
1. The element has no `pt` key, **and**
2. The override is scoped to one component (not app-wide)

```css
/* Acceptable — no pt key available, scoped to this component */
.my-wrapper :deep(.p-autocomplete-input) {
  @apply text-sm;
}
```

### What to avoid

```html
<!-- ❌ :style for static values — use pt instead -->
<Column style="width: 8rem" />

<!-- ✅ Use pt -->
<Column :pt="{ root: { style: 'width: 8rem' } }" />
<!-- or Tailwind class where supported -->
<Column header-class="w-32" />
```

---

## 10. Shared Component Classes

### View card (read-only display on edit tabs)
```html
<div class="view-card">
  <div class="view-card-hdr">
    <span class="view-card-title">Sectie naam</span>
    <Button ... />
  </div>
  <div class="view-card-body">
    <div class="fr-row">
      <span class="fr-label">Veldnaam</span>
      <span class="fr-value">Waarde</span>
      <!-- or: <span class="fr-empty">—</span> -->
    </div>
  </div>
</div>
```

### Drawer form layout
```html
<div class="drw-scroll">
  <div class="drw-section-hdr">Sectie titel</div>

  <div class="drw-field">
    <label class="drw-label">Veldnaam <span class="drw-req">*</span></label>
    <InputText class="w-full" />
    <p class="drw-hint">Optionele hint tekst</p>
  </div>

  <!-- 2-column grid -->
  <div class="drw-grid">
    <div class="drw-field">...</div>
    <div class="drw-field">...</div>
  </div>

  <!-- Label + toggle side-by-side -->
  <div class="drw-row">
    <label class="drw-label">Toggle label</label>
    <ToggleSwitch />
  </div>

  <!-- Inset sub-section -->
  <div class="drw-inset">...</div>
</div>

<div class="drawer-footer">
  <Button label="Annuleren" severity="secondary" outlined />
  <Button label="Opslaan" />
</div>
```

### Drawer widths (standard sizes)
```html
<!-- Small: personal/account dialogs (~448px) -->
:style="{ width: '28rem' }"

<!-- Medium: address, group drawers (~544px) -->
:style="{ width: '34rem' }"

<!-- Large: add-products, complex drawers (~672px) -->
:style="{ width: '42rem' }"
```

### Status badges (overview tables)
```html
<span class="status-badge status-badge--active">Actief</span>
<span class="status-badge status-badge--no">Nee</span>
<span class="status-badge status-badge--planned">Gepland</span>
<span class="status-badge status-badge--expired">Verlopen</span>
```

### Status pills (edit page headers / tabs)
```html
<span class="status-pill status-pill--active">Actief</span>
<span class="status-pill status-pill--open">Open</span>
<span class="status-pill status-pill--expired">Verlopen</span>
<span class="status-pill status-pill--cancelled">Geannuleerd</span>
<span class="status-pill status-pill--planned">Gepland</span>
<span class="status-pill status-pill--site">sawiday.nl</span>
```

### Tab/nav badges (count indicators)
```html
<span class="edit-tab-badge">12</span>   <!-- on horizontal tabs -->
<span class="edit-nav-badge">3</span>    <!-- on sidebar nav -->
<span class="tab-soon">soon</span>       <!-- coming soon label -->
```

### Site tags
```html
<span class="site-tag">sawiday.nl</span>
<span class="site-tag site-tag--more">+2</span>
```

---

## 10. DataTable Column Widths

PrimeVue `<Column>` requires inline `style="width: Xrem"` for sizing — Tailwind classes can't be applied directly. Use these standard sizes:

| Size | rem | Use |
|---|---|---|
| XS | `3rem` | Checkbox, icon/action columns |
| S | `6–8rem` | Short codes, abbreviations |
| M | `9–10rem` | Dates, status, short text |
| L | `12–14rem` | Names, email, medium text |
| XL | `16–17rem` | Long names, full descriptions |

---

## 11. Icons

Standard sizes for PrimeVue icons:

| Context | Class | rem |
|---|---|---|
| Nav, tab icons | `text-sm` | 0.875rem |
| Action button icons | `text-xs` | 0.75rem |
| Small decorative | `text-[0.7rem]` | 0.7rem |
| Large display (upload zones, etc.) | `text-[1.75rem]` | 1.75rem |
| XL hero (choice cards) | `text-[2.5rem]` | 2.5rem |

---

## 12. Common Patterns

### Small icon button (tree rows, toolbar actions)
```html
<button class="flex items-center justify-center rounded cursor-pointer
               text-(--sw-text-muted) w-[1.375rem] h-[1.375rem] bg-none border-none"
        style="transition: background var(--sw-duration-fast), color var(--sw-duration-fast)">
  <i class="pi pi-pencil text-xs" />
</button>
```

### Accordion / grid-row collapse (height animation)
```html
<!-- CSS grid trick: animates height without knowing exact height -->
<div :style="{ gridTemplateRows: isOpen ? '1fr' : '0fr' }"
     style="display: grid; transition: grid-template-rows var(--sw-duration-base) var(--sw-ease)">
  <div style="overflow: hidden">...content...</div>
</div>
```

### Tree item depth indentation
```html
<!-- Dynamic calculation — inline style is correct here -->
:style="{ paddingLeft: `${0.5 + depth * 1.25}rem` }"
```

---

## 13. What Lives Where

| Need | Where to put it |
|---|---|
| Color, border, background tokens | `tokens.css` — `--sw-*` |
| Transition duration/easing | `tokens.css` — `--sw-duration-*`, `--sw-ease` |
| Typography utilities | `tokens.css` — `@utility sw-*` |
| Shared layout/page classes | `edit.css`, `add.css`, `cards.css`, etc. |
| Reusable Vue transition | `cards.css` (or `filter.css` for filter-specific) |
| Component-specific styles | `<style scoped>` in the `.vue` file |
| One-off size overrides | Tailwind arbitrary value: `class="text-[0.8125rem]"` |
| PrimeVue internal styling | `:pt="{ key: { class: '...' } }"` — see section 9 |
| PrimeVue dynamic sizing | `:style` binding only when value is computed from data |
| Custom button styles | `style.css` — `.p-button.btn-*` |

---

## 14. Checklist Before Merging

- [ ] No raw `color:`, `background:`, `border-color:` properties — use `@apply` with token classes
- [ ] No `--p-gray-*` or `--p-surface-*` used outside `tokens.css`
- [ ] No `font-size:` with unlisted decimal rem values — use a defined arbitrary value from section 2
- [ ] No `padding:` or `margin:` raw properties — use `@apply py-x px-x` etc.
- [ ] No hardcoded `transition` durations (`0.1s`, `0.15s`) — use `var(--sw-duration-*)` tokens
- [ ] All `<style scoped>` blocks start with `@reference "@/assets/style.css"` (not `"tailwindcss"` — that misses project theme colors and custom utilities)
- [ ] Reusable Vue transitions added to `cards.css`, not duplicated per component
- [ ] Drawer widths use one of the three standard sizes (28rem / 34rem / 42rem)
- [ ] Button uses an established archetype from section 5
