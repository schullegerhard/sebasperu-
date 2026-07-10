import { ImageResponse } from 'next/og'
import { getCategoryBySlug, categoryMeta } from '../../../lib/data.js'

// Imagen Open Graph dinámica por categoría.
export const runtime = 'nodejs'
export const revalidate = 60
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'SebasPeru — Categoría'

export default async function OpengraphImage({ params }) {
  const { slug } = await params
  const cat = await getCategoryBySlug(slug)
  const title = categoryMeta[slug]?.title || cat?.name || 'Catálogo'

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg, #001a6e 0%, #0047cc 55%, #1a7fff 100%)', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 800, letterSpacing: 1 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fff', color: '#0047cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, marginRight: 20 }}>S</div>
          SEBASTPERU
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 34, opacity: 0.85, marginBottom: 14 }}>Categoría</div>
          <div style={{ fontSize: 82, fontWeight: 900, lineHeight: 1.05, maxWidth: 1050 }}>{String(title).slice(0, 60)}</div>
        </div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>Las mejores marcas · Envíos a todo el Perú · Factura electrónica</div>
      </div>
    ),
    { ...size },
  )
}
