import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import MovieCard from './MovieCard.jsx'

const movie = {
  id: 7,
  title: 'Película de prueba',
  image: '/posters/prueba.svg',
  rating: 7.5,
  showtimes: ['18:00'],
}

describe('MovieCard', () => {
  it('reports the movie id to its parent and keeps no state of its own', async () => {
    const onToggleFavorite = vi.fn()
    render(
      <MovieCard movie={movie} isFavorite={false} onToggleFavorite={onToggleFavorite} />,
    )

    const button = screen.getByRole('button', { name: /Añadir a favoritas/ })
    await userEvent.click(button)

    expect(onToggleFavorite).toHaveBeenCalledExactlyOnceWith(7)
    // The parent did not change the prop, so the card must not change by itself.
    expect(button).toHaveTextContent('Añadir a favoritas')
  })

  it('shows the current state received from the parent', () => {
    render(<MovieCard movie={movie} isFavorite onToggleFavorite={() => {}} />)
    expect(screen.getByRole('button', { name: /En favoritas/ })).toHaveClass(
      'button--primary',
    )
    expect(screen.getByRole('article')).toHaveClass('movie-card--favorite')
  })
})
