import { describe, it, expect } from 'vitest'
import { createTableConfig } from '../config/create-config'
import { DEFAULT_TABLE_CONFIG } from '../config/defaults'

describe('createTableConfig', () => {
  it('returns DEFAULT_TABLE_CONFIG when called with no arguments', () => {
    const config = createTableConfig()
    expect(config).toBe(DEFAULT_TABLE_CONFIG)
  })

  it('returns DEFAULT_TABLE_CONFIG when called with undefined', () => {
    const config = createTableConfig(undefined)
    expect(config).toBe(DEFAULT_TABLE_CONFIG)
  })

  it('merges input with defaults', () => {
    const config = createTableConfig({
      features: { search: false },
      pagination: { defaultPageSize: 50 },
    })
    expect(config.features.search).toBe(false)
    expect(config.pagination.defaultPageSize).toBe(50)
    // Preserved defaults
    expect(config.features.pagination).toBe(true)
    expect(config.i18n.locale).toBe('en')
  })

  it('returns a frozen object', () => {
    const config = createTableConfig({ features: { sorting: false } })
    expect(Object.isFrozen(config)).toBe(true)
  })

  it('preserves router adapter', () => {
    const router = {
      push: () => {},
      replace: () => {},
      getSearchParams: () => new URLSearchParams(),
      getPathname: () => '/test',
    }
    const config = createTableConfig({ router })
    expect(config.router).toBeDefined()
    expect(config.router!.getPathname()).toBe('/test')
  })

  it('preserves plugin configuration', () => {
    const plugin = {
      name: 'test-plugin',
      priority: 5,
      config: { features: { floatingBar: true } },
    }
    const config = createTableConfig({ plugins: [plugin] })
    expect(config.plugins).toHaveLength(1)
    expect(config.plugins[0].name).toBe('test-plugin')
  })
})
