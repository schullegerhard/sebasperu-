import { useState, useEffect, useRef, Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck, Headset, ChevronLeft, ChevronRight, Shield,
  Star, Cart, ShieldCheck, Zap, Lock, Heart, ArrowRight,
} from '../components/Icons.jsx'
import { ProductImage } from '../components/imageMap.jsx'
import { TruckImg, ShieldImg, BoltImg, HeadsetImg, PayImg } from '../components/FeatureIcons.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { useBanners, useStorefrontProducts, useHasRealCatalog, useApiCategories, descendantSlugs } from '../context/ProductOverrides.jsx'
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

// Banner estilo Dataplus: la imagen DISEÑADA ocupa todo el ancho (el texto va
// dentro del arte). Solo flechas y puntos encima; sin texto de la app.
const bannerToSlide = (b) => ({ img: b.image, to: b.link || '/productos', alt: b.title || b.badge || 'Banner' })

const Hero = () => {
  // Banners gestionados en el admin (activos, ubicación = carrusel); si no hay, usa los del diseño.
  const managed = useBanners().filter((b) => b && b.active && (b.slot || 'hero') === 'hero')
  const slides = managed.length
    ? managed.map(bannerToSlide)
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

  const cur = n ? ((i % n) + n) % n : 0  // índice seguro si cambia el nº de banners

  return (
    <section className="hero-banner">
      <div className="hb-viewport" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="hb-track" style={{ transform: `translateX(-${cur * 100}%)` }}>
          {slides.map((s, idx) => (
            <Link className="hb-slide" to={s.to} key={idx} aria-hidden={idx !== cur} tabIndex={idx === cur ? 0 : -1}>
              <img src={s.img} alt={s.alt} />
            </Link>
          ))}
        </div>
        {n > 1 && (
          <>
            <button className="hb-arrow left" onClick={() => go(i - 1)} aria-label="Anterior"><ChevronLeft size={20} /></button>
            <button className="hb-arrow right" onClick={() => go(i + 1)} aria-label="Siguiente"><ChevronRight size={20} /></button>
            <div className="hb-dots">
              {slides.map((_, idx) => (
                <button key={idx} className={idx === cur ? 'on' : ''} onClick={() => go(idx)} aria-label={`Ir a la diapositiva ${idx + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

/* ---------------- FEATURES (ilustraciones a color) ---------------- */
const features = [
  { icon: <TruckImg />, title: 'Envío gratis', sub: 'En pedidos +S/ 200' },
  { icon: <ShieldImg />, title: 'Garantía oficial', sub: '12 meses de cobertura' },
  { icon: <BoltImg />, title: 'Entrega rápida', sub: 'Lima: 24-48 horas' },
  { icon: <HeadsetImg />, title: 'Soporte 24/7', sub: 'Chat y teléfono' },
  { icon: <PayImg />, title: 'Pagos seguros', sub: 'con Mercado Pago' },
]
const Features = () => (
  <section className="features-bar">
    <div className="container">
      <div className="features2">
        {features.map((f) => (
          <div className="feature2" key={f.title}>
            <div className="feature2-ic">{f.icon}</div>
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
const isRealImg = (s) => typeof s === 'string' && (s.startsWith('data:') || s.startsWith('http') || s.startsWith('/uploads'))
const Categorias = () => {
  const apiCats = useApiCategories()
  // Usa la imagen real asignada a la categoría en el panel (Admin → Categorías);
  // si no hay, cae a la foto del diseño.
  const imgFor = (c) => {
    const slug = c.to.startsWith('/categoria/') ? c.to.slice('/categoria/'.length) : null
    const ac = slug && apiCats.find((x) => x.slug === slug)
    return ac && isRealImg(ac.image) ? ac.image : c.image
  }
  return (
    <section className="section-white">
      <div className="container">
        <h2 className="home-h2">Categorías</h2>
        <Carousel className="cat-car">
          {homeCategories.map((c) => (
            <Link className="cat-tile" key={c.name} to={c.to}>
              <div className="cat-tile-thumb"><ProductImage image={imgFor(c)} style={COVER} /></div>
              <b>{c.name}</b>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

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

const OfertasFlash = ({ items }) => {
  const { h, m, s } = useCountdown()
  if (!items || !items.length) return null
  return (
    <section className="flash-sec">
      <div className="container">
        <div className="flash-head2">
          <span className="flash-pill"><Zap size={16} fill="currentColor" /> Ofertas Flash</span>
          <span className="flash-timer2">Termina en <b>{h}</b><i>:</i><b>{m}</b><i>:</i><b>{s}</b></span>
          <Link className="flash-all" to="/ofertas">Ver todas <ChevronRight size={15} /></Link>
        </div>
        <Carousel className="flash-car">
          {items.map((p) => <FlashCard key={p.id} p={p} />)}
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
      <Carousel className="pcard-car">{items.map((p) => <ProductCardHome key={p.id} p={p} />)}</Carousel>
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

// Bloques promocionales gestionados: la imagen DISEÑADA completa (estilo
// Dataplus), sin texto de la app encima y sin opacidad.
const PromoBanner = ({ to, bg, alt }) => (
  <Link className="promo-banner" to={to}><img src={bg} alt={alt} loading="lazy" /></Link>
)
const PromoRow = ({ items, last }) => {
  const promos = (items || []).filter((b) => b && b.image)
  if (!promos.length) return null
  const cls = promos.length >= 3 ? 'promo-trio' : promos.length === 2 ? 'promo-pair' : 'promo-solo'
  return (
    <section className={`section2${last ? ' last-sec' : ''}`}><div className="container"><div className={`promo-row ${cls}`}>
      {promos.map((b, i) => <PromoBanner key={b.id ?? i} to={b.link || '/productos'} bg={b.image} alt={b.title || b.badge || 'Promoción'} />)}
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

// Banners promocionales gestionados (modo demo): se intercalan con las secciones
// de productos del diseño. El orden de las tarjetas (arriba→abajo) es el del panel.
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

// Cuerpo REAL: secciones de productos de la BD (solo las que tienen productos),
// con los bloques promocionales del admin repartidos entre ellas.
const RealBody = ({ sections, promos }) => {
  const per = sections.length ? Math.ceil(promos.length / sections.length) : promos.length
  return (
    <>
      {sections.map((s, i) => (
        <Fragment key={s.slug || s.title}>
          <PromoRow items={promos.slice(i * per, i * per + per)} />
          <ProductSection title={s.title} items={s.items} to={s.to} />
        </Fragment>
      ))}
      <PromoRow items={promos.slice(sections.length * per)} last />
    </>
  )
}

export default function Home() {
  useSeo({
    title: 'Tecnología que impulsa tu negocio',
    description: 'SebasPeru — Impresoras, tóner, tintas, laptops y accesorios de las mejores marcas. Ventas corporativas, factura electrónica y envíos a todo el Perú.',
    path: '/',
  })
  const all = useStorefrontProducts()
  const hasReal = useHasRealCatalog()
  const apiCats = useApiCategories()
  const promos = useBanners().filter((b) => b && b.active && b.slot === 'promo')

  // Productos reales por categoría (incluye subcategorías vía `parent`). Se pueden
  // EXCLUIR ramas (p. ej. la sección "Impresoras" no repite tóner/tintas, que
  // están anidadas bajo Impresión pero tienen su propia sección).
  const inScope = (p, s) => s.has(p.category)
    || (Array.isArray(p.categories) && p.categories.some((c) => s.has(c)))
    || (p.subcategory && s.has(p.subcategory))
  const pick = (root, exclude = [], n = 10) => {
    const s = descendantSlugs(root, apiCats)
    const ex = exclude.map((e) => descendantSlugs(e, apiCats))
    return all.filter((p) => inScope(p, s) && !ex.some((e) => inScope(p, e))).slice(0, n)
  }
  const flash = hasReal
    ? all.filter((p) => p.oldPrice && Number(p.oldPrice) > Number(p.price))
        .map((p) => ({ ...p, off: Math.round((1 - p.price / p.oldPrice) * 100) })).slice(0, 10)
    : flashOffers
  const sections = hasReal ? (() => {
    const preset = [
      { slug: 'impresoras', title: 'Impresoras', items: pick('impresoras', ['toner', 'tintas']), to: '/categoria/impresoras' },
      { slug: 'toner', title: 'Tóner para Impresora', items: pick('toner'), to: '/categoria/toner' },
      { slug: 'tintas', title: 'Tintas para Impresora', items: pick('tintas'), to: '/categoria/tintas' },
      { slug: 'laptops-pc', title: 'Computación', items: pick('laptops-pc'), to: '/categoria/laptops-pc' },
    ].filter((s) => s.items.length)
    return preset.length ? preset : [{ slug: 'todos', title: 'Productos', items: all.slice(0, 12), to: '/productos' }]
  })() : null

  return (
    <>
      <Hero />
      <Features />
      <Categorias />
      <OfertasFlash items={flash} />
      {hasReal
        ? <RealBody sections={sections} promos={promos} />
        : (promos.length ? <ManagedPromos promos={promos} /> : <DesignPromos />)}
    </>
  )
}
