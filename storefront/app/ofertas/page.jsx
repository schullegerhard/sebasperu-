import Link from 'next/link'
import CategoryFilters from '../../components/CategoryFilters.jsx'
import { ChevronRight } from '../../components/Icons.jsx'
import { getAllProducts, getCategories, getAttributes } from '../../lib/data.js'

export const revalidate = 60

// App 1 = Catalog mode="offers": productos con descuento (oldPrice > price).
export const metadata = {
  title: 'Ofertas',
  description: 'Aprovecha las mejores ofertas en tecnología: laptops, impresoras, tóner y tintas con descuento en SebasPeru.',
  alternates: { canonical: '/ofertas' },
}

export default async function Ofertas() {
  const [all, cats, attrDefs] = await Promise.all([getAllProducts(), getCategories(), getAttributes()])
  const items = all.filter((p) => p.oldPrice && Number(p.oldPrice) > Number(p.price))
  const title = 'Ofertas'

  return (
    <div className="container page cat2">
      <div className="cat-crumb"><Link href="/">Inicio</Link><ChevronRight size={12} /><span>{title}</span></div>

      <CategoryFilters slug="ofertas" meta={{ title }} products={items} cats={cats} attrDefs={attrDefs} />
    </div>
  )
}
