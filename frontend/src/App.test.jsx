import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

const STORAGE_KEY = 'cine-aurora:favorites'

function favoriteButton(title) {
  return screen.getByRole('button', { name: new RegExp(`favoritas: ${title}`) })
}

describe('App favorites', () => {
  it('adds and removes a favorite and updates the header counter', async () => {
    render(<App />)
    const banner = within(screen.getByRole('banner'))
    expect(banner.getByText(/0 favoritas/)).toBeInTheDocument()

    await userEvent.click(favoriteButton('Ecos de Marte'))
    expect(banner.getByText(/1 favorita$/)).toBeInTheDocument()
    expect(favoriteButton('Ecos de Marte')).toHaveTextContent('En favoritas')

    await userEvent.click(favoriteButton('Ecos de Marte'))
    expect(banner.getByText(/0 favoritas/)).toBeInTheDocument()
  })

  it('shows "2 favoritas" in the header after marking two movies', async () => {
    render(<App />)
    const counter = within(screen.getByRole('banner')).getByText(/favoritas?$/)

    await userEvent.click(favoriteButton('El último faro'))
    expect(counter).toHaveTextContent('1 favorita')

    await userEvent.click(favoriteButton('Frontera helada'))
    expect(counter).toHaveTextContent('2 favoritas')
    expect(counter).toHaveAttribute('aria-live', 'polite')
    expect(favoriteButton('El último faro')).toHaveTextContent('En favoritas')
    expect(favoriteButton('Frontera helada')).toHaveTextContent('En favoritas')
  })

  it('shows a notice with the title when a favorite is added and when it is removed', async () => {
    render(<App />)

    await userEvent.click(favoriteButton('Ecos de Marte'))
    const added = await screen.findByText('♥ Ecos de Marte añadida a favoritas')
    expect(added.closest('[role="status"]')).toBeInTheDocument()

    await userEvent.click(favoriteButton('Ecos de Marte'))
    expect(
      await screen.findByText('Ecos de Marte quitada de favoritas'),
    ).toBeInTheDocument()
    // The second notice replaces the first one instead of stacking.
    expect(
      screen.queryByText('♥ Ecos de Marte añadida a favoritas'),
    ).not.toBeInTheDocument()
  })

  it('shows one notice per movie, each with its own title', async () => {
    render(<App />)

    await userEvent.click(favoriteButton('El último faro'))
    await userEvent.click(favoriteButton('Frontera helada'))

    expect(
      await screen.findByText('♥ El último faro añadida a favoritas'),
    ).toBeInTheDocument()
    expect(screen.getByText('♥ Frontera helada añadida a favoritas')).toBeInTheDocument()
  })

  it('saves favorites and restores them after a reload', async () => {
    const { unmount } = render(<App />)
    await userEvent.click(favoriteButton('El último faro'))
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[1]')

    unmount()
    render(<App />)

    expect(favoriteButton('El último faro')).toHaveTextContent('En favoritas')
    expect(screen.getByText(/1 favorita$/)).toBeInTheDocument()
  })
})

describe('App search', () => {
  it('filters the billboard after the delay, not on each keystroke', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('searchbox'), 'marte')

    // The box updates at once while the list still waits for the pause.
    expect(screen.getByRole('searchbox')).toHaveValue('marte')
    expect(screen.getAllByRole('article')).toHaveLength(8)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1))
    expect(screen.getByText('1 de 8 películas para «marte»')).toBeInTheDocument()
  })

  it('shows the empty state and recovers the list from its button', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('searchbox'), 'zzz')

    expect(
      await screen.findByText('Ninguna película coincide con «zzz»'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Ver toda la cartelera' }))

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getAllByRole('article')).toHaveLength(8)
  })

  it('keeps favorites while the list is being filtered', async () => {
    render(<App />)
    await userEvent.click(favoriteButton('Ecos de Marte'))
    await userEvent.type(screen.getByRole('searchbox'), 'faro')
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1))

    await userEvent.click(screen.getByRole('button', { name: 'Limpiar' }))

    expect(favoriteButton('Ecos de Marte')).toHaveTextContent('En favoritas')
  })
})

describe('App banner "Quitar filtro"', () => {
  function banner() {
    return within(screen.getByRole('region', { name: 'Ecos de Marte' }))
  }

  it('shows the active filter and clears search box and billboard from the banner', async () => {
    render(<App />)
    expect(banner().queryByRole('button', { name: 'Quitar filtro' })).not.toBeInTheDocument()

    await userEvent.type(screen.getByRole('searchbox'), 'faro')
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1))

    expect(banner().getByText('Filtrando por «faro»')).toHaveAttribute('aria-live', 'polite')
    const clearButton = banner().getByRole('button', { name: 'Quitar filtro' })

    await userEvent.click(clearButton)

    // All three views follow the same state at once, without waiting for the debounce.
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getAllByRole('article')).toHaveLength(8)
    expect(screen.getByText('8 películas en cartelera')).toBeInTheDocument()
    expect(banner().queryByRole('button', { name: 'Quitar filtro' })).not.toBeInTheDocument()
    expect(banner().queryByText(/Filtrando por/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Limpiar' })).not.toBeInTheDocument()
  })

  it('clears a search without results from the banner', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('searchbox'), 'xyz')
    expect(await screen.findByText('Ninguna película coincide con «xyz»')).toBeInTheDocument()
    expect(banner().getByText('Filtrando por «xyz»')).toBeInTheDocument()

    await userEvent.click(banner().getByRole('button', { name: 'Quitar filtro' }))

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.queryByText('Ninguna película coincide con «xyz»')).not.toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(8)
  })

  it('shows the filter only once it is applied, not on every keystroke', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('searchbox'), 'fa')

    // The box already says "fa", but the billboard has not filtered yet: no banner state.
    expect(banner().queryByText(/Filtrando por/)).not.toBeInTheDocument()

    expect(await banner().findByText('Filtrando por «fa»')).toBeInTheDocument()
  })
})
