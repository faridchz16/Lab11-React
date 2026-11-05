// Console trace for development; production builds stay silent.
export function debugLog(message) {
  if (import.meta.env.DEV) {
    console.log(message)
  }
}
