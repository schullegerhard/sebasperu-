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
  if (!cat) return { title: 'Categoría no encontrada' }
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
  const crumbs = [{ label: 'Inicio', to: '/' }, ...(meta?.crumb || [{ label: cat.name }])]

  return (
    <div className="container page catalog2">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <nav className="breadcrumbs" aria-label="Migas de pan">
        {crumbs.map((c, i) => (
          <span className="crumb" key={i}>
            {c.to && i < crumbs.length - 1 ? <Link href={c.to}>{c.label}</Link> : <span className="crumb-current">{c.label}</span>}
            {i < crumbs.length - 1 && <ChevronRight size={13} className="crumb-sep" />}
          </span>
        ))}
      </nav>

      <CategoryFilters slug={slug} meta={meta} cat={cat} products={ordered} cats={cats} attrDefs={attrDefs} />
    </div>
  )
}
