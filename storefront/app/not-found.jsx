import Link from 'next/link'

export const metadata = { title: 'Página no encontrada' }

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty-state">
        <h1 style={{ fontSize: 64, margin: 0 }}>404</h1>
        <h2>Página no encontrada</h2>
        <p className="muted">La página que buscas no existe o fue movida.</p>
        <Link className="btn-primary" href="/">Volver al inicio</Link>
      </div>
    </div>
  )
}
