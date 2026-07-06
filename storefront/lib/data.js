// Capa de acceso a datos del storefront.
// Hoy lee del catálogo local; en Fase 2 puede leer de la API (ver getJSON).
import { products, categories, categoryMeta, getProduct, getCategory } from './catalog.js'
import { flashOffers, impresorasBest, tonerBest, tintasBest, homeBrands, homeCategories } from './home.js'

// Si se define NEXT_PUBLIC_API_URL, el storefront consulta la API REST (Fase 2).
const API = process.env.NEXT_PUBLIC_API_URL

async function getJSON(path) {
  const res = await fetch(`${API}${path}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`)
  return res.json()
}

export async function getAllProducts() {
  if (API) { try { return await getJSON('/api/products') } catch { /* fallback */ } }
  return products
}
export async function getProductBySlug(slug) {
  if (API) { try { return await getJSON(`/api/products/${slug}`) } catch { /* fallback */ } }
  return getProduct(slug)
}
// Un slug de categoría y todos sus descendientes (campo `parent`), para que una
// categoría padre incluya los productos de sus subcategorías.
export function descendantSlugs(slug, cats) {
  const out = new Set([slug])
  if (!Array.isArray(cats) || !cats.length) return out
  let added = true
  while (added) {
    added = false
    for (const c of cats) {
      if (c.parent && out.has(c.parent) && !out.has(c.slug)) { out.add(c.slug); added = true }
    }
  }
  return out
}
export async function getProductsByCategory(slug) {
  if (API) {
    try {
      const [all, cats] = await Promise.all([getJSON('/api/products'), getJSON('/api/categories')])
      const scope = descendantSlugs(slug, cats)
      return all.filter((p) => scope.has(p.category))
    } catch { /* fallback */ }
  }
  const scope = descendantSlugs(slug, categories)
  return products.filter((p) => scope.has(p.category))
}
export async function getCategoryBySlug(slug) {
  if (API) { try { return await getJSON(`/api/categories/${slug}`) } catch { /* fallback */ } }
  return getCategory(slug)
}
export async function getCategories() {
  if (API) { try { return await getJSON('/api/categories') } catch { /* fallback */ } }
  return categories
}
export async function getAttributes() {
  if (API) { try { return await getJSON('/api/attributes') } catch { /* fallback */ } }
  return []
}

export { categoryMeta, flashOffers, impresorasBest, tonerBest, tintasBest, homeBrands, homeCategories }
