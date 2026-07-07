import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductImage, brandLogo } from '../../../components/imageMap.jsx'
import ProductGallery from '../../../components/ProductGallery.jsx'
import ProductCard from '../../../components/ProductCard.jsx'
import AddToCart from '../../../components/AddToCart.jsx'
import { Star, Truck, ShieldCheck, FileText, Whatsapp, Check, ChevronRight, ArrowRight } from '../../../components/Icons.jsx'
import { getProductBySlug, getAllProducts, getCategoryBySlug } from '../../../lib/data.js'
import { peso } from '../../../lib/catalog.js'
import { ORIGIN, productJsonLd, breadcrumbJsonLd, JsonLd } from '../../../lib/seo.js'

export const revalidate = 60

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const p = await getProductBySlug(params.slug)
  if (!p) return { title: 'Producto no encontrado' }
  return {
    title: p.name,
    description: p.shortDesc,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: { title: p.name, description: p.shortDesc, type: 'website', url: `${ORIGIN}/producto/${p.slug}` },
  }
}

const Stars = ({ value }) => <span className="stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} style={{ opacity: i < Math.round(value) ? 1 : 0.3 }} />)}</span>

const bottomFeatures = [
  { icon: <Truck size={20} />, t: 'Envíos a todo el Perú', s: 'Recíbelo en 24 a 48 horas' },
  { icon: <ShieldCheck size={20} />, t: 'Compra 100% segura', s: 'Tus datos están protegidos' },
  { icon: <Check size={20} />, t: 'Garantía oficial', s: '1 año de garantía' },
  { icon: <FileText size={20} />, t: 'Factura electrónica', s: 'Boleta o factura' },
]

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  const all = await getAllProducts()
  const category = await getCategoryBySlug(product.category)
  const related = (product.related || []).map((id) => all.find((p) => p.id === id)).filter(Boolean)
  const Brand = brandLogo[product.brand]
  const ahorro = product.oldPrice ? product.oldPrice - product.price : 0
  // Especificaciones = atributos administrables (panel) + specs estáticas, sin duplicar.
  const attrRows = (Array.isArray(product.attributes) ? product.attributes : [])
    .filter((a) => a && a.name && a.value != null && String(a.value).trim() !== '')
    .map((a) => [String(a.name).trim(), String(a.value).trim()])
  const seenK = new Set()
  const specs = [...attrRows, ...Object.entries(product.specs || {})]
    .filter(([k, v]) => { const key = String(k).toLowerCase(); if (seenK.has(key) || v == null || v === '') return false; seenK.add(key); return true })
  // Galería: imagen principal + galería administrable, sin duplicados ni vacíos.
  const gallery = [...new Set([product.image, ...(Array.isArray(product.gallery) ? product.gallery : []), ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean))]
  const crumbs = [{ label: 'Inicio', to: '/' }, { label: category?.name || '', to: `/categoria/${product.category}` }, { label: product.name }]

  return (
    <div className="container page product-page">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <nav className="breadcrumbs" aria-label="Migas de pan">
        {crumbs.map((c, i) => (
          <span className="crumb" key={i}>
            {c.to && i < crumbs.length - 1 ? <Link href={c.to}>{c.label}</Link> : <span className="crumb-current">{c.label}</span>}
            {i < crumbs.length - 1 && <ChevronRight size={13} className="crumb-sep" />}
          </span>
        ))}
      </nav>

      <div className="pd2">
        <ProductGallery images={gallery} tint={product.tint} label={product.label} />

        <div className="pd2-info">
          <div className="pd2-brand">{Brand && <Brand />}</div>
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd2-meta">
            <span className="pd2-stars"><Stars value={product.rating} /> <b>{product.rating}</b> <span className="muted">({product.reviews} reseñas)</span></span>
            <span className="pd2-sku">SKU: {product.sku}</span>
          </div>
          <div className="pd2-price"><span className="now">{peso(product.price)}</span>{product.oldPrice && <span className="price-old">{peso(product.oldPrice)}</span>}</div>
          {ahorro > 0 && <div className="pd2-save">Ahorras {peso(ahorro)}</div>}
          <div className={`pd2-stock ${product.stock > 0 ? 'ok' : 'no'}`}><span className="dot" /> {product.stock > 0 ? <>En stock — <b>{product.stock} unidades disponibles</b></> : 'Agotado'}</div>
          <p className="pd2-short">{product.shortDesc}</p>

          <AddToCart product={product} />

          <a className="pd2-wa" href="https://wa.me/51925552042" target="_blank" rel="noreferrer">
            <span className="pd2-wa-ic"><Whatsapp size={20} /></span>
            <span><b>¿Tienes dudas? Escríbenos por WhatsApp</b><i>925 552 042</i></span>
          </a>
          <div className="pd2-trust">
            <span><span className="dot" /> Stock: {product.stock} unidades</span>
            <span><Truck size={15} /> Entrega 24-48 horas</span>
            <span><ShieldCheck size={15} /> Garantía oficial {product.brand}</span>
            <span><Whatsapp size={15} /> WhatsApp: 925 552 042</span>
          </div>
        </div>
      </div>

      <div className="pd2-tabs">
        <div className="pd2-desc">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Descripción</h2>
            <p>{product.longDesc}</p>
            {product.highlights && <ul className="pd2-checks">{product.highlights.map((h) => <li key={h}><Check size={15} /> {h}</li>)}</ul>}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Especificaciones</h2>
            <table className="specs-table"><tbody>{specs.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section2">
          <div className="head2"><h2>Productos relacionados</h2><Link className="link2" href={`/categoria/${product.category}`}>Ver todos <ArrowRight size={14} /></Link></div>
          <div className="ccard-grid">{related.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </section>
      )}

      <div className="pd2-features">
        {bottomFeatures.map((f) => <div className="pd2-feat" key={f.t}><div className="pd2-feat-ic">{f.icon}</div><div><b>{f.t}</b><span>{f.s}</span></div></div>)}
      </div>
    </div>
  )
}
