import './Header.css'

// Top bar with the cinema name, the main navigation links and the favorites counter.
// It only gets the count (a number), never the favorites list: it does not need more.
function Header({ name, navLinks, favoriteCount }) {
  const favoriteLabel = `${favoriteCount} ${favoriteCount === 1 ? 'favorita' : 'favoritas'}`

  return (
    <header className="header">
      <div className="container header__inner">
        <h1 className="header__title">
          <a className="header__brand" href="#">
            {name}
          </a>
        </h1>
        <nav aria-label="Navegación principal">
          <ul className="header__list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a className="header__link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Live region: screen readers announce the new count when it changes. */}
        <p className="header__favorites" aria-live="polite" aria-atomic="true">
          <span aria-hidden="true">♥ </span>
          {favoriteLabel}
        </p>
      </div>
    </header>
  )
}

export default Header
