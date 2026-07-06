import { getAllProducts, getCategories } from '../lib/data.js'
import { ORIGIN } from '../lib/seo.js'

// Next genera /sitemap.xml automáticamente desde este archivo.
export default async function sitemap() {
  const products = await getAllProducts()
  const categories = await getCategories()
  const now = new Date()
  const urls = [
    '', '/ofertas', '/marcas', '/cotizacion',
    ...categories.map((c) => `/categoria/${c.slug}`),
    ...products.map((p) => `/producto/${p.slug}`),
    '/legal/quienes-somos', '/legal/terminos', '/legal/privacidad', '/legal/devoluciones', '/legal/preguntas',
  ]
  return urls.map((u) => ({ url: `${ORIGIN}${u}`, lastModified: now, changeFrequency: 'weekly', priority: u === '' ? 1 : 0.7 }))
}
