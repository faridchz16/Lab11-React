// Lowercases and strips accents, so "jardin" also finds "El jardín de relojes".
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

// Returns the movies whose title contains the query; an empty query keeps them all.
export function filterMovies(movies, query) {
  const normalizedQuery = normalize(query)
  return movies.filter((movie) => normalize(movie.title).includes(normalizedQuery))
}
