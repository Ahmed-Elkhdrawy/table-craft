export { DEFAULT_TABLE_CONFIG } from './defaults'
export { deepMergeConfig } from './merge'
export { createTableConfig } from './create-config'
export { TableProvider, useGlobalTableConfig, useResolvedTableConfigContext } from './context'
export { useResolvedTableConfig } from './use-resolved-config'
export { useTableConfig } from './use-table-config'

export type {
  TableConfig,
  TableConfigInput,
  TableFeatureFlags,
  TablePaginationConfig,
  TableSearchConfig,
  TableI18nConfig,
  TablePerformanceConfig,
  TableEnterpriseConfig,
  TableDevConfig,
  TablePlugin,
  TableRouterAdapter,
  DeepPartial,
} from '../types/table-config'
