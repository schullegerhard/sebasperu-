import Link from 'next/link'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import { brandLogo } from '../../components/imageMap.jsx'
import { brands } from '../../lib/catalog.js'

// Revalidación corta: sin esto la página es 100% estática y se sirve con
// Cache-Control s-maxage de 1 año → tras un redeploy la caché seguiría
// mostrando la versión anterior.
export const revalidate = 300

export const metadata = {
  title: 'Marcas',
  description: 'Las mejores marcas de tecnología en SebasPeru: HP, Epson, Canon, Brother, Samsung, Logitech y TP-Link.',
  alternates: { canonical: '/marcas' },
}

export default function Marcas() {
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Marcas' }]} />
      <h1 className="page-title">Las mejores marcas</h1>
      <div className="brands-page">
        {brands.map((b) => {
          const B = brandLogo[b]
          return <Link className="brand-tile" key={b} href={`/buscar?q=${b}`}>{B ? <B /> : <span className="brand-name">{b}</span>}</Link>
        })}
      </div>
    </div>
  )
}
