import Link from 'next/link'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'

// Revalidación corta: sin esto la página es 100% estática y se sirve con
// Cache-Control s-maxage de 1 año → tras un redeploy la caché seguiría
// mostrando la versión anterior.
export const revalidate = 300

export const metadata = {
  title: 'Comparador de productos',
  description: 'Compara productos de tecnología lado a lado en SebasPeru.',
  alternates: { canonical: '/comparar' },
}

export default function Comparar() {
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Comparar' }]} />
      <div className="empty-state">
        <h2>No hay productos para comparar</h2>
        <p className="muted">Usa el botón ⇄ en cualquier producto para añadirlo al comparador (hasta 4).</p>
        <Link className="btn-primary" href="/categoria/laptops-pc">Ver productos</Link>
      </div>
    </div>
  )
}
