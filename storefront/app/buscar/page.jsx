import Link from 'next/link'
import CategoryFilters from '../../components/CategoryFilters.jsx'
import { ChevronRight } from '../../components/Icons.jsx'
import { getAllProducts, getCategories, getAttributes } from '../../lib/data.js'

// App 1 = Catalog mode="search": lee ?q= y filtra por nombre/marca/sku/modelo.
// Lee la query → renderizado dinámico (no se cachea).
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Buscar productos',
  description: 'Busca laptops, impresoras, tóner, tintas y más en SebasPeru.',
  robots: { index: false },
  alternates: { canonical: '/buscar' },
}

export default async function Buscar({ searchParams }) {
  const { q = '' } = await searchParams
  const term = String(q).trim().toLowerCase()
  const [all, cats, attrDefs] = await Promise.all([getAllProducts(), getCategories(), getAttributes()])
  const items = term
    ? all.filter((p) =>
        p.name.toLowerCase().includes(term)
        || (p.brand || '').toLowerCase().includes(term)
        || (p.sku || '').toLowerCase().includes(term)
        || (p.model || '').toLowerCase().includes(term))
    : []
  const title = `Resultados para "${q}"`

  return (
    <div className="container page cat2">
      <div className="cat-crumb"><Link href="/">Inicio</Link><ChevronRight size={12} /><span>{title}</span></div>

      <CategoryFilters slug="buscar" meta={{ title }} products={items} cats={cats} attrDefs={attrDefs} />
    </div>
  )
}
