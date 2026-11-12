import { usePremieres } from '../../hooks/usePremieres.js'
import Button from '../Button/Button.jsx'
import PremiereCarousel from '../PremiereCarousel/PremiereCarousel.jsx'
import SkeletonCard from '../Skeleton/SkeletonCard.jsx'
import './PremieresSection.css'

const SKELETON_COUNT = 4

// "Upcoming premieres" section. It owns the premieres request (usePremieres) because it is
// the only part of the page that needs that data, and shows one view per request state.
function PremieresSection() {
  const { status, premieres, error, retry } = usePremieres()

  return (
    <section
      id="estrenos"
      className="section premieres"
      aria-labelledby="premieres-title"
      aria-busy={status === 'loading'}
    >
      <div className="container">
        <h2 id="premieres-title" className="premieres__title">
          Próximos estrenos
        </h2>
        <p className="premieres__summary text-muted text-sm">
          Las películas que llegan pronto a Cine Aurora.
        </p>

        {status === 'loading' && (
          <>
            {/* The skeletons are aria-hidden; this text is what screen readers hear. */}
            <p className="visually-hidden" role="status">
              Cargando estrenos…
            </p>
            <div className="grid premieres__skeletons">
              {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </>
        )}

        {status === 'error' && (
          <div className="premieres__error">
            <div role="alert">
              <p className="premieres__error-title">No pudimos cargar los estrenos</p>
              <p className="text-muted">
                {error}. Revisa tu conexión e inténtalo de nuevo en unos segundos.
              </p>
            </div>
            <Button variant="secondary" onClick={retry}>
              Reintentar
            </Button>
          </div>
        )}

        {status === 'success' && <PremiereCarousel premieres={premieres} />}
      </div>
    </section>
  )
}

export default PremieresSection
