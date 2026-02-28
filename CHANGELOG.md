# Changelog

## 0.1.4

- Add cursor-based pagination support (`isCursorPagination` mode) for APIs like GraphQL Relay and Stripe
- New `CursorPaginationInfo` and `CursorPaginationData` exported types
- Renders Prev/Next buttons only (no numbered pages) with optional total count display
- Page size selector and RTL support included
- `pageCount` prop is now optional across `DataTable` and `ClientSideTable`
- Discriminated union types prevent mixing cursor and offset pagination props

## 0.1.0 (Initial Release)

- Core `DataTable` component with sorting, filtering, pagination
- `ClientSideTable` wrapper with auto-index column
- Advanced filter builder UI
- Card view and table view toggle
- CSV export support
- Full i18n support with configurable translation function
- Router adapter pattern for framework-agnostic URL sync
- 4-layer config system with `TableProvider`
- Plugin architecture for extending config
- RTL support
- Mobile-responsive toolbar with drawer
- Floating action bar for bulk operations
- Column visibility toggle
- Role-based filtering
- Faceted and single-select filters
- Loading skeleton
- Row actions with dropdown and individual button modes
