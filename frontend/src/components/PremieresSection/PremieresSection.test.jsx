import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiPremieres } from '../../data/premieres.js'
import { usePremieres } from '../../hooks/usePremieres.js'
import { adaptMovies } from '../../utils/adaptMovie.js'
import PremieresSection from './PremieresSection.jsx'

// The section is tested on its own: the hook is replaced so each state can be set directly.
vi.mock('../../hooks/usePremieres.js', () => ({ usePremieres: vi.fn() }))

const premieres = adaptMovies(apiPremieres)
const retry = vi.fn()

function mockState(state) {
  usePremieres.mockReturnValue({ premieres: [], error: null, retry, ...state })
}

function section() {
  return screen.getByRole('region', { name: 'Próximos estrenos' })
}

describe('PremieresSection', () => {
  beforeEach(() => {
    retry.mockClear()
  })

  describe('loading', () => {
    beforeEach(() => mockState({ status: 'loading' }))

    it('marks the section as busy and announces the loading to screen readers', () => {
      render(<PremieresSection />)

      expect(section()).toHaveAttribute('aria-busy', 'true')
      expect(screen.getByRole('status')).toHaveTextContent('Cargando estrenos…')
    })

    it('shows four decorative skeleton cards and nothing else', () => {
      const { container } = render(<PremieresSection />)

      const skeletons = container.querySelectorAll('.skeleton-card')
      expect(skeletons).toHaveLength(4)
      skeletons.forEach((card) => expect(card).toHaveAttribute('aria-hidden', 'true'))
      expect(container.querySelectorAll('.skeleton-card .skeleton').length).toBeGreaterThan(0)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('error', () => {
    beforeEach(() =>
      mockState({ status: 'error', error: 'No se pudo conectar con el servidor de estrenos' }),
    )

    it('explains the error in an alert with the hook message and a hint', () => {
      render(<PremieresSection />)

      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('No pudimos cargar los estrenos')
      expect(alert).toHaveTextContent('No se pudo conectar con el servidor de estrenos')
      expect(alert).toHaveTextContent('inténtalo de nuevo')
      expect(section()).toHaveAttribute('aria-busy', 'false')
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('calls retry when the Reintentar button is pressed', async () => {
      render(<PremieresSection />)

      await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

      expect(retry).toHaveBeenCalledTimes(1)
    })
  })

  describe('success', () => {
    beforeEach(() => mockState({ status: 'success', premieres }))

    it('shows the carousel with every title, poster and Spanish release date', () => {
      render(<PremieresSection />)
      const region = within(section())

      for (const { title } of premieres) {
        expect(region.getByRole('heading', { name: title, level: 3 })).toBeInTheDocument()
        expect(region.getByRole('img', { name: `Póster de ${title}` })).toBeInTheDocument()
      }
      expect(region.getByText('27 de noviembre')).toHaveAttribute('datetime', '2026-11-27')
      expect(region.getByText('15 de enero')).toBeInTheDocument()
      expect(section()).toHaveAttribute('aria-busy', 'false')
    })

    it('has Spanish labels on the carousel arrows', () => {
      const { container } = render(<PremieresSection />)

      expect(container.querySelector('.swiper-button-prev')).toHaveAttribute(
        'aria-label',
        'Estreno anterior',
      )
      expect(container.querySelector('.swiper-button-next')).toHaveAttribute(
        'aria-label',
        'Estreno siguiente',
      )
    })
  })
})
