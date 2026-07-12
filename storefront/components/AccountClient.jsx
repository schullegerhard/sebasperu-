'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCustomer, register, login, logout, myOrders } from '../lib/client.js'

const money = (n) => 'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })
const STATE = { Pendiente: 'pend', Pagado: 'done', Enviado: 'ship', Entregado: 'done', Cancelado: 'cancel' }

function Dashboard({ customer, onLogout }) {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { let a = true; myOrders().then((o) => a && setOrders(o)).catch((e) => a && setError(e.message)); return () => { a = false } }, [])
  return (
    <div className="account-dash">
      <div className="co-card account-hello">
        <div><h3>Hola, {customer.name}</h3><p className="muted">{customer.email}</p></div>
        <button className="btn-ghost" onClick={onLogout}>Cerrar sesión</button>
      </div>
      <div className="co-card">
        <h3>Mis pedidos</h3>
        {error && <p className="co-err">{error}</p>}
        {!orders && !error && <p className="muted">Cargando pedidos…</p>}
        {orders && orders.length === 0 && <p className="muted">Aún no tienes pedidos. <Link href="/">Ver productos</Link></p>}
        {orders && orders.length > 0 && (
          <table className="account-orders">
            <thead><tr><th>Pedido</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}><td><b>{o.code}</b></td><td className="muted">{o.date}</td><td>{money(o.total)}</td><td><span className={`badge ${STATE[o.status] || 'pend'}`}>{o.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function AccountClient() {
  const [customer, setCustomer] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [lf, setLf] = useState({ email: '', password: '' })
  const [rf, setRf] = useState({ name: '', email: '', password: '' })
  useEffect(() => {
    setCustomer(getCustomer())
    const sync = () => setCustomer(getCustomer())
    window.addEventListener('sp-auth', sync)
    return () => window.removeEventListener('sp-auth', sync)
  }, [])

  const doLogin = async (e) => { e.preventDefault(); setErr(''); setBusy(true); try { setCustomer(await login(lf)) } catch (x) { setErr(x.message) } finally { setBusy(false) } }
  const doRegister = async (e) => { e.preventDefault(); setErr(''); setBusy(true); try { setCustomer(await register(rf)) } catch (x) { setErr(x.message) } finally { setBusy(false) } }
  const doLogout = () => { logout(); setCustomer(null) }

  if (customer) return <Dashboard customer={customer} onLogout={doLogout} />
  return (
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
  )
}
