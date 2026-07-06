import { Link } from 'react-router-dom'
import { ProductImage } from '../components/imageMap.jsx'
import { Breadcrumbs, Stars } from '../components/ui.jsx'
import { Cart } from '../components/Icons.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { useProductOverrides, applyOverride } from '../context/ProductOverrides.jsx'
import { products, peso } from '../data/catalog.js'
import { useSeo } from '../lib/seo.js'

// Comparador de productos (requisito 11).
export default function Compare() {
  const { compare, toggleCompare, addToCart } = useStore()
  const overrides = useProductOverrides()
  useSeo({ title: 'Comparador de productos', path: '/comparar', description: 'Compara productos de tecnología lado a lado en SebasPeru.' })

  const items = compare
    .map((c) => applyOverride(products.find((p) => p.id === c.id), overrides[c.id]))
    .filter(Boolean)

  if (items.length === 0) {
    return (
      <div className="container page">
        <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Comparar' }]} />
        <div className="empty-state">
          <h2>No hay productos para comparar</h2>
          <p className="muted">Usa el botón ⇄ en cualquier producto para añadirlo al comparador (hasta 4).</p>
          <Link className="btn-primary" to="/categoria/laptops-pc">Ver productos</Link>
        </div>
      </div>
    )
  }

  // Conjunto unión de especificaciones para alinear filas.
  const specKeys = [...new Set(items.flatMap((p) => Object.keys(p.specs)))]

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Comparar' }]} />
      <h1 className="page-title">Comparador de productos</h1>

      <div className="compare-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="sticky-col"></th>
              {items.map((p) => (
                <th key={p.id}>
                  <div className="cmp-thumb"><ProductImage image={p.image} /></div>
                  <Link to={`/producto/${p.slug}`} className="cmp-name">{p.name}</Link>
                  <button className="cmp-remove" onClick={() => toggleCompare(p)}>Quitar ✕</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><th className="sticky-col">Precio</th>{items.map((p) => <td key={p.id}><b className="price">{peso(p.price)}</b></td>)}</tr>
            <tr><th className="sticky-col">Marca</th>{items.map((p) => <td key={p.id}>{p.brand}</td>)}</tr>
            <tr><th className="sticky-col">Valoración</th>{items.map((p) => <td key={p.id}><Stars value={p.rating} /> {p.rating}</td>)}</tr>
            <tr><th className="sticky-col">Disponibilidad</th>{items.map((p) => <td key={p.id}>{p.stock > 0 ? `En stock (${p.stock})` : 'Agotado'}</td>)}</tr>
            {specKeys.map((k) => (
              <tr key={k}><th className="sticky-col">{k}</th>{items.map((p) => <td key={p.id}>{p.specs[k] || '—'}</td>)}</tr>
            ))}
            <tr>
              <th className="sticky-col"></th>
              {items.map((p) => (
                <td key={p.id}><button className="add-btn" onClick={() => addToCart(p)}><Cart size={15} /> Agregar</button></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
