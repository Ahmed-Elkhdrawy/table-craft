import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { useResolvedTableConfig } from '../config/use-resolved-config'
import { TableProvider } from '../config/context'
import { DEFAULT_TABLE_CONFIG } from '../config/defaults'

describe('useResolvedTableConfig', () => {
  it('returns defaults when no provider or instance config', () => {
    const { result } = renderHook(() => useResolvedTableConfig())
    expect(result.current).toEqual(DEFAULT_TABLE_CONFIG)
  })

  it('merges instance config (Layer 3) over provider (Layer 2)', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableProvider config={{ features: { search: false, sorting: false } }}>
        {children}
      </TableProvider>
    )

    const { result } = renderHook(
      () => useResolvedTableConfig({ features: { sorting: true } }),
      { wrapper }
    )

    // Provider set search=false, instance didn't override it
    expect(result.current.features.search).toBe(false)
    // Instance overrode sorting back to true
    expect(result.current.features.sorting).toBe(true)
    // Defaults preserved
    expect(result.current.features.pagination).toBe(true)
  })

  it('applies plugins sorted by priority (Layer 4)', () => {
    const pluginLow = {
      name: 'low-priority',
      priority: 1,
      config: { features: { floatingBar: true } },
    }
    const pluginHigh = {
      name: 'high-priority',
      priority: 10,
      config: { features: { floatingBar: false, advancedFilter: true } },
    }

    const { result } = renderHook(() =>
      useResolvedTableConfig({
        plugins: [pluginHigh, pluginLow], // order shouldn't matter
      })
    )

    // High priority (10) overrides low priority (1)
    expect(result.current.features.floatingBar).toBe(false)
    // High priority sets advancedFilter
    expect(result.current.features.advancedFilter).toBe(true)
  })

  it('calls onResolve for each plugin after resolution', () => {
    const onResolve1 = vi.fn()
    const onResolve2 = vi.fn()

    const plugin1 = {
      name: 'plugin-1',
      priority: 1,
      config: {},
      onResolve: onResolve1,
    }
    const plugin2 = {
      name: 'plugin-2',
      priority: 2,
      config: {},
      onResolve: onResolve2,
    }

    renderHook(() =>
      useResolvedTableConfig({ plugins: [plugin2, plugin1] })
    )

    expect(onResolve1).toHaveBeenCalledTimes(1)
    expect(onResolve2).toHaveBeenCalledTimes(1)
    // Both receive the final resolved config
    expect(onResolve1).toHaveBeenCalledWith(
      expect.objectContaining({ features: expect.any(Object) })
    )
  })

  it('resolves all 4 layers correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableProvider
        config={{
          pagination: { defaultPageSize: 25 },
          features: { csvExport: false },
        }}
      >
        {children}
      </TableProvider>
    )

    const plugin = {
      name: 'test-plugin',
      priority: 1,
      config: { features: { viewToggle: false } },
    }

    const { result } = renderHook(
      () =>
        useResolvedTableConfig({
          search: { debounceMs: 200 },
          plugins: [plugin],
        }),
      { wrapper }
    )

    // Layer 1 default preserved
    expect(result.current.features.sorting).toBe(true)
    // Layer 2 provider
    expect(result.current.pagination.defaultPageSize).toBe(25)
    expect(result.current.features.csvExport).toBe(false)
    // Layer 3 instance
    expect(result.current.search.debounceMs).toBe(200)
    // Layer 4 plugin
    expect(result.current.features.viewToggle).toBe(false)
  })
})
