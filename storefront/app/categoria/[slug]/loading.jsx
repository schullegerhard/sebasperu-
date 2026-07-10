// Streaming: skeleton de la parrilla de categoría mientras carga en el servidor.
export default function Loading() {
  return (
    <div className="container page catalog2" aria-busy="true">
      <div className="sk-crumb sk" />
      <div className="sk sk-line w40" style={{ height: 26, margin: '10px 0 20px' }} />
      <div className="sk-grid">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="sk sk-card" />)}
      </div>
    </div>
  )
}
