# Customization — `@imperijal/date-time-picker`

## Does Tailwind need to be installed?

**Yes.** This package ships **Tailwind class names** in the components — it does **not** bundle Tailwind CSS.

Your app must have:

1. **Tailwind CSS** configured (v3 or v4)
2. **Content scan** including the package:

```js
// tailwind.config (v3)
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  './node_modules/@imperijal/date-time-picker/dist/**/*.js',
]
```

```css
/* globals.css (v4) */
@source "../node_modules/@imperijal/date-time-picker/dist/**/*.js";
```

3. **CSS theme variables** (`--primary`, `--border`, etc.) — either from shadcn/ui or:

```css
@import '@imperijal/date-time-picker/styles.css';
```

4. **Peer dependencies** installed (see package README)

Without Tailwind + theme variables, the component renders **unstyled / empty-looking**.

---

## Customization via props

You customize with **props** (pass Tailwind classes as strings). You do **not** install Tailwind inside the package itself.

### `className` — trigger button

```tsx
<DateTimePicker
  value={value}
  onChange={setValue}
  className="mt-2 border-slate-200 bg-white shadow-sm focus-visible:ring-indigo-400"
/>
```

### `popoverClassName` — popover panel

```tsx
<DateTimePicker
  value={value}
  onChange={setValue}
  popoverClassName="border-2 border-indigo-200 shadow-xl"
/>
```

### `contentClassName` — inner picker (date chips + time grid)

```tsx
<DateTimePicker
  value={value}
  onChange={setValue}
  contentClassName="text-sm"
/>
```

### `size` — preset trigger size

```tsx
<DateTimePicker size="sm" ... />   // compact (delivery rows)
<DateTimePicker size="default" ... />
```

### `placeholder`

```tsx
<DateTimePicker placeholder="Pick deadline" ... />
```

### `disabled`

```tsx
<DateTimePicker disabled ... />
```

### `align` — popover position

```tsx
<DateTimePicker align="start" ... />   // default
<DateTimePicker align="center" ... />
<DateTimePicker align="end" ... />
```

### `timeSlots` — time range & interval

```tsx
<DateTimePicker
  timeSlots={{
    startHour: 5,           // 05:00 first slot
    endHour: 24,            // up to 23:30 (exclusive end)
    intervalMinutes: 30,    // 30 min steps
  }}
/>
```

Examples:

| Config | Result |
|--------|--------|
| Default | 05:00–23:30 every 30 min |
| `{ startHour: 9, endHour: 18 }` | Business hours |
| `{ intervalMinutes: 15 }` | 15-minute slots |

---

## Customization via CSS variables (global theme)

Override colors for **all** pickers in your app:

```css
:root {
  --primary: #9810fa;
  --primary-foreground: #ffffff;
  --border: #e2e8f0;
  --accent: #f1f5f9;
}
```

Or import the package defaults and override after:

```css
@import '@imperijal/date-time-picker/styles.css';

:root {
  --primary: #004ac6;
}
```

---

## What is NOT customizable via props (today)

| Part | How to customize |
|------|------------------|
| Date chip labels (Today, Tomorrow) | Fork / PR — hardcoded in `quick-dates.ts` |
| Step titles ("Step 1: Choose Date") | Use `DateTimePickerContent` directly |
| Confirm button text | Use `DateTimePickerContent` directly |
| Icons | Uses `lucide-react` internally |

For full control, use the headless export:

```tsx
import { DateTimePickerContent, useDateTimeSelection } from '@imperijal/date-time-picker';
```

---

## restoranico example

```tsx
<DateTimePicker
  value={defaultDeadline}
  onChange={handleDefaultDeadlineChange}
  className="mt-0.5 border-slate-200 focus-visible:ring-indigo-400"
/>

<DateTimePicker
  value={d.deadline}
  onChange={(deadline) => updateDelivery(d.id, { deadline })}
  size="sm"
  className="mt-0.5 border-slate-200 focus-visible:ring-indigo-400"
/>
```

restoranico already has Tailwind + shadcn variables — no extra install needed beyond the npm package.

---

## Summary

| Question | Answer |
|----------|--------|
| Install Tailwind in consumer app? | **Yes** |
| Pass Tailwind via props? | **Yes** — `className`, `popoverClassName`, `contentClassName` |
| Tailwind inside the npm package? | **No** — peer / consumer responsibility |
| Change colors globally? | CSS variables on `:root` |
| Change time range? | `timeSlots` prop |
