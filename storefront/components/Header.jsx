'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Truck, MapPin, Search, Cart, ChevronDown,
  ShieldCheck, Phone, Tag, Mail, Zap, Menu, X,
} from './Icons.jsx'
import { ProductImage } from './imageMap.jsx'
import { products, peso } from '../lib/catalog.js'
import { MENU_TREE } from '../lib/menu.js'
import { useCart } from './CartProvider.jsx'
import { getCustomer } from '../lib/client.js'

export const Logo = () => (
  <Link href="/" className="logo" aria-label="SEBASTPERU — Inicio">
    <img src="/logo.png" alt="SEBASTPERU — Suministros y Tecnología" className="logo-img" width="190" height="44" />
  </Link>
)

const TopBar = () => (
  <div className="topbar">
    <div className="container">
      <div className="tb-left">
        <span className="tb-item"><Phone size={14} /> (01) 700-4000</span>
        <span className="tb-item"><Mail size={14} /> ventas@sebasperu.com</span>
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

function PredictiveSearch() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const router = useRouter()

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (term.length < 2) return []
    return products
      .filter((p) =>
        (p.name || '').toLowerCase().includes(term) || (p.sku || '').toLowerCase().includes(term) ||
        (p.brand || '').toLowerCase().includes(term) || (p.model || '').toLowerCase().includes(term))
      .slice(0, 6)
  }, [q])

  useEffect(() => {
    const onClick = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    router.push(`/buscar?q=${encodeURIComponent(q)}`)
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
            <Link key={p.id} href={`/producto/${p.slug}`} className="search-result" onClick={() => setOpen(false)}>
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

const MainHeader = ({ onMenu }) => {
  const { count, total } = useCart()
  const [customer, setCustomer] = useState(null)
  useEffect(() => {
    const sync = () => setCustomer(getCustomer())
    sync()
    window.addEventListener('sp-auth', sync)
    return () => window.removeEventListener('sp-auth', sync)
  }, [])
  return (
    <header className="header">
      <div className="container">
        <button type="button" className="hdr-burger" onClick={onMenu} aria-label="Abrir menú"><Menu size={22} /></button>
        <Logo />
        <PredictiveSearch />
        <div className="header-actions">
          {customer ? (
            <Link href="/cuenta" className="acc-link"><small>Mi cuenta</small><b>Hola, {(customer.name || '').split(' ')[0]}</b></Link>
          ) : (
            <>
              <Link href="/cuenta" className="acc-link">
                <small>¿Ya tienes cuenta?</small>
                <b>Inicia sesión</b>
              </Link>
              <Link href="/cuenta" className="btn-register">Regístrate</Link>
            </>
          )}
          <Link href="/carrito" className="cart-action">
            <span className="cart-ic">
              <Cart size={20} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </span>
            <span className="ca-col"><small>MI CARRITO</small><b>{peso(total).replace('.00', '')}</b></span>
          </Link>
        </div>
      </div>
    </header>
  )
}

const MEGA_MENU = MENU_TREE

function NavItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="nav2-item" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link href={item.to} className="nav2-link">{item.name} <ChevronDown size={13} className={open ? 'up' : ''} /></Link>
      {open && (
        <div className="nav2-mega" style={{ minWidth: 180 * item.cols.length }}>
          {item.cols.map((col) => (
            <div className="nav2-mega-col" key={col.title}>
              <p className="nav2-mega-title">{col.groupSlug ? <Link href={`/categoria/${col.groupSlug}`}>{col.title}</Link> : col.title}</p>
              <ul>{col.items.map(([slug, name]) => <li key={slug}><Link href={`/categoria/${slug}`}>{name}</Link></li>)}</ul>
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
      <Link href="/ofertas" className="nav2-ofertas"><Tag size={15} /> OFERTAS</Link>
    </div>
  </nav>
)

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
          <Link href="/productos" className="mnav-top" onClick={onClose}>Todos los productos</Link>
          {MEGA_MENU.map((item) => {
            const isOpen = expanded === item.slug
            return (
              <div className="mnav-group" key={item.slug}>
                <div className="mnav-row">
                  <Link href={item.to} className="mnav-cat" onClick={onClose}>{item.name}</Link>
                  <button className="mnav-exp" onClick={() => setExpanded(isOpen ? null : item.slug)} aria-label={`Ver subcategorías de ${item.name}`}>
                    <ChevronDown size={16} className={isOpen ? 'up' : ''} />
                  </button>
                </div>
                {isOpen && (
                  <div className="mnav-subs">
                    {item.cols.map((col) => (
                      <div className="mnav-subcol" key={col.title}>
                        <p className="mnav-subtitle">{col.groupSlug ? <Link href={`/categoria/${col.groupSlug}`} onClick={onClose}>{col.title}</Link> : col.title}</p>
                        {col.items.map(([slug, name]) => <Link key={slug} href={`/categoria/${slug}`} className="mnav-sub" onClick={onClose}>{name}</Link>)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <Link href="/ofertas" className="mnav-top ofertas" onClick={onClose}><Tag size={15} /> OFERTAS</Link>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="site-header">
      <TopBar />
      <MainHeader onMenu={() => setMenuOpen(true)} />
      <Nav />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
