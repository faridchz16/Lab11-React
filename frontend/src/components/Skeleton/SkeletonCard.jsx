import Skeleton from './Skeleton.jsx'
import './Skeleton.css'

// Skeleton with the shape of a movie card: poster, title and date lines.
// Decorative as a whole: screen readers skip it.
function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <Skeleton className="skeleton-card__poster" />
      <div className="skeleton-card__body">
        <Skeleton className="skeleton-text" width="75%" />
        <Skeleton className="skeleton-text" width="45%" />
      </div>
    </div>
  )
}

export default SkeletonCard
