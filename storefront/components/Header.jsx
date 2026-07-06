'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Truck, Building, MapPin, Search, User, Cart, Menu, ChevronDown, Heart, Tag,
} from './Icons.jsx'
import { ProductImage } from './imageMap.jsx'
import { products, categories, peso } from '../lib/catalog.js'
import { useCart } from './CartProvider.jsx'

const Logo = ({ variant = 'inner' }) => (
  <Link href="/" className="logo" aria-label="SEBASTPERU — Inicio">
    <img src="/logo.png" alt="SEBASTPERU — Suministros y Tecnología" className="logo-img" width="190" height="44" />
  </Link>
)

const navLinks = [
  { label: 'INICIO', href: '/' },
  { label: 'OFERTAS', href: '/ofertas', hot: true },
  { label: 'IMPRESORAS', href: '/categoria/impresoras' },
  { label: 'TÓNER', href: '/categoria/toner' },
  { label: 'TINTAS', href: '/categoria/tintas' },
  { label: 'LAPTOPS & PC', href: '/categoria/laptops-pc' },
  { label: 'ACCESORIOS', href: '/categoria/accesorios' },
  { label: 'MARCAS', href: '/marcas' },
]

const homeNavLinks = [
  { label: 'IMPRESORAS', href: '/categoria/impresoras' },
  { label: 'TÓNER', href: '/categoria/toner' },
  { label: 'TINTAS', href: '/categoria/tintas' },
  { label: 'OFERTAS', href: '/ofertas', red: true },
]

export default function Header() {
  const { count, total } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const boxRef = useRef(null)

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (t.length < 2) return []
    return products.filter((p) => p.name.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t)).slice(0, 6)
  }, [q])

  useEffect(() => {
    const onClick = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const submit = (e) => { e.preventDefault(); if (q.trim()) { router.push(`/buscar?q=${encodeURIComponent(q)}`); setOpen(false) } }
  const variant = pathname === '/' ? 'home' : 'inner'

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span className="topbar-item"><Truck size={15} /> Envío gratis desde S/299</span>
          <Link href="/cotizacion" className="topbar-item center"><Building size={15} /> Ventas Corporativas</Link>
          <span className="topbar-item"><MapPin size={15} /> Lima - Perú</span>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <Logo variant={variant} />
          <form className="searchbar" onSubmit={submit} ref={boxRef} role="search">
            <div className="sb-field">
              <input placeholder={variant === 'home' ? 'Buscar productos, marcas y más...' : '¿Qué estás buscando? (nombre, SKU, marca, modelo)'} value={q}
                onChange={(e) => { setQ(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} aria-label="Buscar" />
              <span className="search-cat">Todas las categorías <ChevronDown size={15} /></span>
            </div>
            {variant === 'home'
              ? <button className="search-go icon" type="submit" aria-label="Buscar"><Search size={20} /></button>
              : <button className="search-go" type="submit"><Search size={18} /> <span>Buscar</span></button>}
            {open && results.length > 0 && (
              <div className="search-dropdown">
                {results.map((p) => (
                  <Link key={p.id} href={`/producto/${p.slug}`} className="search-result" onClick={() => setOpen(false)}>
                    <div className="sr-thumb"><ProductImage image={p.image} /></div>
                    <div className="sr-info"><b>{p.name}</b><span>{p.brand} · SKU {p.sku}</span></div>
                    <span className="sr-price">{peso(p.price)}</span>
                  </Link>
                ))}
              </div>
            )}
          </form>
          <div className="header-actions">
            {variant === 'home' && (
              <Link href="/ofertas" className="header-action promo-action"><Tag size={19} /><span>Promociones</span></Link>
            )}
            <Link href="/cuenta" className="header-action acc-action"><User size={22} /><span className="ha-col"><small>Mi cuenta</small><b>Iniciar sesión</b></span></Link>
            {variant !== 'home' && (
              <Link href="/cuenta" className="header-action fav-action"><Heart size={22} /><span className="ha-lbl">Favoritos</span></Link>
            )}
            <Link href="/carrito" className="header-action cart-action">
              <span className="cart-ic"><Cart size={23} /><span className="cart-badge">{count}</span></span>
              <span className="ha-col"><small>Carrito</small><b>{peso(total)}</b></span>
            </Link>
          </div>
        </div>
      </header>

      {variant === 'home' ? (
        <nav className="nav nav-home">
          <div className="container">
            <div className="nav-links">
              {homeNavLinks.map((l) => (
                <Link key={l.label} href={l.href} className={`nav-link ${l.red ? 'red' : ''}`}>{l.label}</Link>
              ))}
            </div>
          </div>
        </nav>
      ) : (
      <nav className="nav">
        <div className="container">
          <div className="nav-all-wrap" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button className="nav-all"><Menu size={16} /> TODAS LAS CATEGORÍAS <ChevronDown size={14} /></button>
            {mega && (
              <div className="mega-menu">
                {categories.map((c) => (
                  <div className="mega-col" key={c.slug}>
                    <Link href={`/categoria/${c.slug}`} className="mega-cat">{c.name}</Link>
                    <ul>{c.subcategories.map((s) => <li key={s.slug}><Link href={`/categoria/${c.slug}?sub=${s.slug}`}>{s.name}</Link></li>)}</ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="nav-links">
            {navLinks.map((l) => {
              const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
              return (
                <Link key={l.label} href={l.href} className={`nav-link ${active ? 'active' : ''}`}>
                  {l.label}{l.hot && <span className="hot-badge">HOT</span>}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      )}
    </>
  )
}
