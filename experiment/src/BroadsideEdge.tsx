export function BroadsideEdge() {
  return (
    <div className="broadside-edge" aria-hidden="true">
      <span className="broadside-edge__tear broadside-edge__tear--lead" />
      <span className="broadside-edge__crease broadside-edge__crease--lead" />
      <span className="broadside-edge__crease broadside-edge__crease--trail" />
      <span className="broadside-edge__tear broadside-edge__tear--trail" />
    </div>
  )
}