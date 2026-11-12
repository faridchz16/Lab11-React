import { useEffect, useMemo } from 'react'
import { useWindowSize } from '../../hooks/useWindowSize.js'
import { columnsForWidth } from '../../utils/columnsForWidth.js'
import { debugLog } from '../../utils/debugLog.js'
import { filterMovies } from '../../utils/filterMovies.js'
import Button from '../Button/Button.jsx'
import EmptyState from '../EmptyState/EmptyState.jsx'
import MovieCard from '../MovieCard/MovieCard.jsx'
import './MovieList.css'

// Billboard section: filters the movies by query and shows one card per match,
// or an empty state when nothing matches.
function MovieList({ movies, query, favoriteIds, onToggleFavorite, onClearSearch }) {
  // Derived data, not state: it is always computable from movies and query.
  const visibleMovies = useMemo(() => filterMovies(movies, query), [movies, query])
  const trimmedQuery = query.trim()
  // Layout is this component's own concern: App does not pass the column count.
  const { width } = useWindowSize()
  const columns = columnsForWidth(width)

  useEffect(() => {
    debugLog(`[search] filtered "${query}": ${visibleMovies.length} movies`)
  }, [query, visibleMovies])

  return (
    <section id="cartelera" className="movie-list" aria-labelledby="movie-list-title">
      <div className="container">
        <h2 id="movie-list-title" className="movie-list__title">
          Cartelera
        </h2>
        <p className="movie-list__summary text-muted text-sm" aria-live="polite">
          {trimmedQuery
            ? `${visibleMovies.length} de ${movies.length} películas para «${trimmedQuery}»`
            : `${movies.length} películas en cartelera`}
        </p>
        {/* Cards show the showtimes, so this block is the target of #horarios. */}
        <div id="horarios" className="movie-list__results">
          {visibleMovies.length === 0 ? (
            <EmptyState title={`Ninguna película coincide con «${trimmedQuery}»`}>
              <p className="text-muted">Revisa el título o prueba con otra palabra.</p>
              <Button variant="secondary" onClick={onClearSearch}>
                Ver toda la cartelera
              </Button>
            </EmptyState>
          ) : (
            <div
              className="grid movie-list__grid"
              style={{ '--columns': columns }}
              data-columns={columns}
            >
              {visibleMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={favoriteIds.includes(movie.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MovieList
