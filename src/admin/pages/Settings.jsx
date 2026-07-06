import { useState } from 'react'
import { Settings as SettingsApi } from '../../services/api.js'
import { useAuth, DEMO_USERS, ROLE_PERMS } from '../AuthContext.jsx'
import { PageHead, useAsync, Spinner } from '../components.jsx'
import { Check } from '../../components/Icons.jsx'

const TABS = ['Tienda', 'Pagos', 'Envíos', 'Usuarios y permisos']
const ALL_PERMS = ['dashboard', 'products', 'orders', 'customers', 'inventory', 'coupons', 'reports', 'settings']
const PERM_LABEL = { dashboard: 'Dashboard', products: 'Productos/Categorías', orders: 'Pedidos', customers: 'Clientes', inventory: 'Inventario', coupons: 'Cupones', reports: 'Reportes', settings: 'Configuración' }

export default function Settings() {
  const { canManage } = useAuth()
  const editable = canManage('settings')
  const { data, loading, setData } = useAsync(() => SettingsApi.get(), [])
  const [tab, setTab] = useState('Tienda')
  const [saved, setSaved] = useState(false)
  if (loading || !data) return <Spinner />

  const s = data
  const setS = (patch) => setData({ ...s, ...patch })
  const save = async () => { await SettingsApi.save(s); setSaved(true); setTimeout(() => setSaved(false), 1800) }
  const has = (role, perm) => { const p = ROLE_PERMS[role]; return p.includes('*') || p.includes(perm) }

  return (
    <div>
      <PageHead title="Configuración" subtitle="Datos de la tienda, pagos, envíos y permisos" />
      <div className="adm-tabs big">{TABS.map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>

      <div className="adm-card">
        {tab === 'Tienda' && (
          <div className="adm-form-grid wide">
            <label>Nombre de la tienda<input value={s.name} disabled={!editable} onChange={(e) => setS({ name: e.target.value })} /></label>
            <label>RUC<input value={s.ruc} disabled={!editable} onChange={(e) => setS({ ruc: e.target.value })} /></label>
            <label>Correo<input value={s.email} disabled={!editable} onChange={(e) => setS({ email: e.target.value })} /></label>
            <label>Teléfono<input value={s.phone} disabled={!editable} onChange={(e) => setS({ phone: e.target.value })} /></label>
            <label>WhatsApp<input value={s.whatsapp} disabled={!editable} onChange={(e) => setS({ whatsapp: e.target.value })} /></label>
            <label>Dirección<input value={s.address} disabled={!editable} onChange={(e) => setS({ address: e.target.value })} /></label>
            <label>IGV (%)<input type="number" value={s.igv} disabled={!editable} onChange={(e) => setS({ igv: Number(e.target.value) })} /></label>
          </div>
        )}
        {tab === 'Pagos' && (
          <div className="adm-toggle-list">
            {Object.entries(s.payments).map(([k, v]) => (
              <label key={k} className="adm-toggle-row"><span>{k}</span><button className={`adm-toggle ${v ? 'on' : ''}`} disabled={!editable} onClick={() => setS({ payments: { ...s.payments, [k]: !v } })}><i /></button></label>
            ))}
          </div>
        )}
        {tab === 'Envíos' && (
          <div className="adm-form-grid wide">
            <label>Envío gratis desde (S/)<input type="number" value={s.shipping.freeFrom} disabled={!editable} onChange={(e) => setS({ shipping: { ...s.shipping, freeFrom: Number(e.target.value) } })} /></label>
            <label>Tarifa Lima (S/)<input type="number" value={s.shipping.limaFee} disabled={!editable} onChange={(e) => setS({ shipping: { ...s.shipping, limaFee: Number(e.target.value) } })} /></label>
            <label>Tarifa provincia (S/)<input type="number" value={s.shipping.provinceFee} disabled={!editable} onChange={(e) => setS({ shipping: { ...s.shipping, provinceFee: Number(e.target.value) } })} /></label>
          </div>
        )}
        {tab === 'Usuarios y permisos' && (
          <div>
            <h4 className="adm-sub-h">Usuarios</h4>
            <table className="adm-table"><thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th></tr></thead>
              <tbody>{DEMO_USERS.map((u) => <tr key={u.email}><td><b>{u.name}</b></td><td className="muted">{u.email}</td><td><span className="adm-chip">{u.role}</span></td></tr>)}</tbody></table>
            <h4 className="adm-sub-h">Matriz de permisos por rol</h4>
            <div className="adm-matrix-wrap">
              <table className="adm-table matrix">
                <thead><tr><th>Rol</th>{ALL_PERMS.map((p) => <th key={p}>{PERM_LABEL[p]}</th>)}</tr></thead>
                <tbody>{Object.keys(ROLE_PERMS).map((role) => <tr key={role}><td><b>{role}</b></td>{ALL_PERMS.map((p) => <td key={p} className="center">{has(role, p) ? <span className="adm-yes"><Check size={14} /></span> : <span className="adm-no">—</span>}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {editable && tab !== 'Usuarios y permisos' && (
          <div className="adm-form-foot spread">{saved && <span className="adm-saved"><Check size={15} /> Cambios guardados</span>}<button className="adm-btn primary" onClick={save}>Guardar cambios</button></div>
        )}
      </div>
    </div>
  )
}
