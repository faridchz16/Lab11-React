import '@testing-library/jest-dom/vitest'
import { act, cleanup } from '@testing-library/react'
import toast from 'react-hot-toast'
import { afterEach, beforeEach, vi } from 'vitest'

// jsdom has no matchMedia; react-hot-toast uses it to check prefers-reduced-motion.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })
}

beforeEach(() => {
  localStorage.clear()
  // Keeps the development search trace out of the test report.
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  // The toast store is global: drop the notices so they do not leak into the next test.
  act(() => toast.remove())
  cleanup()
  vi.restoreAllMocks()
})
