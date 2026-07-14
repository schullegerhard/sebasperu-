'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ProductImage } from './imageMap.jsx'
import { Search, X, Star, Heart, Cart } from './Icons.jsx'
import { peso } from '../lib/catalog.js'
import { useCart } from './CartProvider.jsx'

const COVER = { objectFit: 'cover', width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }

// Sección "Sobre esta categoría" (mismos textos/imágenes del diseño de App 1).
const CATEGORY_INFO = {
  'laptops-pc': {
    title: 'Laptops para trabajo, estudio y gaming',
    description: 'Encuentra la laptop ideal para cada necesidad. En SebasPeru contamos con los mejores modelos de HP, Lenovo, Dell, Asus y más marcas líderes con garantía oficial. Procesadores Intel Core de última generación y AMD Ryzen para máximo rendimiento.',
    bullets: ['Garantía oficial de fábrica 12 meses', 'Procesadores Intel Core i5, i7 y AMD Ryzen 5, 7', 'Memoria RAM desde 8 GB hasta 32 GB', 'Almacenamiento SSD NVMe de alta velocidad', 'Envío a todo el Perú en 24-48 horas'],
    image: '/img/photo-1611186871348-b1ce696e52c9.jpg', bg: '#eef3ff',
  },
  impresoras: {
    title: 'Impresoras para el hogar y la oficina',
    description: 'Soluciones de impresión para todo tipo de necesidades. Desde impresoras de tinta para el hogar hasta equipos láser de alto rendimiento para oficinas. Contamos con impresoras multifunción, de tanque de tinta, láser y matriciales de las mejores marcas.',
    bullets: ['Impresoras inkjet, láser y de tanque de tinta', 'Multifunción: imprime, escanea y copia', 'Conectividad Wi-Fi y USB', 'Compatible con tintas y tóner originales', 'Ideal para hogar, PYME y grandes empresas'],
    image: '/img/photo-1503694978374-8a2fa686963a.jpg', bg: '#f0f7ff',
  },
  toner: {
    title: 'Tóner original para impresoras láser',
    description: 'Tóner original y compatible para todas las marcas y modelos de impresoras láser. Garantizamos la mejor calidad de impresión con el rendimiento óptimo para tu equipo. Disponemos de stock permanente de HP, Samsung, Brother, Canon y más.',
    bullets: ['Tóner original y compatible certificado', 'HP, Samsung, Brother, Canon, Kyocera y más', 'Rendimiento garantizado por páginas', 'Stock permanente disponible', 'Entrega express en Lima 24h'],
    image: '/img/photo-1586953208448-b95a79798f07.jpg', bg: '#f5f5f5',
  },
  tintas: {
    title: 'Tintas para impresoras de inyección',
    description: 'Cartuchos de tinta y botellas para impresoras de inyección de las principales marcas. Tintas originales HP, Epson, Canon y Brother para obtener impresiones de alta calidad con los colores más vibrantes y mayor durabilidad.',
    bullets: ['Cartuchos originales y botellas de tinta', 'HP, Epson, Canon y Brother', 'Alta definición en color y negro', 'Compatible con impresoras EcoTank y DeskJet', 'Precio justo con garantía de calidad'],
    image: '/img/photo-1612815154858-60aa4c59eaa6.jpg', bg: '#fff8f0',
  },
}

const Stars = ({ value = 5 }) => (
  <span className="pc-stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={12} style={{ opacity: i < Math.round(value) ? 1 : .3 }} />)}</span>
)

