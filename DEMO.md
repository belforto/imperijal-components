# Demo playground — local iteration & public preview

How to **preview components locally**, ship **v2**, add **new components**, and show a **live demo** to npm users.

---

## Monorepo layout

```
imperijal-components/
├── apps/
│   └── demo/                    ← local + public demo site (NOT published to npm)
├── packages/
│   ├── date-time-picker/        ← @imperijal/date-time-picker (published)
│   └── your-next-component/     ← future packages
├── DEMO.md                      ← this file
├── INSTALL_AND_USAGE.md
└── PUBLISHING.md
```

| Folder | Published to npm? | Purpose |
|--------|-------------------|---------|
| `apps/demo` | No | Playground + public website |
| `packages/*` | Yes | Reusable components |

---

## 1. Run demo locally (daily workflow)

From monorepo root:

```bash
cd /home/marko-og/Documents/wappa/imperijal-components
pnpm install
pnpm demo
```

Opens **http://localhost:5173** with all component demos.

### How hot reload works

`apps/demo/vite.config.ts` aliases the package to **source**:

```ts
'@imperijal/date-time-picker' → packages/date-time-picker/src/index.ts
```

So when you edit files in `packages/date-time-picker/src/`, the demo updates **immediately** — no rebuild needed while iterating v2.

---

## 2. Iterate v2 of DateTimePicker

```bash
# Terminal 1 — demo (keep running)
pnpm demo

# Terminal 2 — edit component
code packages/date-time-picker/src/components/date-time-picker.tsx
```

Check variants in the demo:
- Default size
- Small size (`size="sm"`)
- Custom `timeSlots`

When v2 is ready:

```bash
cd packages/date-time-picker
npm version minor          # 0.1.0 → 0.2.0  (or patch / major)
pnpm build
pnpm publish --access public
```

Or from root:

```bash
pnpm publish:date-time-picker
```

Update in restoranico:

```bash
cd ../restoranico
pnpm update @imperijal/date-time-picker
```

---

## 3. Add a new component to the same group

### Step A — Create package

```bash
cd /home/marko-og/Documents/wappa/imperijal-components
cp -r packages/date-time-picker packages/my-widget
```

Edit `packages/my-widget/package.json`:

```json
{
  "name": "@imperijal/my-widget",
  "version": "0.1.0",
  ...
}
```

Clear `src/` and implement your component. Add root script:

```json
"publish:my-widget": "pnpm --filter @imperijal/my-widget publish --access public --no-git-checks"
```

### Step B — Add to demo app

1. In `apps/demo/package.json`:

```json
"@imperijal/my-widget": "workspace:*"
```

2. Create `apps/demo/src/demos/MyWidgetDemo.tsx`

3. Register in `apps/demo/src/App.tsx`:

```tsx
const DEMOS = [
  { id: 'date-time-picker', label: 'Date & Time Picker', package: '@imperijal/date-time-picker' },
  { id: 'my-widget', label: 'My Widget', package: '@imperijal/my-widget' },
];
```

4. Add Vite alias in `vite.config.ts`:

```ts
'@imperijal/my-widget': path.resolve(root, '../../packages/my-widget/src/index.ts'),
```

5. Run `pnpm install && pnpm demo`

### Step C — Publish separately

Each package gets its own npm page:

```bash
pnpm --filter @imperijal/my-widget publish --access public
```

---

## 4. Public demo for npm users

npm does **not** host interactive demos. You deploy `apps/demo` as a website and link it from:

- Package README on npm
- `homepage` field in `package.json`

### Option A — Vercel (easiest)

1. Push repo to GitHub
2. [vercel.com](https://vercel.com) → Import `imperijal-components`
3. Settings:
   - **Root Directory:** `apps/demo`
   - **Build Command:** `pnpm build`
   - **Install Command:** `cd ../.. && pnpm install`
   - **Output Directory:** `dist`

4. Add to `packages/date-time-picker/package.json`:

```json
"homepage": "https://imperijal-components.vercel.app"
```

5. Add to package README:

```markdown
## Live demo

https://imperijal-components.vercel.app
```

npm shows the **homepage** link on the package page.

### Option B — GitHub Pages

Build with base path:

```bash
cd apps/demo
IMPERIJAL_DEMO_BASE=/imperijal-components/ pnpm build
```

Deploy `apps/demo/dist` to GitHub Pages (see `.github/workflows/demo-pages.yml` if added).

Homepage URL:

```
https://YOUR_USERNAME.github.io/imperijal-components/
```

---

## 5. What npm users see

On [npmjs.com/package/@imperijal/date-time-picker](https://www.npmjs.com/package/@imperijal/date-time-picker):

| Field | Shows |
|-------|--------|
| **README** | Install + usage (from package README) |
| **homepage** | Link to live demo (if set in package.json) |
| **Repository** | GitHub source link |

They install via:

```bash
pnpm add @imperijal/date-time-picker
```

They try live UI on your deployed demo URL — not on npm itself.

---

## 6. Fix `ENOSPC: System limit for number of file watchers reached`

Linux limits how many files Vite can watch. Monorepos + `node_modules` + restoranico dev server can exceed the default (**65536**).

### Option A — Permanent fix (recommended)

Run in your terminal (requires password once):

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee /etc/sysctl.d/99-inotify.conf
echo fs.inotify.max_user_instances=512 | sudo tee -a /etc/sysctl.d/99-inotify.conf
sudo sysctl -p /etc/sysctl.d/99-inotify.conf
```

Then retry:

```bash
pnpm demo
```

### Option B — No sudo (polling fallback)

Uses more CPU but avoids file watchers:

```bash
pnpm demo:poll
```

### Option C — Free watchers temporarily

Stop other dev servers (e.g. restoranico `pnpm dev`) before running the demo — each Next/Vite instance consumes many watchers.

---

## 7. Quick command reference

| Task | Command |
|------|---------|
| Local demo | `pnpm demo` |
| Demo (ENOSPC workaround) | `pnpm demo:poll` |
| Build demo for deploy | `pnpm demo:build` |
| Preview production build | `pnpm demo:preview` |
| Build all packages | `pnpm build` |
| Publish date-time-picker | `pnpm publish:date-time-picker` |
| Typecheck package | `pnpm --filter @imperijal/date-time-picker typecheck` |

---

## 7. Recommended release loop

```
edit packages/…/src
    ↓
pnpm demo          (verify in browser)
    ↓
pnpm build         (verify dist)
    ↓
npm version patch  (in package folder)
    ↓
pnpm publish --access public
    ↓
git tag + push
    ↓
Vercel auto-deploys demo (optional)
    ↓
pnpm update in restoranico
```

---

## 8. Test in restoranico before publishing (optional)

Use file dependency while iterating:

```json
// restoranico/package.json
"@imperijal/date-time-picker": "file:../imperijal-components/packages/date-time-picker"
```

Or link:

```bash
cd imperijal-components/packages/date-time-picker && pnpm link --global
cd restoranico && pnpm link --global @imperijal/date-time-picker
```

Switch back to npm version when published.
