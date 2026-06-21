# imperijal-components

Monorepo of reusable React UI packages published under the `@imperijal/*` scope.

## Packages

| Package | Description |
|---------|-------------|
| [`@imperijal/date-time-picker`](./packages/date-time-picker) | Date & time picker (`YYYY-MM-DDTHH:mm`) |

## Development

```bash
pnpm install
pnpm build
```

## Adding a new component

```bash
mkdir -p packages/my-component/src
# add package.json, tsconfig, tsup.config.ts
# register in pnpm-workspace.yaml (already uses packages/*)
```

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for step-by-step npm instructions.
