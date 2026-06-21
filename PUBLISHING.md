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

**Important:** Do **not** run `npm publish` from the monorepo root (`imperijal-components/`).  
The root is private and not a publishable package. You must publish **`@imperijal/date-time-picker`** only.

### Option A — from package folder (recommended)

```bash
cd /home/marko-og/Documents/wappa/imperijal-components/packages/date-time-picker
pnpm publish --access public
```

### Option B — from monorepo root

```bash
cd /home/marko-og/Documents/wappa/imperijal-components
pnpm publish:date-time-picker
```

When prompted for **OTP**, enter the 6-digit code from your authenticator app (required if 2FA is enabled).

> Scoped packages default to private. `--access public` is required for free public scoped packages.

First publish creates `@imperijal/date-time-picker@0.1.0` on npm.

---

## Fix E403 — Two-factor authentication required

If you see:

```text
error code E403
error 403 Forbidden - PUT https://registry.npmjs.org/...
Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

### What it means

npm **requires 2FA on your account** before you can publish any package. This is a security policy — not a bug in your code.

Your log also showed:

```text
verbose pkgid imperijal-components@0.0.0
```

That means publish was attempted for the **wrong package** (monorepo root name). Fix both issues below.

### Fix 1 — Enable 2FA on npm

1. Log in at [npmjs.com](https://www.npmjs.com/)
2. Click your avatar → **Account**
3. Open **Enable 2FA** (or **Authentication**)
4. Choose mode: **Authorization and publishing** (required for `npm publish`)
   - "Authorization only" is **not** enough to publish
5. Scan QR code with Google Authenticator / Authy / 1Password
6. Save recovery codes

Then log in again locally:

```bash
npm logout
npm login
# Enter username, password, then OTP when asked
npm whoami
```

When you run `pnpm publish`, npm will ask for a **one-time password (OTP)** — enter the 6-digit code from your app.

### Fix 2 — Publish the correct package

Root `package.json` must have `"private": true` (already fixed). Never publish:

| Wrong | Right |
|-------|-------|
| `imperijal-components@0.0.0` | `@imperijal/date-time-picker@0.1.0` |
| from repo root | from `packages/date-time-picker/` |

Verify before publish:

```bash
cd packages/date-time-picker
node -p "require('./package.json').name"
# must print: @imperijal/date-time-picker
```

### Fix 3 — Own the `@imperijal` scope (if 403 persists)

If error says you don't have access to scope `@imperijal`:

1. Create org at [npmjs.com/org/create](https://www.npmjs.com/org/create) named `imperijal`, **or**
2. Rename package in `packages/date-time-picker/package.json`:

```json
"name": "@YOUR_NPM_USERNAME/date-time-picker"
```

### Alternative — Granular access token (CI / automation)

For GitHub Actions instead of interactive OTP:

1. [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens) → **Generate New Token** → **Granular Access Token**
2. Permissions: **Read and write** for packages
3. Enable **Bypass 2FA** (only if your org policy allows)
4. Use token:

```bash
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN
```

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
| `E403` + 2FA message | Enable 2FA (Authorization **and publishing**) on npmjs.com — see [Fix E403](#fix-e403--two-factor-authentication-required) |
| `E403` wrong scope | Create `@imperijal` org or rename package to `@your-user/...` |
| Published `imperijal-components` by mistake | Root must be `"private": true`; publish from `packages/date-time-picker` |
| `402 Payment Required` on scoped package | Add `--access public` |
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
