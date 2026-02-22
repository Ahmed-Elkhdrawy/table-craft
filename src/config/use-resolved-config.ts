'use client'

import { useMemo } from 'react'
import type { TableConfig, TableConfigInput } from '../types/table-config'
import { useGlobalTableConfig } from './context'
import { deepMergeConfig } from './merge'
import { runDevValidation } from './dev-warnings'

/**
 * Resolves config across all layers: Core Defaults -> Provider -> Instance -> Plugins.
 * Memoized and runs dev validation.
 */
export function useResolvedTableConfig(instanceConfig?: TableConfigInput): TableConfig {
  const globalConfig = useGlobalTableConfig()

  const resolved = useMemo(() => {
    // Layer 3: merge instance overrides into global (which already has Layer 1+2)
    let config = instanceConfig
      ? deepMergeConfig(globalConfig, instanceConfig)
      : globalConfig

    // Layer 4: apply plugins sorted by priority
    if (config.plugins.length > 0) {
      const sortedPlugins = [...config.plugins].sort((a, b) => a.priority - b.priority)
      for (const plugin of sortedPlugins) {
        config = deepMergeConfig(config, plugin.config)
      }
      // Notify plugins after resolution
      for (const plugin of sortedPlugins) {
        plugin.onResolve?.(config)
      }
    }

    return config
  }, [globalConfig, instanceConfig])

  // Dev-only validation (tree-shaken in production)
  if (process.env.NODE_ENV === 'development') {
    runDevValidation(resolved)
  }

  return resolved
}
