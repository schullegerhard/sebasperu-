import { useState, useEffect, useCallback } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import { X } from '../components/Icons.jsx'

// Hook genérico para cargar datos asíncronos de la API con recarga y estado.
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reload = useCallback(() => {
    setLoading(true)
    return Promise.resolve(fn())
      .then((d) => { setData(d); setError(null); return d })
      .catch((e) => setError(e))
      .finally(() => setLoading(false))
  }, deps)
  useEffect(() => { reload() }, [reload])
  return { data, loading, error, reload, setData }
}

export const Spinner = ({ label = 'Cargando…' }) => <div className="adm-spinner">{label}</div>

/* ---------- Ruta protegida ---------- */
export function ProtectedRoute({ perm, children }) {
  const { user, can } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/admin/login" state={{ from: loc.pathname }} replace />
  if (perm && !can(perm)) {
    return (
      <div className="adm-noaccess">
        <h2>Sin acceso</h2>
        <p>Tu rol (<b>{user.role}</b>) no tiene permisos para ver esta sección.</p>
      </div>
    )
  }
  return children
}

/* ---------- Encabezado de página ---------- */
export const PageHead = ({ title, subtitle, children }) => (
  <div className="adm-pagehead">
    <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    {children && <div className="adm-pagehead-actions">{children}</div>}
  </div>
)

/* ---------- Tarjeta KPI ---------- */
export const StatCard = ({ icon, label, value, hint, tone = 'blue' }) => (
  <div className="adm-stat">
    <div className={`adm-stat-ic ${tone}`}>{icon}</div>
    <div className="adm-stat-body">
      <span className="adm-stat-label">{label}</span>
      <b className="adm-stat-value">{value}</b>
      {hint && <span className="adm-stat-hint">{hint}</span>}
    </div>
  </div>
)

/* ---------- Modal ---------- */
export const Modal = ({ title, onClose, children, wide }) => (
  <div className="adm-modal-overlay" onMouseDown={onClose}>
    <div className={`adm-modal ${wide ? 'wide' : ''}`} onMouseDown={(e) => e.stopPropagation()}>
      <div className="adm-modal-head">
        <h3>{title}</h3>
        <button className="adm-modal-x" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
      </div>
      <div className="adm-modal-body">{children}</div>
    </div>
  </div>
)

/* ---------- Badge de estado de pedido ---------- */
export const StatusBadge = ({ status }) => {
  const map = {
    Pendiente: 'pend', Pagado: 'paid', Enviado: 'ship', Entregado: 'done', Cancelado: 'cancel',
  }
  return <span className={`adm-status ${map[status] || ''}`}>{status}</span>
}

/* ---------- Gráfico de líneas (SVG, sin dependencias) ---------- */
export function LineChart({ data, height = 220 }) {
  const w = 640, h = height, pad = 34
  if (!data.length) return <div className="adm-chart-empty">Sin datos</div>
  const max = Math.max(...data.map((d) => d.total)) * 1.15 || 1
  const stepX = (w - pad * 2) / Math.max(1, data.length - 1)
  const x = (i) => pad + i * stepX
  const y = (v) => h - pad - (v / max) * (h - pad * 2)
  const pts = data.map((d, i) => [x(i), y(d.total)])
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${h - pad} L${x(0)},${h - pad} Z`
  return (
    <svg className="adm-chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={pad} x2={w - pad} y1={pad + g * (h - pad * 2)} y2={pad + g * (h - pad * 2)} stroke="#eef2f7" />
      ))}
      <defs>
        <linearGradient id="admArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b4dd8" stopOpacity="0.25" />
          <stop offset="1" stopColor="#1b4dd8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#admArea)" />
      <path d={line} fill="none" stroke="#1b4dd8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke="#1b4dd8" strokeWidth="2" />)}
      {data.map((d, i) => (
        <text key={i} x={x(i)} y={h - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.date.slice(5)}</text>
      ))}
    </svg>
  )
}

/* ---------- Gráfico de barras horizontal ---------- */
export function BarList({ items }) {
  const max = Math.max(...items.map((i) => i.value)) || 1
  return (
    <div className="adm-barlist">
      {items.map((it) => (
        <div className="adm-bar-row" key={it.label}>
          <span className="adm-bar-label">{it.label}</span>
          <div className="adm-bar-track"><div className="adm-bar-fill" style={{ width: `${(it.value / max) * 100}%` }} /></div>
          <span className="adm-bar-val">{it.display ?? it.value}</span>
        </div>
      ))}
    </div>
  )
}
