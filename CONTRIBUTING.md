# Contributing to slf4ts

Thank you for considering a contribution! This document describes how to set
up the project and what to watch out for.

## Requirements

- Node.js >= 22.13 (required by pnpm 11)
- pnpm 11.22.0, pinned via the `packageManager` field in `package.json`

        npm i -g pnpm@11.22.0
        # or, if your Node installation ships Corepack:
        corepack enable

## Setup

    pnpm i

## Common tasks

| Task | Command |
| :--------------------------- | :------------------------------- |
| clean + lint + compile all   | `pnpm run build`                 |
| run all tests                | `pnpm run test`                  |
| lint only (Biome)            | `npx biome check .`              |
| fix formatting/lint issues   | `npx biome check --write .`      |
| coverage report              | `pnpm run coverage`              |
| dependency report            | `docker-compose run --rm deps`   |

Notes:

- Linting and formatting are enforced by [Biome](https://biomejs.dev) via the
  root `biome.json`; every package's `build` runs `biome check .`.
- Tests use mocha with @testdeck and chai and run directly on the TypeScript
  sources via tsx. CI sets `TZ=Europe/Berlin` for reproducible results.
- The workspace is a pnpm monorepo (`pnpm-workspace.yaml`); packages link each
  other via `workspace:` ranges which are rewritten on publish.

## Pull requests

1. Fork / branch from `main`.
2. Make your change; add or adjust tests in `packages/<pkg>/test/`.
3. Ensure `pnpm run build` and `pnpm run test` pass locally.
4. Keep commits concise; reference issues in the message body.
5. Open the PR against `main`. CI runs the build, tests (Node 22/24/26) and
   CodeQL analysis.

Dependency updates are managed by Dependabot (see `.github/dependabot.yml`);
please do not bundle unrelated dependency upgrades into feature PRs.

## Known blocked dependency upgrades

Do not upgrade `chai` to >= 5 (also encoded as a Dependabot ignore): chai 5+
is ESM-only and incompatible with the current CJS test setup.

## Releases

Releases are cut by the maintainers following the flow documented in the
[README](README.md#project-development). If you need a released version that
includes your change, mention it in the PR.
