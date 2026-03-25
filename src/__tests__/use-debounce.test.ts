import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../hooks/use-debounce'

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500))
    expect(result.current).toBe('hello')
  })

  it('does not update value before delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'updated', delay: 500 })

    // Before delay
    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe('initial')

    vi.useRealTimers()
  })

  it('updates value after delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'updated', delay: 500 })

    act(() => { vi.advanceTimersByTime(500) })
    expect(result.current).toBe('updated')

    vi.useRealTimers()
  })

  it('resets timer on rapid changes', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    )

    rerender({ value: 'b', delay: 300 })
    act(() => { vi.advanceTimersByTime(200) })

    rerender({ value: 'c', delay: 300 })
    act(() => { vi.advanceTimersByTime(200) })

    // Still 'a' because timer keeps resetting
    expect(result.current).toBe('a')

    // After full delay from last change, should be 'c'
    act(() => { vi.advanceTimersByTime(100) })
    expect(result.current).toBe('c')

    vi.useRealTimers()
  })

  it('works with number values', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 100 } }
    )

    rerender({ value: 42, delay: 100 })
    act(() => { vi.advanceTimersByTime(100) })
    expect(result.current).toBe(42)

    vi.useRealTimers()
  })
})
