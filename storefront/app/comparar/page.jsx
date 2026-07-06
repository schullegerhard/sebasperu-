import Link from 'next/link'
export const metadata = { title: 'Comparar productos', alternates: { canonical: '/comparar' } }
export default function Comparar() {
  return (
    <div className="container page"><div className="empty-state">
      <h2>Comparador de productos</h2>
      <p className="muted">Agrega productos para compararlos lado a lado.</p>
      <Link className="btn-primary" href="/categoria/laptops-pc">Ver productos</Link>
    </div></div>
  )
}
