import { useState } from 'react'
import { Coupons as CouponsApi } from '../../services/api.js'
import { useAuth } from '../AuthContext.jsx'
import { PageHead, Modal, useAsync, Spinner } from '../components.jsx'
import { Plus, Pencil, Trash, Ticket } from '../../components/Icons.jsx'
import { peso, fdate } from '../../lib/util.js'

const blank = { code: '', type: '%', value: 10, expires: '', minBuy: 0, active: true }

export default function Coupons() {
  const { canManage } = useAuth()
  const editable = canManage('coupons')
  const { data: rows, loading, reload } = useAsync(() => CouponsApi.list(), [])
  const [modal, setModal] = useState(null)
  const [del, setDel] = useState(null)
  if (loading || !rows) return <Spinner />

  const save = async (e) => { e.preventDefault(); await CouponsApi.save({ ...modal, value: Number(modal.value), minBuy: Number(modal.minBuy), code: modal.code.toUpperCase() }); setModal(null); reload() }
  const fmtVal = (c) => c.type === '%' ? `${c.value}%` : c.type === 'envio' ? 'Envío gratis' : peso(c.value)
  const expired = (c) => c.expires && String(c.expires).slice(0, 10) < '2026-06-23'

  return (
    <div>
      <PageHead title="Cupones y Promociones" subtitle={`${rows.length} cupones`}>
        {editable && <button className="adm-btn primary" onClick={() => setModal({ ...blank })}><Plus size={16} /> Nuevo cupón</button>}
      </PageHead>
      <div className="adm-card nopad">
        <table className="adm-table">
          <thead><tr><th>Código</th><th>Descuento</th><th>Compra mínima</th><th>Vence</th><th>Usos</th><th>Estado</th>{editable && <th></th>}</tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td><span className="adm-coupon"><Ticket size={14} /> {c.code}</span></td>
                <td><b>{fmtVal(c)}</b></td><td>{c.minBuy ? peso(c.minBuy) : '—'}</td>
                <td className={expired(c) ? 'adm-exp' : ''}>{fdate(String(c.expires).slice(0, 10))}</td><td>{c.uses}</td>
                <td><button className={`adm-toggle ${c.active && !expired(c) ? 'on' : ''}`} disabled={!editable} onClick={async () => { await CouponsApi.toggle(c.id); reload() }}><i /></button></td>
                {editable && <td><div className="adm-rowactions"><button onClick={() => setModal({ ...c, expires: String(c.expires || '').slice(0, 10) })}><Pencil size={15} /></button><button className="danger" onClick={() => setDel(c)}><Trash size={15} /></button></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.id ? 'Editar cupón' : 'Nuevo cupón'} onClose={() => setModal(null)}>
          <form className="adm-form" onSubmit={save}>
            <div className="adm-form-grid">
              <label>Código <i>*</i><input required value={modal.code} onChange={(e) => setModal({ ...modal, code: e.target.value })} placeholder="DESCUENTO10" /></label>
              <label>Tipo<select value={modal.type} onChange={(e) => setModal({ ...modal, type: e.target.value })}><option value="%">Porcentaje (%)</option><option value="S/">Monto fijo (S/)</option><option value="envio">Envío gratis</option></select></label>
              <label>Valor<input type="number" value={modal.value} disabled={modal.type === 'envio'} onChange={(e) => setModal({ ...modal, value: e.target.value })} /></label>
              <label>Compra mínima (S/)<input type="number" value={modal.minBuy} onChange={(e) => setModal({ ...modal, minBuy: e.target.value })} /></label>
              <label>Fecha de vencimiento<input type="date" value={modal.expires} onChange={(e) => setModal({ ...modal, expires: e.target.value })} /></label>
              <label className="adm-switch row"><input type="checkbox" checked={modal.active} onChange={(e) => setModal({ ...modal, active: e.target.checked })} /> Activo</label>
            </div>
            <div className="adm-form-foot"><button type="button" className="adm-btn ghost" onClick={() => setModal(null)}>Cancelar</button><button className="adm-btn primary">Guardar</button></div>
          </form>
        </Modal>
      )}
      {del && (
        <Modal title="Eliminar cupón" onClose={() => setDel(null)}>
          <p>¿Eliminar el cupón <b>{del.code}</b>?</p>
          <div className="adm-form-foot"><button className="adm-btn ghost" onClick={() => setDel(null)}>Cancelar</button><button className="adm-btn danger" onClick={async () => { await CouponsApi.remove(del.id); setDel(null); reload() }}>Eliminar</button></div>
        </Modal>
      )}
    </div>
  )
}
