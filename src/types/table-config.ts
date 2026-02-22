/** Deep-partial helper: makes every property (and nested property) optional. */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? U[]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P]
}

/** Adapter for framework-agnostic routing. */
export interface TableRouterAdapter {
  /** Navigate to a URL string. */
  push: (url: string) => void
  /** Replace current URL without adding to history. */
  replace?: (url: string) => void
  /** Get current URL search params. */
  getSearchParams: () => URLSearchParams
  /** Get current pathname. */
  getPathname: () => string
}

/** Feature flags controlling which UI elements are rendered. */
export interface TableFeatureFlags {
  /** Show search inputs. */
  search: boolean
  /** Show filter dropdowns. */
  filter: boolean
  /** Show pagination controls. */
  pagination: boolean
  /** Show column visibility toggle. */
  columnVisibility: boolean
  /** Show CSV export button. */
  csvExport: boolean
  /** Enable row selection checkboxes. */
  rowSelection: boolean
  /** Show table/card view toggle. */
  viewToggle: boolean
  /** Show floating action bar for selected rows. */
  floatingBar: boolean
  /** Enable advanced filter builder UI. */
  advancedFilter: boolean
  /** Enable column sorting. */
  sorting: boolean
}

/** Pagination configuration. */
export interface TablePaginationConfig {
  /** Available page size options in the dropdown. */
  pageSizeOptions: number[]
  /** Default number of rows per page. */
  defaultPageSize: number
}

/** Search configuration. */
export interface TableSearchConfig {
  /** Debounce delay in milliseconds for search input. */
  debounceMs: number
  /** Minimum number of characters before search triggers. */
  minSearchLength: number
}

/** Internationalization configuration. */
export interface TableI18nConfig {
  /** Current locale string (e.g. 'en', 'ar'). */
  locale: string
  /** Text direction: 'ltr', 'rtl', or 'auto' (derived from locale). */
  direction: 'ltr' | 'rtl' | 'auto'
  /** Custom translation function. When provided, used for all UI strings. */
  translationFn?: (key: string) => string
  /** Translation namespace (for organizational purposes). */
  namespace: string
}

/** Performance tuning configuration. */
export interface TablePerformanceConfig {
  /** Memoization strategy: 'smart' (default), 'aggressive', or 'manual'. */
  memoStrategy: 'smart' | 'aggressive' | 'manual'
  /** Number of extra rows rendered above/below the visible area for virtualization. */
  virtualizationOverscan: number
  /** Whether to batch state updates. */
  batchUpdates: boolean
}

/** Enterprise-grade configuration. */
export interface TableEnterpriseConfig {
  /** Enforce strict ARIA compliance. */
  strictAccessibility: boolean
  /** Wrap table in error boundary for graceful recovery. */
  errorRecovery: boolean
  /** Enable debug mode with extra logging. */
  debugMode: boolean
}

/** Developer experience configuration (dev-only). */
export interface TableDevConfig {
  /** Show console warnings for misconfigurations. */
  warnings: boolean
  /** Show performance optimization hints. */
  performanceHints: boolean
  /** Threshold in ms for flagging slow renders. */
  renderCostThresholdMs: number
}

/** Plugin interface for extending table config. */
export interface TablePlugin {
  /** Unique plugin name. */
  name: string
  /** Merge priority (lower = applied first). */
  priority: number
  /** Partial config to deep-merge. */
  config: DeepPartial<TableConfig>
  /** Callback invoked after config resolution. */
  onResolve?: (resolvedConfig: TableConfig) => void
}

/** Root config interface — the fully resolved config shape. */
export interface TableConfig {
  features: TableFeatureFlags
  pagination: TablePaginationConfig
  search: TableSearchConfig
  i18n: TableI18nConfig
  performance: TablePerformanceConfig
  enterprise: TableEnterpriseConfig
  dev: TableDevConfig
  plugins: TablePlugin[]
  /** Optional router adapter for URL synchronization. */
  router?: TableRouterAdapter
}

/** What consumers pass — everything optional via DeepPartial. */
export type TableConfigInput = DeepPartial<TableConfig>
