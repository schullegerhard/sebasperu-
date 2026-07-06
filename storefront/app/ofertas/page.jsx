import ProductCard from '../../components/ProductCard.jsx'
import { getAllProducts } from '../../lib/data.js'

export const metadata = {
  title: 'Ofertas',
  description: 'Aprovecha las mejores ofertas en tecnología: laptops, impresoras, tóner y tintas con descuento en SebasPeru.',
  alternates: { canonical: '/ofertas' },
}

export default async function Ofertas() {
  const products = await getAllProducts()
  const items = products.filter((p) => p.offer)
  return (
    <div className="container page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>Ofertas</h1>
      <div className="ccard-grid">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </div>
  )
}
