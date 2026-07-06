'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ProductCard from '../../components/ProductCard.jsx'
import { products } from '../../lib/catalog.js'

function Results() {
  const sp = useSearchParams()
  const q = (sp.get('q') || '').toLowerCase().trim()
  const items = products.filter((p) =>
    p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q))
  return (
    <div className="container page">
      <h1 className="page-title" style={{ marginBottom: 6 }}>Resultados para “{q}”</h1>
      <p className="muted" style={{ marginBottom: 16 }}>{items.length} producto(s)</p>
      {items.length ? <div className="ccard-grid">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <div className="empty">No se encontraron productos.</div>}
    </div>
  )
}

export default function Buscar() {
  return <Suspense fallback={<div className="route-loading">Buscando…</div>}><Results /></Suspense>
}
