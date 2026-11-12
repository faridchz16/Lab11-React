import './Skeleton.css'

// Grey placeholder with the shimmer animation (global .skeleton utility) while data loads.
// Purely decorative: aria-hidden, so the loading message is given by whoever renders it.
// width and height accept any CSS length; without them the block fills its container.
function Skeleton({ width, height, className = '' }) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export default Skeleton
