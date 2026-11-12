import { useEffect, useState } from 'react'

// Returns value only once it has stopped changing for delayMs milliseconds.
// Each new value cancels the pending timer, so a burst of changes yields a single update.
// Generic: it works for any value (search text, window size, ...).
export function useDebounce(value, delayMs) {
  // Starts with the current value, so the first render needs no wait.
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Schedules the update for when the value has been quiet for delayMs.
    const timerId = setTimeout(() => setDebouncedValue(value), delayMs)
    // Cleanup runs before the next effect and on unmount: it cancels the pending timer.
    return () => clearTimeout(timerId)
  }, [value, delayMs])

  return debouncedValue
}
