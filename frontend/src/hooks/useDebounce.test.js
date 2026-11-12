import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce.js'

const DELAY_MS = 300

function renderDebounce(initialValue) {
  return renderHook(({ value }) => useDebounce(value, DELAY_MS), {
    initialProps: { value: initialValue },
  })
}

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value at once', () => {
    const { result } = renderDebounce('faro')
    expect(result.current).toBe('faro')
    expect(vi.getTimerCount()).toBe(1)
  })

  it('updates only after the delay has passed', () => {
    const { result, rerender } = renderDebounce('f')

    rerender({ value: 'fa' })
    act(() => vi.advanceTimersByTime(DELAY_MS - 1))
    expect(result.current).toBe('f')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('fa')
  })

  it('turns a burst of changes into a single update with the last value', () => {
    const seen = []
    const { result, rerender } = renderHook(
      ({ value }) => {
        const debounced = useDebounce(value, DELAY_MS)
        if (seen.at(-1) !== debounced) seen.push(debounced)
        return debounced
      },
      { initialProps: { value: '' } },
    )

    for (const value of ['f', 'fa', 'far', 'faro']) {
      rerender({ value })
      act(() => vi.advanceTimersByTime(100))
      // Each change cancels the previous timer: only one is ever pending.
      expect(vi.getTimerCount()).toBe(1)
    }
    expect(result.current).toBe('')

    act(() => vi.advanceTimersByTime(DELAY_MS))
    expect(result.current).toBe('faro')
    // Intermediate values ('f', 'fa', 'far') were never returned.
    expect(seen).toEqual(['', 'faro'])
  })

  it('restarts the wait when the delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebounce(value, delayMs),
      { initialProps: { value: 'a', delayMs: DELAY_MS } },
    )

    rerender({ value: 'b', delayMs: 500 })
    act(() => vi.advanceTimersByTime(DELAY_MS))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('b')
  })

  it('clears the pending timer on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout')
    const { rerender, unmount } = renderDebounce('f')
    rerender({ value: 'fa' })
    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(clearSpy).toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
})
