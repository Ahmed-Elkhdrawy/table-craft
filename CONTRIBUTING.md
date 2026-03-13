# Contributing to react-table-craft

Thank you for your interest in contributing to react-table-craft! This guide will help you get started.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Basic knowledge of React, TypeScript, and TanStack Table

### Setup

1. Fork the repository on GitHub.
2. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/table-craft.git
cd table-craft
```

3. Install dependencies:

```bash
npm install
```

4. Run the type checker to make sure everything compiles:

```bash
npm run typecheck
```

5. Start the dev watcher (rebuilds on file changes):

```bash
npm run dev
```

## Making Changes

### Branch Naming

Create a branch from `main` with a descriptive name:

```
fix/config-merging-strategy
feat/add-virtual-scrolling
docs/update-router-examples
```

Prefixes:
- `fix/` — Bug fixes
- `feat/` — New features
- `docs/` — Documentation changes
- `refactor/` — Code improvements without behavior changes
- `test/` — Adding or updating tests

### Code Style

- **TypeScript first** — All code must be written in TypeScript with strict mode. No `any` types in public APIs.
- **2-space indentation** — Consistent across the entire codebase.
- **No default exports** — Use named exports only (except where required by external libraries).
- **Functional components** — React components should be function components with hooks.
- **Minimal dependencies** — Avoid adding new dependencies unless absolutely necessary. Discuss in the issue first.

### Architecture Guidelines

react-table-craft uses a 4-layer configuration system:

1. **Defaults** — `DEFAULT_TABLE_CONFIG`
2. **Provider** — Global config from `TableProvider`
3. **Instance** — Per-table `config` prop
4. **Plugins** — Priority-sorted plugin config

When making changes, respect this layering:

- Config changes should flow through `deepMergeConfig`.
- Child components should read config via `useTableConfig()`, not by drilling props.
- New features should be controllable via `TableFeatureFlags` when appropriate.
- Public API changes require discussion — open an issue first.

### What Makes a Good PR

- **One concern per PR** — Don't mix bug fixes with features. Separate PRs are easier to review and safer to merge or revert.
- **Compiles cleanly** — Run `npm run typecheck` before submitting. PRs that don't compile will not be reviewed.
- **No breaking changes** — If your change alters the public API or exported types, discuss it in an issue first.
- **Consistent style** — Match the existing code style. Don't reformat files you didn't change.
- **Clear PR description** — Explain what problem you're solving and why your approach makes sense.

### Commit Messages

Use clear, conventional commit messages:

```
fix: resolve config merging for instance-level overrides
feat: add skeleton loading state for table and card views
docs: add cursor pagination example
refactor: simplify URL sync logic in DataTable
```

Format: `<type>: <short description>`

Types: `fix`, `feat`, `docs`, `refactor`, `test`, `chore`

## Submitting a Pull Request

1. Make sure your branch is up to date with `main`:

```bash
git fetch origin
git rebase origin/main
```

2. Run the type checker:

```bash
npm run typecheck
```

3. Build the package to verify output:

```bash
npm run build
```

4. Push your branch and open a PR against `main`.

5. Fill in the PR template with:
   - **Title** — What the PR does (e.g., "Fix config merging for instance overrides")
   - **Problem** — What was wrong or missing
   - **Solution** — How you fixed it
   - **Testing** — How you verified it works

## Reporting Issues

When opening an issue, include:

- A clear description of the problem
- Steps to reproduce (minimal code example if possible)
- Expected vs actual behavior
- Your environment (React version, browser, OS)

## Project Structure

```
src/
  components/         React components (DataTable, Toolbar, Pagination, etc.)
    advanced/         Advanced filter components
    ui/               Base UI components (Radix UI + Tailwind)
  config/             Configuration system (context, merging, defaults, hooks)
  hooks/              Shared hooks (translations, debounce)
  types/              TypeScript type definitions
  lib/                Utilities (cn, CSV export)
  index.ts            Public API barrel export
```

## Need Help?

- Check the [documentation](https://react-table-craft.vercel.app/)
- Open a [discussion](https://github.com/Ahmed-Elkhdrawy/table-craft/issues) on GitHub
- Look at existing PRs and issues for examples

## License

By contributing to react-table-craft, you agree that your contributions will be licensed under the MIT License.
