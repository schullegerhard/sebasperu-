import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/ui.jsx'
import { brandLogo } from '../components/imageMap.jsx'
import { brands } from '../data/catalog.js'
import { useSeo } from '../lib/seo.js'

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

export function Account() {
  useSeo({ title: 'Mi cuenta', path: '/cuenta', description: 'Accede a tu cuenta de SebasPeru.' })
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Mi cuenta' }]} />
      <h1 className="page-title">Mi cuenta</h1>
      <div className="account-grid">
        <form className="co-card" onSubmit={(e) => e.preventDefault()}>
          <h3>Iniciar sesión</h3>
          <label className="block-label">Correo<input type="email" /></label>
          <label className="block-label">Contraseña<input type="password" /></label>
          <button className="btn-primary block">Ingresar</button>
        </form>
        <form className="co-card" onSubmit={(e) => e.preventDefault()}>
          <h3>Crear cuenta</h3>
          <label className="block-label">Nombre<input /></label>
          <label className="block-label">Correo<input type="email" /></label>
          <label className="block-label">Contraseña<input type="password" /></label>
          <button className="btn-ghost block">Registrarme</button>
        </form>
      </div>
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
