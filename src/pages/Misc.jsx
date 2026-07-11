import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/ui.jsx'
import { brandLogo } from '../components/imageMap.jsx'
import { brands, peso } from '../data/catalog.js'
import { useSeo } from '../lib/seo.js'
import { getCustomer, register, login, logout, myOrders } from '../services/account.js'

export function Brands() {
  useSeo({ title: 'Marcas', path: '/marcas', description: 'Las mejores marcas de tecnología en SebasPeru: HP, Epson, Canon, Brother, Samsung, Logitech y TP-Link.' })
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Marcas' }]} />
      <h1 className="page-title">Las mejores marcas</h1>
      <div className="brands-page">
        {brands.map((b) => {
          const B = brandLogo[b]
          return <Link className="brand-tile" key={b} to={`/buscar?q=${b}`}>{B ? <B /> : <span className="brand-name">{b}</span>}</Link>
        })}
      </div>
    </div>
  )
}

const ORDER_STATE = { Pendiente: 'pend', Pagado: 'done', Enviado: 'ship', Entregado: 'done', Cancelado: 'cancel' }

// Panel del cliente autenticado: datos + historial de pedidos.
function AccountDashboard({ customer, onLogout }) {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let alive = true
    myOrders().then((o) => alive && setOrders(o)).catch((e) => alive && setError(e.message))
    return () => { alive = false }
  }, [])
  return (
    <div className="account-dash">
      <div className="co-card account-hello">
        <div><h3>Hola, {customer.name}</h3><p className="muted">{customer.email}</p></div>
        <button className="adm-btn ghost" onClick={onLogout}>Cerrar sesión</button>
      </div>
      <div className="co-card">
        <h3>Mis pedidos</h3>
        {error && <p className="co-err">{error}</p>}
        {!orders && !error && <p className="muted">Cargando pedidos…</p>}
        {orders && orders.length === 0 && (
          <div className="account-empty"><p className="muted">Aún no tienes pedidos.</p><Link className="btn-primary" to="/productos">Ver productos</Link></div>
        )}
        {orders && orders.length > 0 && (
          <table className="account-orders">
            <thead><tr><th>Pedido</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><b>{o.code}</b></td>
                  <td className="muted">{o.date}</td>
                  <td>{peso(Number(o.total)).replace('.00', '')}</td>
                  <td><span className={`adm-status ${ORDER_STATE[o.status] || 'pend'}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export function Account() {
  useSeo({ title: 'Mi cuenta', path: '/cuenta', description: 'Accede a tu cuenta de SebasPeru para ver tus pedidos.' })
  const [customer, setCustomer] = useState(() => getCustomer())
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [lf, setLf] = useState({ email: '', password: '' })
  const [rf, setRf] = useState({ name: '', email: '', password: '' })
  useEffect(() => {
    const sync = () => setCustomer(getCustomer())
    window.addEventListener('customer-auth', sync)
    return () => window.removeEventListener('customer-auth', sync)
  }, [])

  const doLogin = async (e) => { e.preventDefault(); setErr(''); setBusy(true); try { setCustomer(await login(lf)) } catch (x) { setErr(x.message) } finally { setBusy(false) } }
  const doRegister = async (e) => { e.preventDefault(); setErr(''); setBusy(true); try { setCustomer(await register(rf)) } catch (x) { setErr(x.message) } finally { setBusy(false) } }
  const doLogout = () => { logout(); setCustomer(null) }

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Mi cuenta' }]} />
      <h1 className="page-title">Mi cuenta</h1>
      {customer ? <AccountDashboard customer={customer} onLogout={doLogout} /> : (
        <div className="account-grid">
          {err && <p className="co-err" style={{ gridColumn: '1 / -1' }}>{err}</p>}
          <form className="co-card" onSubmit={doLogin}>
            <h3>Iniciar sesión</h3>
            <label className="block-label">Correo<input type="email" required value={lf.email} onChange={(e) => setLf({ ...lf, email: e.target.value })} /></label>
            <label className="block-label">Contraseña<input type="password" required value={lf.password} onChange={(e) => setLf({ ...lf, password: e.target.value })} /></label>
            <button className="btn-primary block" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
          </form>
          <form className="co-card" onSubmit={doRegister}>
            <h3>Crear cuenta</h3>
            <label className="block-label">Nombre<input required value={rf.name} onChange={(e) => setRf({ ...rf, name: e.target.value })} /></label>
            <label className="block-label">Correo<input type="email" required value={rf.email} onChange={(e) => setRf({ ...rf, email: e.target.value })} /></label>
            <label className="block-label">Contraseña<input type="password" required minLength={6} value={rf.password} onChange={(e) => setRf({ ...rf, password: e.target.value })} /></label>
            <button className="btn-ghost block" disabled={busy}>{busy ? 'Creando…' : 'Registrarme'}</button>
          </form>
        </div>
      )}
    </div>
  )
}

export function NotFound() {
  useSeo({ title: 'Página no encontrada', path: '/404' })
  return (
    <div className="container page">
      <div className="empty-state">
        <h1 style={{ fontSize: 64, margin: 0 }}>404</h1>
        <h2>Página no encontrada</h2>
        <p className="muted">La página que buscas no existe o fue movida.</p>
        <Link className="btn-primary" to="/">Volver al inicio</Link>
      </div>
    </div>
  )
}
