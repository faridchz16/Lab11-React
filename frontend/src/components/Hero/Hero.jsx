import './Hero.css'

// Maps each classification to the modifier class that colors its badge.
const BADGE_MODIFIERS = {
  APT: 'apt',
  '+14': '14',
  '+18': '18',
}

// Banner that highlights the featured movie.
// Receives the whole movie and destructures only the fields it renders.
// children fills the actions area, so the banner does not depend on what goes in it.
function Hero({ movie, children }) {
  const { title, image, synopsis, classification, rating } = movie
  // Unknown classifications get the neutral base badge instead of a misleading color.
  const badgeModifier = BADGE_MODIFIERS[classification]
  const badgeClass = badgeModifier
    ? `hero__badge hero__badge--${badgeModifier}`
    : 'hero__badge'

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <img
          className="hero__poster"
          src={image}
          alt={`Póster de ${title}`}
          width="300"
          height="450"
        />
        <div className="hero__content">
          <p className="hero__eyebrow">Película destacada</p>
          <h2 id="hero-title" className="hero__title">
            {title}
          </h2>
          <div className="hero__meta">
            <span className={badgeClass}>
              {classification}
            </span>
            <span className="hero__rating">
              <span aria-hidden="true">★ </span>
              <span className="visually-hidden">Valoración: </span>
              {rating}/10
            </span>
          </div>
          <p className="hero__synopsis">{synopsis}</p>
          {children}
        </div>
      </div>
    </section>
  )
}

export default Hero
