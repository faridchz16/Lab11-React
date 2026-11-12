import { describe, expect, it } from 'vitest'
import { columnsForWidth } from './columnsForWidth.js'

describe('columnsForWidth', () => {
  it.each([
    [390, 1],
    [599, 1],
    [600, 2],
    [768, 2],
    [899, 2],
    [900, 3],
    [1024, 3],
    [1199, 3],
    [1200, 4],
    [1440, 4],
    [2560, 4],
  ])('gives %i px → %i column(s)', (width, columns) => {
    expect(columnsForWidth(width)).toBe(columns)
  })

  it('falls back to one column for invalid widths', () => {
    expect(columnsForWidth(0)).toBe(1)
    expect(columnsForWidth(-10)).toBe(1)
    expect(columnsForWidth(Number.NaN)).toBe(1)
    expect(columnsForWidth(undefined)).toBe(1)
  })
})
