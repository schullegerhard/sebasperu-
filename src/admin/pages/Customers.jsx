import { useState } from 'react'
import { Customers as CustApi, Orders } from '../../services/api.js'
import { PageHead, Modal, useAsync, Spinner } from '../components.jsx'
import { peso, fdate } from '../../lib/util.js'

export default function Customers() {
  const { data, loading } = useAsync(() => Promise.all([CustApi.list(), Orders.list().catch(() => [])]).then(([customers, orders]) => ({ customers, orders })), [])
  const [q, setQ] = useState('')
  const [view, setView] = useState(null)
  if (loading || !data) return <Spinner />

  const { customers, orders } = data
  const filtered = customers.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()))
  const history = (c) => orders.filter((o) => o.email === c.email)

  return (
    <div>
      <PageHead title="Clientes" subtitle={`${customers.length} clientes registrados`} />
      <div className="adm-toolbar"><div className="adm-search"><input placeholder="Buscar cliente…" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <div className="adm-card nopad">
        <table className="adm-table">
          <thead><tr><th>Cliente</th><th>Tipo</th><th>Pedidos</th><th>Total gastado</th><th>Cliente desde</th><th></th></tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td><div className="adm-prodcell"><div className="adm-avatar sm">{c.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div><div><b>{c.name}</b><span className="muted">{c.email}</span></div></div></td>
                <td><span className={`adm-chip ${c.type === 'Empresa' ? 'biz' : ''}`}>{c.type}</span></td>
                <td>{c.orders}</td><td><b>{peso(c.spent)}</b></td><td>{fdate(String(c.since).slice(0, 10))}</td>
                <td><button className="adm-btn link" onClick={() => setView(c)}>Ver historial</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {view && (
        <Modal title={view.name} onClose={() => setView(null)}>
          <p className="muted">{view.email} · {view.phone}</p>
          <div className="adm-cust-stats"><div><b>{view.orders}</b><span>Pedidos</span></div><div><b>{peso(view.spent)}</b><span>Total gastado</span></div><div><b>{fdate(String(view.since).slice(0, 10))}</b><span>Cliente desde</span></div></div>
          <h4>Historial de compras</h4>
          <table className="adm-table compact"><tbody>
            {history(view).map((o) => <tr key={o.id}><td><b>{o.code}</b></td><td>{fdate(String(o.date).slice(0, 10))}</td><td>{o.status}</td><td className="right">{peso(o.total)}</td></tr>)}
            {history(view).length === 0 && <tr><td className="muted">Sin compras en este periodo.</td></tr>}
          </tbody></table>
        </Modal>
      )}
    </div>
  )
}
