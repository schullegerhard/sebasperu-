import { ImageResponse } from 'next/og'
import { getProductBySlug } from '../../../lib/data.js'

// Imagen Open Graph dinámica por producto (para compartir en redes / SEO social).
export const runtime = 'nodejs'
export const revalidate = 60
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'SebasPeru — Producto'

export default async function OpengraphImage({ params }) {
  const { slug } = await params
  const p = await getProductBySlug(slug)
  const name = p?.name || 'SebasPeru — Suministros y Tecnología'
  const brand = p?.brand || ''
  const price = p ? `S/ ${Number(p.price).toLocaleString('es-PE')}` : ''

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg, #001a6e 0%, #0047cc 55%, #1a7fff 100%)', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 800, letterSpacing: 1 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fff', color: '#0047cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, marginRight: 20 }}>S</div>
          SebasPeru
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {brand ? <div style={{ fontSize: 30, opacity: 0.85, marginBottom: 14 }}>{brand}</div> : null}
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, maxWidth: 1050 }}>{name.slice(0, 90)}</div>
          {price ? <div style={{ fontSize: 72, fontWeight: 900, marginTop: 28, color: '#ffd24d' }}>{price}</div> : null}
        </div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>Garantía oficial · Factura electrónica · Envíos a todo el Perú</div>
      </div>
    ),
    { ...size },
  )
}
