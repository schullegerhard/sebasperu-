'use client'
import Link from 'next/link'
import { ProductImage } from './imageMap.jsx'
import { Cart, Heart, Star, Eye } from './Icons.jsx'
import { peso } from '../lib/catalog.js'
import { useCart } from './CartProvider.jsx'

const Stars = ({ value }) => (
  <span className="stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={12} style={{ opacity: i < Math.round(value) ? 1 : 0.3 }} />)}</span>
)

// Tarjeta estilo "categorías". El contenido se renderiza en el servidor (SEO)
// aunque el botón de carrito sea interactivo en el cliente.
export default function ProductCard({ p }) {
  const { addToCart } = useCart()
  const off = p.off || (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0)
  const badge = p.flag === 'oferta' ? { t: '¡Oferta!', c: 'oferta' } : p.flag === 'nuevo' ? { t: 'Nuevo', c: 'nuevo' } : off > 0 ? { t: `-${off}%`, c: 'disc' } : null
  return (
    <div className="ccard">
      {badge && <span className={`ccard-badge ${badge.c}`}>{badge.t}</span>}
      <button className="ccard-fav" aria-label="Favorito"><Heart size={17} /></button>
      <Link href={`/producto/${p.slug}`} className="ccard-thumb"><ProductImage image={p.image} tint={p.tint} label={p.label} /></Link>
      {p.trendTag && <span className="ccard-trend"><b>trends</b> {p.trendTag} ›</span>}
      <Link href={`/producto/${p.slug}`} className="ccard-name">{p.name}</Link>
      <div className="ccard-blurb">{p.blurb || p.subtitle}</div>
      {p.rankLabel && <div className="ccard-rank">🏆 {p.rankLabel}</div>}
      <div className="ccard-rating"><Stars value={p.rating} /> <span>({p.reviews})</span></div>
      <div className="ccard-price"><span className="price-now">{peso(p.price)}</span>{p.oldPrice && <span className="price-old">{peso(p.oldPrice)}</span>}</div>
      <div className="ccard-stock">{p.stock > 0 ? 'En stock' : 'Agotado'}</div>
      <div className="ccard-actions">
        <button className="ccard-add" onClick={() => addToCart(p)} disabled={p.stock === 0}><Cart size={16} /></button>
        <Link className="ccard-eye" href={`/producto/${p.slug}`} aria-label="Vista rápida"><Eye size={16} /></Link>
      </div>
    </div>
  )
}
