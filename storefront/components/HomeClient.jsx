'use client'
import { useState, useEffect, useRef, Fragment } from 'react'
import Link from 'next/link'
import {
  Truck, Headset, ChevronLeft, ChevronRight, Shield,
  Star, Cart, ShieldCheck, Zap, Lock, Heart, ArrowRight,
} from './Icons.jsx'
import { ProductImage } from './imageMap.jsx'
import { peso } from '../lib/catalog.js'
import { useCart } from './CartProvider.jsx'
import ProductCard from './ProductCard.jsx'

const COVER = { objectFit: 'cover', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }

/* ---------------- HERO ---------------- */
const heroChips = ['Garantía oficial', 'Envío gratis +S/ 200', 'Cuotas sin intereses']
const heroSlides = [
  { theme: 'blue', badgeStyle: 'gold', badge: 'CYBERWEEK — Hasta 40% OFF', title: <>Tintas y Tóner<br />al mejor precio<br />del Perú</>, sub: 'HP, Epson, Canon, Brother y más marcas con garantía oficial. Envío a todo el país.', cta: 'Ver Tintas', to: '/categoria/tintas', img: '/img/photo-1612815154858-60aa4c59eaa6.jpg' },
  { theme: 'orange', badgeStyle: 'white', badge: 'NUEVA COLECCIÓN 2024', title: <>Laptops HP, Dell<br />y Lenovo desde<br />S/ 1,899</>, sub: 'Procesadores Intel Core i5 e i7 de 12ª y 13ª generación. Cuotas sin intereses.', cta: 'Ver Laptops', to: '/categoria/laptops-pc', img: '/img/photo-1517336714731-489689fd1ca8.jpg' },
  { theme: 'green', badgeStyle: 'white', badge: 'STOCK DISPONIBLE', title: <>Tóner original<br />para impresoras<br />laser</>, sub: 'HP, Samsung, Brother y Epson. Entrega en 24 horas en Lima.', cta: 'Ver Tóner', to: '/categoria/toner', img: '/img/photo-1586953208448-b95a79798f07.jpg' },
]
const bannerToSlide = (b) => ({ img: b.image, to: b.link || '/productos', alt: b.title || b.badge || 'Banner' })

