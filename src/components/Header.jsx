import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Truck, MapPin, Search, Cart, ChevronDown,
  ShieldCheck, Phone, Tag, Mail, Zap, Menu, X,
} from './Icons.jsx'
import { ProductImage } from './imageMap.jsx'
import { products, peso } from '../data/catalog.js'
import { MENU_TREE } from '../data/menu.js'
import { useProductOverrides, useExtraProducts, applyOverride, useStorefrontProducts, useHasRealCatalog } from '../context/ProductOverrides.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { getCustomer } from '../services/account.js'
import { track } from '../lib/analytics.js'

export const Logo = ({ footer, variant = 'inner' }) => (
  <Link to="/" className="logo" aria-label="SEBASTPERU — Inicio">
    <img src="/logo.png" alt="SEBASTPERU — Suministros y Tecnología" className="logo-img" width="190" height="44" />
  </Link>
)

const TopBar = () => (
  <div className="topbar">
    <div className="container">
      <div className="tb-left">
        <span className="tb-item"><Phone size={14} /> (01) 700-4000</span>
        <span className="tb-item"><Mail size={14} /> ventas@sebastperu.pe</span>
        <span className="tb-item"><MapPin size={14} /> Lima, Perú</span>
      </div>
      <div className="tb-right">
        <span className="tb-item"><Zap size={13} /> Envío gratis +S/ 200</span>
        <span className="tb-divider" />
        <span className="tb-item"><ShieldCheck size={13} /> Garantía oficial</span>
        <span className="tb-divider" />
        <span className="tb-item"><Truck size={13} /> Entrega en 24h Lima</span>
      </div>
    </div>
  </div>
)

function PredictiveSearch({ variant = 'inner' }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const navigate = useNavigate()
  const overrides = useProductOverrides()
  const extras = useExtraProducts()
  const realCatalog = useStorefrontProducts()
  const hasReal = useHasRealCatalog()

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (term.length < 2) return []
    const pool = hasReal ? realCatalog : [...products.map((p) => applyOverride(p, overrides[p.id])), ...extras]
    return pool
      .filter((p) =>
        (p.name || '').toLowerCase().includes(term) || (p.sku || '').toLowerCase().includes(term) ||
        (p.brand || '').toLowerCase().includes(term) || (p.model || '').toLowerCase().includes(term))
      .slice(0, 6)
  }, [q, overrides, extras, realCatalog, hasReal])

  useEffect(() => {
    const onClick = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    track('search', { search_term: q })
    navigate(`/buscar?q=${encodeURIComponent(q)}`)
    setOpen(false)
  }

  return (
    <form className="searchbar" onSubmit={submit} ref={boxRef} role="search">
      <input
        className="sb-input"
        placeholder="Busca tintas HP, tóner Samsung, laptops Dell..."
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        aria-label="Buscar productos"
      />
      <button className="search-go" type="submit"><Search size={18} /> <span>Buscar</span></button>
      {open && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((p) => (
            <Link key={p.id} to={`/producto/${p.slug}`} className="search-result" onClick={() => setOpen(false)}>
              <div className="sr-thumb"><ProductImage image={p.image} /></div>
              <div className="sr-info">
                <b>{p.name}</b>
                <span>{p.brand} · SKU {p.sku}</span>
              </div>
              <span className="sr-price">{peso(p.price)}</span>
            </Link>
          ))}
          <button type="submit" className="search-all">Ver todos los resultados para “{q}”</button>
        </div>
      )}
    </form>
  )
}

const MainHeader = ({ variant = 'inner', onMenu }) => {
  const { cartCount, cartTotal, openCart } = useStore()
  const [customer, setCustomer] = useState(() => getCustomer())
  useEffect(() => {
    const sync = () => setCustomer(getCustomer())
    window.addEventListener('customer-auth', sync)
    return () => window.removeEventListener('customer-auth', sync)
  }, [])
  return (
    <header className="header">
      <div className="container">
        <button type="button" className="hdr-burger" onClick={onMenu} aria-label="Abrir menú"><Menu size={22} /></button>
        <Logo variant={variant} />
        <PredictiveSearch variant={variant} />
        <div className="header-actions">
          {customer ? (
            <Link to="/cuenta" className="acc-link"><small>Mi cuenta</small><b>Hola, {customer.name.split(' ')[0]}</b></Link>
          ) : (
            <>
              <Link to="/cuenta" className="acc-link">
                <small>¿Ya tienes cuenta?</small>
                <b>Inicia sesión</b>
              </Link>
              <Link to="/cuenta" className="btn-register">Regístrate</Link>
            </>
          )}
          <button type="button" onClick={openCart} className="cart-action">
            <span className="cart-ic">
              <Cart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </span>
            <span className="ca-col"><small>MI CARRITO</small><b>{peso(cartTotal).replace('.00', '')}</b></span>
          </button>
        </div>
      </div>
    </header>
  )
}

