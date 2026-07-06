import { ORIGIN } from '../lib/seo.js'

// Next genera /robots.txt automáticamente desde este archivo.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/checkout', '/carrito', '/cuenta'] },
    sitemap: `${ORIGIN}/sitemap.xml`,
  }
}
