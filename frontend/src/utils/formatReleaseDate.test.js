import { describe, expect, it } from 'vitest'
import { formatReleaseDate } from './formatReleaseDate.js'

describe('formatReleaseDate', () => {
  it('writes day and month in Spanish', () => {
    expect(formatReleaseDate('2026-12-12')).toBe('12 de diciembre')
    expect(formatReleaseDate('2027-01-08')).toBe('8 de enero')
  })

  it('keeps the same day whatever the time zone (first and last day of a month)', () => {
    expect(formatReleaseDate('2026-12-01')).toBe('1 de diciembre')
    expect(formatReleaseDate('2026-11-30')).toBe('30 de noviembre')
  })

  it('returns empty text for a missing or invalid date', () => {
    expect(formatReleaseDate(undefined)).toBe('')
    expect(formatReleaseDate(null)).toBe('')
    expect(formatReleaseDate('mañana')).toBe('')
  })
})
