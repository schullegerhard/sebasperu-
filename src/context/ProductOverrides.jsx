import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { http } from '../services/http.js'
import { products as staticProducts } from '../data/catalog.js'

// Una imagen "real" (subida desde el admin) vs. una clave de ícono SVG estática.
const isUrl = (s) => typeof s === 'string' && (s.startsWith('data:') || s.startsWith('http') || s.startsWith('/uploads'))

// Ids que ya existen en el catálogo estático. Todo producto de la API cuyo id
// no esté aquí es un producto creado en el admin → debe sumarse a la tienda.
const STATIC_IDS = new Set(staticProducts.map((p) => p.id))

// El storefront compone sus páginas con el catálogo estático (src/data/catalog.js),
// pero los datos se editan en el panel de administración (API/BD). Este proveedor
// hace UNA lectura pública de /api/products y /api/categories al montar y guarda:
//   • byId: { id → productoAPI }  → superponer campos en productos existentes
//   • list: [productoAPI, …]      → detectar productos nuevos creados en el admin
//   • cats: [categoríaAPI, …]     → jerarquía padre/hijo (campo `parent`) para que
//                                    una categoría padre agregue los productos de
//                                    sus subcategorías
const Ctx = createContext({ byId: {}, list: [], cats: [], attrs: [], banners: [] })

export function ProductOverridesProvider({ children }) {
  const [state, setState] = useState({ byId: {}, list: [], cats: [], attrs: [], banners: [] })
  useEffect(() => {
    let alive = true
    Promise.all([
      http.get('/api/products').catch(() => null),
      http.get('/api/categories').catch(() => null),
      http.get('/api/attributes').catch(() => null),
      http.get('/api/banners').catch(() => null),
    ]).then(([rows, cats, attrs, banners]) => {
      if (!alive) return
      const next = { byId: {}, list: [], cats: [], attrs: [], banners: [] }
      if (Array.isArray(rows)) {
        for (const p of rows) if (p && p.id != null) next.byId[p.id] = p
        next.list = rows
      }
      if (Array.isArray(cats)) next.cats = cats
      if (Array.isArray(attrs)) next.attrs = attrs
      if (Array.isArray(banners)) next.banners = banners
      setState(next)
    })
    return () => { alive = false }
  }, [])
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>
}

// Banners activos del carrusel, gestionados en el admin. Vacío → la Home usa
// los banners estáticos del diseño como respaldo.
export const useBanners = () => useContext(Ctx).banners

// Mapa { id → productoAPI }. Vacío fuera del proveedor → seguro en admin/tests.
export const useProductOverrides = () => useContext(Ctx).byId

// Lista de categorías de la API (con `parent`/`subcategories`). Vacía sin proveedor.
export const useApiCategories = () => useContext(Ctx).cats

// Definiciones de atributos fijos (orden y valores) para ordenar los filtros.
export const useAttributeDefs = () => useContext(Ctx).attrs

// Campos administrables que se reflejan en la tienda. Solo se superponen estos
// (no se hace spread completo) para no pisar campos de presentación que solo
// existen en el catálogo estático (specs, related, highlights, subtitle…).
export function applyOverride(staticP, ov) {
  if (!staticP || !ov) return staticP
  const out = { ...staticP }
  if (ov.name != null) out.name = ov.name
  if (ov.brand != null) out.brand = ov.brand
  if (ov.price != null && ov.price !== '') out.price = Number(ov.price)
  if ('oldPrice' in ov) out.oldPrice = ov.oldPrice ? Number(ov.oldPrice) : undefined
  if (ov.stock != null && ov.stock !== '') out.stock = Number(ov.stock)
  if (isUrl(ov.image)) out.image = ov.image
  if (ov.category != null && ov.category !== '') out.category = ov.category
  if (Array.isArray(ov.categories)) out.categories = ov.categories
  if (ov.subcategory != null) out.subcategory = ov.subcategory
  if (Array.isArray(ov.attributes)) out.attributes = ov.attributes
  if (Array.isArray(ov.gallery)) out.gallery = ov.gallery
  if (Array.isArray(ov.images)) out.images = ov.images
  if (Array.isArray(ov.faq)) out.faq = ov.faq
  return out
}

// Un producto creado en el admin no trae los campos de presentación del catálogo
// estático (specs, model, rating…). Los rellenamos con valores seguros para que
// las páginas de la tienda lo rendericen sin romperse.
function normalize(p) {
  return {
    ...p,
    model: p.model || '',
    rating: Number(p.rating) || 0,
    reviews: Number(p.reviews) || 0,
    price: Number(p.price) || 0,
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    stock: Number(p.stock) || 0,
    specs: p.specs && typeof p.specs === 'object' && !Array.isArray(p.specs) ? p.specs : {},
    compatibilities: Array.isArray(p.compatibilities) ? p.compatibilities : [],
    related: Array.isArray(p.related) ? p.related : [],
    attributes: Array.isArray(p.attributes) ? p.attributes : [],
    highlights: Array.isArray(p.benefits) && p.benefits.length ? p.benefits : p.highlights,
    subtitle: p.subtitle || p.shortDesc || '',
    blurb: p.blurb || p.shortDesc || '',
    offer: !!p.offer || (p.oldPrice ? Number(p.oldPrice) > Number(p.price) : false),
    image: p.image || 'laptop',
  }
}

// Productos creados en el admin (no presentes en el catálogo estático), ya
// normalizados y filtrados a los que están publicados (sin borradores/descontinuados).
export function useExtraProducts() {
  const { list } = useContext(Ctx)
  return useMemo(() => (list || [])
    .filter((p) => p && p.id != null && !STATIC_IDS.has(p.id))
    .filter((p) => p.status !== 'Borrador' && p.status !== 'Descontinuado')
    .map(normalize), [list])
}

// Conjunto con un slug de categoría y TODOS sus descendientes (según `parent`),
// para que la página de una categoría padre incluya los productos de sus hijas.
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

// Devuelve la imagen subida para un id de producto, o undefined si no hay override.
// La usa ProductImage para reflejar imágenes incluso donde no se hace merge completo
// (p. ej. tarjetas de la Home que provienen de data/home.js).
export const useImageOverride = (id) => {
  const { byId } = useContext(Ctx)
  const ov = id != null ? byId[id] : null
  return ov && isUrl(ov.image) ? ov.image : undefined
}
