# Contributing to react-table-craft

Thanks for your interest in contributing. This guide covers everything you need to get started.

## Before You Start

- **Bug fix or small improvement?** Open a PR directly.
- **New feature or API change?** Open an issue first to discuss the approach.
- **Major feature, new component, or architectural change?** Write an [RFC](rfcs/README.md).

This keeps everyone aligned and avoids wasted effort.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Familiarity with React, TypeScript, and TanStack Table

### Getting started

```bash
git clone https://github.com/<your-username>/table-craft.git
cd table-craft
npm install
npm run typecheck    # verify everything compiles
npm run dev          # start dev watcher
```

## Contribution Types

### Bug Fixes

1. Confirm the bug exists (check open issues)
2. Create a branch: `fix/short-description`
3. Fix it, run `npm run typecheck`, open a PR
4. Include steps to reproduce in the PR description

### Small Features

Small additions that don't change the public API surface (e.g., a new translation key, an internal optimization):

1. Create a branch: `feat/short-description`
2. Implement, verify types, open a PR
3. Include a usage example in the PR description if applicable

### Major Features (RFC required)

New components, hooks, config options, or breaking changes:

1. Open an issue describing the problem and proposed solution
2. Write an RFC using the [template](rfcs/_template.md)
3. Open a PR titled `rfc: [short title]` for community review
4. Once the RFC is accepted, implement it in a separate PR

## Architecture Rules

react-table-craft uses a 4-layer configuration system:

```
Defaults → Provider → Instance → Plugins
```

When contributing, respect this:

- **Config flows through `deepMergeConfig`** — don't bypass the merge system.
- **Components read config via `useTableConfig()`** — no prop drilling for config values.
- **New features use `TableFeatureFlags`** — features should be toggleable.
- **Named exports only** — no default exports (except where required by dependencies).
- **TypeScript strict mode** — no `any` in public APIs.

## Code Style

- 2-space indentation
- Functional components with hooks
- Minimal dependencies — discuss in the issue before adding one
- Match existing patterns — look at similar code before writing new code

## Commit Messages

```
fix: resolve config merging for instance-level overrides
feat: add skeleton loading state for table and card views
docs: add cursor pagination example
refactor: simplify URL sync logic in DataTable
```

Format: `<type>: <short description>`

Types: `fix`, `feat`, `docs`, `refactor`, `test`, `chore`

## Pull Request Checklist

Before submitting your PR, verify:

- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run build` completes successfully
- [ ] No `any` types in public-facing code
- [ ] No breaking changes (or discussed and approved in an issue/RFC)
- [ ] One concern per PR — don't mix bug fixes with features
- [ ] PR description explains the problem and approach
- [ ] Code matches existing architecture patterns
- [ ] Includes a usage example if adding new API surface

## Branch Naming

```
fix/config-merging-strategy
feat/add-virtual-scrolling
docs/update-router-examples
refactor/simplify-pagination-logic
test/add-config-merge-tests
```

## Submitting a PR

1. Rebase on latest `main`:

```bash
git fetch origin
git rebase origin/main
```

2. Verify:

```bash
npm run typecheck
npm run build
```

3. Push and open a PR against `main` with:
   - **Title** — What the PR does
   - **Problem** — What was wrong or missing
   - **Solution** — How you fixed it
   - **Testing** — How you verified it works

## Reporting Issues

Include:

- Clear description of the problem
- Steps to reproduce (minimal code example preferred)
- Expected vs. actual behavior
- Environment: React version, browser, OS

## Project Structure

```
src/
  components/         React components (DataTable, Toolbar, Pagination, etc.)
    advanced/         Advanced filter components
    client-side-table/ Client-side pagination wrapper
    ui/               Base UI components (Radix UI + Tailwind)
  config/             Configuration system (context, merging, defaults, hooks)
  hooks/              Shared hooks (translations, debounce)
  types/              TypeScript type definitions
  lib/                Utilities (cn, CSV export)
  index.ts            Public API barrel export
rfcs/                 RFC proposals for major changes
```

## Need Help?

- Check the [documentation](https://react-table-craft.vercel.app/)
- Open a [discussion](https://github.com/Ahmed-Elkhdrawy/table-craft/issues) on GitHub
- Look at existing PRs and issues for examples

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
