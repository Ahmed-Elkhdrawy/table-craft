import type { TableConfig } from '../types/table-config'

/**
 * Core default config (Layer 1).
 * All values match the current hardcoded behavior across components.
 * Frozen to prevent accidental mutation.
 */
export const DEFAULT_TABLE_CONFIG: Readonly<TableConfig> = Object.freeze({
  features: Object.freeze({
    search: true,
    filter: true,
    pagination: true,
    columnVisibility: true,
    csvExport: true,
    rowSelection: true,
    viewToggle: true,
    floatingBar: false,
    advancedFilter: false,
    sorting: true,
  }),
  pagination: Object.freeze({
    pageSizeOptions: Object.freeze([10, 20, 30, 40, 50]) as unknown as number[],
    defaultPageSize: 10,
  }),
  search: Object.freeze({
    debounceMs: 500,
    minSearchLength: 0,
  }),
  i18n: Object.freeze({
    locale: 'en',
    direction: 'auto' as const,
    translationFn: undefined,
    namespace: 'table',
  }),
  performance: Object.freeze({
    memoStrategy: 'smart' as const,
    virtualizationOverscan: 5,
    batchUpdates: true,
  }),
  enterprise: Object.freeze({
    strictAccessibility: false,
    errorRecovery: false,
    debugMode: false,
  }),
  dev: Object.freeze({
    warnings: true,
    performanceHints: false,
    renderCostThresholdMs: 16,
  }),
  plugins: [],
  router: undefined,
})
