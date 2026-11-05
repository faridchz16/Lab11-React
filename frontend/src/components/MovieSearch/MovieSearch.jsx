import Button from '../Button/Button.jsx'
import './MovieSearch.css'

// Controlled search box: the text lives in the parent's state, so this component
// only shows value and reports every change through onChange.
function MovieSearch({ value, onChange, onClear }) {
  // The list filters while typing, so submitting must not reload the page.
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <form className="movie-search" role="search" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label" htmlFor="movie-search-input">
          Buscar película
        </label>
        <div className="cluster movie-search__row">
          <input
            id="movie-search-input"
            className="form-control movie-search__input"
            type="search"
            placeholder="Escribe un título…"
            autoComplete="off"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          {value && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              Limpiar
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

export default MovieSearch
