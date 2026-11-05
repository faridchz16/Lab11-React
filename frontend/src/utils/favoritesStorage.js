const STORAGE_KEY = 'cine-aurora:favorites'

// Reads the saved ids. Blocked storage or corrupt content means "no favorites":
// a bad saved value must never stop the billboard from loading.
export function loadFavoriteIds() {
  try {
    const savedIds = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(savedIds) ? savedIds.filter(Number.isInteger) : []
  } catch {
    return []
  }
}

// Saves the ids. If the browser refuses, favorites still work until the page closes.
export function saveFavoriteIds(favoriteIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
  } catch {
    // Nothing else to do: the state in memory stays correct.
  }
}
