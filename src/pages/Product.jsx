import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { http } from '../services/http.js'
import { ProductImage } from '../components/imageMap.jsx'
import { Truck, Zap, MapPin, Shield, Cart, Star, Plus, ChevronRight } from '../components/Icons.jsx'
import { getProduct, getCategory, products, peso } from '../data/catalog.js'
import { findStoreProduct, storeByCategory, productSlug } from '../data/storefront.js'
import { useStore } from '../context/StoreContext.jsx'
import { useProductOverrides, useExtraProducts, applyOverride, useStorefrontProducts, useHasRealCatalog, useApiCategories, descendantSlugs, useCatalogLoaded } from '../context/ProductOverrides.jsx'
import { useSeo, productJsonLd } from '../lib/seo.js'
import { NotFound } from './Misc.jsx'

const COVER = { objectFit: 'cover', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }
// La galería de la ficha muestra la imagen COMPLETA (sin recortar).
const CONTAIN = { objectFit: 'contain', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }

const Stars = ({ value = 5 }) => (
  <span className="pdp-stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} style={{ opacity: i < Math.round(value) ? 1 : .3 }} />)}</span>
)

// Normaliza un producto (del storefront, del catálogo o de la API) a una forma común.
function normalize(base) {
  if (!base) return null
  const cat = getCategory(base.category)
  const isCatalog = base.specs && typeof base.specs === 'object' && !Array.isArray(base.specs)
  // Atributos administrables (definidos en el panel) — se muestran como parte de
  // las especificaciones del producto.
  const attrRows = (Array.isArray(base.attributes) ? base.attributes : [])
    .filter((a) => a && a.name && a.value != null && String(a.value).trim() !== '')
    .map((a) => ({ label: String(a.name).trim(), value: String(a.value).trim() }))
  const baseRows = isCatalog
    ? Object.entries(base.specs).map(([label, value]) => ({ label, value }))
    : [
      { label: 'Marca', value: base.brand },
      { label: 'Modelo', value: base.model || base.sku || `${base.brand}-${base.id}` },
      { label: 'SKU', value: base.sku || `${String(base.brand || '').toUpperCase()}-${base.id}` },
      { label: 'Garantía', value: '12 meses oficial' },
      { label: 'País', value: 'Perú' },
      { label: 'Condición', value: 'Nuevo' },
    ]
  // Une atributos + specs sin duplicar etiquetas (los atributos tienen prioridad).
  const seen = new Set()
  const specsRows = [...attrRows, ...baseRows].filter((r) => {
    const k = r.label.toLowerCase()
    if (seen.has(k) || r.value == null || r.value === '') return false
    seen.add(k); return true
  })
  // Galería de imágenes: imagen principal + galería administrable (campo `gallery`
  // del panel) o `images`; se eliminan duplicados y vacíos.
  const gal = Array.isArray(base.images) && base.images.length
    ? base.images
    : [base.image, ...(Array.isArray(base.gallery) ? base.gallery : [])]
  const images = [...new Set(gal.filter(Boolean))]
  let related = storeByCategory(base.category).filter((p) => p.slug !== base.slug).slice(0, 4)
  if (!related.length && Array.isArray(base.related)) {
    related = base.related.map((id) => products.find((p) => p.id === id)).filter(Boolean)
      .map((p) => ({ ...p, slug: p.slug })).slice(0, 4)
  }
  return {
    id: base.id,
    name: base.name,
    brand: base.brand,
    category: base.category,
    categoryLabel: base.categoryLabel || cat?.name || base.category,
    sku: base.sku || `${String(base.brand || '').toUpperCase()}-${String(base.id).padStart(8, '0')}`,
    price: Number(base.price) || 0,
    oldPrice: base.oldPrice ? Number(base.oldPrice) : null,
    rating: Number(base.rating) || 5,
    reviews: Number(base.reviews) || 0,
    shortDesc: base.shortDesc || base.subtitle || base.blurb || '',
    longDesc: base.longDesc || base.description || '',
    faq: (Array.isArray(base.faq) ? base.faq : []).filter((f) => f && f.q),
    image: base.image, images, tint: base.tint, label: base.label, seed: base.id,
    specsRows,
    related,
  }
}

