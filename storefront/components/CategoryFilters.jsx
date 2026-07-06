'use client'
import { useMemo, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import { ChevronDown } from './Icons.jsx'
import { brands, peso } from '../lib/catalog.js'

// Sidebar de filtros interactivo + grilla de resultados (cliente).
// Recibe productos ya agregados desde el servidor (categoría padre incluye hijas),
// la lista de categorías (para subcategorías hijas) y las definiciones de atributos.
export default function CategoryFilters({ slug, meta, cat, products = [], cats = [], attrDefs = [] }) {
  const maxProductPrice = products.reduce((m, p) => Math.max(m, Number(p.price) || 0), 0)
  const priceRange = meta?.price || [0, Math.max(1000, Math.ceil(maxProductPrice / 100) * 100)]

  const [selBrands, setSelBrands] = useState([])
  const [maxPrice, setMaxPrice] = useState(priceRange[1])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sub, setSub] = useState('')
  const [selAttrs, setSelAttrs] = useState({})
  const [sort, setSort] = useState('relevancia')

  // Subcategorías estáticas + categorías hijas creadas en el admin.
  const subList = useMemo(() => {
    const stat = meta?.subcats
      || (cat?.subcategories?.map((s) => ({ name: s.name, slug: s.slug, count: products.filter((p) => p.subcategory === s.slug).length })) || [])
    const seen = new Set(stat.map((s) => s.slug))
    const childs = (cats || [])
      .filter((c) => c.parent === slug && !seen.has(c.slug) && c.active !== false)
      .map((c) => ({ name: c.name, slug: c.slug, count: products.filter((p) => p.category === c.slug).length }))
    return [...stat, ...childs]
  }, [meta, cat, products, cats, slug])

  const availableBrands = meta?.brandCounts
    ? meta.brandCounts
    : brands.filter((b) => products.some((p) => p.brand === b)).map((b) => [b, products.filter((p) => p.brand === b).length])

  // Facetas de atributos marcados como "Filtro" (excluye Marca: ya hay filtro de marca).
  const attrFacets = useMemo(() => {
    const facets = new Map()
    for (const p of products) {
      for (const a of (p.attributes || [])) {
        if (!a || !a.filter || !a.name || a.value == null || a.value === '') continue
        const name = String(a.name).trim()
        if (/^(marca|brand)$/i.test(name)) continue
        const value = String(a.value).trim()
        if (!facets.has(name)) facets.set(name, new Map())
        facets.get(name).set(value, (facets.get(name).get(value) || 0) + 1)
      }
    }
    const defOrder = (n) => { const i = attrDefs.findIndex((d) => d.name.toLowerCase() === n.toLowerCase()); return i < 0 ? 999 : i }
    const defValues = (n) => attrDefs.find((d) => d.name.toLowerCase() === n.toLowerCase())?.values || []
    return [...facets.entries()]
      .map(([name, vals]) => {
        const order = defValues(name)
        const values = [...vals.entries()].sort((a, b) => {
          const ia = order.indexOf(a[0]), ib = order.indexOf(b[0])
          if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
          return a[0].localeCompare(b[0], 'es', { numeric: true })
        })
        return { name, values }
      })
      .sort((a, b) => defOrder(a.name) - defOrder(b.name) || a.name.localeCompare(b.name, 'es'))
  }, [products, attrDefs])

  const toggleBrand = (b) => setSelBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))
  const toggleAttr = (name, value) => setSelAttrs((prev) => {
    const cur = prev[name] || []
    const next = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]
    const out = { ...prev, [name]: next }
    if (!next.length) delete out[name]
    return out
  })
  const clearFilters = () => { setSelBrands([]); setMaxPrice(priceRange[1]); setInStockOnly(false); setSub(''); setSelAttrs({}) }
  const activeAttrs = Object.entries(selAttrs).filter(([, v]) => v.length)

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      if (selBrands.length && !selBrands.includes(p.brand)) return false
      if ((Number(p.price) || 0) > maxPrice) return false
      if (inStockOnly && (p.stock || 0) === 0) return false
      if (sub && p.subcategory !== sub && p.category !== sub) return false
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
  }, [products, selBrands, maxPrice, inStockOnly, sub, sort, activeAttrs])

  return (
    <div className="cat2-layout">
      <aside className="cat2-filters">
        {subList.length > 0 && (
          <div className="fbox">
            <h3>Categorías</h3>
            <ul className="sub-list">
              {subList.map((s) => (
                <li key={s.slug || s.name}>
                  <button type="button" className={`sub-item ${sub === s.slug ? 'active' : ''}`} onClick={() => setSub(sub === s.slug ? '' : s.slug)}>
                    <span>{s.name}</span><em>{s.count || ''}</em>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="fbox">
          <h3>Marca</h3>
          {availableBrands.slice(0, 6).map(([b, n]) => (
            <label className="check" key={b}>
              <input type="checkbox" checked={selBrands.includes(b)} onChange={() => toggleBrand(b)} />
              <span>{b}</span><em>({n})</em>
            </label>
          ))}
        </div>

        {attrFacets.map((f) => (
          <div className="fbox" key={f.name}>
            <h3>{f.name}</h3>
            {f.values.map(([value, n]) => (
              <label className="check" key={value}>
                <input type="checkbox" checked={(selAttrs[f.name] || []).includes(value)} onChange={() => toggleAttr(f.name, value)} />
                <span>{value}</span><em>({n})</em>
              </label>
            ))}
          </div>
        ))}

        <div className="fbox">
          <h3>Precio</h3>
          <input type="range" min={priceRange[0]} max={priceRange[1]} step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
          <div className="price-ends"><span>{peso(priceRange[0]).replace('.00', '')}</span><span>{peso(maxPrice).replace('.00', '')}</span></div>
          <label className="check"><input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} /><span>Solo en stock</span></label>
          <button className="limpiar" onClick={clearFilters}>Limpiar filtros</button>
        </div>
      </aside>

      <div className="cat2-results">
        <div className="cat2-results-head">
          <div><h1 className="page-title">{meta?.title || cat?.name}</h1>{meta?.subtitle && <p className="muted">{meta.subtitle}</p>}</div>
          <div className="cat2-tools">
            <span className="muted small">Ordenar por:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevancia">Recomendados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </div>
        </div>
        {filtered.length === 0
          ? <div className="empty">No se encontraron productos con los filtros seleccionados.</div>
          : <div className="ccard-grid">{filtered.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      </div>
    </div>
  )
}
