import { useEffect, useState } from 'react'
import {
  PREMIERES_ERROR_MESSAGE,
  fetchPremieres,
  simulationFromUrl,
} from '../services/premieresService.js'
import { adaptMovies } from '../utils/adaptMovie.js'

const LOADING = { status: 'loading', premieres: [], error: null }

// Loads the upcoming premieres and reports the request state:
//   { status: 'loading' | 'success' | 'error', premieres, error, retry }
// premieres are already adapted to the app model; error is the message to show.
// The options default to the development simulation read from the URL (?estrenos=...).
export function usePremieres({ delayMs, shouldFail } = simulationFromUrl()) {
  // One object, so status, data and error always change together and never disagree.
  const [request, setRequest] = useState(LOADING)
  // Bumping it re-runs the effect: that is how retry() repeats the request.
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Cancellation flag: set by the cleanup when the component unmounts or the request is
    // replaced, so a late answer is ignored instead of updating stale or unmounted state.
    let ignore = false

    fetchPremieres({ delayMs, shouldFail }).then(
      (data) => {
        if (!ignore) setRequest({ status: 'success', premieres: adaptMovies(data), error: null })
      },
      (error) => {
        // Anything thrown without a message still gets a clear one.
        const message = error?.message || PREMIERES_ERROR_MESSAGE
        if (!ignore) setRequest({ status: 'error', premieres: [], error: message })
      },
    )

    return () => {
      ignore = true
    }
  }, [delayMs, shouldFail, attempt])

  // Event handler, not an effect: shows the loading state at once and asks for a new request.
  function retry() {
    setRequest(LOADING)
    setAttempt((current) => current + 1)
  }

  return { ...request, retry }
}
