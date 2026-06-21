# Versioning & publishing packages

How to bump versions, publish to npm, and update apps that use `@imperijal/*` packages.

---

## Semantic versioning (semver)

| Bump | When | Example |
|------|------|---------|
| **patch** | Bug fix, CSS fix, docs | `0.1.0` → `0.1.1` |
| **minor** | New feature, new optional prop | `0.1.1` → `0.2.0` |
| **major** | Breaking API change | `0.2.0` → `1.0.0` |

---

## Step-by-step: release a new version

### 1. Develop & verify locally

```bash
cd /home/marko-og/Documents/wappa/imperijal-components
pnpm demo              # or pnpm demo:poll if ENOSPC
```

Edit files in `packages/date-time-picker/src/`.

### 2. Build the package

```bash
pnpm --filter @imperijal/date-time-picker build
```

Check `packages/date-time-picker/dist/` exists.

### 3. Bump the version

From the **package folder** (not monorepo root):

```bash
cd packages/date-time-picker

# Pick one:
npm version patch    # 0.1.1 → 0.1.2  (bug fix)
npm version minor    # 0.1.1 → 0.2.0  (new feature)
npm version major    # 0.2.0 → 1.0.0  (breaking change)
```

This updates `package.json` and creates a git tag (if inside a git repo).

**Manual alternative** — edit `packages/date-time-picker/package.json`:

```json
"version": "0.1.2"
```

### 4. Commit & tag (recommended)

```bash
cd /home/marko-og/Documents/wappa/imperijal-components
git add packages/date-time-picker
git commit -m "chore(date-time-picker): release v0.1.2"
git tag date-time-picker-v0.1.2
git push && git push --tags
```

### 5. Publish to npm

Requires npm login + 2FA enabled (see [PUBLISHING.md](./PUBLISHING.md)).

```bash
cd packages/date-time-picker
pnpm publish --access public
```

Or from monorepo root:

```bash
pnpm publish:date-time-picker
```

Enter OTP from your authenticator when prompted.

### 6. Update consumer apps (restoranico)

```bash
cd /home/marko-og/Documents/wappa/restoranico
pnpm update @imperijal/date-time-picker
# or pin exact version in package.json:
# "@imperijal/date-time-picker": "0.1.2"
pnpm install
```

---

## Release checklist

- [ ] `pnpm demo` — component looks correct
- [ ] `pnpm --filter @imperijal/date-time-picker build` — no errors
- [ ] `pnpm --filter @imperijal/date-time-picker typecheck` — passes
- [ ] Version bumped in `packages/date-time-picker/package.json`
- [ ] CHANGELOG or commit message describes changes
- [ ] `pnpm publish --access public` from package folder
- [ ] Consumer app updated

---

## Multiple packages in this monorepo

Each package under `packages/` has **its own version**:

```
packages/date-time-picker/     → @imperijal/date-time-picker@0.1.1
packages/my-widget/            → @imperijal/my-widget@0.1.0
```

Bump and publish **each package separately**:

```bash
cd packages/my-widget
npm version patch
pnpm publish --access public
```

Add a root script when you create a new package:

```json
"publish:my-widget": "pnpm --filter @imperijal/my-widget publish --access public --no-git-checks"
```

---

## Version history example

| Version | Changes |
|---------|---------|
| `0.1.0` | Initial publish |
| `0.1.1` | Fix `:root` theme CSS; add `popoverClassName` / `contentClassName` props |

---

## Never publish these

| Path | Why |
|------|-----|
| Monorepo root `imperijal-components` | `"private": true` — not a package |
| `apps/demo` | Demo site only — not on npm |

---

## Related docs

- [PUBLISHING.md](./PUBLISHING.md) — npm login, 2FA, E403 fixes
- [DEMO.md](./DEMO.md) — local demo playground
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) — Tailwind & props
- [INSTALL_AND_USAGE.md](./INSTALL_AND_USAGE.md) — install in apps
