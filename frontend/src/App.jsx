import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { apiMovies, cinema } from './data/movies.js'
import Button from './components/Button/Button.jsx'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import MovieList from './components/MovieList/MovieList.jsx'
import MovieSearch from './components/MovieSearch/MovieSearch.jsx'
import { useDebounce } from './hooks/useDebounce.js'
import { adaptMovies } from './utils/adaptMovie.js'
import { debugLog } from './utils/debugLog.js'
import { loadFavoriteIds, saveFavoriteIds } from './utils/favoritesStorage.js'
import { TOASTER_PROPS } from './utils/toastOptions.js'

// Pause after the last keystroke before the search is applied.
const SEARCH_DELAY_MS = 300

// The billboard goes through the adapter once: from here on the app only sees its own model.
const movies = adaptMovies(apiMovies)

// The featured movie is the highest-rated one.
const featured = movies.reduce((best, movie) =>
  movie.rating > best.rating ? movie : best,
)

// Root component of the movie billboard app.
function App() {
  // Lazy initializer: localStorage is read once, not on every render.
  const [favoriteIds, setFavoriteIds] = useState(loadFavoriteIds)
  const [searchText, setSearchText] = useState('')
  const debouncedText = useDebounce(searchText, SEARCH_DELAY_MS)
  // Emptying the box is not a typing burst: the full list comes back at once.
  const searchQuery = searchText === '' ? '' : debouncedText

  function clearSearch() {
    setSearchText('')
  }

  function handleSearchChange(text) {
    debugLog(`[search] keystroke: "${text}"`)
    setSearchText(text)
  }

  useEffect(() => {
    saveFavoriteIds(favoriteIds)
  }, [favoriteIds])

  // Adds the movie when it is missing from the list and removes it otherwise,
  // then tells the user. App owns the state, so App decides how the notice looks.
  function toggleFavorite(movieId) {
    // Read before updating: the updater below must stay pure (no side effects).
    const wasFavorite = favoriteIds.includes(movieId)
    const title = movies.find((movie) => movie.id === movieId)?.title ?? 'La película'

    setFavoriteIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    )

    // Same id per movie: toggling it again replaces its notice instead of stacking a new one.
    const toastId = `favorite-${movieId}`
    if (wasFavorite) {
      toast(`${title} quitada de favoritas`, { id: toastId })
    } else {
      toast.success(`♥ ${title} añadida a favoritas`, { id: toastId })
    }
  }

  return (
    <>
      <Header
        name={cinema.name}
        navLinks={cinema.navLinks}
        favoriteCount={favoriteIds.length}
      />
      <main>
        <Hero movie={featured}>
          <MovieSearch
            value={searchText}
            onChange={handleSearchChange}
            onClear={clearSearch}
          />
          <Button href="#cartelera">Ver cartelera</Button>
        </Hero>
        <MovieList
          movies={movies}
          query={searchQuery}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onClearSearch={clearSearch}
        />
      </main>
      <Footer name={cinema.name} contact={cinema.contact} />
      <Toaster {...TOASTER_PROPS} />
    </>
  )
}

export default App
