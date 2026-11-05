import { useState } from 'react'
import { movies, cinema } from './data/movies.js'
import Button from './components/Button/Button.jsx'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import MovieList from './components/MovieList/MovieList.jsx'

// The featured movie is the highest-rated one.
const featured = movies.reduce((best, movie) =>
  movie.rating > best.rating ? movie : best,
)

// Root component of the movie billboard app.
function App() {
  const [favoriteIds, setFavoriteIds] = useState([])

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
          <Button href="#cartelera">Ver cartelera</Button>
        </Hero>
        <MovieList
          movies={movies}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      </main>
      <Footer name={cinema.name} contact={cinema.contact} />
    </>
  )
}

export default App
