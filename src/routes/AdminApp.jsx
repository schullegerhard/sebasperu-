import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../admin/AuthContext.jsx'
import { ProtectedRoute } from '../admin/components.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import Login from '../admin/pages/Login.jsx'
import Dashboard from '../admin/pages/Dashboard.jsx'
import Products from '../admin/pages/Products.jsx'
import Categories from '../admin/pages/Categories.jsx'
import AttributesPage from '../admin/pages/Attributes.jsx'
import Orders from '../admin/pages/Orders.jsx'
import Customers from '../admin/pages/Customers.jsx'
import Inventory from '../admin/pages/Inventory.jsx'
import Coupons from '../admin/pages/Coupons.jsx'
import Reports from '../admin/pages/Reports.jsx'
import Settings from '../admin/pages/Settings.jsx'
import '../admin/admin.css'

// Cada página protegida se envuelve con su permiso y el layout del panel.
const guard = (perm, El) => (
  <ProtectedRoute perm={perm}><AdminLayout><El /></AdminLayout></ProtectedRoute>
)

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={guard('dashboard', Dashboard)} />
        <Route path="productos" element={guard('products', Products)} />
        <Route path="categorias" element={guard('products', Categories)} />
        <Route path="atributos" element={guard('products', AttributesPage)} />
        <Route path="pedidos" element={guard('orders', Orders)} />
        <Route path="clientes" element={guard('customers', Customers)} />
        <Route path="inventario" element={guard('inventory', Inventory)} />
        <Route path="cupones" element={guard('coupons', Coupons)} />
        <Route path="reportes" element={guard('reports', Reports)} />
        <Route path="configuracion" element={guard('settings', Settings)} />
        <Route path="*" element={guard('dashboard', Dashboard)} />
      </Routes>
    </AuthProvider>
  )
}
