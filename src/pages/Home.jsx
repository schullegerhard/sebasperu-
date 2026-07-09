import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck, Headset, ChevronLeft, ChevronRight, Shield,
  Star, Cart, ShieldCheck, Zap, Lock, Heart, ArrowRight,
} from '../components/Icons.jsx'
import { ProductImage } from '../components/imageMap.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { useBanners } from '../context/ProductOverrides.jsx'
import { useSeo } from '../lib/seo.js'
import { peso } from '../data/catalog.js'
import { productSlug } from '../data/storefront.js'
import {
  homeCategories, flashOffers, homeImpresoras, homeToner, homeTintas, homeLaptops,
} from '../data/home.js'

// Estilo para que las fotos llenen su contenedor (como en el diseño).
const COVER = { objectFit: 'cover', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }

/* ---------------- HERO (carrusel del diseño) ---------------- */
const heroChips = ['Garantía oficial', 'Envío gratis +S/ 200', 'Cuotas sin intereses']

const heroSlides = [
  {
    theme: 'blue', badgeStyle: 'gold', badge: 'CYBERWEEK — Hasta 40% OFF',
    title: <>Tintas y Tóner<br />al mejor precio<br />del Perú</>,
    sub: 'HP, Epson, Canon, Brother y más marcas con garantía oficial. Envío a todo el país.',
    cta: 'Ver Tintas', to: '/categoria/tintas',
    img: '/img/photo-1612815154858-60aa4c59eaa6.jpg',
  },
  {
    theme: 'orange', badgeStyle: 'white', badge: 'NUEVA COLECCIÓN 2024',
    title: <>Laptops HP, Dell<br />y Lenovo desde<br />S/ 1,899</>,
    sub: 'Procesadores Intel Core i5 e i7 de 12ª y 13ª generación. Cuotas sin intereses.',
    cta: 'Ver Laptops', to: '/categoria/laptops-pc',
    img: '/img/photo-1517336714731-489689fd1ca8.jpg',
  },
  {
    theme: 'green', badgeStyle: 'white', badge: 'STOCK DISPONIBLE',
    title: <>Tóner original<br />para impresoras<br />laser</>,
    sub: 'HP, Samsung, Brother y Epson. Entrega en 24 horas en Lima.',
    cta: 'Ver Tóner', to: '/categoria/toner',
    img: '/img/photo-1586953208448-b95a79798f07.jpg',
  },
]

// Convierte un banner del admin al formato de diapositiva del carrusel.
const bannerToSlide = (b) => ({
  theme: b.theme || 'blue',
  badgeStyle: (!b.theme || b.theme === 'blue') ? 'gold' : 'white',
  badge: b.badge,
  title: b.title,
  sub: b.subtitle,
  cta: b.cta || 'Ver más',
  to: b.link || '/productos',
  img: b.image,
})

