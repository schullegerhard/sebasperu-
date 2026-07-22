import Link from 'next/link'
import { notFound } from 'next/navigation'
import CategoryFilters from '../../../components/CategoryFilters.jsx'
import { ChevronRight } from '../../../components/Icons.jsx'
import { getCategoryBySlug, getProductsByCategory, getCategories, getAttributes, categoryMeta } from '../../../lib/data.js'
import { ORIGIN, breadcrumbJsonLd, JsonLd } from '../../../lib/seo.js'

export const revalidate = 60

// Pre-genera las rutas de categoría en build (SSG) → HTML estático e indexable.
export async function generateStaticParams() {
  const cats = await getCategories()
  return cats.map((c) => ({ slug: c.slug }))
}

// SEO por página: título, descripción y canonical renderizados en el servidor.
export async function generateMetadata({ params }) {
  const { slug } = await params
  const cat = await getCategoryBySlug(slug)
  // notFound() aquí → HTTP 404 real (no soft-404 con estado 200).
  if (!cat) notFound()
  const meta = categoryMeta[slug]
  const title = meta?.title || cat.name
  const description = meta?.subtitle || `Compra ${cat.name} en SebasPeru. Filtra por marca, precio y disponibilidad. Envíos a todo el Perú.`
  return {
    title, description,
    alternates: { canonical: `/categoria/${slug}` },
    openGraph: { title, description, url: `${ORIGIN}/categoria/${slug}` },
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params
  const [cat, items, cats, attrDefs] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug), // ya agrega productos de subcategorías
    getCategories(),
    getAttributes(),
  ])
  if (!cat) notFound()
  const meta = categoryMeta[slug]
  // Orden destacado por defecto (el cliente puede reordenar).
  let ordered = items
  if (meta?.featured) {
    const order = meta.featured
    ordered = [...items].sort((a, b) => (order.indexOf(a.id) === -1 ? 99 : order.indexOf(a.id)) - (order.indexOf(b.id) === -1 ? 99 : order.indexOf(b.id)))
  }
  const title = meta?.title || cat.name
  // El último crumb apunta a la URL canónica de la categoría (auditoría 3.3).
  const tail = (meta?.crumb || [{ label: cat.name }]).map((c) => ({ ...c }))
  tail[tail.length - 1] = { ...tail[tail.length - 1], to: `/categoria/${slug}` }
  const crumbs = [{ label: 'Inicio', to: '/' }, ...tail]

  return (
    <div className="container page cat2">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="cat-crumb"><Link href="/">Inicio</Link><ChevronRight size={12} /><span>{title}</span></div>

      <CategoryFilters slug={slug} meta={meta} cat={cat} products={ordered} cats={cats} attrDefs={attrDefs} />
    </div>
  )
}
