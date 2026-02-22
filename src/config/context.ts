'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import React from 'react'
import type { TableConfig, TableConfigInput } from '../types/table-config'
import { DEFAULT_TABLE_CONFIG } from './defaults'
import { deepMergeConfig } from './merge'

const TableConfigContext = createContext<TableConfig | null>(null)

interface TableProviderProps {
  config: TableConfigInput
  children: ReactNode
}

/**
 * Optional global config provider (Layer 2).
 * Wrapping your app or page with this merges your config with defaults.
 * If omitted, all components fall back to DEFAULT_TABLE_CONFIG.
 */
export function TableProvider({ config, children }: TableProviderProps) {
  const resolvedConfig = useMemo(
    () => deepMergeConfig(DEFAULT_TABLE_CONFIG, config),
    [config]
  )

  return React.createElement(
    TableConfigContext.Provider,
    { value: resolvedConfig },
    children
  )
}

/**
 * Internal hook: returns the provider's config or defaults if no provider exists.
 */
export function useGlobalTableConfig(): TableConfig {
  const context = useContext(TableConfigContext)
  return context ?? DEFAULT_TABLE_CONFIG
}
