'use client'
import Link from 'next/link'
import { ProductImage } from '../../components/imageMap.jsx'
import { Cart as CartIcon } from '../../components/Icons.jsx'
import { peso } from '../../lib/catalog.js'
import { useCart } from '../../components/CartProvider.jsx'

export default function CartPage() {
  const { cart, total, count } = useCart()
  if (!cart.length) {
    return (
      <div className="container page"><div className="empty-state">
        <CartIcon size={48} /><h2>Tu carrito está vacío</h2>
        <p className="muted">Agrega productos para continuar con tu compra.</p>
        <Link className="btn-primary" href="/categoria/laptops-pc">Ver productos</Link>
      </div></div>
    )
  }
  return (
    <div className="container page">
      <h1 className="page-title">Carrito ({count})</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((i) => (
            <div className="cart-item" key={i.id}>
              <div className="ci-thumb"><ProductImage image={i.image} /></div>
              <div className="ci-info"><Link href={`/producto/${i.slug}`} className="ci-name">{i.name}</Link><span className="ci-unit">{peso(i.price)} c/u · x{i.qty}</span></div>
              <div className="ci-total">{peso(i.price * i.qty)}</div>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Resumen</h3>
          <div className="sum-row total"><span>Total</span><b>{peso(total)}</b></div>
          <p className="muted small" style={{ marginTop: 12 }}>El checkout completo está disponible en la app del cliente.</p>
        </aside>
      </div>
    </div>
  )
}
