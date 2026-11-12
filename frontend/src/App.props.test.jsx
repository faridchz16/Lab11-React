import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

// Separate file because vi.mock applies to the whole file: here Header is replaced by a spy
// that records the props App really passes, while it still renders the real Header.
const headerProps = vi.hoisted(() => [])

vi.mock('./components/Header/Header.jsx', async (importOriginal) => {
  const { default: RealHeader } = await importOriginal()
  return {
    default: (props) => {
      headerProps.push(props)
      return <RealHeader {...props} />
    },
  }
})

function favoriteButton(title) {
  return screen.getByRole('button', { name: new RegExp(`favoritas: ${title}`) })
}

describe('App → Header props', () => {
  it('gives Header only the count, never the favorites list', async () => {
    render(<App />)

    await userEvent.click(favoriteButton('El último faro'))
    await userEvent.click(favoriteButton('Ecos de Marte'))

    const lastProps = headerProps.at(-1)
    expect(Object.keys(lastProps).sort()).toEqual(['favoriteCount', 'name', 'navLinks'])
    expect(lastProps).not.toHaveProperty('favoriteIds')
    expect(lastProps.favoriteCount).toBe(2)
    expect(typeof lastProps.favoriteCount).toBe('number')
    // Every render along the way got a number, from 0 up to 2.
    expect(new Set(headerProps.map((props) => props.favoriteCount))).toEqual(new Set([0, 1, 2]))
  })
})
