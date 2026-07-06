import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { ProductImage } from './imageMap.jsx'
import { Star, Heart, Cart, ChevronRight, Whatsapp, ArrowRight } from './Icons.jsx'
import { peso } from '../data/catalog.js'

/* ---------- Stars ---------- */
export const Stars = ({ value, size = 12 }) => (
  <span className="stars">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} size={size} style={{ opacity: i < Math.round(value) ? 1 : 0.3 }} />
    ))}
  </span>
)

/* ---------- Breadcrumbs (requisito 3) ---------- */
export const Breadcrumbs = ({ items }) => (
  <nav className="breadcrumbs" aria-label="Migas de pan">
    {items.map((it, i) => (
      <span key={i} className="crumb">
        {it.to && i < items.length - 1 ? <Link to={it.to}>{it.label}</Link> : <span className="crumb-current">{it.label}</span>}
        {i < items.length - 1 && <ChevronRight size={13} className="crumb-sep" />}
      </span>
    ))}
  </nav>
)

/* ---------- ProductCard ---------- */
export const ProductCard = ({ p }) => {
  const { addToCart, toggleCompare, compare } = useStore()
  const inCompare = compare.some((c) => c.id === p.id)
  return (
    <div className="product-card">
      <div className="product-thumb">
        {p.offer && <span className="offer-tag">¡Oferta!</span>}
        <button className="fav-btn" aria-label="Agregar a favoritos"><Heart size={16} /></button>
        <Link to={`/producto/${p.slug}`} aria-label={p.name}>
          <ProductImage image={p.image} />
        </Link>
      </div>
      <Link to={`/producto/${p.slug}`} className="product-name">{p.name}</Link>
      <div className="rating">
        <Stars value={p.rating} />
        <span className="rnum">{p.rating}</span>
        <span className="rcount">({p.reviews})</span>
      </div>
      <div className="stock-line">
        {p.stock > 0 ? <span className="in-stock">● En stock</span> : <span className="out-stock">● Agotado</span>}
      </div>
      <div className="price-row">
        <span className="price">{peso(p.price)}</span>
        {p.oldPrice && <span className="price-old">{peso(p.oldPrice)}</span>}
      </div>
      <div className="card-actions">
        <button className="add-btn" onClick={() => addToCart(p)} disabled={p.stock === 0}>
          <Cart size={16} /> Agregar al carrito
        </button>
        <button
          className={`compare-btn ${inCompare ? 'on' : ''}`}
          onClick={() => toggleCompare(p)}
          title="Comparar"
          aria-label="Comparar"
        >⇄</button>
      </div>
    </div>
  )
}

/* ---------- Toast ---------- */
export const Toast = () => {
  const { toast } = useStore()
  if (!toast) return null
  return <div className="toast">{toast}</div>
}

/* ---------- Floating WhatsApp (requisito 11) ---------- */
export const FloatingWhatsApp = () => (
  <a
    className="wa-pill"
    href="https://wa.me/51925552042?text=Hola%20SebasPeru,%20necesito%20información"
    target="_blank" rel="noreferrer" aria-label="Escríbenos por WhatsApp"
  >
    <Whatsapp size={24} />
    <span className="wa-col"><b>WhatsApp</b><small>925 552 042</small></span>
  </a>
)

/* ---------- Cookie banner (requisito 12: Política de cookies) ---------- */
import { useEffect, useState } from 'react'
export const CookieBanner = () => {
  const [show, setShow] = useState(false)
  useEffect(() => { if (!localStorage.getItem('sp_cookies')) setShow(true) }, [])
  if (!show) return null
  const accept = (v) => { localStorage.setItem('sp_cookies', v); setShow(false) }
  return (
    <div className="cookie-banner">
      <p>Usamos cookies para mejorar tu experiencia, personalizar contenido y analizar el tráfico. Consulta nuestra <Link to="/legal/cookies">Política de Cookies</Link>.</p>
      <div className="cookie-actions">
        <button className="btn-ghost" onClick={() => accept('rejected')}>Rechazar</button>
        <button className="btn-primary" onClick={() => accept('accepted')}>Aceptar</button>
      </div>
    </div>
  )
}

export { ArrowRight }
