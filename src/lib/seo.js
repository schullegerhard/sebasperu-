import { useEffect } from 'react'

const SITE = 'SebasPeru'
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://www.sebasperu.com'

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(id, data) {
  let el = document.getElementById(id)
  if (data == null) { if (el) el.remove(); return }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

// useSeo: actualiza title, meta description, canonical, Open Graph y JSON-LD
// (requisito 8: Meta Title/Description editables, Canonical, Schema Product).
export function useSeo({ title, description, path = '', jsonLd } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : `${SITE} — Tecnología para todos`
    document.title = fullTitle
    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
    }
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:type', 'website')
    const canonical = ORIGIN + path
    upsertMeta('property', 'og:url', canonical)
    upsertLink('canonical', canonical)
    setJsonLd('jsonld-page', jsonLd || null)
    return () => setJsonLd('jsonld-page', null)
  }, [title, description, path, JSON.stringify(jsonLd)])
}

// Construye el Schema.org Product para la ficha de producto.
export function productJsonLd(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    brand: { '@type': 'Brand', name: p.brand },
    description: p.shortDesc,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: p.price,
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${ORIGIN}/producto/${p.slug}`,
    },
  }
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.label,
      item: ORIGIN + (it.to || ''),
    })),
  }
}