const Hero = ({ heroBanners }) => {
  const slides = heroBanners.length
    ? heroBanners.map(bannerToSlide)
    : heroSlides.map((s) => ({ img: s.img, to: s.to, alt: 'Banner' }))
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = slides.length
  const go = (k) => setI((k + n) % n)
  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => setI((x) => (x + 1) % n), 6000)
    return () => clearInterval(id)
  }, [paused, n])
  const cur = n ? ((i % n) + n) % n : 0
  return (
    <section className="hero-banner">
      <div className="container">
        <div className="hb-viewport" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="hb-track" style={{ transform: `translateX(-${cur * 100}%)` }}>
            {slides.map((s, idx) => (
              <Link className="hb-slide" href={s.to} key={idx} aria-hidden={idx !== cur} tabIndex={idx === cur ? 0 : -1}>
                <img src={s.img} alt={s.alt} />
              </Link>
            ))}
          </div>
          {n > 1 && (
            <>
              <button className="hb-arrow left" onClick={() => go(i - 1)} aria-label="Anterior"><ChevronLeft size={20} /></button>
              <button className="hb-arrow right" onClick={() => go(i + 1)} aria-label="Siguiente"><ChevronRight size={20} /></button>
              <div className="hb-dots">
                {slides.map((_, idx) => <button key={idx} className={idx === cur ? 'on' : ''} onClick={() => go(idx)} aria-label={`Ir a la diapositiva ${idx + 1}`} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------- FEATURES ---------------- */
const features = [
  { icon: <Truck size={20} />, color: '#2563eb', title: 'Envío gratis', sub: 'En pedidos +S/ 200' },
  { icon: <ShieldCheck size={20} />, color: '#16a34a', title: 'Garantía oficial', sub: '12 meses de cobertura' },
  { icon: <Zap size={20} />, color: '#f59e0b', title: 'Entrega rápida', sub: 'Lima: 24-48 horas' },
  { icon: <Headset size={20} />, color: '#a855f7', title: 'Soporte 24/7', sub: 'Chat y teléfono' },
  { icon: <Lock size={20} />, color: '#0ea5e9', title: 'Pagos seguros', sub: 'con Mercado Pago' },
]
const Features = () => (
  <section className="features-bar"><div className="container"><div className="features2">
    {features.map((f) => (
      <div className="feature2" key={f.title}><div className="feature2-ic" style={{ color: f.color }}>{f.icon}</div><div><b>{f.title}</b><span>{f.sub}</span></div></div>
    ))}
  </div></div></section>
)

/* ---------------- CARRUSEL HORIZONTAL ---------------- */
function Carousel({ children, className = '' }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 600, behavior: 'smooth' })
  return (
    <div className="carousel-wrap">
      <button className="car-arrow left" onClick={() => scroll(-1)} aria-label="Anterior"><ChevronLeft size={18} /></button>
      <div className={`carousel ${className}`} ref={ref}>{children}</div>
      <button className="car-arrow right" onClick={() => scroll(1)} aria-label="Siguiente"><ChevronRight size={18} /></button>
    </div>
  )
}

/* ---------------- CATEGORÍAS ---------------- */
const Categorias = ({ categorias }) => (
  <section className="section-white"><div className="container">
    <h2 className="home-h2">Categorías</h2>
    <Carousel className="cat-car">
      {categorias.map((c) => (
        <Link className="cat-tile" key={c.name} href={c.to}>
          <div className="cat-tile-thumb"><ProductImage image={c.image} alt={c.name} style={COVER} /></div>
          <b>{c.name}</b>
        </Link>
      ))}
    </Carousel>
  </div></section>
)

/* ---------------- OFERTAS FLASH ---------------- */
function useCountdown(initial = { h: 3, m: 45, s: 22 }) {
  const [t, setT] = useState(initial.h * 3600 + initial.m * 60 + initial.s)
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x <= 0 ? 0 : x - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const pad = (n) => String(n).padStart(2, '0')
  return { h: pad(Math.floor(t / 3600)), m: pad(Math.floor((t % 3600) / 60)), s: pad(t % 60) }
}
const FlashCard = ({ p }) => {
  const { addToCart } = useCart()
  const pct = Math.min(95, Math.max(12, 100 - p.stock * 6))
  const to = `/producto/${p.slug}`
  return (
    <div className="fcard">
      <Link href={to} className="fcard-media" aria-label={`Ver ${p.name}`}>
        <div className="fcard-img"><ProductImage image={p.image} tint={p.tint} label={p.label} alt={p.name} style={COVER} /></div>
        <span className="fcard-badge"><Zap size={11} /> -{p.off}%</span>
        <div className="fcard-stockbar"><i style={{ width: `${pct}%` }} /></div>
        <span className="fcard-stock">Solo {p.stock} disponibles</span>
      </Link>
      <div className="pcard-body">
        <span className="pcard-brand">{p.brand}</span>
        <Link href={to} className="fcard-name">{p.name}</Link>
        <div className="pcard-price"><span className="now">{peso(p.price).replace('.00', '')}</span><span className="old">{peso(p.oldPrice).replace('.00', '')}</span></div>
        <button className="pcard-add" onClick={() => addToCart(p)}><Cart size={14} /> Agregar al carrito</button>
      </div>
    </div>
  )
}
const OfertasFlash = ({ items }) => {
  const { h, m, s } = useCountdown()
  if (!items || !items.length) return null
  return (
    <section className="flash-sec"><div className="container">
      <div className="flash-head2">
        <span className="flash-pill"><Zap size={16} fill="currentColor" /> Ofertas Flash</span>
        <span className="flash-timer2">Termina en <b>{h}</b><i>:</i><b>{m}</b><i>:</i><b>{s}</b></span>
        <Link className="flash-all" href="/ofertas">Ver todas <ChevronRight size={15} /></Link>
      </div>
      <Carousel className="flash-car">{items.map((p) => <FlashCard key={p.id} p={p} />)}</Carousel>
    </div></section>
  )
}

/* ---------------- SECCIONES DE PRODUCTOS + PROMOS ---------------- */
const ProductSection = ({ title, items, to }) => (
  <section className="section-white"><div className="container">
    <div className="psec-head"><h2 className="home-h2">{title}</h2><Link className="psec-all" href={to}>Ver todos <ChevronRight size={15} /></Link></div>
    <Carousel className="pcard-car">{items.map((p) => <ProductCard key={p.id} p={p} />)}</Carousel>
  </div></section>
)

// Banner promocional = la imagen COMPLETA y nítida (sin texto superpuesto ni
// difuminado), igual que el hero. El diseño va dentro de la propia imagen.
const Promo = ({ to, bg, alt }) => (
  <Link className="promo-banner" href={to}>
    <img src={bg} alt={alt} loading="lazy" />
  </Link>
)
const PromoRow = ({ items, last }) => {
  const promos = (items || []).filter((b) => b && b.image)
  if (!promos.length) return null
  const cls = promos.length >= 3 ? 'promo-trio' : promos.length === 2 ? 'promo-pair' : 'promo-solo'
  return (
    <section className={`section2${last ? ' last-sec' : ''}`}><div className="container"><div className={`promo-row ${cls}`}>
      {promos.map((b, i) => <Promo key={b.id ?? i} to={b.link || '/productos'} bg={b.image} alt={b.title || b.badge || 'Promoción'} />)}
    </div></div></section>
  )
}

export default function HomeClient({ heroBanners = [], promos = [], sections = [], flash = [], categorias = [] }) {
  const per = sections.length ? Math.ceil(promos.length / sections.length) : promos.length
  return (
    <>
      <Hero heroBanners={heroBanners} />
      <Features />
      <Categorias categorias={categorias} />
      <OfertasFlash items={flash} />
      {sections.map((sec, i) => (
        <Fragment key={sec.slug || sec.title}>
          <PromoRow items={promos.slice(i * per, i * per + per)} />
          <ProductSection title={sec.title} items={sec.items} to={sec.to} />
        </Fragment>
      ))}
      <PromoRow items={promos.slice(sections.length * per)} last />
    </>
  )
}