function CatProductCard({ p }) {
  const { addToCart } = useCart()
  const href = `/producto/${p.slug}`
  const off = p.off || (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0)
  const cuota = Math.round(p.price / 6)
  return (
    <div className="pcard">
      {p.badge ? <span className="pcard-badge nuevo">{p.badge}</span> : off > 0 ? <span className="pcard-badge disc">-{off}%</span> : null}
      <button className="pcard-fav" aria-label="Favorito"><Heart size={16} /></button>
      <Link href={href} className="pcard-thumb" aria-label={`Ver ${p.name}`}><ProductImage image={p.image} tint={p.tint} label={p.label} seed={p.id} brand={p.brand} alt={p.name} style={COVER} /></Link>
      <div className="pcard-body">
        <span className="pcard-brand">{p.brand}</span>
        <Link href={href} className="pcard-name">{p.name}</Link>
        <div className="pcard-rating"><Stars value={p.rating} /> <span>({(p.reviews || 0).toLocaleString('en-US')})</span></div>
        <div className="pcard-price"><span className="now">{peso(p.price).replace('.00', '')}</span>{p.oldPrice && <span className="old">{peso(p.oldPrice).replace('.00', '')}</span>}</div>
        <p className="pcard-cuota">6 cuotas de <b>{peso(cuota).replace('.00', '')}</b></p>
        <button className="pcard-add" onClick={() => addToCart(p)}><Cart size={14} /> Agregar al carrito</button>
      </div>
    </div>
  )
}

