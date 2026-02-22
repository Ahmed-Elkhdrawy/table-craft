import type { TableConfig, TableConfigInput } from '../types/table-config'
import { DEFAULT_TABLE_CONFIG } from './defaults'
import { deepMergeConfig } from './merge'

/**
 * Factory function to create a resolved, frozen TableConfig.
 * Can be used outside React to pre-build configs in constants files.
 */
export function createTableConfig(input?: TableConfigInput): TableConfig {
  if (!input) return DEFAULT_TABLE_CONFIG

  const merged = deepMergeConfig(DEFAULT_TABLE_CONFIG, input)
  return Object.freeze(merged)
}
