// Look of the react-hot-toast notifications, built only from the design tokens
// (src/styles/variables.css) so they match the dark theme.

const baseStyle = {
  maxWidth: '22rem',
  padding: 'var(--space-3) var(--space-4)',
  color: 'var(--toast-text)',
  background: 'var(--toast-bg)',
  border: 'thin solid var(--toast-border)',
  borderRadius: 'var(--toast-radius)',
  boxShadow: 'var(--shadow-md)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
}

// Colored left edge plus a tinted background tell the kind of notice at a glance.
function variantStyle(color, background) {
  return { ...baseStyle, background, borderLeft: `4px solid ${color}` }
}

// Props for <Toaster />: success for "added", the plain (blank) type as info for "removed".
export const TOASTER_PROPS = {
  position: 'bottom-right',
  containerStyle: { zIndex: 'var(--z-toast)' },
  toastOptions: {
    style: baseStyle,
    success: {
      style: variantStyle('var(--color-success)', 'var(--color-success-bg)'),
      iconTheme: { primary: 'var(--color-success)', secondary: 'var(--toast-text)' },
    },
    error: {
      style: variantStyle('var(--color-error)', 'var(--color-error-bg)'),
      iconTheme: { primary: 'var(--color-error)', secondary: 'var(--toast-text)' },
    },
    blank: {
      style: variantStyle('var(--color-info)', 'var(--color-info-bg)'),
    },
  },
}
