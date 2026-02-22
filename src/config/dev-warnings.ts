import type { TableConfig } from '../types/table-config'

/**
 * Validates the resolved config and logs warnings in development.
 * All warnings are gated behind process.env.NODE_ENV === 'development'.
 */
export function runDevValidation(config: TableConfig): void {
  if (process.env.NODE_ENV !== 'development') return
  if (!config.dev.warnings) return

  // Pagination sanity: defaultPageSize should be in pageSizeOptions
  if (!config.pagination.pageSizeOptions.includes(config.pagination.defaultPageSize)) {
    console.warn(
      `[TableCraft] defaultPageSize (${config.pagination.defaultPageSize}) is not in pageSizeOptions [${config.pagination.pageSizeOptions.join(', ')}]. The page size dropdown may not show the default selection.`
    )
  }

  // Search sanity: debounceMs should be non-negative
  if (config.search.debounceMs < 0) {
    console.warn(
      `[TableCraft] search.debounceMs is negative (${config.search.debounceMs}). This will be treated as 0.`
    )
  }

  // Feature flag conflict: advancedFilter requires filter
  if (config.features.advancedFilter && !config.features.filter) {
    console.warn(
      `[TableCraft] features.advancedFilter is enabled but features.filter is disabled. Advanced filter will have no effect.`
    )
  }

  // i18n: direction 'auto' with no locale hint
  if (config.i18n.direction === 'auto' && !config.i18n.locale) {
    console.warn(
      `[TableCraft] i18n.direction is 'auto' but i18n.locale is empty. Direction detection may not work correctly. Set an explicit direction or locale.`
    )
  }
}
