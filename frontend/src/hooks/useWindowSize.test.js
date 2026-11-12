import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RESIZE_DELAY_MS, useWindowSize } from './useWindowSize.js'

const originalSize = { width: window.innerWidth, height: window.innerHeight }

function resizeWindow(width, height) {
  window.innerWidth = width
  window.innerHeight = height
  window.dispatchEvent(new Event('resize'))
}

describe('useWindowSize', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.innerWidth = 1440
    window.innerHeight = 900
  })

  afterEach(() => {
    vi.useRealTimers()
    window.innerWidth = originalSize.width
    window.innerHeight = originalSize.height
  })

  it('returns the current window size at once', () => {
    const { result } = renderHook(() => useWindowSize())
    expect(result.current).toEqual({ width: 1440, height: 900 })
  })

  it('reports the new size only after resizing pauses', () => {
    const { result } = renderHook(() => useWindowSize())

    act(() => resizeWindow(768, 1024))
    act(() => vi.advanceTimersByTime(RESIZE_DELAY_MS - 1))
    expect(result.current).toEqual({ width: 1440, height: 900 })

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toEqual({ width: 768, height: 1024 })
  })

  it('turns a drag of many resize events into one update with the last size', () => {
    const seen = []
    const { result } = renderHook(() => {
      const size = useWindowSize()
      if (seen.at(-1) !== size.width) seen.push(size.width)
      return size
    })

    for (const width of [1400, 1300, 1100, 1000, 900]) {
      act(() => resizeWindow(width, 900))
      act(() => vi.advanceTimersByTime(30))
    }
    act(() => vi.advanceTimersByTime(RESIZE_DELAY_MS))

    expect(result.current.width).toBe(900)
    expect(seen).toEqual([1440, 900])
  })

  it('removes the same resize listener it added when unmounted', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useWindowSize())

    const added = addSpy.mock.calls.find(([type]) => type === 'resize')
    expect(added).toBeDefined()

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('resize', added[1])
    // A resize after unmounting schedules nothing.
    resizeWindow(500, 800)
    expect(vi.getTimerCount()).toBe(0)
  })
})
