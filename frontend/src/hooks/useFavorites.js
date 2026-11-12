import { useEffect, useState } from 'react'
import { loadFavoriteIds, saveFavoriteIds } from '../utils/favoritesStorage.js'

// Favorite movies kept in the browser. The component that calls it owns the state, so it must
// be the closest common ancestor of everyone who reads it (App: Header and MovieList).
// Returns { favoriteIds, favoriteCount, toggleFavorite, isFavorite }.
export function useFavorites() {
  // Lazy initializer: localStorage is read once, on the first render, not on every render.
  const [favoriteIds, setFavoriteIds] = useState(loadFavoriteIds)

  // Writing to localStorage is a side effect: it runs after each change of the list.
  useEffect(() => {
    saveFavoriteIds(favoriteIds)
  }, [favoriteIds])

  // Adds the movie when it is missing and removes it otherwise. The updater is pure:
  // it only computes the next list from the current one.
  function toggleFavorite(movieId) {
    setFavoriteIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    )
  }

  function isFavorite(movieId) {
    return favoriteIds.includes(movieId)
  }

  return {
    favoriteIds,
    // Derived, not state: it can never disagree with the list.
    favoriteCount: favoriteIds.length,
    toggleFavorite,
    isFavorite,
  }
}
