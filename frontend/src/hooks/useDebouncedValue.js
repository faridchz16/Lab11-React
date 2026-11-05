import { useEffect, useState } from 'react'

// Returns value once it has stopped changing for delayMs milliseconds.
// Each new value cancels the pending timer, so a burst of changes yields one update.
export function useDebouncedValue(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(timerId)
  }, [value, delayMs])

  return debouncedValue
}
