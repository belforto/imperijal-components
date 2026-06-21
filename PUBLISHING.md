# Publishing `@imperijal/*` packages to npm

Follow these steps in order. You only need to do **Step 1–3 once**; repeat **Step 4–8** for each release.

---

## Step 1 — Create the GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name: `imperijal-components`
3. Visibility: Public (required for free scoped public packages) or Private
4. **Do not** initialize with README (you already have files locally)

Then link your local folder:

```bash
cd /home/marko-og/Documents/wappa/imperijal-components
git init
git add .
git commit -m "chore: initial monorepo with date-time-picker"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/imperijal-components.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username or org.

---

## Step 2 — Create an npm account & org (optional)

1. Sign up at [npmjs.com](https://www.npmjs.com/signup)
2. Verify your email
3. **Optional but recommended:** create org `imperijal` at [npmjs.com/org/create](https://www.npmjs.com/org/create)
   - Lets you publish `@imperijal/date-time-picker` under a team name
   - If you skip this, use `@YOUR_NPM_USERNAME/date-time-picker` instead and update `name` in `packages/date-time-picker/package.json`

---

## Step 3 — Log in to npm locally

```bash
npm login
```

Enter username, password, and OTP if 2FA is enabled.

Verify:

```bash
npm whoami
```

---

## Step 4 — Install dependencies & build

From the monorepo root:

```bash
cd /home/marko-og/Documents/wappa/imperijal-components
pnpm install
pnpm build
```

You should see `packages/date-time-picker/dist/` with `index.js`, `index.cjs`, and `index.d.ts`.

Dry-run typecheck:

```bash
pnpm --filter @imperijal/date-time-picker typecheck
```

---

## Step 5 — Test locally in restoranico (before publishing)

Link the package without publishing:

```bash
cd /home/marko-og/Documents/wappa/imperijal-components/packages/date-time-picker
pnpm link --global

cd /home/marko-og/Documents/wappa/restoranico
pnpm link --global @imperijal/date-time-picker
```

In `restoranico`, change imports:

```tsx
import { DateTimePicker, toLocalInputValue } from '@imperijal/date-time-picker';
```

Install peer deps in restoranico if missing (most are already there).

When done testing, unlink:

```bash
cd /home/marko-og/Documents/wappa/restoranico
pnpm unlink --global @imperijal/date-time-picker
```

---

## Step 6 — Publish to npm

From the **package** directory (not monorepo root):

```bash
cd /home/marko-og/Documents/wappa/imperijal-components/packages/date-time-picker
pnpm publish --access public
```

> Scoped packages default to private. `--access public` is required for free public scoped packages.

First publish creates `@imperijal/date-time-picker@0.1.0` on npm.

---

## Step 7 — Install in restoranico from npm

After publishing:

```bash
cd /home/marko-og/Documents/wappa/restoranico
pnpm add @imperijal/date-time-picker
```

Usage:

```tsx
import { DateTimePicker, toLocalInputValue } from '@imperijal/date-time-picker';
import '@imperijal/date-time-picker/styles.css'; // optional theme tokens
```

### Tailwind setup (required)

Add the package to Tailwind content scanning in your app:

```js
// tailwind.config or @source in globals.css (Tailwind v4)
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  './node_modules/@imperijal/date-time-picker/dist/**/*.js',
]
```

---

## Step 8 — Release updates

1. Make changes in `packages/date-time-picker`
2. Bump version:

```bash
cd packages/date-time-picker
npm version patch   # 0.1.0 → 0.1.1
# or: minor / major
```

3. Rebuild & publish:

```bash
pnpm build
pnpm publish --access public
```

4. Update in restoranico:

```bash
pnpm update @imperijal/date-time-picker
```

---

## Checklist before first publish

- [ ] `repository.url` in `package.json` points to your real GitHub repo
- [ ] `pnpm build` succeeds
- [ ] `files` in package.json includes `dist` (already set)
- [ ] README describes peer dependencies
- [ ] npm login works (`npm whoami`)
- [ ] Package name `@imperijal/date-time-picker` is available (or rename)

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `402 Payment Required` on scoped package | Add `--access public` |
| `403 Forbidden` | Wrong npm account or org doesn't own `@imperijal` scope |
| Styles missing | Add Tailwind content path + shadcn CSS variables in app |
| `ERESOLVE` peer deps | Install listed peerDependencies in consumer app |

---

## Monorepo: adding package #2 later

```bash
cp -r packages/date-time-picker packages/my-new-component
# edit package.json name → @imperijal/my-new-component
pnpm install
pnpm build
cd packages/my-new-component && pnpm publish --access public
```
