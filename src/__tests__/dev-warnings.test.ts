import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runDevValidation } from '../config/dev-warnings'
import { DEFAULT_TABLE_CONFIG } from '../config/defaults'
import { deepMergeConfig } from '../config/merge'
import type { DeepPartial, TableConfig } from '../types/table-config'

function makeConfig(overrides: DeepPartial<TableConfig>): TableConfig {
  return deepMergeConfig(DEFAULT_TABLE_CONFIG, overrides)
}

describe('runDevValidation', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.restoreAllMocks()
  })

  it('does nothing in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const spy = vi.spyOn(console, 'warn')
    const config = makeConfig({
      pagination: { defaultPageSize: 999 },
    })
    runDevValidation(config)
    expect(spy).not.toHaveBeenCalled()
  })

  it('does nothing when dev.warnings is false', () => {
    const spy = vi.spyOn(console, 'warn')
    const config = makeConfig({
      dev: { warnings: false },
      pagination: { defaultPageSize: 999 },
    })
    runDevValidation(config)
    expect(spy).not.toHaveBeenCalled()
  })

  it('warns when defaultPageSize is not in pageSizeOptions', () => {
    const spy = vi.spyOn(console, 'warn')
    const config = makeConfig({
      pagination: { defaultPageSize: 25, pageSizeOptions: [10, 50] },
    })
    runDevValidation(config)
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('defaultPageSize')
    )
  })

  it('does not warn when defaultPageSize is in pageSizeOptions', () => {
    const spy = vi.spyOn(console, 'warn')
    const config = makeConfig({
      pagination: { defaultPageSize: 10, pageSizeOptions: [10, 20, 50] },
    })
    runDevValidation(config)
    expect(spy).not.toHaveBeenCalledWith(
      expect.stringContaining('defaultPageSize')
    )
  })

  it('warns when debounceMs is negative', () => {
    const spy = vi.spyOn(console, 'warn')
    const config = makeConfig({
      search: { debounceMs: -1 },
    })
    runDevValidation(config)
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('debounceMs is negative')
    )
  })

  it('warns when advancedFilter is enabled but filter is disabled', () => {
    const spy = vi.spyOn(console, 'warn')
    const config = makeConfig({
      features: { advancedFilter: true, filter: false },
    })
    runDevValidation(config)
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('advancedFilter')
    )
  })

  it('does not warn for valid default config', () => {
    const spy = vi.spyOn(console, 'warn')
    runDevValidation(DEFAULT_TABLE_CONFIG)
    expect(spy).not.toHaveBeenCalled()
  })
})
