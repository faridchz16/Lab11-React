import './EmptyState.css'

// Message for a list with nothing to show.
// title says what happened and children holds the way out.
function EmptyState({ title, children }) {
  return (
    <div className="empty-state stack" role="status">
      <p className="empty-state__icon" aria-hidden="true">
        🎬
      </p>
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default EmptyState
