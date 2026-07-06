import { useState } from 'react'
import { Orders as OrdersApi } from '../../services/api.js'
import { useAuth } from '../AuthContext.jsx'
import { PageHead, Modal, StatusBadge, useAsync, Spinner } from '../components.jsx'
import { peso, fdate } from '../../lib/util.js'

const STATUSES = ['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado']

export default function Orders() {
  const { canManage } = useAuth()
  const editable = canManage('orders')
  const { data: rows, loading, reload } = useAsync(() => OrdersApi.list(), [])
  const [filter, setFilter] = useState('')
  const [view, setView] = useState(null)

  if (loading || !rows) return <Spinner />

  const setStatus = async (id, status) => { await OrdersApi.setStatus(id, status); setView((v) => v && v.id === id ? { ...v, status } : v); reload() }
  const filtered = filter ? rows.filter((o) => o.status === filter) : rows

  return (
    <div>
      <PageHead title="Pedidos" subtitle={`${rows.length} pedidos`} />
      <div className="adm-toolbar">
        <div className="adm-tabs">
          <button className={!filter ? 'on' : ''} onClick={() => setFilter('')}>Todos</button>
          {STATUSES.map((s) => <button key={s} className={filter === s ? 'on' : ''} onClick={() => setFilter(s)}>{s}</button>)}
        </div>
      </div>
      <div className="adm-card nopad">
        <table className="adm-table">
          <thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Pago</th><th>Total</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td><b>{o.code}</b></td><td>{o.customer}<span className="muted block">{o.email}</span></td>
                <td>{fdate(String(o.date).slice(0, 10))}</td><td>{o.payment}</td><td><b>{peso(o.total)}</b></td><td><StatusBadge status={o.status} /></td>
                <td><button className="adm-btn link" onClick={() => setView(o)}>Ver detalle</button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="7" className="muted center">No hay pedidos.</td></tr>}
          </tbody>
        </table>
      </div>

      {view && (
        <Modal title={`Pedido ${view.code}`} onClose={() => setView(null)} wide>
          <div className="adm-order-grid">
            <div><h4>Cliente</h4><p>{view.customer}<br /><span className="muted">{view.email}</span><br /><span className="muted">{view.region}</span></p><h4>Pago</h4><p>{view.payment}</p></div>
            <div>
              <h4>Productos</h4>
              <table className="adm-table compact"><tbody>{(view.items || []).map((it, i) => <tr key={i}><td>{it.qty} × {it.name}</td><td className="right">{peso(it.price)}</td></tr>)}</tbody></table>
              <div className="adm-order-total"><span>Total</span><b>{peso(view.total)}</b></div>
            </div>
          </div>
          <div className="adm-order-status">
            <h4>Estado del pedido</h4>
            {editable ? <div className="adm-statusbtns">{STATUSES.map((s) => <button key={s} className={`adm-statusbtn ${view.status === s ? 'on' : ''}`} onClick={() => setStatus(view.id, s)}>{s}</button>)}</div> : <StatusBadge status={view.status} />}
          </div>
        </Modal>
      )}
    </div>
  )
}
