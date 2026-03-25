import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { useTableTranslations } from '../hooks/use-table-translations'
import { TableProvider } from '../config/context'

describe('useTableTranslations', () => {
  it('returns built-in English translations by default', () => {
    const { result } = renderHook(() => useTableTranslations())
    const t = result.current

    expect(t('Filter')).toBe('Filter')
    expect(t('search')).toBe('Search')
    expect(t('previous')).toBe('Previous')
    expect(t('next')).toBe('Next')
    expect(t('no-records-found')).toBe('No records found')
  })

  it('returns the key itself for unknown translation keys', () => {
    const { result } = renderHook(() => useTableTranslations())
    const t = result.current

    expect(t('unknown-key')).toBe('unknown-key')
  })

  it('uses custom translationFn when provided via TableProvider', () => {
    const customFn = (key: string) => `translated:${key}`
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableProvider config={{ i18n: { translationFn: customFn } }}>
        {children}
      </TableProvider>
    )

    const { result } = renderHook(() => useTableTranslations(), { wrapper })
    const t = result.current

    expect(t('Filter')).toBe('translated:Filter')
    expect(t('anything')).toBe('translated:anything')
  })
})
