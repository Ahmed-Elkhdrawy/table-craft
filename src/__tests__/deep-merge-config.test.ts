import { describe, it, expect } from 'vitest'
import { deepMergeConfig } from '../config/merge'
import { DEFAULT_TABLE_CONFIG } from '../config/defaults'
import type { TableConfig, DeepPartial } from '../types/table-config'

describe('deepMergeConfig', () => {
  it('returns base config when overrides are empty', () => {
    const result = deepMergeConfig(DEFAULT_TABLE_CONFIG, {})
    expect(result).toEqual(DEFAULT_TABLE_CONFIG)
  })

  it('overrides top-level primitive values', () => {
    const base = { ...DEFAULT_TABLE_CONFIG, router: undefined }
    const result = deepMergeConfig(base, {
      router: {
        push: () => {},
        replace: () => {},
        getSearchParams: () => new URLSearchParams(),
        getPathname: () => '/',
      },
    })
    expect(result.router).toBeDefined()
    expect(result.router!.getPathname()).toBe('/')
  })

  it('deep merges nested objects one level', () => {
    const result = deepMergeConfig(DEFAULT_TABLE_CONFIG, {
      features: { search: false, sorting: false },
    })
    // Overridden values
    expect(result.features.search).toBe(false)
    expect(result.features.sorting).toBe(false)
    // Preserved values from base
    expect(result.features.pagination).toBe(true)
    expect(result.features.columnVisibility).toBe(true)
    expect(result.features.rowSelection).toBe(true)
  })

  it('replaces arrays entirely instead of concatenating', () => {
    const result = deepMergeConfig(DEFAULT_TABLE_CONFIG, {
      pagination: { pageSizeOptions: [5, 15] },
    })
    expect(result.pagination.pageSizeOptions).toEqual([5, 15])
  })

  it('skips undefined values in overrides', () => {
    const result = deepMergeConfig(DEFAULT_TABLE_CONFIG, {
      features: { search: undefined },
    } as DeepPartial<TableConfig>)
    expect(result.features.search).toBe(true)
  })

  it('does not mutate the base config', () => {
    const base = {
      ...DEFAULT_TABLE_CONFIG,
      features: { ...DEFAULT_TABLE_CONFIG.features },
    }
    const originalSearch = base.features.search

    deepMergeConfig(base, { features: { search: false } })

    expect(base.features.search).toBe(originalSearch)
  })

  it('merges multiple nested sections independently', () => {
    const result = deepMergeConfig(DEFAULT_TABLE_CONFIG, {
      features: { floatingBar: true },
      pagination: { defaultPageSize: 25 },
      search: { debounceMs: 300 },
    })
    expect(result.features.floatingBar).toBe(true)
    expect(result.pagination.defaultPageSize).toBe(25)
    expect(result.search.debounceMs).toBe(300)
    // Unchanged sections
    expect(result.i18n.locale).toBe('en')
    expect(result.enterprise.debugMode).toBe(false)
  })

  it('handles i18n translationFn override', () => {
    const customFn = (key: string) => `translated:${key}`
    const result = deepMergeConfig(DEFAULT_TABLE_CONFIG, {
      i18n: { translationFn: customFn },
    })
    expect(result.i18n.translationFn).toBe(customFn)
    expect(result.i18n.locale).toBe('en')
  })

  it('replaces plugins array entirely', () => {
    const plugin = { name: 'test', priority: 1, config: {} }
    const result = deepMergeConfig(DEFAULT_TABLE_CONFIG, {
      plugins: [plugin],
    })
    expect(result.plugins).toEqual([plugin])
    expect(result.plugins).toHaveLength(1)
  })
})
