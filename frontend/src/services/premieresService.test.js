import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiPremieres } from '../data/premieres.js'
import {
  DEFAULT_DELAY_MS,
  PREMIERES_ERROR_MESSAGE,
  SLOW_DELAY_MS,
  fetchPremieres,
  readSimulation,
  simulationFromUrl,
} from './premieresService.js'

describe('fetchPremieres', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves with the raw API data after the default delay', async () => {
    const onDone = vi.fn()
    fetchPremieres().then(onDone)

    await vi.advanceTimersByTimeAsync(DEFAULT_DELAY_MS - 1)
    expect(onDone).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(onDone).toHaveBeenCalledWith(apiPremieres)
    expect(onDone.mock.calls[0][0][0]).toHaveProperty('release_date')
  })

  it('returns a copy, so the caller cannot change the source data', async () => {
    const request = fetchPremieres({ delayMs: 10 })
    await vi.advanceTimersByTimeAsync(10)
    const data = await request

    data[0].title = 'Cambiado'
    expect(apiPremieres[0].title).toBe('Marea de neón')
  })

  it('rejects with a clear Spanish message when it should fail', async () => {
    const request = fetchPremieres({ delayMs: 50, shouldFail: true })
    const assertion = expect(request).rejects.toThrow(PREMIERES_ERROR_MESSAGE)

    await vi.advanceTimersByTimeAsync(50)
    await assertion
    expect(PREMIERES_ERROR_MESSAGE).toBe('No se pudo conectar con el servidor de estrenos')
  })
})

describe('readSimulation', () => {
  it('forces the error with ?estrenos=error in development', () => {
    expect(readSimulation('?estrenos=error', true)).toEqual({ shouldFail: true })
  })

  it('slows the request down with ?estrenos=lento in development', () => {
    expect(readSimulation('?estrenos=lento', true)).toEqual({ delayMs: SLOW_DELAY_MS })
    expect(SLOW_DELAY_MS).toBe(4000)
  })

  it('uses the normal request without the parameter or with an unknown value', () => {
    expect(readSimulation('', true)).toEqual({})
    expect(readSimulation('?estrenos=otro', true)).toEqual({})
  })

  it('ignores the parameter outside development', () => {
    expect(readSimulation('?estrenos=error', false)).toEqual({})
    expect(readSimulation('?estrenos=lento', false)).toEqual({})
  })
})

describe('simulationFromUrl', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('reads the current page URL (tests run in development mode)', () => {
    window.history.replaceState(null, '', '/?estrenos=error')
    expect(simulationFromUrl()).toEqual({ shouldFail: true })
  })
})
