# @imperijal/date-time-picker

Lumina-style date & time picker for React. Outputs **`YYYY-MM-DDTHH:mm`** (same as HTML `datetime-local`).

## Install

```bash
pnpm add @imperijal/date-time-picker
```

Peer dependencies (install in your app if missing):

```bash
pnpm add react react-dom date-fns lucide-react react-day-picker \
  @radix-ui/react-popover @radix-ui/react-collapsible @radix-ui/react-slot \
  class-variance-authority clsx tailwind-merge
```

## Usage

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
      timeSlots={{ startHour: 5, endHour: 24, intervalMinutes: 30 }}
    />
  );
}
```

## Tailwind

This package uses Tailwind utility classes. Scan the built output in your app config:

```
node_modules/@imperijal/date-time-picker/dist/**/*.js
```

Your app needs shadcn-style CSS variables (`--primary`, `--border`, etc.) or import:

```css
@import '@imperijal/date-time-picker/styles.css';
```

## API

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | required — `YYYY-MM-DDTHH:mm` |
| `onChange` | `(value: string) => void` | required |
| `placeholder` | `string` | `'Select date & time'` |
| `size` | `'default' \| 'sm'` | `'default'` |
| `timeSlots` | `{ startHour?, endHour?, intervalMinutes? }` | 5–24h, 30 min |
| `disabled` | `boolean` | `false` |

## Exports

- `DateTimePicker`
- `DateTimePickerContent` (headless panel)
- `useDateTimeSelection`
- `toLocalInputValue`, `parseLocalInputValue`, `formatLocalInputDisplay`
- `generateTimeSlots`, `getQuickDateOptions`

## License

MIT
