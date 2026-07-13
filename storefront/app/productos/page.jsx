import Link from 'next/link'
import CategoryFilters from '../../components/CategoryFilters.jsx'
import { ChevronRight } from '../../components/Icons.jsx'
import { getAllProducts, getCategories, getAttributes } from '../../lib/data.js'

export const revalidate = 60

// App 1 = Catalog mode="all": todos los productos publicados.
export const metadata = {
  title: 'Todos los productos',
  description: 'Explora todo el catálogo de SebasPeru: laptops, impresoras, tóner, tintas, redes y accesorios. Filtra por marca, precio y disponibilidad.',
  alternates: { canonical: '/productos' },
}

export default async function Productos() {
  const [items, cats, attrDefs] = await Promise.all([getAllProducts(), getCategories(), getAttributes()])
  const title = 'Todos los productos'

  return (
    <div className="container page cat2">
      <div className="cat-crumb"><Link href="/">Inicio</Link><ChevronRight size={12} /><span>{title}</span></div>

      <CategoryFilters slug="productos" meta={{ title }} products={items} cats={cats} attrDefs={attrDefs} />
    </div>
  )
}
