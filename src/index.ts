// ─── Components ────────────────────────────────────────────────────────────────
export { DataTable } from './components/data-table'
export { ClientSideTable } from './components/client-side-table'
export { DataTableToolbar } from './components/data-table-toolbar'
export type { ViewMode } from './components/data-table-toolbar'
export { DataTableMobileToolbar } from './components/data-table-mobile-toolbar'
export { DataTablePagination } from './components/data-table-pagination'
export { DataTableColumnHeader } from './components/data-table-column-header'
export { DataTableViewOptions } from './components/data-table-view-options'
export { DataTableCardView } from './components/data-table-card-view'
export { DataTableFloatingBar } from './components/data-table-floating-bar'
export { DataTableRoleFilter } from './components/data-table-role-filter'
export { DataTableFacetedFilter } from './components/data-table-faceted-filter'
export { DataTableSingleSelectFilter } from './components/data-table-single-select-filter'
export { DataTableLoading } from './components/data-table-loading'
export { default as TableActionsRow } from './components/table-actions-row'
export type { CustomButtonProps, MoreActionsProps } from './components/table-actions-row'
export { ButtonTooltip } from './components/table-actions-row'

// Advanced components
export { DataTableAdvancedFilter } from './components/advanced/data-table-advanced-filter'
export { DataTableAdvancedFilterItem } from './components/advanced/data-table-advanced-filter-item'
export { DataTableAdvancedToolbar } from './components/advanced/data-table-advanced-toolbar'
export { DataTableMultiFilter, MultiFilterRow } from './components/advanced/data-table-multi-filter'

// ─── Config ────────────────────────────────────────────────────────────────────
export {
  DEFAULT_TABLE_CONFIG,
  deepMergeConfig,
  createTableConfig,
  TableProvider,
  useGlobalTableConfig,
  useResolvedTableConfig,
  useTableConfig,
} from './config'

// ─── Hooks ─────────────────────────────────────────────────────────────────────
export { useTableTranslations } from './hooks/use-table-translations'
export { useDebounce } from './hooks/use-debounce'

// ─── Types ─────────────────────────────────────────────────────────────────────
export type {
  Option,
  DataTableSearchableColumn,
  DataTableQuerySearchable,
  DataTableFilterableColumn,
  DataTableFilterOption,
} from './types/table'

export type {
  DeepPartial,
  TableRouterAdapter,
  TableFeatureFlags,
  TablePaginationConfig,
  TableSearchConfig,
  TableI18nConfig,
  TablePerformanceConfig,
  TableEnterpriseConfig,
  TableDevConfig,
  TablePlugin,
  TableConfig,
  TableConfigInput,
} from './types/table-config'

export type {
  PaginationMeta,
  PaginationLinks,
  Pagination,
  BackendPagination,
} from './types/pagination'

export type { FilterOptions } from './types/filter-options'

// ─── Utilities ─────────────────────────────────────────────────────────────────
export { cn } from './lib/utils'
export { exportSelectedRowsCsv, createCsvConfig } from './lib/csv-export'
