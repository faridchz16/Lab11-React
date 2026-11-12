import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFavorites } from './useFavorites.js'

const STORAGE_KEY = 'cine-aurora:favorites'

describe('useFavorites', () => {
  it('starts empty when nothing was saved', () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favoriteIds).toEqual([])
    expect(result.current.favoriteCount).toBe(0)
  })

  it('adds a movie and then removes it with the same function', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggleFavorite(2))
    expect(result.current.favoriteIds).toEqual([2])
    expect(result.current.isFavorite(2)).toBe(true)

    act(() => result.current.toggleFavorite(2))
    expect(result.current.favoriteIds).toEqual([])
    expect(result.current.isFavorite(2)).toBe(false)
  })

  it('derives the count from the list, so both always agree', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite(1)
      result.current.toggleFavorite(5)
      result.current.toggleFavorite(8)
    })
    expect(result.current.favoriteCount).toBe(3)
    expect(result.current.favoriteCount).toBe(result.current.favoriteIds.length)

    act(() => result.current.toggleFavorite(5))
    expect(result.current.favoriteCount).toBe(2)
  })

  it('handles two quick toggles in one batch correctly (pure updater)', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite(3)
      result.current.toggleFavorite(3)
    })

    expect(result.current.favoriteIds).toEqual([])
  })

  it('saves every change to localStorage', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggleFavorite(4))
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[4]')

    act(() => result.current.toggleFavorite(7))
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[4,7]')
  })

  it('restores the saved favorites on the first render', () => {
    localStorage.setItem(STORAGE_KEY, '[1,6]')

    const { result } = renderHook(() => useFavorites())

    expect(result.current.favoriteIds).toEqual([1, 6])
    expect(result.current.favoriteCount).toBe(2)
  })

  it('reads localStorage only once, not on every render', () => {
    localStorage.setItem(STORAGE_KEY, '[1]')
    const { result, rerender } = renderHook(() => useFavorites())

    // Someone else changes the storage: the hook keeps its own state.
    localStorage.setItem(STORAGE_KEY, '[1,2,3]')
    rerender()

    expect(result.current.favoriteIds).toEqual([1])
  })
})
