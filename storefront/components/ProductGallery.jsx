'use client'
import { useState } from 'react'
import { ProductImage } from './imageMap.jsx'

// La galería de la ficha muestra la imagen COMPLETA (sin recortar).
const CONTAIN = { objectFit: 'contain', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }

// Galería interactiva de la ficha: una miniatura por imagen; al hacer clic
// cambia la imagen principal. Devuelve un fragmento con `pdp-thumbs` y
// `pdp-stage` como celdas hermanas del grid `.pdp-grid`.
export default function ProductGallery({ images = [], name = '', tint, label, brand, hasOff, discount }) {
  const gallery = images.length ? images : ['']
  const [imgIdx, setImgIdx] = useState(0)
  const cur = Math.min(imgIdx, gallery.length - 1)
  const altFor = (i) => (i === 0 ? name : `${name} — imagen ${i + 1}`)
  return (
    <>
      <div className="pdp-thumbs">
        {gallery.map((img, i) => (
          <button
            key={i}
            type="button"
            className={`pdp-thumb ${i === cur ? 'active' : ''}`}
            onClick={() => setImgIdx(i)}
            aria-label={`Ver imagen ${i + 1} de ${name}`}
          >
            <ProductImage image={img} tint={tint} label={label} brand={brand} alt={altFor(i)} style={CONTAIN} />
          </button>
        ))}
      </div>
      <div className="pdp-stage">
        <ProductImage image={gallery[cur]} tint={tint} label={label} brand={brand} alt={altFor(cur)} style={CONTAIN} />
        {hasOff && <span className="pdp-disc">-{discount}%</span>}
      </div>
    </>
  )
}
