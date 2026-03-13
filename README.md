# react-table-craft

A production-ready, framework-agnostic React data table system built on [TanStack Table](https://tanstack.com/table). Fully typed, tree-shakeable, and feature-rich.

![Project Screenshot](https://react-table-craft.vercel.app/brand/thumnail.png)

## Features

- **Framework-Agnostic** — Works with Next.js, React Router, Remix, or any React setup
- **Full TypeScript Support** — Generics, strict types, and exported type definitions
- **Tree-Shakeable** — ESM + CJS dual output with `sideEffects: false`
- **Built-in Pagination** — Client-side, server-side, and cursor-based pagination with URL sync
- **Advanced Filtering** — Faceted filters, multi-filters, text search, date range, single-select
- **Sorting** — Column header sorting with multi-sort support
- **Column Visibility** — Toggle columns on/off with persistent state
- **Row Selection** — Checkbox-based row selection with bulk actions
- **Card View** — Switch between table and card layouts
- **Floating Action Bar** — Contextual actions for selected rows
- **CSV Export** — Export selected rows or all data to CSV
- **RTL Support** — Full right-to-left layout support
- **i18n Ready** — Plug in any translation system or use built-in English defaults
- **Responsive** — Desktop toolbar + mobile toolbar with drawer-based filters
- **Configurable** — 4-layer config system (defaults → provider → instance → plugins)
- **Plugin Architecture** — Extend behavior with priority-based plugins

## Installation

```bash
npm install react-table-craft
# or
pnpm add react-table-craft
# or
yarn add react-table-craft
```

### Peer Dependencies

```bash
npm install react react-dom
```

### Tailwind CSS

react-table-craft uses Tailwind CSS classes for styling. You must have Tailwind CSS configured in your project. Add the package to your Tailwind content paths:

```js
// tailwind.config.js
module.exports = {
  content: [
    // ... your paths
    './node_modules/react-table-craft/dist/**/*.{js,mjs}',
  ],
}
```

## Quick Start

```tsx
import { DataTable } from 'react-table-craft'
import type { ColumnDef } from '@tanstack/react-table'

interface User {
  id: string
  name: string
  email: string
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
]

function UsersTable({ data }: { data: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={{ pageCount: 1, page: 1, pageSize: 10 }}
    />
  )
}
```

## Client-Side Table

For simpler use cases with client-side pagination, sorting, and filtering:

```tsx
import { ClientSideTable } from 'react-table-craft'

function UsersTable({ data }: { data: User[] }) {
  return (
    <ClientSideTable
      columns={columns}
      data={data}
      searchableColumns={[{ id: 'name', title: 'Name' }]}
      filterableColumns={[
        {
          id: 'role',
          title: 'Role',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ],
        },
      ]}
    />
  )
}
```

## Cursor-Based Pagination

For APIs that use cursor-based pagination (GraphQL Relay, Stripe, etc.):

```tsx
import { DataTable } from 'react-table-craft'
import type { CursorPaginationData } from 'react-table-craft'

function UsersTable({ data, pageInfo, fetchMore }) {
  const cursorPaginationData: CursorPaginationData = {
    pageInfo: {
      hasNextPage: pageInfo.hasNextPage,
      hasPreviousPage: pageInfo.hasPreviousPage,
      startCursor: pageInfo.startCursor,
      endCursor: pageInfo.endCursor,
      totalCount: pageInfo.totalCount, // optional
    },
    onNextPage: () => fetchMore({ after: pageInfo.endCursor }),
    onPreviousPage: () => fetchMore({ before: pageInfo.startCursor }),
    onPageSizeChange: (size) => fetchMore({ first: size }),
    pageSize: 10,
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      isCursorPagination={true}
      cursorPaginationData={cursorPaginationData}
    />
  )
}
```

This renders only Prev/Next buttons (no numbered pages), an optional total count, and a page size selector.

## Configuration

### TableProvider

Wrap your app (or a subtree) with `TableProvider` to set global defaults:

```tsx
import { TableProvider, createTableConfig } from 'react-table-craft'

const config = createTableConfig({
  features: {
    enableColumnVisibility: true,
    enableRowSelection: true,
    enablePagination: true,
  },
  pagination: {
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
  },
})

function App() {
  return (
    <TableProvider config={config}>
      <YourApp />
    </TableProvider>
  )
}
```

### Per-Table Config

Override global config on individual tables:

```tsx
<DataTable
  columns={columns}
  data={data}
  config={{
    features: { enableRowSelection: false },
    pagination: { defaultPageSize: 50 },
  }}
/>
```

### Config Layers

Configuration is resolved in this order (later layers override earlier ones):

1. **Defaults** — Built-in `DEFAULT_TABLE_CONFIG`
2. **Provider** — Global config from `TableProvider`
3. **Instance** — Per-table `config` prop
4. **Plugins** — Plugin-provided config (priority-ordered)

## Router Adapter

react-table-craft does not depend on any specific router. To enable URL-synced pagination, sorting, and filtering, provide a router adapter:

### Next.js (App Router)

```tsx
'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { TableProvider, createTableConfig } from 'react-table-craft'

function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const config = createTableConfig({
    router: {
      push: (url) => router.push(url),
      replace: (url) => router.replace(url),
      getSearchParams: () => new URLSearchParams(searchParams.toString()),
      getPathname: () => pathname,
    },
  })

  return <TableProvider config={config}>{children}</TableProvider>
}
```

### React Router

```tsx
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { TableProvider, createTableConfig } from 'react-table-craft'

function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const config = createTableConfig({
    router: {
      push: (url) => navigate(url),
      replace: (url) => navigate(url, { replace: true }),
      getSearchParams: () => searchParams,
      getPathname: () => location.pathname,
    },
  })

  return <TableProvider config={config}>{children}</TableProvider>
}
```

### No Router (Default)

If no router adapter is provided, URL sync is silently disabled. Pagination, sorting, and filtering still work — they just manage state internally without updating the URL.

## Internationalization (i18n)

### Built-in English

By default, react-table-craft uses built-in English strings. No configuration needed.

### Custom Translations

Provide a `translationFn` in the config to integrate your own i18n system:

```tsx
import { useTranslations } from 'next-intl' // or any i18n library

function Providers({ children }) {
  const t = useTranslations('table')

  const config = createTableConfig({
    i18n: {
      translationFn: (key) => t(key),
    },
  })

  return <TableProvider config={config}>{children}</TableProvider>
}
```

### Available Translation Keys

`Filter`, `filter-by`, `Reset`, `add`, `add-filter`, `columns`, `showing`, `rows`, `previous`, `next`, `first`, `last`, `no-records-found`, `records`, `selected`, `selected-count`, `delete`, `export`, `view`, `edit`, `actions`, `more-actions`, `search`, `clear`, `apply`, `cancel`, `confirm`, `close`, `open`, `save`, `loading`, `error`, `success`, `warning`, `info`, `page`, `of`, `per-page`, `go-to-page`, `sort-ascending`, `sort-descending`, `no-sorting`, `hide-column`, `show-all`, `toggle-columns`, `row-actions`, `bulk-actions`, `select-all`, `deselect-all`, `rows-per-page`, `card-view`, `table-view`

## Feature Flags

Control which features are enabled:

```tsx
const config = createTableConfig({
  features: {
    enablePagination: true,
    enableSorting: true,
    enableFiltering: true,
    enableColumnVisibility: true,
    enableRowSelection: true,
    enableMultiSort: false,
    enableGlobalFilter: false,
    enableColumnResizing: false,
    enableColumnReordering: false,
    enableExport: true,
    enableCardView: true,
    enableFloatingBar: true,
    enableAdvancedFilter: false,
  },
})
```

## RTL Support

Enable RTL layout via config:

```tsx
const config = createTableConfig({
  i18n: {
    direction: 'rtl',
  },
})
```

Components automatically adjust padding, alignment, and icon positioning for RTL layouts.

## Plugins

Extend table behavior with plugins:

```tsx
import type { TablePlugin } from 'react-table-craft'

const auditPlugin: TablePlugin = {
  name: 'audit-logging',
  priority: 10,
  config: {
    features: {
      enableRowSelection: true,
    },
  },
}

const config = createTableConfig({
  plugins: [auditPlugin],
})
```

Plugins are merged in priority order (lower numbers merge first, higher numbers override).

## Exported Components

| Component | Description |
|-----------|-------------|
| `DataTable` | Core table with server-side pagination support |
| `ClientSideTable` | High-level wrapper with client-side pagination |
| `DataTableToolbar` | Desktop toolbar with search, filters, view options |
| `DataTableMobileToolbar` | Mobile-responsive toolbar with drawer |
| `DataTablePagination` | Pagination controls |
| `DataTableColumnHeader` | Sortable column header |
| `DataTableViewOptions` | Column visibility toggle |
| `DataTableCardView` | Card layout renderer |
| `DataTableFloatingBar` | Floating action bar for selections |
| `DataTableFacetedFilter` | Multi-select faceted filter |
| `DataTableSingleSelectFilter` | Single-select filter |
| `DataTableRoleFilter` | Role-based filter with URL sync |
| `DataTableLoading` | Loading skeleton |
| `TableActionsRow` | Row-level action buttons |
| `DataTableAdvancedToolbar` | Advanced toolbar with multi-filter |
| `DataTableAdvancedFilter` | Advanced filter command palette |
| `DataTableAdvancedFilterItem` | Individual advanced filter chip |
| `DataTableMultiFilter` | Multi-rule filter popover |
| `TableProvider` | Config context provider |

## Exported Types

```tsx
import type {
  // Table types
  Option,
  DataTableSearchableColumn,
  DataTableQuerySearchable,
  DataTableFilterableColumn,
  DataTableFilterOption,
  FilterOptions,

  // Config types
  TableConfig,
  TableConfigInput,
  TableRouterAdapter,
  TableFeatureFlags,
  TablePaginationConfig,
  TableSearchConfig,
  TableI18nConfig,
  TablePerformanceConfig,
  TableEnterpriseConfig,
  TableDevConfig,
  TablePlugin,
  DeepPartial,

  // Pagination types
  Pagination,
  BackendPagination,
  PaginationMeta,
  PaginationLinks,
  CursorPaginationInfo,
  CursorPaginationData,
} from 'react-table-craft'
```

## TypeScript

react-table-craft is written in TypeScript and ships type declarations. All components are generic:

```tsx
// Column definitions are fully typed
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
]

// Table instance is typed
<DataTable<User>
  columns={columns}
  data={users}
  pagination={pagination}
/>
```

## Loading State

Show skeleton placeholders while data is being fetched:

```tsx
<DataTable
  columns={columns}
  data={data}
  isLoading={isLoading}
/>
```

When `isLoading` is `true`, the table renders animated skeleton rows (table view) or skeleton cards (card view) matching the current page size. Pagination and toolbar remain interactive.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by [Ahmed Elkhdrawy](https://github.com/Ahmed-Elkhdrawy).**
