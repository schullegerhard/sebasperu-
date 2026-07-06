import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth, DEMO_USERS } from '../AuthContext.jsx'
import { Lock, User, ShieldCheck } from '../../components/Icons.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [recover, setRecover] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const r = await login(email, pass)
    setBusy(false)
    if (!r.ok) return setErr(r.error)
    nav(loc.state?.from || '/admin', { replace: true })
  }

  const quick = (u) => { setEmail(u.email); setPass(u.pass); setErr('') }

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <div className="logo-mark"><svg width="30" height="30" viewBox="0 0 32 32"><text x="16" y="24.5" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="27" fontWeight="900" fill="#fff">S</text></svg></div>
          <div><strong>SEBASTPERU</strong><span>Panel de administración</span></div>
        </div>

        {recover ? (
          <form className="adm-login-form" onSubmit={(e) => { e.preventDefault(); setRecover(false); alert('Te enviamos un enlace de recuperación a tu correo.') }}>
            <h2>Recuperar contraseña</h2>
            <label>Correo electrónico<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" /></label>
            <button className="adm-btn primary block" type="submit">Enviar enlace</button>
            <button type="button" className="adm-link" onClick={() => setRecover(false)}>← Volver a iniciar sesión</button>
          </form>
        ) : (
          <form className="adm-login-form" onSubmit={submit}>
            <h2>Iniciar sesión</h2>
            {err && <div className="adm-login-err">{err}</div>}
            <label>Correo electrónico
              <span className="adm-inp-ic"><User size={17} /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@sebasperu.com" /></span>
            </label>
            <label>Contraseña
              <span className="adm-inp-ic"><Lock size={17} /><input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" /></span>
            </label>
            <button className="adm-btn primary block" type="submit" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
            <button type="button" className="adm-link" onClick={() => setRecover(true)}>¿Olvidaste tu contraseña?</button>
          </form>
        )}

        <div className="adm-demo">
          <p><ShieldCheck size={14} /> Cuentas demo (clic para autocompletar):</p>
          <div className="adm-demo-list">
            {DEMO_USERS.map((u) => (
              <button key={u.email} className="adm-demo-chip" onClick={() => quick(u)} type="button">
                <b>{u.role}</b><span>{u.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
