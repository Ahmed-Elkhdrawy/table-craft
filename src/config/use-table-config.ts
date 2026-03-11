'use client'

import { useMemo } from 'react'
import type { TableConfig } from '../types/table-config'
import { useGlobalTableConfig, useResolvedTableConfigContext } from './context'

/**
 * Consumer hook for reading the resolved table config.
 *
 * Overloaded:
 * - `useTableConfig()` — returns the full config object
 * - `useTableConfig(selector)` — returns a derived slice (prevents unnecessary re-renders)
 */
export function useTableConfig(): TableConfig
export function useTableConfig<T>(selector: (config: TableConfig) => T): T
export function useTableConfig<T>(selector?: (config: TableConfig) => T): TableConfig | T {
  const resolvedFromContext = useResolvedTableConfigContext()
  const gobalConfig = useGlobalTableConfig()
  const config = resolvedFromContext ?? gobalConfig

  return useMemo(() => {
    if (selector) return selector(config)
    return config
  }, [config, selector])
}
