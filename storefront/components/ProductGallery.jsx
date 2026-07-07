'use client'
import { useState } from 'react'
import { ProductImage } from './imageMap.jsx'

// Galería interactiva de la ficha: una miniatura por imagen; al hacer clic
// cambia la imagen principal. Con una sola imagen muestra una miniatura.
export default function ProductGallery({ images = [], tint, label }) {
  const gallery = images.length ? images : ['']
  const [i, setI] = useState(0)
  const cur = Math.min(i, gallery.length - 1)
  return (
    <div className="pd2-gallery">
      <div className="pd2-thumbs">
        {gallery.map((img, idx) => (
          <button
            key={idx}
            type="button"
            className={`pd2-thumb ${idx === cur ? 'active' : ''}`}
            onClick={() => setI(idx)}
            aria-label={`Ver imagen ${idx + 1}`}
          >
            <ProductImage image={img} tint={tint} label={label} />
          </button>
        ))}
      </div>
      <div className="pd2-main">
        <div className="pd2-stage"><div className="pd2-zoomable"><ProductImage image={gallery[cur]} tint={tint} label={label} /></div></div>
        <div className="pd2-zoomhint">Vista de producto</div>
      </div>
    </div>
  )
}