// Sidebar de filtros + grilla de resultados (cliente), con la misma maqueta que
// App 1 (src/pages/Catalog.jsx). Recibe los productos ya agregados desde el
// servidor (la categoría padre incluye sus hijas) y las definiciones de atributos.
export default function CategoryFilters({ slug, meta, cat, products = [], cats = [], attrDefs = [] }) {
  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))], [products])
  const prices = products.map((p) => Number(p.price) || 0)
  const minP = prices.length ? Math.min(...prices) : 0
  const maxP = prices.length ? Math.max(...prices) : 9999

  const [selBrands, setSelBrands] = useState([])
  const [searchLocal, setSearchLocal] = useState('')
  const [pMin, setPMin] = useState(minP)
  const [pMax, setPMax] = useState(maxP)
  const [minRating, setMinRating] = useState(0)
  const [sort, setSort] = useState('destacados')
  const [selAttrs, setSelAttrs] = useState({})

  useEffect(() => { setSelBrands([]); setSearchLocal(''); setPMin(minP); setPMax(maxP); setMinRating(0); setSort('destacados'); setSelAttrs({}) }, [slug, minP, maxP])

  // Facetas de atributos marcados como "Filtro" (excluye Marca: ya hay filtro de marca).
  const attrFacets = useMemo(() => {
    const facets = new Map()
    for (const p of products) for (const a of (p.attributes || [])) {
      if (!a || !a.filter || !a.name || a.value == null || a.value === '') continue
      const name = String(a.name).trim(); if (/^(marca|brand)$/i.test(name)) continue
      if (!facets.has(name)) facets.set(name, new Set())
      facets.get(name).add(String(a.value).trim())
    }
    const order = (n) => { const i = attrDefs.findIndex((d) => d.name.toLowerCase() === n.toLowerCase()); return i < 0 ? 999 : i }
    return [...facets.entries()].map(([name, vals]) => ({ name, values: [...vals] })).sort((a, b) => order(a.name) - order(b.name))
  }, [products, attrDefs])

  const toggleBrand = (b) => setSelBrands((p) => (p.includes(b) ? p.filter((x) => x !== b) : [...p, b]))
  const toggleAttr = (name, value) => setSelAttrs((prev) => {
    const cur = prev[name] || []; const next = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]
    const out = { ...prev, [name]: next }; if (!next.length) delete out[name]; return out
  })
  const activeAttrs = Object.entries(selAttrs).filter(([, v]) => v.length)
  const clearFilters = () => { setSelBrands([]); setSearchLocal(''); setPMin(minP); setPMax(maxP); setMinRating(0); setSelAttrs({}) }
  const hasFilters = Boolean(selBrands.length || searchLocal || pMin > minP || pMax < maxP || minRating > 0 || activeAttrs.length)

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      if (selBrands.length && !selBrands.includes(p.brand)) return false
      const price = Number(p.price) || 0
      if (price < pMin || price > pMax) return false
      if (minRating && (p.rating || 0) < minRating) return false
      if (searchLocal && !p.name.toLowerCase().includes(searchLocal.toLowerCase())) return false
      for (const [name, vals] of activeAttrs) {
        const ok = (p.attributes || []).some((a) => a.filter && String(a.name).trim() === name && vals.includes(String(a.value).trim()))
        if (!ok) return false
      }
      return true
    })
    if (sort === 'precio-asc') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'precio-desc') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'rating') r = [...r].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return r
  }, [products, selBrands, pMin, pMax, minRating, searchLocal, sort, activeAttrs])

  const title = meta?.title || cat?.name || (products[0]?.categoryLabel) || 'Catálogo'
  const info = CATEGORY_INFO[slug]

  return (
    <div className="cat-layout">
      {/* Sidebar */}
      <aside className="cat-filters">
        <div className="cat-filters-head">
          <h3>Filtros</h3>
          {hasFilters ? <button className="cat-clear" onClick={clearFilters}>Limpiar</button> : null}
        </div>
        <div className="cat-fbox">
          <p className="cat-fbox-t">Buscar</p>
          <div className="cat-search"><Search size={13} /><input value={searchLocal} onChange={(e) => setSearchLocal(e.target.value)} placeholder="Buscar en esta categoría…" /></div>
        </div>
        {brands.length > 0 && (
          <div className="cat-fbox">
            <p className="cat-fbox-t">Marca</p>
            {brands.map((b) => (
              <label className="cat-check" key={b}>
                <input type="checkbox" checked={selBrands.includes(b)} onChange={() => toggleBrand(b)} />
                <span>{b}</span><em>{products.filter((p) => p.brand === b).length}</em>
              </label>
            ))}
          </div>
        )}
        <div className="cat-fbox">
          <p className="cat-fbox-t">Precio</p>
          <div className="cat-price">
            <label>Mínimo<input type="number" value={pMin} onChange={(e) => setPMin(Number(e.target.value))} /></label>
            <label>Máximo<input type="number" value={pMax} onChange={(e) => setPMax(Number(e.target.value))} /></label>
          </div>
          <div className="cat-price-ends"><span>{peso(minP).replace('.00', '')}</span><span>{peso(maxP).replace('.00', '')}</span></div>
        </div>
        {attrFacets.map((f) => (
          <div className="cat-fbox" key={f.name}>
            <p className="cat-fbox-t">{f.name}</p>
            {f.values.map((v) => (
              <label className="cat-check" key={v}><input type="checkbox" checked={(selAttrs[f.name] || []).includes(v)} onChange={() => toggleAttr(f.name, v)} /><span>{v}</span></label>
            ))}
          </div>
        ))}
        <div className="cat-fbox last">
          <p className="cat-fbox-t">Valoración</p>
          {[5, 4, 3].map((r) => (
            <label className="cat-check rating" key={r}>
              <input type="checkbox" checked={minRating === r} onChange={() => setMinRating(minRating === r ? 0 : r)} />
              <span className="cat-rstars">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={11} style={{ opacity: i <= r ? 1 : .3 }} />)} <em>y más</em></span>
            </label>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="cat-main">
        <div className="cat-head cat2-results-head">
          <div><h1 className="page-title">{title}</h1><p className="muted small">{filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p></div>
          <div className="cat-sort">
            <span className="muted small">Ordenar por:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </div>
        </div>

        {hasFilters && (
          <div className="cat-chips">
            {selBrands.map((b) => <span className="cat-chip" key={b}>{b}<button onClick={() => toggleBrand(b)}><X size={11} /></button></span>)}
            {searchLocal && <span className="cat-chip">"{searchLocal}"<button onClick={() => setSearchLocal('')}><X size={11} /></button></span>}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="cat-empty"><Search size={36} /><p>No encontramos productos con esos filtros</p><button onClick={clearFilters}>Limpiar filtros</button></div>
        ) : (
          <div className="pcard-grid ccard-grid">{filtered.map((p) => <CatProductCard key={p.id} p={p} />)}</div>
        )}

        {info && (
          <div className="cat-info" style={{ background: info.bg }}>
            <div className="cat-info-text">
              <span className="cat-info-eyebrow">Sobre esta categoría</span>
              <h2>{info.title}</h2>
              <p>{info.description}</p>
              <ul>{info.bullets.map((b) => <li key={b}><i /> {b}</li>)}</ul>
            </div>
            <div className="cat-info-img"><img src={info.image} alt={info.title} /></div>
          </div>
        )}
      </div>
    </div>
  )
}
