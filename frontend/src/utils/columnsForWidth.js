// Cards per row for each window width. Each entry applies below its maxWidth (in px).
export const COLUMN_BREAKPOINTS = [
  { maxWidth: 600, columns: 1 },
  { maxWidth: 900, columns: 2 },
  { maxWidth: 1200, columns: 3 },
]
export const MAX_COLUMNS = 4

// Pure function: same width in, same column count out. Invalid widths get one column.
export function columnsForWidth(width) {
  if (!Number.isFinite(width) || width <= 0) return 1
  const breakpoint = COLUMN_BREAKPOINTS.find(({ maxWidth }) => width < maxWidth)
  return breakpoint ? breakpoint.columns : MAX_COLUMNS
}
