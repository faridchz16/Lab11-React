import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RESIZE_DELAY_MS } from '../../hooks/useWindowSize.js'
import MovieList from './MovieList.jsx'

const movies = [1, 2, 3].map((id) => ({
  id,
  title: `Película ${id}`,
  image: null,
  synopsis: '',
  classification: 'APT',
  rating: 7,
  showtimes: [],
}))

const originalWidth = window.innerWidth

function renderList() {
  render(
    <MovieList
      movies={movies}
      query=""
      favoriteIds={[]}
      onToggleFavorite={() => {}}
      onClearSearch={() => {}}
    />,
  )
  return screen.getAllByRole('article')[0].parentElement
}

describe('MovieList columns', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    window.innerWidth = originalWidth
  })

  it('sets --columns on the grid from the window width', () => {
    window.innerWidth = 1440
    const grid = renderList()

    expect(grid).toHaveClass('grid')
    expect(grid.style.getPropertyValue('--columns')).toBe('4')
  })

  it('changes the column count after the window is resized', () => {
    window.innerWidth = 1440
    const grid = renderList()

    act(() => {
      window.innerWidth = 390
      window.dispatchEvent(new Event('resize'))
    })
    act(() => vi.advanceTimersByTime(RESIZE_DELAY_MS))

    expect(grid.style.getPropertyValue('--columns')).toBe('1')
  })
})
