import { describe, expect, it } from 'vitest'
import { filterMovies } from './filterMovies.js'

const movies = [
  { id: 1, title: 'El jardín de relojes' },
  { id: 2, title: 'Ecos de Marte' },
]

describe('filterMovies', () => {
  it('returns every movie for an empty or blank query', () => {
    expect(filterMovies(movies, '')).toEqual(movies)
    expect(filterMovies(movies, '   ')).toEqual(movies)
  })

  it('ignores case and surrounding spaces', () => {
    expect(filterMovies(movies, '  MARTE ')).toEqual([movies[1]])
  })

  it('ignores accents in both directions', () => {
    expect(filterMovies(movies, 'jardin')).toEqual([movies[0]])
    expect(filterMovies(movies, 'mártE')).toEqual([movies[1]])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterMovies(movies, 'zzz')).toEqual([])
  })
})