const REVIEWS = [
  { name: 'Carlos M.', rating: 5, text: 'Excelente producto, llegó en perfecto estado y muy rápido. Totalmente recomendado.', date: 'hace 3 días' },
  { name: 'María G.', rating: 5, text: 'Muy buena calidad, exactamente como se describe. El envío fue muy rápido.', date: 'hace 1 semana' },
  { name: 'Juan P.', rating: 4, text: 'Buen producto, cumple con lo especificado. El embalaje estaba en perfecto estado.', date: 'hace 2 semanas' },
]

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useStore()
  const overrides = useProductOverrides()
  const extras = useExtraProducts()
  const realCatalog = useStorefrontProducts()
  const hasReal = useHasRealCatalog()
  const apiCats = useApiCategories()
  const loaded = useCatalogLoaded()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')
  const [added, setAdded] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  // El listado es liviano (sin galería/descripción larga para cargar rápido); la
  // ficha pide el producto COMPLETO por slug y fusiona esos campos pesados.
  const [full, setFull] = useState(null)
  useEffect(() => {
    let alive = true
    setFull(null)
    http.get(`/api/products/${encodeURIComponent(slug)}`).then((f) => { if (alive && f) setFull(f) }).catch(() => {})
    return () => { alive = false }
  }, [slug])

  // Con catálogo real (BD del cliente) se resuelve SOLO desde él (los productos
  // demo dejan de ser accesibles). Sin catálogo real, se usa el del diseño.
  const slugOf = (pp) => pp.slug || productSlug(pp.name)
  const raw0 = hasReal
    ? realCatalog.find((pp) => pp.slug === slug || productSlug(pp.name) === slug)
    : (findStoreProduct(slug) || getProduct(slug) || extras.find((pp) => pp.slug === slug))
  // Fusiona los campos pesados del producto completo (galería, descripción larga)
  // cuando llegan; mientras tanto se muestra la miniatura y datos básicos.
  const raw = raw0 && full && (full.slug === slug || String(full.id) === String(raw0.id))
    ? { ...raw0, gallery: full.gallery, images: full.images, longDesc: full.longDesc, description: full.description }
    : (raw0 || (full && full.slug === slug ? full : null))
  const p = normalize(raw ? applyOverride(raw, overrides[raw.id]) : null)
  // "Podría interesarte": productos reales de la MISMA CATEGORÍA PRINCIPAL (se
  // sube por `parent` hasta el rubro raíz y se toman todos sus descendientes).
  // Se completa con otros productos si el rubro tiene pocos. Sin datos demo.
  if (p && hasReal) {
    const rootOf = (s) => { let cur = s; for (let i = 0; i < 12; i++) { const c = apiCats.find((x) => x.slug === cur); if (!c || !c.parent) break; cur = c.parent } return cur }
    const scope = descendantSlugs(rootOf(p.category), apiCats)
    const inScope = (r) => scope.has(r.category) || (Array.isArray(r.categories) && r.categories.some((c) => scope.has(c))) || (r.subcategory && scope.has(r.subcategory))
    const same = realCatalog.filter((r) => inScope(r) && slugOf(r) !== slug)
    const rest = realCatalog.filter((r) => !inScope(r) && slugOf(r) !== slug)
    p.related = [...same, ...rest].slice(0, 4)
  }

  // Reinicia la imagen activa al cambiar de producto.
  useEffect(() => { setImgIdx(0) }, [slug])

  useSeo(p
    ? {
      title: p.name,
      description: `${p.name} — ${p.brand}. Garantía oficial. Envío a todo el Perú.`,
      path: `/producto/${slug}`,
      jsonLd: productJsonLd({ name: p.name, sku: p.sku, brand: p.brand, shortDesc: `${p.name} — ${p.brand}. Garantía oficial.`, rating: p.rating, reviews: p.reviews, price: p.price, stock: 1, slug }),
    }
    : { title: 'Producto', path: `/producto/${slug}` })

  // Mientras la API aún carga no mostramos "no encontrado" (evita el parpadeo 404
  // al abrir un enlace directo de producto); solo 404 si ya cargó y no existe.
  if (!p) return loaded ? <NotFound /> : (
    <div className="container page"><div className="pdp-loading"><span className="pdp-spinner" /> Cargando producto…</div></div>
  )

  // Solo hay descuento si el precio anterior es MAYOR que el actual (evita el
  // "0" fantasma y el precio tachado duplicado cuando oldPrice === price).
  const hasOff = p.oldPrice && Number(p.oldPrice) > Number(p.price)
  const discount = hasOff ? Math.round((1 - p.price / p.oldPrice) * 100) : 0
  const cuota = Math.round(p.price / 6)
  const doAdd = () => { for (let i = 0; i < qty; i++) addToCart(raw); setAdded(true); setTimeout(() => setAdded(false), 2000) }
  const buyNow = () => { addToCart(raw, qty); navigate('/checkout') }

  return (
    <div className="pdp">
      <div className="container">
        {/* Breadcrumb */}
        <div className="pdp-crumb">
          <Link to="/">Inicio</Link><ChevronRight size={11} />
          <Link to={`/categoria/${p.category}`}>{p.categoryLabel}</Link><ChevronRight size={11} />
          <span className="pdp-crumb-cur">{p.name}</span>
        </div>

        {/* Main grid */}
        <div className="pdp-grid">
          {/* Thumbs (galería: una miniatura por imagen del producto). NO se pasa
              `seed`: cada miniatura es una imagen ya resuelta (data URL / ruta);
              con `seed` el override por id mostraría la principal en todas. */}
          <div className="pdp-thumbs">
            {p.images.map((img, i) => (
              <button key={i} type="button" className={`pdp-thumb ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} aria-label={`Ver imagen ${i + 1}`}>
                <ProductImage image={img} tint={p.tint} label={p.label} brand={p.brand} style={CONTAIN} />
              </button>
            ))}
          </div>

          {/* Main image (imagen activa de la galería; sin `seed` por lo mismo) */}
          <div className="pdp-stage">
            <ProductImage image={p.images[imgIdx] || p.image} tint={p.tint} label={p.label} brand={p.brand} style={CONTAIN} />
            {hasOff && <span className="pdp-disc">-{discount}%</span>}
          </div>

          {/* Info */}
          <div className="pdp-info">
            <div className="pdp-ship">
              <span className="pdp-free"><Truck size={11} /> ENVÍO GRATIS</span>
              <span className="pdp-sku">SKU: {p.sku}</span>
            </div>
            <div className="pdp-rating"><Stars value={p.rating} /> <span>({p.reviews.toLocaleString('es-PE')} valoraciones de clientes)</span></div>
            <h1 className="pdp-title">{p.name}</h1>
            {p.shortDesc && <p className="pdp-shortdesc">{p.shortDesc}</p>}
            <div className="pdp-price">
              <div className="pdp-price-row">
                <span className="now">{peso(p.price).replace('.00', '')}</span>
                {hasOff && <span className="old">{peso(p.oldPrice).replace('.00', '')}</span>}
                {hasOff && <span className="disc">-{discount}%</span>}
              </div>
              {hasOff && <p className="pdp-save">Ahorras {peso(p.oldPrice - p.price).replace('.00', '')}</p>}
              <p className="pdp-cuota-txt">6 cuotas de <b>{peso(cuota).replace('.00', '')}</b> sin intereses</p>
            </div>
            {/* Las especificaciones se muestran solo en la pestaña "Especificaciones" (abajo). */}
            <div className="pdp-sold">🔥 <span>85 vendidos en las últimas 48 horas</span></div>
            <div className="pdp-cuotas">
              <div><small>Paga en 6 cuotas sin intereses</small><b>{peso(cuota).replace('.00', '')} / cuota</b></div>
              <div className="pdp-cuotas-cards"><span className="pay visa">VISA</span><span className="mc"><i /><i /></span></div>
            </div>
          </div>

          {/* Side: delivery + buybox */}
          <div className="pdp-side">
            <div className="pdp-delivery">
              <div className="pdp-delivery-head"><Truck size={12} /> Sobre la entrega</div>
              <div className="pdp-delivery-body">
                <div className="pdp-drow"><span className="ic g"><Zap size={13} /></span><div><b>Envío a Lima</b><small>Recíbelo hoy antes de las 2pm</small></div></div>
                <div className="pdp-drow"><span className="ic b"><Truck size={13} /></span><div><b>Envío a Provincias</b><small>Recíbelo en 2 a 4 días hábiles</small></div></div>
                <div className="pdp-drow"><span className="ic a"><MapPin size={13} /></span><div><b>Retiro en tienda</b><small>Mañana — Lima, Perú</small></div></div>
              </div>
            </div>

            <div className="pdp-buybox">
              <div className="pdp-stock"><i className="dot" /> <b>En stock</b> <small>· Retiro en 24 horas</small></div>
              <div className="pdp-qtyrow">
                <span>Cantidad:</span>
                <div className="pdp-qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos">−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="Más"><Plus size={12} /></button>
                </div>
              </div>
              <button className={`pdp-add ${added ? 'ok' : ''}`} onClick={doAdd}>{added ? <><Shield size={15} /> ¡Agregado!</> : <><Cart size={15} /> Agregar al carrito</>}</button>
              <button className="pdp-buy" onClick={buyNow}><Zap size={14} /> Comprar ahora</button>
              <div className="pdp-trust">
                <Shield size={13} />
                <div><b>Disponible en SEBASTPERU</b><small>Normalmente está listo en 24 horas</small></div>
              </div>
            </div>

            <div className="pdp-cards-box">
              <p className="pdp-cards-title">Tarjetas aceptadas</p>
              <div className="pdp-cards">
                <span className="pc visa">VISA</span>
                <span className="pc mc"><i /><i /></span>
                <span className="pc amex">AMEX</span>
                <span className="pc diners">DINERS</span>
                <span className="pc bcp">BCP</span>
                <span className="pc yape">YAPE</span>
                <span className="pc plin">PLIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pdp-tabs">
          <div className="pdp-tab-head">
            {[['desc', 'Descripción'], ['specs', 'Especificaciones'], ['reviews', 'Reseñas']].map(([k, label]) => (
              <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>
            ))}
          </div>
          <div className="pdp-tab-body">
            {tab === 'desc' && (
              <div className="pdp-desc">
                {p.longDesc
                  ? <div className="pdp-desc-html" dangerouslySetInnerHTML={{ __html: p.longDesc }} />
                  : (
                    <>
                      <p className="lead">{p.name}</p>
                      <p>Producto original con garantía oficial de fábrica. Ideal para uso profesional y personal. Cuenta con las últimas tecnologías para garantizar el mejor rendimiento y durabilidad.</p>
                      <p>En SEBASTPERU ofrecemos únicamente productos auténticos de las mejores marcas con factura y garantía oficial, respaldados por nuestro equipo de soporte técnico especializado en Lima y provincias.</p>
                    </>
                  )}
                {p.faq.length > 0 && (
                  <div className="pdp-faq">
                    <h3>Preguntas frecuentes</h3>
                    {p.faq.map((f, i) => (
                      <details className="pdp-faq-item" key={i}>
                        <summary>{f.q}</summary>
                        <p>{f.a}</p>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            )}
            {tab === 'specs' && (
              <table className="pdp-spec-table">
                <tbody>{p.specsRows.map((s, i) => <tr key={s.label} className={i % 2 === 0 ? 'alt' : ''}><th>{s.label}</th><td>{s.value}</td></tr>)}</tbody>
              </table>
            )}
            {tab === 'reviews' && (
              <div className="pdp-reviews">
                <div className="pdp-rev-summary">
                  <div className="pdp-rev-score"><b>{p.rating}</b><Stars value={p.rating} /><small>{p.reviews.toLocaleString('es-PE')} reseñas</small></div>
                  <div className="pdp-rev-bars">
                    {[5, 4, 3, 2, 1].map((r) => (
                      <div className="pdp-rev-bar" key={r}><span>{r}</span><Star size={11} /><div className="track"><i style={{ width: r === 5 ? '72%' : r === 4 ? '18%' : r === 3 ? '7%' : '2%' }} /></div></div>
                    ))}
                  </div>
                </div>
                <div className="pdp-rev-list">
                  {REVIEWS.map((rev) => (
                    <div className="pdp-rev" key={rev.name}>
                      <div className="pdp-rev-head"><span className="av">{rev.name[0]}</span><div><b>{rev.name}</b><small>{rev.date}</small></div><Stars value={rev.rating} /></div>
                      <p>{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {p.related.length > 0 && (
          <div className="pdp-related">
            <h2>Podría interesarte</h2>
            <div className="pdp-related-grid">
              {p.related.map((r) => {
                const rslug = r.slug || productSlug(r.name)
                const d = r.oldPrice && Number(r.oldPrice) > Number(r.price) ? Math.round((1 - r.price / r.oldPrice) * 100) : 0
                return (
                  <div className="pdp-rel-card" key={r.id}>
                    <Link to={`/producto/${rslug}`} className="pdp-rel-thumb">
                      <ProductImage image={r.image} tint={r.tint} label={r.label} seed={r.id} brand={r.brand} style={CONTAIN} />
                      {d > 0 && <span className="pdp-rel-disc">-{d}%</span>}
                    </Link>
                    <div className="pdp-rel-body">
                      <span className="pdp-rel-brand">{r.brand}</span>
                      <Link to={`/producto/${rslug}`} className="pdp-rel-name">{r.name}</Link>
                      <b className="pdp-rel-price">{peso(r.price).replace('.00', '')}</b>
                      <button className="pdp-rel-add" onClick={() => addToCart(r)}><Cart size={13} /> Agregar al carrito</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