const Hero = () => {
  // Banners gestionados en el admin (activos, ubicación = carrusel); si no hay, usa los del diseño.
  const managed = useBanners().filter((b) => b && b.active && (b.slot || 'hero') === 'hero')
  const slides = managed.length ? managed.map(bannerToSlide) : heroSlides
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = slides.length
  const go = (k) => setI((k + n) % n)
  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => setI((x) => (x + 1) % n), 6000)
    return () => clearInterval(id)
  }, [paused, n])

  const cur = n ? ((i % n) + n) % n : 0  // índice seguro si cambia el nº de banners

  return (
    <section className="hero3">
      <div className="container">
        <div className="hero3-inner" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="hero3-track" style={{ transform: `translateX(-${cur * 100}%)` }}>
            {slides.map((s, idx) => (
              <div className={`hero3-slide t-${s.theme}`} key={idx} aria-hidden={idx !== cur}>
                <div className="hero3-content">
                  {s.badge && <span className={`hero3-badge ${s.badgeStyle}`}><Zap size={14} /> {s.badge}</span>}
                  <h1>{s.title}</h1>
                  <p>{s.sub}</p>
                  <div className="hero3-btns">
                    <Link className="hero3-btn primary" to={s.to} tabIndex={idx === cur ? 0 : -1}>{s.cta} <ArrowRight size={16} /></Link>
                    <Link className="hero3-btn ghost" to="/productos" tabIndex={idx === cur ? 0 : -1}>Ver todo</Link>
                  </div>
                  <div className="hero3-chips">
                    {heroChips.map((c) => <span className="hero3-chip" key={c}><Shield size={11} /> {c}</span>)}
                  </div>
                </div>
                <div className="hero3-art"><div className="hero3-card"><ProductImage image={s.img} alt="" style={{ objectFit: 'cover', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }} /></div></div>
              </div>
            ))}
          </div>
          <button className="hero3-arrow left" onClick={() => go(i - 1)} aria-label="Anterior"><ChevronLeft size={20} /></button>
          <button className="hero3-arrow right" onClick={() => go(i + 1)} aria-label="Siguiente"><ChevronRight size={20} /></button>
          <div className="hero3-dots">
            {slides.map((_, idx) => (
              <button key={idx} className={idx === cur ? 'on' : ''} onClick={() => go(idx)} aria-label={`Ir a la diapositiva ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- FEATURES (5 ítems del diseño) ---------------- */
const features = [
  { icon: <Truck size={20} />, color: '#2563eb', title: 'Envío gratis', sub: 'En pedidos +S/ 200' },
  { icon: <ShieldCheck size={20} />, color: '#16a34a', title: 'Garantía oficial', sub: '12 meses de cobertura' },
  { icon: <Zap size={20} />, color: '#f59e0b', title: 'Entrega rápida', sub: 'Lima: 24-48 horas' },
  { icon: <Headset size={20} />, color: '#a855f7', title: 'Soporte 24/7', sub: 'Chat y teléfono' },
  { icon: <Lock size={20} />, color: '#0ea5e9', title: 'Pagos seguros', sub: 'con MercadoPago' },
]
const Features = () => (
  <section className="features-bar">
    <div className="container">
      <div className="features2">
        {features.map((f) => (
          <div className="feature2" key={f.title}>
            <div className="feature2-ic" style={{ color: f.color }}>{f.icon}</div>
            <div><b>{f.title}</b><span>{f.sub}</span></div>
          </div>
        ))}
      </div>
    </div>
  </section>
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

/* ---------------- CATEGORÍAS (scroller horizontal) ---------------- */
const Categorias = () => (
  <section className="section-white">
    <div className="container">
      <h2 className="home-h2">Categorías</h2>
      <Carousel className="cat-car">
        {homeCategories.map((c) => (
          <Link className="cat-tile" key={c.name} to={c.to}>
            <div className="cat-tile-thumb"><ProductImage image={c.image} style={COVER} /></div>
            <b>{c.name}</b>
          </Link>
        ))}
      </Carousel>
    </div>
  </section>
)

/* ---------------- OFERTAS FLASH (con countdown) ---------------- */
function useCountdown(initial = { h: 3, m: 45, s: 22 }) {
  const [t, setT] = useState(initial.h * 3600 + initial.m * 60 + initial.s)
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x <= 0 ? 0 : x - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const pad = (n) => String(n).padStart(2, '0')
  return { h: pad(Math.floor(t / 3600)), m: pad(Math.floor((t % 3600) / 60)), s: pad(t % 60) }
}

/* Estrellas de valoración (doradas). */
const Stars = ({ value = 5 }) => (
  <span className="pc-stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} style={{ opacity: i < Math.round(value) ? 1 : .3 }} />)}</span>
)

/* Tarjeta de Oferta Flash: imagen con badge + barra de stock. */
const FlashCard = ({ p }) => {
  const { addToCart } = useStore()
  const pct = Math.min(95, Math.max(12, 100 - p.stock * 6))
  const to = `/producto/${productSlug(p.name)}`
  return (
    <div className="fcard">
      <Link to={to} className="fcard-media">
        <div className="fcard-img"><ProductImage image={p.image} tint={p.tint} label={p.label} seed={p.id} brand={p.brand} style={COVER} /></div>
        <span className="fcard-badge"><Zap size={11} /> -{p.off}%</span>
        <div className="fcard-stockbar"><i style={{ width: `${pct}%` }} /></div>
        <span className="fcard-stock">Solo {p.stock} disponibles</span>
      </Link>
      <div className="pcard-body">
        <span className="pcard-brand">{p.brand}</span>
        <Link to={to} className="fcard-name">{p.name}</Link>
        <div className="pcard-price"><span className="now">{peso(p.price).replace('.00', '')}</span><span className="old">{peso(p.oldPrice).replace('.00', '')}</span></div>
        <button className="pcard-add" onClick={() => addToCart(p)}><Cart size={14} /> Agregar al carrito</button>
      </div>
    </div>
  )
}

const OfertasFlash = () => {
  const { h, m, s } = useCountdown()
  return (
    <section className="flash-sec">
      <div className="container">
        <div className="flash-head2">
          <span className="flash-pill"><Zap size={16} fill="currentColor" /> Ofertas Flash</span>
          <span className="flash-timer2">Termina en <b>{h}</b><i>:</i><b>{m}</b><i>:</i><b>{s}</b></span>
          <Link className="flash-all" to="/ofertas">Ver todas <ChevronRight size={15} /></Link>
        </div>
        <Carousel className="flash-car">
          {flashOffers.map((p) => <FlashCard key={p.id} p={p} />)}
        </Carousel>
      </div>
    </section>
  )
}

/* Tarjeta de producto del diseño. */
const ProductCardHome = ({ p }) => {
  const { addToCart } = useStore()
  const to = `/producto/${productSlug(p.name)}`
  return (
    <div className="pcard">
      {p.badge ? <span className="pcard-badge nuevo">{p.badge}</span> : p.off ? <span className="pcard-badge disc">-{p.off}%</span> : null}
      <button className="pcard-fav" aria-label="Favorito"><Heart size={16} /></button>
      <Link to={to} className="pcard-thumb"><ProductImage image={p.image} tint={p.tint} label={p.label} seed={p.id} brand={p.brand} style={COVER} /></Link>
      <div className="pcard-body">
        <span className="pcard-brand">{p.brand}</span>
        <Link to={to} className="pcard-name">{p.name}</Link>
        <div className="pcard-price"><span className="now">{peso(p.price).replace('.00', '')}</span>{p.oldPrice && <span className="old">{peso(p.oldPrice).replace('.00', '')}</span>}</div>
        <button className="pcard-add" onClick={() => addToCart(p)}><Cart size={14} /> Agregar al carrito</button>
      </div>
    </div>
  )
}

const ProductSection = ({ title, items, to }) => (
  <section className="section-white">
    <div className="container">
      <div className="psec-head">
        <h2 className="home-h2">{title}</h2>
        <Link className="psec-all" to={to}>Ver todos <ChevronRight size={15} /></Link>
      </div>
      <div className="pcard-grid">{items.map((p) => <ProductCardHome key={p.id} p={p} />)}</div>
    </div>
  </section>
)

// Foto de fondo desvanecida para los banners (mismas fotos del diseño).
const bnr = (id) => `/img/${id}.jpg`

/* Banner promocional (par/trío). */
const Promo = ({ theme, eyebrow, title, accent, sub, btn, to, bg }) => (
  <Link className={`promo3 t-${theme}`} to={to}>
    {bg && <img className="promo3-bg" src={bg} alt="" loading="lazy" />}
    <span className="promo3-eyebrow">{eyebrow}</span>
    <h3 className="promo3-title">{title}</h3>
    {accent && <div className="promo3-accent">{accent}</div>}
    <p className="promo3-sub">{sub}</p>
    <span className="promo3-btn">{btn} <ChevronRight size={14} /></span>
  </Link>
)

const BannerImpresion = () => (
  <section className="section2"><div className="container"><div className="promo3-pair">
    <Promo theme="blue" eyebrow="ESPECIAL IMPRESIÓN" title="Impresoras HP" accent="desde S/ 299" sub="Inkjet, multifunción y tanque de tinta" btn="Ver impresoras" to="/categoria/impresoras" bg={bnr('photo-1612815154858-60aa4c59eaa6')} />
    <Promo theme="dark" eyebrow="IMPRESIÓN LÁSER" title="Tóner original" accent="hasta 40% OFF" sub="HP, Samsung, Brother y Epson" btn="Ver tóner" to="/categoria/toner" bg={bnr('photo-1586953208448-b95a79798f07')} />
  </div></div></section>
)

const BannerToner = () => (
  <section className="section2"><div className="container"><div className="promo3-pair">
    <Promo theme="blue" eyebrow="TÓNER ORIGINAL" title="Tóner HP LaserJet" accent="desde S/ 145" sub="85A · 35A · 78A · 12A — stock disponible" btn="Ver tóner HP" to="/categoria/toner" bg={bnr('photo-1586953208448-b95a79798f07')} />
    <Promo theme="green" eyebrow="TÓNER COMPATIBLE" title="Samsung · Brother" accent="hasta 35% OFF" sub="MLT-D101S · TN-1060 · TN-760 — garantía oficial" btn="Ver tóner" to="/categoria/toner" bg={bnr('photo-1612815154858-60aa4c59eaa6')} />
  </div></div></section>
)

const BannerTintas = () => (
  <section className="section2"><div className="container">
    <Link className="promo3-wide t-blue" to="/categoria/tintas">
      <div>
        <span className="promo3-eyebrow">TINTAS PARA IMPRESORA</span>
        <h3 className="promo3-title">HP · Epson · Canon · Brother — <em>hasta 25% OFF</em></h3>
        <p className="promo3-sub">Originales y compatibles. Envío gratis en pedidos +S/ 200.</p>
      </div>
      <span className="promo3-btn solid">Ver tintas <ChevronRight size={14} /></span>
    </Link>
  </div></section>
)

const BannerLaptops = () => (
  <section className="section2"><div className="container"><div className="promo3-trio">
    <Promo theme="blue" eyebrow="LAPTOPS HP" title="HP Pavilion" accent="desde S/ 1,899" sub="Intel Core i5 · i7 — 8GB a 16GB RAM" btn="Ver HP" to="/categoria/laptops-pc" bg={bnr('photo-1517336714731-489689fd1ca8')} />
    <Promo theme="purple" eyebrow="LAPTOPS LENOVO" title="IdeaPad · ThinkPad" accent="desde S/ 1,799" sub="AMD Ryzen 5 · 7 — hasta 32GB RAM" btn="Ver Lenovo" to="/categoria/laptops-pc" bg={bnr('photo-1496181133206-80ce9b88a853')} />
    <Promo theme="navy" eyebrow="LAPTOPS DELL" title="Inspiron · Vostro" accent="desde S/ 2,299" sub="Intel Core i7 · i9 — SSD NVMe 512GB" btn="Ver Dell" to="/categoria/laptops-pc" bg={bnr('photo-1593642632559-0c6d3fc62b89')} />
  </div></div></section>
)

const BannerEspecial = () => (
  <section className="section2 last-sec"><div className="container">
    <div className="promo-special">
      <div>
        <span className="promo3-eyebrow">OFERTA ESPECIAL</span>
        <h3 className="promo-special-title">Tóner HP desde S/ 145</h3>
        <p className="promo3-sub">Stock disponible. Compatibles con HP LaserJet, Samsung y Brother.</p>
      </div>
      <Link className="promo-special-btn" to="/categoria/toner">Ver tóner <ArrowRight size={16} /></Link>
    </div>
  </div></section>
)

// Fila de bloques promocionales gestionados desde el admin (Banners → «Bloque promocional»).
const PromoRow = ({ items, last }) => {
  if (!items || !items.length) return null
  const cls = items.length >= 3 ? 'promo3-trio' : items.length === 2 ? 'promo3-pair' : 'promo3-solo'
  return (
    <section className={`section2${last ? ' last-sec' : ''}`}><div className="container"><div className={cls}>
      {items.map((b, i) => (
        <Promo key={b.id ?? i} theme={b.theme} eyebrow={b.badge} title={b.title}
          accent={b.accent} sub={b.subtitle} btn={b.cta || 'Ver más'} to={b.link || '/productos'} bg={b.image} />
      ))}
    </div></div></section>
  )
}

// Banners promocionales del diseño (respaldo cuando el admin no tiene ninguno).
const DesignPromos = () => (
  <>
    <BannerImpresion />
    <ProductSection title="Impresoras" items={homeImpresoras} to="/categoria/impresoras" />
    <BannerToner />
    <ProductSection title="Tóner para Impresora" items={homeToner} to="/categoria/toner" />
    <BannerTintas />
    <ProductSection title="Tintas para Impresora" items={homeTintas} to="/categoria/tintas" />
    <BannerLaptops />
    <ProductSection title="Laptops" items={homeLaptops} to="/categoria/laptops-pc" />
    <BannerEspecial />
  </>
)

// Banners promocionales gestionados: se intercalan con las secciones de productos.
// El orden de las tarjetas (arriba→abajo) es el del panel; se reparten en las filas.
const ManagedPromos = ({ promos }) => (
  <>
    <PromoRow items={promos.slice(0, 2)} />
    <ProductSection title="Impresoras" items={homeImpresoras} to="/categoria/impresoras" />
    <PromoRow items={promos.slice(2, 4)} />
    <ProductSection title="Tóner para Impresora" items={homeToner} to="/categoria/toner" />
    <PromoRow items={promos.slice(4, 6)} />
    <ProductSection title="Tintas para Impresora" items={homeTintas} to="/categoria/tintas" />
    <PromoRow items={promos.slice(6, 9)} />
    <ProductSection title="Laptops" items={homeLaptops} to="/categoria/laptops-pc" />
    <PromoRow items={promos.slice(9)} last />
  </>
)

export default function Home() {
  useSeo({
    title: 'Tecnología que impulsa tu negocio',
    description: 'SebasPeru — Impresoras, tóner, tintas, laptops y accesorios de las mejores marcas. Ventas corporativas, factura electrónica y envíos a todo el Perú.',
    path: '/',
  })
  const promos = useBanners().filter((b) => b && b.active && b.slot === 'promo')
  return (
    <>
      <Hero />
      <Features />
      <Categorias />
      <OfertasFlash />
      {promos.length ? <ManagedPromos promos={promos} /> : <DesignPromos />}
    </>
  )
}
