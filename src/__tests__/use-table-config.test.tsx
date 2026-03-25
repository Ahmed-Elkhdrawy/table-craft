import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { useTableConfig } from '../config/use-table-config'
import { TableProvider } from '../config/context'
import { DEFAULT_TABLE_CONFIG } from '../config/defaults'

describe('useTableConfig', () => {
  it('returns full default config when called without arguments', () => {
    const { result } = renderHook(() => useTableConfig())
    expect(result.current).toEqual(DEFAULT_TABLE_CONFIG)
  })

  it('returns provider config when inside a TableProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableProvider config={{ features: { search: false } }}>
        {children}
      </TableProvider>
    )

    const { result } = renderHook(() => useTableConfig(), { wrapper })
    expect(result.current.features.search).toBe(false)
  })

  it('supports selector function to extract a slice', () => {
    const { result } = renderHook(() =>
      useTableConfig((config) => config.features.pagination)
    )
    expect(result.current).toBe(true)
  })

  it('selector returns derived values from provider config', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableProvider config={{ pagination: { defaultPageSize: 50 } }}>
        {children}
      </TableProvider>
    )

    const { result } = renderHook(
      () => useTableConfig((config) => config.pagination.defaultPageSize),
      { wrapper }
    )
    expect(result.current).toBe(50)
  })

  it('selector can return complex derived objects', () => {
    const { result } = renderHook(() =>
      useTableConfig((config) => ({
        hasSearch: config.features.search,
        pageSize: config.pagination.defaultPageSize,
      }))
    )
    expect(result.current).toEqual({
      hasSearch: true,
      pageSize: 10,
    })
  })
})
