import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header, { MinimalHeader } from './components/Header.jsx'
import Footer, { MinimalFooter } from './components/Footer.jsx'
import { Toast, FloatingWhatsApp, CookieBanner } from './components/ui.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import { trackPageView } from './lib/analytics.js'
import Home from './pages/Home.jsx'

// Code-splitting / lazy load de rutas secundarias (requisito 1: rendimiento).
const Catalog = lazy(() => import('./pages/Catalog.jsx'))
const Product = lazy(() => import('./pages/Product.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const Compare = lazy(() => import('./pages/Compare.jsx'))
const Quote = lazy(() => import('./pages/Quote.jsx'))
const Legal = lazy(() => import('./pages/Legal.jsx'))
const Misc = lazy(() => import('./pages/Misc.jsx'))
const Brands = lazy(() => import('./pages/Misc.jsx').then((m) => ({ default: m.Brands })))
const Account = lazy(() => import('./pages/Misc.jsx').then((m) => ({ default: m.Account })))
const NotFound = lazy(() => import('./pages/Misc.jsx').then((m) => ({ default: m.NotFound })))
// Panel de administración (área separada, su propio layout/auth).
const AdminApp = lazy(() => import('./routes/AdminApp.jsx'))

function ScrollAndTrack() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView(pathname + search, document.title)
  }, [pathname, search])
  return null
}

export default function App() {
  const { pathname } = useLocation()

  // El panel /admin tiene su propio layout (sin header/footer de tienda).
  if (pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<div className="route-loading">Cargando panel…</div>}>
        <Routes><Route path="/admin/*" element={<AdminApp />} /></Routes>
      </Suspense>
    )
  }

  const minimal = pathname === '/checkout'
  const headerVariant = pathname === '/' ? 'home' : 'inner'
  return (
    <>
      {minimal ? <MinimalHeader /> : <Header variant={headerVariant} />}
      <ScrollAndTrack />
      <main>
        <Suspense fallback={<div className="route-loading">Cargando…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:slug" element={<Catalog mode="category" />} />
            <Route path="/productos" element={<Catalog mode="all" />} />
            <Route path="/ofertas" element={<Catalog mode="offers" />} />
            <Route path="/buscar" element={<Catalog mode="search" />} />
            <Route path="/producto/:slug" element={<Product />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/comparar" element={<Compare />} />
            <Route path="/cotizacion" element={<Quote />} />
            <Route path="/marcas" element={<Brands />} />
            <Route path="/cuenta" element={<Account />} />
            <Route path="/legal/:page" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {minimal ? <MinimalFooter /> : <Footer />}
      {!minimal && <FloatingWhatsApp />}
      <CartDrawer />
      <Toast />
      {!minimal && <CookieBanner />}
    </>
  )
}
