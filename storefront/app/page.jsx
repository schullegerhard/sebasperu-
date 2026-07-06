import Link from 'next/link'
import { ProductImage, brandLogo } from '../components/imageMap.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { Truck, Lock, Building, Headset, ArrowRight } from '../components/Icons.jsx'
import { getAllProducts, getCategories, homeBrands } from '../lib/data.js'

// Server Component → todo el contenido se renderiza en el HTML (SEO).
export const revalidate = 60

const features = [
  { icon: <Truck size={20} />, title: 'Envíos a todo el Perú', sub: 'Rápido y seguro' },
  { icon: <Lock size={20} />, title: 'Compra 100% segura', sub: 'Protección de datos' },
  { icon: <Building size={20} />, title: 'Ventas corporativas', sub: 'Cotizaciones rápidas' },
  { icon: <Headset size={20} />, title: 'Garantía y soporte', sub: 'Postventa especializada' },
]

export default async function Home() {
  const products = await getAllProducts()
  const categories = await getCategories()
  const featured = products.slice(0, 10)

  return (
    <>
      <section className="hero2">
        <div className="container">
          <div className="hero2-inner">
            <div className="hero2-content">
              <h1>TECNOLOGÍA QUE<span className="accent">IMPULSA TU NEGOCIO</span></h1>
              <p>Impresoras, tóner, tintas y más<br />de las mejores marcas.</p>
              <Link className="hero2-btn" href="/ofertas">VER OFERTAS</Link>
            </div>
            <div className="hero2-art">
              <ProductImage image="laptop" className="h2-laptop" />
              <ProductImage image="printer" className="h2-printer" />
              <ProductImage image="toner" className="h2-toner" />
              <div className="h2-inks">
                <ProductImage image="ink" tint="#1f2937" label="504" /><ProductImage image="ink" tint="#06b6d4" label="504" />
                <ProductImage image="ink" tint="#ec4899" label="504" /><ProductImage image="ink" tint="#eab308" label="504" />
              </div>
            </div>
            <div className="hero2-dots"><i /><i className="on" /><i /><i /></div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="features2">
          {features.map((f) => <div className="feature2" key={f.title}><div className="feature2-ic">{f.icon}</div><div><b>{f.title}</b><span>{f.sub}</span></div></div>)}
        </div>
      </div>

      <section className="section2">
        <div className="container">
          <div className="head2"><h2>COMPRA POR MARCA</h2><Link className="link2" href="/marcas">Ver todas las marcas <ArrowRight size={14} /></Link></div>
          <div className="brands-strip">
            {homeBrands.map((b) => { const B = brandLogo[b]; return <Link className="brand-logo" key={b} href={`/buscar?q=${b}`}><B /></Link> })}
          </div>
        </div>
      </section>

      <section className="section2">
        <div className="container">
          <div className="head2"><h2>COMPRA POR CATEGORÍA</h2><Link className="link2" href="/categoria/laptops-pc">Ver todas las categorías <ArrowRight size={14} /></Link></div>
          <div className="cat2-grid">
            {categories.slice(0, 5).map((c) => (
              <Link className="cat2-card" key={c.slug} href={`/categoria/${c.slug}`}>
                <div className="cat2-thumb"><ProductImage image={c.image} /></div>
                <b>{c.name}</b><span className="cat2-more">Ver más <ArrowRight size={12} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section2">
        <div className="container">
          <div className="head2"><h2>PRODUCTOS DESTACADOS</h2><Link className="link2" href="/categoria/laptops-pc">Ver todos <ArrowRight size={14} /></Link></div>
          <div className="ccard-grid">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </section>
    </>
  )
}
