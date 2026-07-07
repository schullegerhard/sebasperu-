import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../admin/AuthContext.jsx'
import {
  Grid, Box, Layers, Clipboard, Users, Boxes, Ticket, BarChart, Settings as Gear,
  LogOut, Menu, Bell, Search, Tag, Zap,
} from '../components/Icons.jsx'

const NAV = [
  { to: '/admin', label: 'Dashboard', perm: 'dashboard', icon: <Grid size={18} />, end: true },
  { to: '/admin/productos', label: 'Productos', perm: 'products', icon: <Box size={18} /> },
  { to: '/admin/categorias', label: 'Categorías', perm: 'products', icon: <Layers size={18} /> },
  { to: '/admin/atributos', label: 'Atributos', perm: 'products', icon: <Tag size={18} /> },
  { to: '/admin/pedidos', label: 'Pedidos', perm: 'orders', icon: <Clipboard size={18} /> },
  { to: '/admin/clientes', label: 'Clientes', perm: 'customers', icon: <Users size={18} /> },
  { to: '/admin/inventario', label: 'Inventario', perm: 'inventory', icon: <Boxes size={18} /> },
  { to: '/admin/cupones', label: 'Cupones', perm: 'coupons', icon: <Ticket size={18} /> },
  { to: '/admin/banners', label: 'Banners', perm: 'banners', icon: <Zap size={18} /> },
  { to: '/admin/reportes', label: 'Reportes', perm: 'reports', icon: <BarChart size={18} /> },
  { to: '/admin/configuracion', label: 'Configuración', perm: 'settings', icon: <Gear size={18} /> },
]

export default function AdminLayout({ children }) {
  const { user, logout, can } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const items = NAV.filter((n) => can(n.perm))
  const initials = (user?.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('')

  const doLogout = () => { logout(); nav('/admin/login') }

  return (
    <div className={`adm ${open ? 'sb-open' : ''}`}>
      <aside className="adm-sidebar">
        <Link to="/admin" className="adm-brand">
          <div className="logo-mark"><svg width="26" height="26" viewBox="0 0 32 32"><text x="16" y="24.5" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="27" fontWeight="900" fill="#fff">S</text></svg></div>
          <div className="adm-brand-txt"><strong>SEBASTPERU</strong><span>Administrador</span></div>
        </Link>
        <nav className="adm-nav">
          {items.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
              className={({ isActive }) => `adm-navlink ${isActive ? 'active' : ''}`}>
              {n.icon} <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="adm-logout" onClick={doLogout}><LogOut size={18} /> Cerrar sesión</button>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <button className="adm-burger" onClick={() => setOpen((o) => !o)} aria-label="Menú"><Menu size={20} /></button>
          <div className="adm-topsearch"><Search size={16} /><input placeholder="Buscar en el panel…" /></div>
          <div className="adm-topright">
            <Link to="/" className="adm-viewsite" target="_blank">Ver tienda ↗</Link>
            <button className="adm-bell" aria-label="Notificaciones"><Bell size={18} /><i /></button>
            <div className="adm-user">
              <div className="adm-avatar">{initials}</div>
              <div className="adm-user-txt"><b>{user?.name}</b><span>{user?.role}</span></div>
            </div>
          </div>
        </header>
        <div className="adm-content">{children}</div>
      </div>

      {open && <div className="adm-sb-backdrop" onClick={() => setOpen(false)} />}
    </div>
  )
}
