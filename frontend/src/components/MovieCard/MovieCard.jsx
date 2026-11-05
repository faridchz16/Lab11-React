import Button from '../Button/Button.jsx'
import './MovieCard.css'

// Card for a single movie: poster, title, rating and showtimes.
// Receives the whole movie and destructures only the fields it renders.
// It owns no favorite state: it shows isFavorite and reports clicks to its parent.
function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const { id, title, image, rating, showtimes } = movie
  const favoriteLabel = isFavorite ? 'En favoritas' : 'Añadir a favoritas'

  return (
    <article className={`movie-card${isFavorite ? ' movie-card--favorite' : ''}`}>
      <img
        className="movie-card__poster"
        src={image}
        alt={`Póster de ${title}`}
        width="300"
        height="450"
        loading="lazy"
      />
      <div className="movie-card__body">
        <h3>{title}</h3>
        <p className="movie-card__rating">
          <span aria-hidden="true">★ </span>
          <span className="visually-hidden">Valoración: </span>
          {rating}/10
        </p>
        <ul className="movie-card__showtimes" aria-label={`Horarios de ${title}`}>
          {showtimes.map((time) => (
            <li key={time} className="movie-card__showtime">
              <time>{time}</time>
            </li>
          ))}
        </ul>
        <Button
          variant={isFavorite ? 'primary' : 'secondary'}
          size="sm"
          aria-label={`${favoriteLabel}: ${title}`}
          onClick={() => onToggleFavorite(id)}
        >
          <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
          {favoriteLabel}
        </Button>
      </div>
    </article>
  )
}

export default MovieCard
