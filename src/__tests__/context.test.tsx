import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { TableProvider, useGlobalTableConfig } from '../config/context'
import { DEFAULT_TABLE_CONFIG } from '../config/defaults'

describe('TableProvider & useGlobalTableConfig', () => {
  it('returns DEFAULT_TABLE_CONFIG when no provider is present', () => {
    const { result } = renderHook(() => useGlobalTableConfig())
    expect(result.current).toBe(DEFAULT_TABLE_CONFIG)
  })

  it('merges provider config with defaults', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableProvider config={{ features: { search: false } }}>
        {children}
      </TableProvider>
    )

    const { result } = renderHook(() => useGlobalTableConfig(), { wrapper })

    expect(result.current.features.search).toBe(false)
    // Preserved defaults
    expect(result.current.features.pagination).toBe(true)
    expect(result.current.features.sorting).toBe(true)
  })

  it('merges pagination config through provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableProvider config={{ pagination: { defaultPageSize: 25 } }}>
        {children}
      </TableProvider>
    )

    const { result } = renderHook(() => useGlobalTableConfig(), { wrapper })

    expect(result.current.pagination.defaultPageSize).toBe(25)
    expect(result.current.pagination.pageSizeOptions).toEqual(
      DEFAULT_TABLE_CONFIG.pagination.pageSizeOptions
    )
  })

  it('passes custom translationFn through provider', () => {
    const customFn = (key: string) => `custom:${key}`
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableProvider config={{ i18n: { translationFn: customFn } }}>
        {children}
      </TableProvider>
    )

    const { result } = renderHook(() => useGlobalTableConfig(), { wrapper })

    expect(result.current.i18n.translationFn).toBe(customFn)
    expect(result.current.i18n.translationFn!('test')).toBe('custom:test')
  })
})
