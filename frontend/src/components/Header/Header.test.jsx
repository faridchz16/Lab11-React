import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Header from './Header.jsx'

const navLinks = [{ id: 'cartelera', label: 'Cartelera', href: '#cartelera' }]

function renderHeader(favoriteCount) {
  return render(<Header name="Cine Aurora" navLinks={navLinks} favoriteCount={favoriteCount} />)
}

function counter() {
  return screen.getByText(/favoritas?$/)
}

describe('Header favorites counter', () => {
  it.each([
    [0, '0 favoritas'],
    [1, '1 favorita'],
    [2, '2 favoritas'],
  ])('shows %i as "%s"', (count, text) => {
    renderHeader(count)
    expect(counter()).toHaveTextContent(text)
  })

  it('is a polite live region, so screen readers announce changes', () => {
    renderHeader(0)

    expect(counter()).toHaveAttribute('aria-live', 'polite')
    expect(counter()).toHaveAttribute('aria-atomic', 'true')
  })

  it('updates the text when the count received from the parent changes', () => {
    const { rerender } = renderHeader(1)

    rerender(<Header name="Cine Aurora" navLinks={navLinks} favoriteCount={3} />)

    expect(counter()).toHaveTextContent('3 favoritas')
  })
})
