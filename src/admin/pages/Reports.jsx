import { Reports as Rep } from '../../services/api.js'
import { PageHead, StatCard, LineChart, BarList, useAsync, Spinner } from '../components.jsx'
import { Wallet, Clipboard, Users, Box } from '../../components/Icons.jsx'
import { peso } from '../../lib/util.js'

export default function Reports() {
  const { data, loading } = useAsync(() => Rep.data(), [])
  if (loading || !data) return <Spinner />

  const { products, orders, customers } = data
  const k = Rep.kpis(data)
  const sales = Rep.salesByDay(orders)
  const top = Rep.topProducts(products).map((p) => ({ label: p.name, value: p.reviews, display: `${p.reviews}` }))
  const freq = {}
  orders.forEach((o) => { freq[o.customer] = (freq[o.customer] || 0) + 1 })
  const frequent = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, value]) => ({ label, value, display: `${value} pedidos` }))

  const exportCsv = () => {
    const rowsCsv = [['Pedido', 'Cliente', 'Fecha', 'Estado', 'Total'], ...orders.map((o) => [o.code, o.customer, String(o.date).slice(0, 10), o.status, o.total])]
    const csv = rowsCsv.map((r) => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'reporte-ventas.csv'; a.click()
  }

  return (
    <div>
      <PageHead title="Reportes" subtitle="Ventas, productos y clientes">
        <button className="adm-btn ghost" onClick={exportCsv}>⬇ Exportar CSV</button>
      </PageHead>
      <div className="adm-stats">
        <StatCard tone="green" icon={<Wallet size={20} />} label="Ingresos (periodo)" value={peso(k.revenue)} />
        <StatCard tone="blue" icon={<Clipboard size={20} />} label="Pedidos" value={k.ordersTotal} />
        <StatCard tone="violet" icon={<Users size={20} />} label="Clientes" value={k.customers} />
        <StatCard tone="amber" icon={<Box size={20} />} label="Ticket promedio" value={peso(k.revenue / Math.max(1, k.ordersTotal))} />
      </div>
      <div className="adm-card"><div className="adm-card-head"><h3>Ventas por día</h3></div><LineChart data={sales} height={260} /></div>
      <div className="adm-grid-2">
        <div className="adm-card"><div className="adm-card-head"><h3>Productos más vendidos</h3></div><BarList items={top} /></div>
        <div className="adm-card"><div className="adm-card-head"><h3>Clientes frecuentes</h3></div><BarList items={frequent} /></div>
      </div>
    </div>
  )
}
