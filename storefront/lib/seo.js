export const SITE = 'SebasPeru'
export const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://sebasperu.com'

// Convierte una ruta/URL a absoluta. Devuelve null para data:base64 (no es
// rastreable → inválida en JSON-LD `image` y og:image, ver auditoría SEO 2.4).
export function absUrl(src) {
  if (!src || typeof src !== 'string') return null
  if (src.startsWith('data:')) return null
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  if (src.startsWith('/')) return ORIGIN + src
  return null
}

// Imágenes rastreables del producto (sin base64 ni duplicados). Prioriza el
// og:image del panel si existe.
export function productImages(p) {
  const raw = [p?.seo?.ogImage, p?.image,
    ...(Array.isArray(p?.gallery) ? p.gallery : []),
    ...(Array.isArray(p?.images) ? p.images : [])]
  return [...new Set(raw.map(absUrl).filter(Boolean))]
}

// Descripción SEO: override del panel > descripción corta > generada. Siempre
// devuelve texto (evita meta description vacía, auditoría 2.1).
export function productDescription(p) {
  const base = p?.seo?.metaDescription || p?.seo?.ogDescription
    || p?.shortDesc || p?.subtitle || p?.blurb || ''
  if (base && base.trim()) return base.trim().slice(0, 300)
  const brand = p?.brand ? `${p.brand} ` : ''
  return `Compra ${brand}${p?.name || ''} en ${SITE}. Garantía oficial, factura electrónica y envíos a todo el Perú.`.replace(/\s+/g, ' ').trim()
}

// Schema.org Product (JSON-LD) renderizado en el HTML servidor → rich results.
// Solo incluye campos con datos reales: sin marca vacía, sin descripción vacía,
// y aggregateRating únicamente cuando existen reseñas reales (auditoría 2.2).
export function productJsonLd(p) {
  const url = `${ORIGIN}/producto/${p.slug}`
  const images = productImages(p)
  const brand = String(p.brand || '').trim()
  const reviews = Number(p.reviews) || 0
  const rating = Number(p.rating) || 0
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.name,
    description: productDescription(p),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'PEN',
      price: Number(p.price || 0).toFixed(2),
      priceValidUntil,
      availability: Number(p.stock) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: SITE },
    },
  }
  if (images.length) data.image = images
  if (p.sku) data.sku = p.sku
  if (p.mpn) data.mpn = p.mpn
  if (p.ean) data.gtin13 = p.ean
  if (brand) data.brand = { '@type': 'Brand', name: brand }
  if (reviews > 0 && rating > 0) {
    data.aggregateRating = { '@type': 'AggregateRating', ratingValue: rating, reviewCount: reviews }
  }
  return data
}

// BreadcrumbList. El `item` solo se emite cuando el crumb tiene ruta propia; así
// el último elemento apunta a su URL canónica y nunca al inicio (auditoría 3.3).
export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => {
      const li = { '@type': 'ListItem', position: i + 1, name: it.label }
      if (it.to) li.item = ORIGIN + it.to
      return li
    }),
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org', '@type': 'OnlineStore',
    '@id': `${ORIGIN}/#store`,
    name: SITE, url: ORIGIN,
    logo: `${ORIGIN}/logo.png`,
    image: `${ORIGIN}/logo.png`,
    telephone: '+51925552042', email: 'ventas@sebasperu.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Lima', addressRegion: 'Lima', addressCountry: 'PE' },
    contactPoint: {
      '@type': 'ContactPoint', telephone: '+51925552042',
      contactType: 'customer service', areaServed: 'PE', availableLanguage: 'Spanish',
    },
    // sameAs: añade aquí los perfiles sociales REALES de SebasPeru cuando existan.
  }
}

// WebSite con SearchAction → habilita el cuadro de búsqueda de sitelinks en Google.
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org', '@type': 'WebSite',
    '@id': `${ORIGIN}/#website`,
    name: SITE, url: ORIGIN,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${ORIGIN}/buscar?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export const JsonLd = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
)
