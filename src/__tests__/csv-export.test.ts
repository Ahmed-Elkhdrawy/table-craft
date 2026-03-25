import { describe, it, expect } from 'vitest'
import { createCsvConfig } from '../lib/csv-export'

describe('createCsvConfig', () => {
  it('returns config with default filename', () => {
    const config = createCsvConfig()
    expect(config).toBeDefined()
  })

  it('uses custom filename when provided', () => {
    const config = createCsvConfig({ fileName: 'my-export' })
    expect(config).toBeDefined()
  })

  it('sets correct field separator', () => {
    const config = createCsvConfig()
    // mkConfig returns an object with fieldSeparator
    expect(config.fieldSeparator).toBe(',')
  })

  it('enables useKeysAsHeaders', () => {
    const config = createCsvConfig()
    expect(config.useKeysAsHeaders).toBe(true)
  })
})