// El mega-menú se deriva del árbol de categorías (src/data/menu.js). Cada ítem
// de columna enlaza a la página de su subcategoría real (/categoria/{slug}); los
// títulos de columna que son categorías propias (Tóner/Tintas) también enlazan.
const MEGA_MENU = MENU_TREE

function NavItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="nav2-item" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to={item.to} className="nav2-link">{item.name} <ChevronDown size={13} className={open ? 'up' : ''} /></Link>
      {open && (
        <div className="nav2-mega" style={{ minWidth: 180 * item.cols.length }}>
          {item.cols.map((col) => (
            <div className="nav2-mega-col" key={col.title}>
              <p className="nav2-mega-title">{col.groupSlug ? <Link to={`/categoria/${col.groupSlug}`}>{col.title}</Link> : col.title}</p>
              <ul>{col.items.map(([slug, name]) => <li key={slug}><Link to={`/categoria/${slug}`}>{name}</Link></li>)}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Nav = () => (
  <nav className="nav2">
    <div className="container">
      <div className="nav2-links">
        {MEGA_MENU.map((item) => <NavItem key={item.slug} item={item} />)}
      </div>
      <Link to="/ofertas" className="nav2-ofertas"><Tag size={15} /> OFERTAS</Link>
    </div>
  </nav>
)

// Menú lateral para móvil: categorías como acordeón (rubro + subcategorías).
function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  return (
    <div className="mnav-overlay" onClick={onClose}>
      <div className="mnav" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Menú de categorías">
        <div className="mnav-head">
          <span>Categorías</span>
          <button onClick={onClose} aria-label="Cerrar menú"><X size={20} /></button>
        </div>
        <div className="mnav-body">
          <Link to="/productos" className="mnav-top" onClick={onClose}>Todos los productos</Link>
          {MEGA_MENU.map((item) => {
            const isOpen = expanded === item.slug
            return (
              <div className="mnav-group" key={item.slug}>
                <div className="mnav-row">
                  <Link to={item.to} className="mnav-cat" onClick={onClose}>{item.name}</Link>
                  <button className="mnav-exp" onClick={() => setExpanded(isOpen ? null : item.slug)} aria-label={`Ver subcategorías de ${item.name}`}>
                    <ChevronDown size={16} className={isOpen ? 'up' : ''} />
                  </button>
                </div>
                {isOpen && (
                  <div className="mnav-subs">
                    {item.cols.map((col) => (
                      <div className="mnav-subcol" key={col.title}>
                        <p className="mnav-subtitle">{col.groupSlug ? <Link to={`/categoria/${col.groupSlug}`} onClick={onClose}>{col.title}</Link> : col.title}</p>
                        {col.items.map(([slug, name]) => <Link key={slug} to={`/categoria/${slug}`} className="mnav-sub" onClick={onClose}>{name}</Link>)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <Link to="/ofertas" className="mnav-top ofertas" onClick={onClose}><Tag size={15} /> OFERTAS</Link>
        </div>
      </div>
    </div>
  )
}

export default function Header({ variant = 'inner' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="site-header">
      <TopBar />
      <MainHeader variant={variant} onMenu={() => setMenuOpen(true)} />
      <Nav />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

/* Encabezado minimalista para el checkout (sin nav ni buscador). */
export function MinimalHeader() {
  return (
    <header className="header-min">
      <div className="container">
        <Logo />
        <div className="hm-secure"><ShieldCheck size={20} /> <div><b>Compra 100% segura</b><span>Tus datos están protegidos</span></div></div>
        <a className="hm-help" href="https://wa.me/51925552042" target="_blank" rel="noreferrer">
          <Phone size={20} />
          <div><span>¿Dudas? Escríbenos</span><b>925 552 042</b></div>
        </a>
      </div>
    </header>
  )
}
