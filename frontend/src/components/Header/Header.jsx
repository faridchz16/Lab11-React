import './Header.css'

// Top bar with the cinema name, the main navigation links and the favorites counter.
function Header({ name, navLinks, favoriteCount }) {
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
        <p className="header__favorites">
          <span aria-hidden="true">♥ </span>
          {favoriteCount} {favoriteCount === 1 ? 'favorita' : 'favoritas'}
        </p>
      </div>
    </header>
  )
}

export default Header
