import { useEffect, useState } from 'react'
import { useDebounce } from './useDebounce.js'

// Wait after the last resize event before the new size is reported.
export const RESIZE_DELAY_MS = 150

function readWindowSize() {
  return { width: window.innerWidth, height: window.innerHeight }
}

// Returns the window { width, height }, updated once resizing pauses for RESIZE_DELAY_MS.
export function useWindowSize() {
  // Lazy initializer: the size is read once, on the first render.
  const [size, setSize] = useState(readWindowSize)

  useEffect(() => {
    function handleResize() {
      const next = readWindowSize()
      // Same size, same object: React skips the render (e.g. a resize that only changed zoom).
      setSize((current) =>
        current.width === next.width && current.height === next.height ? current : next,
      )
    }

    window.addEventListener('resize', handleResize)
    // Cleanup: the same function is removed, so no listener outlives the component.
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reuses the search debounce: a drag that fires dozens of events yields one new size.
  return useDebounce(size, RESIZE_DELAY_MS)
}
