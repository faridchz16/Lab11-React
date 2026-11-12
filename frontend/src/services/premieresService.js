import { apiPremieres } from '../data/premieres.js'

// Simulated request for the upcoming premieres. It answers like a server would: after a
// network delay it resolves with the raw API data, or rejects with an Error.

export const DEFAULT_DELAY_MS = 1200
export const SLOW_DELAY_MS = 4000
export const PREMIERES_ERROR_MESSAGE = 'No se pudo conectar con el servidor de estrenos'

export function fetchPremieres({ delayMs = DEFAULT_DELAY_MS, shouldFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(PREMIERES_ERROR_MESSAGE))
      } else {
        // A fresh copy each time, as if it came over the network: callers cannot mutate the source.
        resolve(structuredClone(apiPremieres))
      }
    }, delayMs)
  })
}

/*
 * Development-only simulation, read from the page URL:
 *   ?estrenos=error  -> the request fails
 *   ?estrenos=lento  -> the request takes SLOW_DELAY_MS
 * Pure function so it can be tested with any URL and any mode.
 */
export function readSimulation(search, isDev) {
  if (!isDev) return {}
  const mode = new URLSearchParams(search).get('estrenos')
  if (mode === 'error') return { shouldFail: true }
  if (mode === 'lento') return { delayMs: SLOW_DELAY_MS }
  return {}
}

// In a production build import.meta.env.DEV is the constant false: this always returns {}
// and the bundler drops the URL reading altogether.
export function simulationFromUrl() {
  return import.meta.env.DEV ? readSimulation(window.location.search, true) : {}
}
