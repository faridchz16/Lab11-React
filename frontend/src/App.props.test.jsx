import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

// Separate file because vi.mock applies to the whole file: here some components are replaced
// by spies that record the props App really passes, while they still render the real thing.
const headerProps = vi.hoisted(() => [])
const recorded = vi.hoisted(() => ({ search: [], list: [], buttons: [] }))

// Wraps a real component so every render records its props in the given list.
async function spyOn(importOriginal, list) {
  const { default: Real } = await importOriginal()
  return {
    default: (props) => {
      list.push(props)
      return <Real {...props} />
    },
  }
}

vi.mock('./components/MovieSearch/MovieSearch.jsx', (importOriginal) =>
  spyOn(importOriginal, recorded.search),
)
vi.mock('./components/MovieList/MovieList.jsx', (importOriginal) =>
  spyOn(importOriginal, recorded.list),
)
vi.mock('./components/Button/Button.jsx', (importOriginal) =>
  spyOn(importOriginal, recorded.buttons),
)

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

describe('App → the three ways to clear the search', () => {
  it('passes the very same clearSearch function to the search box, the banner and the list', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('searchbox'), 'faro')
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1))

    // Props from App's latest render: all three come from the same render.
    const fromSearchBox = recorded.search.at(-1).onClear
    const fromList = recorded.list.at(-1).onClearSearch
    const fromBanner = recorded.buttons.findLast((props) => props.children === 'Quitar filtro').onClick

    expect(typeof fromBanner).toBe('function')
    expect(fromSearchBox).toBe(fromList)
    expect(fromBanner).toBe(fromList)
  })
})
