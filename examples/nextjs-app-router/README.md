# Next.js App Router Example

A minimal example of [react-table-craft](https://www.npmjs.com/package/react-table-craft) with Next.js App Router.

## What this demonstrates

- Router adapter for URL-synced pagination, sorting, and filtering
- `TableProvider` with global config
- `ClientSideTable` with typed columns
- Searchable columns (name, email)
- Filterable columns (role, status, department)
- Sortable column headers
- Column visibility toggle
- Row selection with CSV export

## Run it

```bash
cd examples/nextjs-app-router
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key files

| File | What it shows |
|------|---------------|
| `components/providers.tsx` | Router adapter + TableProvider setup |
| `app/users/columns.tsx` | Typed column definitions with sortable headers |
| `app/users/users-table.tsx` | ClientSideTable with search and filters |
| `app/users/data.tsx` | Mock data with TypeScript interface |
