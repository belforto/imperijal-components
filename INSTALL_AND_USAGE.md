# Install & usage — `@imperijal/date-time-picker`

Guide for **installing** the package in an app (e.g. restoranico) and **using** the DateTimePicker component.

For **publishing** to npm, see [PUBLISHING.md](./PUBLISHING.md).

---

## What this package is

`@imperijal/date-time-picker` is a React date & time picker with:

- Quick date chips (Today, Tomorrow, Sat, Sun)
- Expandable calendar
- Scrollable time grid (default **05:00–23:30**, every 30 min)
- Confirm button before applying

**Value format** (same as HTML `datetime-local`):

```
YYYY-MM-DDTHH:mm
```

Example: `2026-06-21T14:30`

---

## Install

### From npm (after you publish)

```bash
pnpm add @imperijal/date-time-picker
```

### Peer dependencies

Your app must already have (or install):

```bash
pnpm add react react-dom date-fns lucide-react react-day-picker \
  @radix-ui/react-popover @radix-ui/react-collapsible @radix-ui/react-slot \
  class-variance-authority clsx tailwind-merge
```

Most of these are already in **restoranico**.

### Local development (before npm publish)

Link from the monorepo:

```bash
# Terminal 1 — build the package
cd /home/marko-og/Documents/wappa/imperijal-components
pnpm build

# Terminal 2 — link globally
cd packages/date-time-picker
pnpm link --global

# Terminal 3 — link in your app
cd /home/marko-og/Documents/wappa/restoranico
pnpm link --global @imperijal/date-time-picker
```

Or use a workspace/file dependency in `restoranico/package.json`:

```json
"@imperijal/date-time-picker": "file:../imperijal-components/packages/date-time-picker"
```

Then run `pnpm install` in restoranico.

---

## Tailwind setup

The picker uses Tailwind classes (`bg-primary`, `border-border`, etc.). Your app must:

### 1. Scan the package in Tailwind content

**Tailwind v3** (`tailwind.config.ts`):

```ts
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  './node_modules/@imperijal/date-time-picker/dist/**/*.js',
],
```

**Tailwind v4** (`globals.css`):

```css
@source "../node_modules/@imperijal/date-time-picker/dist/**/*.js";
```

### 2. CSS variables (shadcn-style)

If your app already uses shadcn/ui theme variables (`--primary`, `--border`, …), nothing else is needed.

Otherwise import optional tokens:

```css
@import '@imperijal/date-time-picker/styles.css';
```

### 3. react-day-picker styles

If the calendar looks unstyled, add in your global CSS:

```css
@import 'react-day-picker/style.css';
```

---

## Basic usage

```tsx
'use client';

import { useState } from 'react';
import {
  DateTimePicker,
  toLocalInputValue,
} from '@imperijal/date-time-picker';

export function Example() {
  const [value, setValue] = useState(() => toLocalInputValue(new Date()));

  return (
    <DateTimePicker
      value={value}
      onChange={setValue}
    />
  );
}
```

---

## Usage in restoranico (traffic page)

Replace local imports:

```tsx
// Before
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { toLocalInputValue } from '@/lib/datetime/local-input-value';

// After
import {
  DateTimePicker,
  toLocalInputValue,
} from '@imperijal/date-time-picker';
```

Example fields:

```tsx
<DateTimePicker
  value={defaultDeadline}
  onChange={handleDefaultDeadlineChange}
  className="mt-0.5 border-slate-200 focus-visible:ring-indigo-400"
/>

<DateTimePicker
  value={departureTime}
  onChange={setDepartureTime}
  className="mt-0.5 border-slate-200 focus-visible:ring-indigo-400"
/>

<DateTimePicker
  value={d.deadline}
  onChange={(deadline) => updateDelivery(d.id, { deadline })}
  size="sm"
  className="mt-0.5 border-slate-200 focus-visible:ring-indigo-400"
/>
```

Convert to ISO when sending to API (unchanged):

```tsx
deadline: new Date(d.deadline).toISOString()
departureTime: new Date(departureTime).toISOString()
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | `YYYY-MM-DDTHH:mm` |
| `onChange` | `(value: string) => void` | required | Called on Confirm |
| `placeholder` | `string` | `'Select date & time'` | Empty state label |
| `size` | `'default' \| 'sm'` | `'default'` | Trigger size |
| `disabled` | `boolean` | `false` | Disable trigger |
| `className` | `string` | — | Extra classes on trigger |
| `id` | `string` | — | HTML id on trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Popover alignment |
| `timeSlots` | `TimeSlotConfig` | see below | Time range config |

### `timeSlots` config

```tsx
<DateTimePicker
  value={value}
  onChange={setValue}
  timeSlots={{
    startHour: 5,      // first slot hour (24h)
    endHour: 24,       // exclusive end (24 = include 23:30)
    intervalMinutes: 30,
  }}
/>
```

---

## Exported helpers

```tsx
import {
  toLocalInputValue,       // Date → "2026-06-21T14:30"
  parseLocalInputValue,    // string → Date | null
  formatLocalInputDisplay, // string → "Jun 21, 2026, 14:30"
  combineLocalDateTime,      // date + hours + minutes → string
  generateTimeSlots,
  getQuickDateOptions,
  useDateTimeSelection,    // headless hook
  DateTimePickerContent,   // panel without popover
} from '@imperijal/date-time-picker';
```

---

## Monorepo layout

```
imperijal-components/          ← NOT published (private root)
├── packages/
│   └── date-time-picker/      ← @imperijal/date-time-picker (published)
└── INSTALL_AND_USAGE.md       ← this file
```

**Never run `npm publish` from the repo root.** Only publish packages inside `packages/`.

---

## Common errors

### `E403` — Two-factor authentication required

npm blocks publish until 2FA is enabled. See [PUBLISHING.md — Fix E403](./PUBLISHING.md#fix-e403-two-factor-authentication-required).

### Published wrong package name `imperijal-components`

You ran publish from the **monorepo root**. Root must stay `"private": true`. Publish only:

```bash
cd packages/date-time-picker
pnpm publish --access public
```

Or from root:

```bash
pnpm publish:date-time-picker
```

### Styles look broken

- Add Tailwind content path for `node_modules/@imperijal/date-time-picker/dist/**/*.js`
- Ensure CSS variables (`--primary`, etc.) exist in your app

### `Module not found: @imperijal/date-time-picker`

Package not installed or not built. Run `pnpm build` in monorepo, then `pnpm install` in app.

---

## Uninstall / unlink local package

```bash
cd restoranico
pnpm unlink --global @imperijal/date-time-picker
pnpm remove @imperijal/date-time-picker
```
