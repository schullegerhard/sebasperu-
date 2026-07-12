export const SITE = 'SebasPeru'
export const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://sebasperu.com'

// Schema.org Product (JSON-LD) renderizado en el HTML servidor → rich results.
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
      '@type': 'Offer', priceCurrency: 'PEN', price: p.price,
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${ORIGIN}/producto/${p.slug}`,
    },
  }
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: ORIGIN + (it.to || '') })),
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org', '@type': 'OnlineStore', name: SITE, url: ORIGIN,
    logo: `${ORIGIN}/favicon.svg`, telephone: '+51925552042', email: 'ventas@sebasperu.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Lima', addressCountry: 'PE' },
  }
}

export const JsonLd = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
)
