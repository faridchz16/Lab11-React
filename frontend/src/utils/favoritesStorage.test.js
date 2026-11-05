import { describe, expect, it, vi } from 'vitest'
import { loadFavoriteIds, saveFavoriteIds } from './favoritesStorage.js'

const STORAGE_KEY = 'cine-aurora:favorites'

describe('favoritesStorage', () => {
  it('reads back what it saved', () => {
    saveFavoriteIds([2, 5])
    expect(loadFavoriteIds()).toEqual([2, 5])
  })

  it('returns an empty list when nothing was saved', () => {
    expect(loadFavoriteIds()).toEqual([])
  })

  it('survives corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadFavoriteIds()).toEqual([])
  })

  it('ignores valid JSON of the wrong shape', () => {
    localStorage.setItem(STORAGE_KEY, '{"id":1}')
    expect(loadFavoriteIds()).toEqual([])
    localStorage.setItem(STORAGE_KEY, '[1,"dos",null,3]')
    expect(loadFavoriteIds()).toEqual([1, 3])
  })

  it('does not throw when the browser blocks storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'QuotaExceededError')
    })
    expect(() => saveFavoriteIds([1])).not.toThrow()
  })
})
