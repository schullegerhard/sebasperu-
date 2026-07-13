import Link from 'next/link'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import { brandLogo } from '../../components/imageMap.jsx'
import { brands } from '../../lib/catalog.js'

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
