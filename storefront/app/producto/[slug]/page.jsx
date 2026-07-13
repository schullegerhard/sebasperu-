import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductImage } from '../../../components/imageMap.jsx'
import ProductGallery from '../../../components/ProductGallery.jsx'
import ProductTabs from '../../../components/ProductTabs.jsx'
import AddToCart from '../../../components/AddToCart.jsx'
import RelatedAddButton from '../../../components/RelatedAddButton.jsx'
import { Truck, Zap, MapPin, Shield, Cart, Star, ChevronRight } from '../../../components/Icons.jsx'
import { getProductBySlug, getAllProducts, getCategoryBySlug } from '../../../lib/data.js'
import { peso } from '../../../lib/catalog.js'
import { ORIGIN, productJsonLd, breadcrumbJsonLd, JsonLd } from '../../../lib/seo.js'

export const revalidate = 60

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const p = await getProductBySlug(slug)
  if (!p) return { title: 'Producto no encontrado' }
  return {
    title: p.name,
    description: p.shortDesc,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: { title: p.name, description: p.shortDesc, type: 'website', url: `${ORIGIN}/producto/${p.slug}` },
  }
}

// La galería de la ficha muestra la imagen COMPLETA (sin recortar).
const CONTAIN = { objectFit: 'contain', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }

const Stars = ({ value = 5 }) => (
  <span className="pdp-stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} style={{ opacity: i < Math.round(value) ? 1 : 0.3 }} />)}</span>
)

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  const all = await getAllProducts()
  const category = await getCategoryBySlug(product.category)

  // Datos normalizados (mismos campos que App 1).
  const rating = Number(product.rating) || 5
  const reviews = Number(product.reviews) || 0
  const sku = product.sku || `${String(product.brand || '').toUpperCase()}-${String(product.id).padStart(8, '0')}`
  const categoryLabel = category?.name || product.categoryLabel || product.category
  const shortDesc = product.shortDesc || product.subtitle || product.blurb || ''
  const longDesc = product.longDesc || product.description || ''
  const faq = (Array.isArray(product.faq) ? product.faq : []).filter((f) => f && f.q)

  // Especificaciones = atributos administrables (panel) + specs estáticas, sin duplicar.
  const attrRows = (Array.isArray(product.attributes) ? product.attributes : [])
    .filter((a) => a && a.name && a.value != null && String(a.value).trim() !== '')
    .map((a) => ({ label: String(a.name).trim(), value: String(a.value).trim() }))
  const seenK = new Set()
  const specsRows = [...attrRows, ...Object.entries(product.specs || {}).map(([label, value]) => ({ label, value }))]
    .filter((r) => { const k = String(r.label).toLowerCase(); if (seenK.has(k) || r.value == null || r.value === '') return false; seenK.add(k); return true })

  // Galería: imagen principal + galería administrable, sin duplicados ni vacíos.
  const gallery = [...new Set([product.image, ...(Array.isArray(product.gallery) ? product.gallery : []), ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean))]

  // "Podría interesarte": productos vinculados o, en su defecto, de la misma categoría.
  let related = (product.related || []).map((id) => all.find((p) => p.id === id)).filter(Boolean)
  if (!related.length) related = all.filter((p) => p.category === product.category && p.slug !== product.slug)
  related = related.slice(0, 4)

  // Solo hay descuento si el precio anterior es MAYOR que el actual.
  const hasOff = product.oldPrice && Number(product.oldPrice) > Number(product.price)
  const discount = hasOff ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const cuota = Math.round(product.price / 6)

  const crumbs = [{ label: 'Inicio', to: '/' }, { label: categoryLabel, to: `/categoria/${product.category}` }, { label: product.name }]

  return (
    <div className="pdp">
      <div className="container">
        <JsonLd data={productJsonLd(product)} />
        <JsonLd data={breadcrumbJsonLd(crumbs)} />

        {/* Breadcrumb */}
        <div className="pdp-crumb">
          <Link href="/">Inicio</Link><ChevronRight size={11} />
          <Link href={`/categoria/${product.category}`}>{categoryLabel}</Link><ChevronRight size={11} />
          <span className="pdp-crumb-cur">{product.name}</span>
        </div>

        {/* Main grid */}
        <div className="pdp-grid">
          {/* Thumbs + main image (isla cliente: cambia la imagen activa) */}
          <ProductGallery images={gallery} tint={product.tint} label={product.label} brand={product.brand} hasOff={hasOff} discount={discount} />

          {/* Info */}
          <div className="pdp-info">
            <div className="pdp-ship">
              <span className="pdp-free"><Truck size={11} /> ENVÍO GRATIS</span>
              <span className="pdp-sku">SKU: {sku}</span>
            </div>
            <div className="pdp-rating"><Stars value={rating} /> <span>({reviews.toLocaleString('es-PE')} valoraciones de clientes)</span></div>
            <h1 className="pdp-title">{product.name}</h1>
            {shortDesc && <p className="pdp-shortdesc">{shortDesc}</p>}
            <div className="pdp-price">
              <div className="pdp-price-row">
                <span className="now">{peso(product.price).replace('.00', '')}</span>
                {hasOff && <span className="old">{peso(product.oldPrice).replace('.00', '')}</span>}
                {hasOff && <span className="disc">-{discount}%</span>}
              </div>
              {hasOff && <p className="pdp-save">Ahorras {peso(product.oldPrice - product.price).replace('.00', '')}</p>}
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

            {/* Buybox (isla cliente: cantidad + agregar/comprar) */}
            <AddToCart product={product} />

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

        {/* Tabs (isla cliente: descripción / especificaciones / reseñas) */}
        <ProductTabs name={product.name} longDesc={longDesc} faq={faq} specsRows={specsRows} rating={rating} reviews={reviews} />

        {/* Related */}
        {related.length > 0 && (
          <div className="pdp-related">
            <h2>Podría interesarte</h2>
            <div className="pdp-related-grid">
              {related.map((r) => {
                const d = r.oldPrice && Number(r.oldPrice) > Number(r.price) ? Math.round((1 - r.price / r.oldPrice) * 100) : 0
                return (
                  <div className="pdp-rel-card" key={r.id}>
                    <Link href={`/producto/${r.slug}`} className="pdp-rel-thumb">
                      <ProductImage image={r.image} tint={r.tint} label={r.label} brand={r.brand} style={CONTAIN} />
                      {d > 0 && <span className="pdp-rel-disc">-{d}%</span>}
                    </Link>
                    <div className="pdp-rel-body">
                      <span className="pdp-rel-brand">{r.brand}</span>
                      <Link href={`/producto/${r.slug}`} className="pdp-rel-name">{r.name}</Link>
                      <b className="pdp-rel-price">{peso(r.price).replace('.00', '')}</b>
                      <RelatedAddButton product={r} />
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
