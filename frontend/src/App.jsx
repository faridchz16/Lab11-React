import { useEffect, useState } from 'react'
import { apiMovies, cinema } from './data/movies.js'
import Button from './components/Button/Button.jsx'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import MovieList from './components/MovieList/MovieList.jsx'
import MovieSearch from './components/MovieSearch/MovieSearch.jsx'
import { useDebouncedValue } from './hooks/useDebouncedValue.js'
import { adaptMovies } from './utils/adaptMovie.js'
import { debugLog } from './utils/debugLog.js'
import { loadFavoriteIds, saveFavoriteIds } from './utils/favoritesStorage.js'

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
  const debouncedText = useDebouncedValue(searchText, SEARCH_DELAY_MS)
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

  // Adds the movie when it is missing from the list and removes it otherwise.
  function toggleFavorite(movieId) {
    setFavoriteIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    )
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
    </>
  )
}

export default App
