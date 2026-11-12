// Spanish day + month, e.g. "12 de diciembre". UTC keeps the day from shifting with the time zone.
const dayMonth = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', timeZone: 'UTC' })

// Turns an ISO date (YYYY-MM-DD, as adaptMovie leaves it) into text for the user.
export function formatReleaseDate(isoDate) {
  if (typeof isoDate !== 'string') return ''
  const date = new Date(`${isoDate}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? '' : dayMonth.format(date)
}
