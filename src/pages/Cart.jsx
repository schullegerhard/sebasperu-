import { Link } from 'react-router-dom'
import { ProductImage } from '../components/imageMap.jsx'
import { Breadcrumbs } from '../components/ui.jsx'
import { Cart as CartIcon, ArrowRight } from '../components/Icons.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { peso } from '../data/catalog.js'
import { useSeo } from '../lib/seo.js'

export default function Cart() {
  const { cart, setQty, removeFromCart, cartTotal, cartCount } = useStore()
  useSeo({ title: 'Carrito de compras', path: '/carrito', description: 'Revisa los productos de tu carrito en SebasPeru.' })

  if (cart.length === 0) {
    return (
      <div className="container page">
        <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Carrito' }]} />
        <div className="empty-state">
          <CartIcon size={48} />
          <h2>Tu carrito está vacío</h2>
          <p className="muted">Agrega productos para continuar con tu compra.</p>
          <Link className="btn-primary" to="/categoria/laptops-pc">Ver productos</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Carrito' }]} />
      <h1 className="page-title">Carrito de compras ({cartCount})</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((i) => (
            <div className="cart-item" key={i.id}>
              <div className="ci-thumb"><ProductImage image={i.image} tint={i.tint} label={i.label} seed={i.id} brand={i.brand} /></div>
              <div className="ci-info">
                <Link to={i.href || `/producto/${i.slug}`} className="ci-name">{i.name}</Link>
                <span className="muted small">SKU: {i.sku}</span>
                <span className="ci-unit">{peso(i.price)} c/u</span>
              </div>
              <div className="qty">
                <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Disminuir">−</button>
                <input value={i.qty} onChange={(e) => setQty(i.id, Number(e.target.value) || 1)} />
                <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Aumentar">+</button>
              </div>
              <div className="ci-total">{peso(i.price * i.qty)}</div>
              <button className="ci-remove" onClick={() => removeFromCart(i.id)} aria-label="Eliminar">✕</button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Resumen</h3>
          <div className="sum-row"><span>Subtotal</span><b>{peso(cartTotal)}</b></div>
          <div className="sum-row"><span>Envío</span><span className="muted">Se calcula en el checkout</span></div>
          <div className="sum-row total"><span>Total</span><b>{peso(cartTotal)}</b></div>
          <Link className="btn-primary block" to="/checkout">Continuar compra <ArrowRight size={16} /></Link>
          <Link className="btn-ghost block" to="/categoria/laptops-pc">Seguir comprando</Link>
        </aside>
      </div>
    </div>
  )
}
