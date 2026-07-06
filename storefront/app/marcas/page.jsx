import Link from 'next/link'
import { brandLogo } from '../../components/imageMap.jsx'
import { homeBrands } from '../../lib/data.js'

export const metadata = {
  title: 'Marcas',
  description: 'Las mejores marcas de tecnología en SebasPeru: HP, Epson, Canon, Brother, Lenovo, ASUS, Dell, Logitech y más.',
  alternates: { canonical: '/marcas' },
}

export default function Marcas() {
  return (
    <div className="container page">
      <h1 className="page-title" style={{ marginBottom: 18 }}>Las mejores marcas</h1>
      <div className="brands-page">
        {homeBrands.map((b) => { const B = brandLogo[b]; return <Link className="brand-tile" key={b} href={`/buscar?q=${b}`}><B /></Link> })}
      </div>
    </div>
  )
}
