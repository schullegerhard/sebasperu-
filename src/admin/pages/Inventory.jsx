import { useState } from 'react'
import { Products } from '../../services/api.js'
import { useAuth } from '../AuthContext.jsx'
import { PageHead, StatCard, useAsync, Spinner } from '../components.jsx'
import { ProductImage } from '../../components/imageMap.jsx'
import { Boxes, AlertTriangle, Check } from '../../components/Icons.jsx'
import { peso } from '../../lib/util.js'

export default function Inventory() {
  const { canManage } = useAuth()
  const editable = canManage('inventory')
  const { data: rows, loading, reload, setData } = useAsync(() => Products.list(), [])
  const [onlyLow, setOnlyLow] = useState(false)
  if (loading || !rows) return <Spinner />

  // Optimista: refleja el cambio al instante y persiste en la API.
  const apply = (id, stock) => {
    setData(rows.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)))
    Products.setStock(id, Math.max(0, stock)).catch(() => reload())
  }
  const change = (id, delta) => { const p = rows.find((x) => x.id === id); apply(id, (p.stock || 0) + delta) }

  const low = rows.filter((p) => p.stock <= 10)
  const out = rows.filter((p) => p.stock === 0)
  const list = onlyLow ? low : rows
  const stockValue = rows.reduce((n, p) => n + p.stock * p.price, 0)

  return (
    <div>
      <PageHead title="Inventario" subtitle="Control de stock y alertas" />
      <div className="adm-stats">
        <StatCard tone="blue" icon={<Boxes size={20} />} label="Productos" value={rows.length} />
        <StatCard tone="amber" icon={<AlertTriangle size={20} />} label="Bajo stock (≤10)" value={low.length} />
        <StatCard tone="red" icon={<AlertTriangle size={20} />} label="Agotados" value={out.length} />
        <StatCard tone="green" icon={<Check size={20} />} label="Valor de inventario" value={peso(stockValue)} />
      </div>
      <div className="adm-toolbar"><label className="adm-switch"><input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} /> Mostrar solo bajo stock</label></div>
      <div className="adm-card nopad">
        <table className="adm-table">
          <thead><tr><th>Producto</th><th>SKU</th><th>Estado</th><th>Stock</th>{editable && <th>Ajustar</th>}</tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td><div className="adm-prodcell"><div className="adm-prodthumb"><ProductImage image={p.image} tint={p.tint} label={p.label} /></div><b>{p.name}</b></div></td>
                <td className="muted">{p.sku}</td>
                <td>{p.stock === 0 ? <span className="adm-status cancel">Agotado</span> : p.stock <= 10 ? <span className="adm-status pend">Bajo</span> : <span className="adm-status done">OK</span>}</td>
                <td>{editable ? <input className="adm-stockinput" type="number" value={p.stock} onChange={(e) => apply(p.id, Number(e.target.value) || 0)} /> : <b>{p.stock}</b>}</td>
                {editable && <td><div className="adm-stepper"><button onClick={() => change(p.id, -1)}>−</button><button onClick={() => change(p.id, 1)}>+</button><button className="adm-btn ghost xs" onClick={() => change(p.id, 10)}>+10</button></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
