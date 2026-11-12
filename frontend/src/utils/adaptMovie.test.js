import { describe, expect, it } from 'vitest'
import { apiMovies } from '../data/movies.js'
import { apiPremieres } from '../data/premieres.js'
import { UNKNOWN_CLASSIFICATION, adaptMovie, adaptMovies } from './adaptMovie.js'

const APP_FIELDS = ['classification', 'id', 'image', 'rating', 'showtimes', 'synopsis', 'title']

const apiMovie = {
  id: 2,
  title: 'Ecos de Marte',
  poster_url: '/posters/ecos-de-marte.svg',
  overview: 'La primera colonia en Marte recibe un mensaje.',
  certification: '+14',
  vote_average: 8.4,
  show_times: ['15:15', '18:30', '21:45'],
}

describe('adaptMovie', () => {
  it('maps every API field to its app field', () => {
    expect(adaptMovie(apiMovie)).toEqual({
      id: 2,
      title: 'Ecos de Marte',
      image: '/posters/ecos-de-marte.svg',
      synopsis: 'La primera colonia en Marte recibe un mensaje.',
      classification: '+14',
      rating: 8.4,
      showtimes: ['15:15', '18:30', '21:45'],
    })
  })

  it('returns only the app model, without API names or extra fields', () => {
    const adapted = adaptMovie({ ...apiMovie, popularity: 99, poster_path: '/x.jpg' })
    expect(Object.keys(adapted).sort()).toEqual(APP_FIELDS)
  })

  it('uses safe defaults when fields are missing', () => {
    expect(adaptMovie({ id: 9 })).toEqual({
      id: 9,
      title: 'Sin título',
      image: null,
      synopsis: '',
      classification: UNKNOWN_CLASSIFICATION,
      rating: 0,
      showtimes: [],
    })
  })

  it('survives a missing movie', () => {
    expect(adaptMovie(undefined).showtimes).toEqual([])
    expect(adaptMovie(null).rating).toBe(0)
  })

  it('treats invalid values as missing', () => {
    const adapted = adaptMovie({
      id: 3,
      title: '   ',
      poster_url: '',
      vote_average: 'n/a',
      show_times: 'all day',
    })
    expect(adapted.title).toBe('Sin título')
    expect(adapted.image).toBeNull()
    expect(adapted.rating).toBe(0)
    expect(adapted.showtimes).toEqual([])
  })

  it('keeps the rating on the 0-10 scale and accepts numeric text', () => {
    expect(adaptMovie({ vote_average: 12 }).rating).toBe(10)
    expect(adaptMovie({ vote_average: -1 }).rating).toBe(0)
    expect(adaptMovie({ vote_average: '7.5' }).rating).toBe(7.5)
    expect(adaptMovie({ vote_average: null }).rating).toBe(0)
  })

  it('drops empty showtimes from the list', () => {
    expect(adaptMovie({ show_times: ['14:30', '', null, '17:00'] }).showtimes).toEqual([
      '14:30',
      '17:00',
    ])
  })
})

describe('adaptMovie with release dates (premieres)', () => {
  it('maps release_date to releaseDate', () => {
    const adapted = adaptMovie({ ...apiMovie, release_date: '2026-12-04' })
    expect(adapted.releaseDate).toBe('2026-12-04')
    expect(adapted).not.toHaveProperty('release_date')
  })

  it('leaves releaseDate out when the API sends no date, so the billboard model is unchanged', () => {
    expect(adaptMovie(apiMovie)).not.toHaveProperty('releaseDate')
  })

  it('leaves out dates that are not real YYYY-MM-DD days', () => {
    for (const value of ['2026-02-30', '04/12/2026', '2026-12-4', '', null, 20261204]) {
      expect(adaptMovie({ ...apiMovie, release_date: value })).not.toHaveProperty('releaseDate')
    }
  })

  it('adapts all the premieres with their dates', () => {
    const premieres = adaptMovies(apiPremieres)

    expect(premieres).toHaveLength(6)
    premieres.forEach((movie, index) => {
      expect(movie.releaseDate).toBe(apiPremieres[index].release_date)
      expect(movie.image).toBe(apiPremieres[index].poster_url)
    })
  })
})

describe('adaptMovies', () => {
  it('adapts the whole billboard keeping its 8 movies and values', () => {
    const movies = adaptMovies(apiMovies)

    expect(movies).toHaveLength(8)
    movies.forEach((movie, index) => {
      const source = apiMovies[index]
      expect(Object.keys(movie).sort()).toEqual(APP_FIELDS)
      expect(movie).toEqual({
        id: source.id,
        title: source.title,
        image: source.poster_url,
        synopsis: source.overview,
        classification: source.certification,
        rating: source.vote_average,
        showtimes: source.show_times,
      })
    })
    expect(movies.map((movie) => movie.title)).toEqual([
      'El último faro',
      'Ecos de Marte',
      'La ciudad sin sombras',
      'Noche de cristal',
      'El jardín de relojes',
      'Frontera helada',
      'Susurros en el sótano',
      'Pequeños gigantes',
    ])
  })

  it('returns an empty billboard when the response is not a list', () => {
    expect(adaptMovies(undefined)).toEqual([])
    expect(adaptMovies({ results: [] })).toEqual([])
  })
})
