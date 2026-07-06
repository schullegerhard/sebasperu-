export const metadata = { title: 'Mi cuenta', alternates: { canonical: '/cuenta' } }
export default function Cuenta() {
  return (
    <div className="container page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>Mi cuenta</h1>
      <div className="account-grid">
        <form className="co-card"><h3>Iniciar sesión</h3><label className="block-label">Correo<input type="email" /></label><label className="block-label">Contraseña<input type="password" /></label><button className="btn-primary block" type="button">Ingresar</button></form>
        <form className="co-card"><h3>Crear cuenta</h3><label className="block-label">Nombre<input /></label><label className="block-label">Correo<input type="email" /></label><button className="btn-ghost block" type="button">Registrarme</button></form>
      </div>
    </div>
  )
}
