// Catálogo del storefront con los mismos productos/fotos del diseño (Figma).
// Unifica las secciones de la Home para que las páginas de categoría y de
// producto puedan encontrarlos por slug (Home → Producto conectados).
import { homeImpresoras, homeToner, homeTintas, homeLaptops, flashOffers } from './home.js'
import { slugify } from '../lib/util.js'

const withMeta = (arr, category, categoryLabel) =>
  arr.map((p) => ({ ...p, category, categoryLabel, slug: slugify(p.name) }))

export const storeSections = [
  { category: 'impresoras', label: 'Impresoras', items: withMeta(homeImpresoras, 'impresoras', 'Impresoras') },
  { category: 'toner', label: 'Tóner', items: withMeta(homeToner, 'toner', 'Tóner') },
  { category: 'tintas', label: 'Tintas', items: withMeta(homeTintas, 'tintas', 'Tintas') },
  { category: 'laptops-pc', label: 'Laptops', items: withMeta(homeLaptops, 'laptops-pc', 'Laptops') },
]

export const storeProducts = storeSections.flatMap((s) => s.items)

// Ofertas flash como productos navegables (categoría deducida por el nombre).
const guessCat = (name) => {
  const n = name.toLowerCase()
  if (n.includes('laptop')) return 'laptops-pc'
  if (n.includes('tóner') || n.includes('toner')) return 'toner'
  if (n.includes('impresora')) return 'impresoras'
  return 'tintas'
}
const flashProducts = flashOffers.map((p) => ({ ...p, category: guessCat(p.name), slug: slugify(p.name) }))

export const findStoreProduct = (slug) =>
  storeProducts.find((p) => p.slug === slug) || flashProducts.find((p) => p.slug === slug) || null

export const storeByCategory = (cat) => storeProducts.filter((p) => p.category === cat)
export const productSlug = (name) => slugify(name)
