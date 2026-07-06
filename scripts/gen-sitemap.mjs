// Genera public/sitemap.xml a partir del catálogo (requisito 8: Sitemap XML).
// Uso: node scripts/gen-sitemap.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const ORIGIN = 'https://www.sebasperu.com'

// Importamos el catálogo (ESM).
const { products, categories } = await import('../src/data/catalog.js')

const urls = [
  '/', '/ofertas', '/marcas', '/cotizacion',
  ...categories.map((c) => `/categoria/${c.slug}`),
  ...products.map((p) => `/producto/${p.slug}`),
  '/legal/quienes-somos', '/legal/terminos', '/legal/privacidad',
  '/legal/cookies', '/legal/devoluciones', '/legal/libro-reclamaciones', '/legal/preguntas',
]

const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${ORIGIN}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`).join('\n')}
</urlset>
`

writeFileSync(resolve(here, '../public/sitemap.xml'), xml)
console.log(`sitemap.xml generado con ${urls.length} URLs`)
