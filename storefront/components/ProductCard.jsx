'use client'
import Link from 'next/link'
import { ProductImage } from './imageMap.jsx'
import { Cart, Heart } from './Icons.jsx'
import { peso } from '../lib/catalog.js'
import { useCart } from './CartProvider.jsx'

const COVER = { objectFit: 'cover', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }

// Tarjeta de producto del diseño (pcard), igual que App 1. Contenido renderizado
// en el servidor (SEO); solo el botón "Agregar al carrito" es interactivo.
export default function ProductCard({ p }) {
  const { addToCart } = useCart()
  const to = `/producto/${p.slug}`
  const hasOff = p.oldPrice && Number(p.oldPrice) > Number(p.price)
  const off = p.off || (hasOff ? Math.round((1 - p.price / p.oldPrice) * 100) : 0)
  return (
    <div className="pcard">
      {p.badge ? <span className="pcard-badge nuevo">{p.badge}</span> : off ? <span className="pcard-badge disc">-{off}%</span> : null}
      <button className="pcard-fav" aria-label="Favorito"><Heart size={16} /></button>
      <Link href={to} className="pcard-thumb" aria-label={`Ver ${p.name}`}><ProductImage image={p.image} tint={p.tint} label={p.label} alt={p.name} style={COVER} /></Link>
      <div className="pcard-body">
        <span className="pcard-brand">{p.brand}</span>
        <Link href={to} className="pcard-name">{p.name}</Link>
        <div className="pcard-price"><span className="now">{peso(p.price).replace('.00', '')}</span>{hasOff && <span className="old">{peso(p.oldPrice).replace('.00', '')}</span>}</div>
        <button className="pcard-add" onClick={() => addToCart(p)}><Cart size={14} /> Agregar al carrito</button>
      </div>
    </div>
  )
}
