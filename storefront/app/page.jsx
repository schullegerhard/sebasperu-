import HomeClient from '../components/HomeClient.jsx'
import { getAllProducts, getCategories, getBanners, descendantSlugs, homeCategories } from '../lib/data.js'

// Server Component: obtiene los datos (SEO) y los pasa al render del diseño.
export const revalidate = 60

export const metadata = {
  title: 'Tecnología que impulsa tu negocio',
  description: 'SebasPeru — Impresoras, tóner, tintas, laptops y accesorios de las mejores marcas. Ventas corporativas, factura electrónica y envíos a todo el Perú.',
  alternates: { canonical: '/' },
}

const isRealImg = (s) => typeof s === 'string' && (s.startsWith('data:') || s.startsWith('http') || s.startsWith('/uploads'))

export default async function Home() {
  const [all, cats, banners] = await Promise.all([getAllProducts(), getCategories(), getBanners()])

  const heroBanners = banners.filter((b) => b && b.active && (b.slot || 'hero') === 'hero')
  const promos = banners.filter((b) => b && b.active && b.slot === 'promo')

  const inScope = (p, s) => s.has(p.category)
    || (Array.isArray(p.categories) && p.categories.some((c) => s.has(c)))
    || (p.subcategory && s.has(p.subcategory))
  const pick = (root, exclude = [], n = 10) => {
    const s = descendantSlugs(root, cats)
    const ex = exclude.map((e) => descendantSlugs(e, cats))
    return all.filter((p) => inScope(p, s) && !ex.some((e) => inScope(p, e))).slice(0, n)
  }

  const flash = all
    .filter((p) => p.oldPrice && Number(p.oldPrice) > Number(p.price))
    .map((p) => ({ ...p, off: Math.round((1 - p.price / p.oldPrice) * 100) }))
    .slice(0, 10)

  const preset = [
    { slug: 'impresoras', title: 'Impresoras', items: pick('impresoras', ['toner', 'tintas']), to: '/categoria/impresoras' },
    { slug: 'toner', title: 'Tóner para Impresora', items: pick('toner'), to: '/categoria/toner' },
    { slug: 'tintas', title: 'Tintas para Impresora', items: pick('tintas'), to: '/categoria/tintas' },
    { slug: 'laptops-pc', title: 'Computación', items: pick('laptops-pc'), to: '/categoria/laptops-pc' },
  ].filter((s) => s.items.length)
  const sections = preset.length ? preset : [{ slug: 'todos', title: 'Productos', items: all.slice(0, 12), to: '/productos' }]

  const categorias = homeCategories.map((c) => {
    const slug = c.to.startsWith('/categoria/') ? c.to.slice('/categoria/'.length) : null
    const ac = slug && cats.find((x) => x.slug === slug)
    return { ...c, image: ac && isRealImg(ac.image) ? ac.image : c.image }
  })

  return <HomeClient heroBanners={heroBanners} promos={promos} sections={sections} flash={flash} categorias={categorias} />
}
