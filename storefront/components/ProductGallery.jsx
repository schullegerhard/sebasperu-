'use client'
import { useState, useEffect, useRef } from 'react'
import { ProductImage } from './imageMap.jsx'
import { ChevronLeft, ChevronRight } from './Icons.jsx'

// La galería de la ficha muestra la imagen COMPLETA (sin recortar).
const CONTAIN = { objectFit: 'contain', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }

// Galería de la ficha: rotación AUTOMÁTICA (cada 5 s, pausada al pasar el mouse)
// y control MANUAL (miniaturas, flechas y deslizar en móvil).
export default function ProductGallery({ images = [], name = '', tint, label, brand, hasOff, discount }) {
  const gallery = images.length ? images : ['']
  const [imgIdx, setImgIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const n = gallery.length
  const cur = Math.min(imgIdx, n - 1)
  const go = (k) => setImgIdx(((k % n) + n) % n)

  // Auto-rotación; al elegir manualmente, el temporizador se reinicia (cur en deps).
  useEffect(() => {
    if (paused || n <= 1) return undefined
    const id = setInterval(() => setImgIdx((x) => (x + 1) % n), 5000)
    return () => clearInterval(id)
  }, [paused, n, cur])

  const altFor = (i) => (i === 0 ? name : `${name} — imagen ${i + 1}`)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)) // deslizar: manual
    touchX.current = null
  }

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
      <div
        className="pdp-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <ProductImage image={gallery[cur]} tint={tint} label={label} brand={brand} alt={altFor(cur)} style={CONTAIN} />
        {hasOff && <span className="pdp-disc">-{discount}%</span>}
        {n > 1 && (
          <>
            <button type="button" className="pdp-arrow left" onClick={() => go(cur - 1)} aria-label="Imagen anterior"><ChevronLeft size={18} /></button>
            <button type="button" className="pdp-arrow right" onClick={() => go(cur + 1)} aria-label="Imagen siguiente"><ChevronRight size={18} /></button>
          </>
        )}
      </div>
    </>
  )
}
