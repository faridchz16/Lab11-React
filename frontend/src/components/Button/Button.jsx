import './Button.css'

// Reusable button: content comes from children, appearance from variant and size.
// With href it renders a link, so navigation keeps its native browser behavior.
// Any other prop (onClick, disabled, aria-*) reaches the rendered element.
function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  ...rest
}) {
  const className = `button button--${variant} button--${size}`

  if (href) {
    return (
      <a className={className} href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button className={className} type={type} {...rest}>
      {children}
    </button>
  )
}

export default Button
