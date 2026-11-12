import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiPremieres } from '../data/premieres.js'
import * as service from '../services/premieresService.js'
import * as adapter from '../utils/adaptMovie.js'
import { usePremieres } from './usePremieres.js'

const { adaptMovies } = adapter

// Wraps the real service so a single call can be made to fail, as a flaky server would.
vi.mock('../services/premieresService.js', async (importOriginal) => {
  const original = await importOriginal()
  return { ...original, fetchPremieres: vi.fn(original.fetchPremieres) }
})

// Spy on the adapter to see whether a late answer is still processed.
vi.mock('../utils/adaptMovie.js', async (importOriginal) => {
  const original = await importOriginal()
  return { ...original, adaptMovies: vi.fn(original.adaptMovies) }
})

const DELAY_MS = 1200

// Moves the fake clock forward and lets the resolved promise update the hook.
async function advance(ms) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

describe('usePremieres', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in loading with no data and no error', () => {
    const { result } = renderHook(() => usePremieres({ delayMs: DELAY_MS }))

    expect(result.current.status).toBe('loading')
    expect(result.current.premieres).toEqual([])
    expect(result.current.error).toBeNull()
    expect(typeof result.current.retry).toBe('function')
  })

  it('switches to success with the adapted premieres after the delay', async () => {
    const { result } = renderHook(() => usePremieres({ delayMs: DELAY_MS }))

    await advance(DELAY_MS - 1)
    expect(result.current.status).toBe('loading')

    await advance(1)
    expect(result.current.status).toBe('success')
    expect(result.current.error).toBeNull()
    expect(result.current.premieres).toEqual(adaptMovies(apiPremieres))
    // App model, not API names: releaseDate instead of release_date, image instead of poster_url.
    expect(result.current.premieres[0]).toMatchObject({
      title: 'Marea de neón',
      image: '/posters/marea-de-neon.svg',
      releaseDate: '2026-11-27',
    })
    expect(result.current.premieres[0]).not.toHaveProperty('release_date')
  })

  it('switches to error with the message when the request fails', async () => {
    const { result } = renderHook(() => usePremieres({ delayMs: DELAY_MS, shouldFail: true }))

    await advance(DELAY_MS)

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('No se pudo conectar con el servidor de estrenos')
    expect(result.current.premieres).toEqual([])
  })

  it('retry goes back to loading and then to success', async () => {
    service.fetchPremieres.mockImplementationOnce(() =>
      Promise.reject(new Error(service.PREMIERES_ERROR_MESSAGE)),
    )
    const { result } = renderHook(() => usePremieres({ delayMs: DELAY_MS }))
    await advance(0)
    expect(result.current.status).toBe('error')

    act(() => result.current.retry())
    expect(result.current.status).toBe('loading')
    expect(result.current.error).toBeNull()

    await advance(DELAY_MS)
    expect(result.current.status).toBe('success')
    expect(result.current.premieres).toHaveLength(6)
    expect(service.fetchPremieres).toHaveBeenCalledTimes(2)
  })

  it('gives a clear message when the failure has none', async () => {
    service.fetchPremieres.mockImplementationOnce(() => Promise.reject(new Error('')))
    const { result } = renderHook(() => usePremieres({ delayMs: DELAY_MS }))

    await advance(0)

    expect(result.current.error).toBe(service.PREMIERES_ERROR_MESSAGE)
  })

  it('ignores the answer that arrives after unmounting', async () => {
    const renders = []
    const { unmount } = renderHook(() => {
      const premieres = usePremieres({ delayMs: DELAY_MS })
      renders.push(premieres.status)
      return premieres
    })
    adapter.adaptMovies.mockClear()

    unmount()
    await advance(DELAY_MS)

    // The request still answered, but the cleanup flag kept it from being processed:
    // the data was not adapted and nothing reached the state.
    expect(service.fetchPremieres).toHaveBeenCalledTimes(1)
    expect(adapter.adaptMovies).not.toHaveBeenCalled()
    expect(renders).not.toContain('success')
  })

  it('ignores a slow old answer that arrives after a newer request finished', async () => {
    const { result, rerender } = renderHook(
      ({ options }) => usePremieres(options),
      // First request: slow and failing.
      { initialProps: { options: { delayMs: 3000, shouldFail: true } } },
    )

    // It is replaced by a fast request that succeeds before the old one answers.
    rerender({ options: { delayMs: 500, shouldFail: false } })
    await advance(500)
    expect(result.current.status).toBe('success')

    // The old request fails now; without the flag it would overwrite the good data.
    await advance(3000)
    expect(result.current.status).toBe('success')
    expect(result.current.premieres).toHaveLength(6)
  })
})
