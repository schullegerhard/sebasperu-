import { Link } from 'react-router-dom'
import { Reports } from '../../services/api.js'
import { PageHead, StatCard, LineChart, BarList, StatusBadge, useAsync, Spinner } from '../components.jsx'
import { Wallet, Clipboard, Users, Box, AlertTriangle, ArrowRight } from '../../components/Icons.jsx'
import { peso, fdate } from '../../lib/util.js'

export default function Dashboard() {
  const { data, loading } = useAsync(() => Reports.data(), [])
  if (loading || !data) return <Spinner />

  const { products, orders, customers } = data
  const k = Reports.kpis(data)
  const sales = Reports.salesByDay(orders)
  const recent = orders.slice(0, 6)
  const low = Reports.lowStock(products).slice(0, 5)
  const top = Reports.topProducts(products).map((p) => ({ label: p.name, value: p.reviews, display: `${p.reviews} ventas` }))

  return (
    <div>
      <PageHead title="Dashboard" subtitle="Resumen general de tu tienda" />
      <div className="adm-stats">
        <StatCard tone="blue" icon={<Wallet size={20} />} label="Ventas del día" value={peso(k.salesToday)} hint="20 Jun 2026" />
        <StatCard tone="green" icon={<Clipboard size={20} />} label="Pedidos" value={k.ordersTotal} hint={`${k.ordersPending} pendientes`} />
        <StatCard tone="violet" icon={<Users size={20} />} label="Clientes" value={k.customers} hint="registrados" />
        <StatCard tone="amber" icon={<Box size={20} />} label="Productos" value={k.products} hint={`${k.lowStock} con bajo stock`} />
      </div>

      <div className="adm-grid-2">
        <div className="adm-card">
          <div className="adm-card-head"><h3>Ventas (últimos días)</h3><b className="adm-revenue">{peso(k.revenue)}</b></div>
          <LineChart data={sales} />
        </div>
        <div className="adm-card">
          <div className="adm-card-head"><h3>Productos más vendidos</h3></div>
          <BarList items={top} />
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-card">
          <div className="adm-card-head"><h3>Pedidos recientes</h3><Link className="adm-link" to="/admin/pedidos">Ver todos <ArrowRight size={13} /></Link></div>
          <table className="adm-table compact">
            <thead><tr><th>Pedido</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {recent.map((o) => <tr key={o.id}><td><b>{o.code}</b></td><td>{o.customer}</td><td>{peso(o.total)}</td><td><StatusBadge status={o.status} /></td></tr>)}
              {recent.length === 0 && <tr><td colSpan="4" className="muted">Sin pedidos visibles para tu rol.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="adm-card">
          <div className="adm-card-head"><h3><AlertTriangle size={16} /> Bajo stock</h3><Link className="adm-link" to="/admin/inventario">Inventario <ArrowRight size={13} /></Link></div>
          <table className="adm-table compact">
            <thead><tr><th>Producto</th><th>SKU</th><th>Stock</th></tr></thead>
            <tbody>
              {low.map((p) => <tr key={p.id}><td>{p.name}</td><td className="muted">{p.sku}</td><td><span className={`adm-stockpill ${p.stock <= 5 ? 'crit' : 'warn'}`}>{p.stock}</span></td></tr>)}
              {low.length === 0 && <tr><td colSpan="3" className="muted">Sin alertas de stock 🎉</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
