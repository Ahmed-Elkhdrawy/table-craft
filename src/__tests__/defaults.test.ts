import { describe, it, expect } from 'vitest'
import { DEFAULT_TABLE_CONFIG } from '../config/defaults'

describe('DEFAULT_TABLE_CONFIG', () => {
  it('is frozen at the top level', () => {
    expect(Object.isFrozen(DEFAULT_TABLE_CONFIG)).toBe(true)
  })

  it('has frozen nested objects', () => {
    expect(Object.isFrozen(DEFAULT_TABLE_CONFIG.features)).toBe(true)
    expect(Object.isFrozen(DEFAULT_TABLE_CONFIG.pagination)).toBe(true)
    expect(Object.isFrozen(DEFAULT_TABLE_CONFIG.search)).toBe(true)
    expect(Object.isFrozen(DEFAULT_TABLE_CONFIG.i18n)).toBe(true)
    expect(Object.isFrozen(DEFAULT_TABLE_CONFIG.performance)).toBe(true)
    expect(Object.isFrozen(DEFAULT_TABLE_CONFIG.enterprise)).toBe(true)
    expect(Object.isFrozen(DEFAULT_TABLE_CONFIG.dev)).toBe(true)
  })

  it('has sensible default feature flags', () => {
    const { features } = DEFAULT_TABLE_CONFIG
    expect(features.search).toBe(true)
    expect(features.filter).toBe(true)
    expect(features.pagination).toBe(true)
    expect(features.sorting).toBe(true)
    expect(features.floatingBar).toBe(false)
    expect(features.advancedFilter).toBe(false)
  })

  it('has default pagination config', () => {
    expect(DEFAULT_TABLE_CONFIG.pagination.defaultPageSize).toBe(10)
    expect(DEFAULT_TABLE_CONFIG.pagination.pageSizeOptions).toEqual([10, 20, 30, 40, 50])
  })

  it('has no router by default', () => {
    expect(DEFAULT_TABLE_CONFIG.router).toBeUndefined()
  })

  it('has no plugins by default', () => {
    expect(DEFAULT_TABLE_CONFIG.plugins).toEqual([])
  })

  it('has dev warnings enabled by default', () => {
    expect(DEFAULT_TABLE_CONFIG.dev.warnings).toBe(true)
  })
})
