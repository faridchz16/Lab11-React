// Adapter pattern: turns a movie as the API sends it into the model the app renders.
// Components only know the app model, so a change in the API is fixed here and nowhere else.

const MIN_RATING = 0
const MAX_RATING = 10
// Label for a movie without certification; Hero shows it with the neutral badge.
export const UNKNOWN_CLASSIFICATION = 'Sin clasificar'

function toText(value, fallback = '') {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : fallback
}

// A missing or invalid vote becomes 0, and the value always stays on the 0-10 scale.
function toRating(value) {
  const number = Number(value)
  if (value === null || value === '' || !Number.isFinite(number)) return MIN_RATING
  return Math.min(Math.max(number, MIN_RATING), MAX_RATING)
}

// Keeps only the valid showtimes; anything that is not a list becomes an empty list.
function toShowtimes(value) {
  return Array.isArray(value) ? value.filter((time) => toText(time) !== '') : []
}

// Accepts only a real calendar date written as YYYY-MM-DD; anything else is null.
function toReleaseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value) ? value : null
}

// Maps one API movie to { id, title, image, synopsis, classification, rating, showtimes }.
// Premieres also bring release_date, which becomes releaseDate (ISO text, formatted by the UI).
// Billboard movies have no release date, so their model stays exactly as before.
export function adaptMovie(apiMovie = {}) {
  const movie = apiMovie ?? {}
  const releaseDate = toReleaseDate(movie.release_date)
  return {
    id: movie.id ?? null,
    title: toText(movie.title, 'Sin título'),
    // null (not '') so React leaves out the src attribute and the alt text is shown.
    image: toText(movie.poster_url, null),
    synopsis: toText(movie.overview),
    classification: toText(movie.certification, UNKNOWN_CLASSIFICATION),
    rating: toRating(movie.vote_average),
    showtimes: toShowtimes(movie.show_times),
    ...(releaseDate && { releaseDate }),
  }
}

// Maps a whole API list; anything that is not a list becomes an empty billboard.
export function adaptMovies(list) {
  return Array.isArray(list) ? list.map(adaptMovie) : []
}
