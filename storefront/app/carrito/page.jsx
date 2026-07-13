'use client'
import Link from 'next/link'
import { ProductImage } from '../../components/imageMap.jsx'
import { Cart as CartIcon, ArrowRight } from '../../components/Icons.jsx'
import { peso } from '../../lib/catalog.js'
import { useCart } from '../../components/CartProvider.jsx'

export default function CartPage() {
  const { cart, total, count, updateQty, removeItem } = useCart()

  if (!cart.length) {
    return (
      <div className="container page">
        <div className="empty-state">
          <CartIcon size={48} />
          <h2>Tu carrito está vacío</h2>
          <p className="muted">Agrega productos para continuar con tu compra.</p>
          <Link className="btn-primary" href="/categoria/laptops-pc">Ver productos</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page-title">Carrito de compras ({count})</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((i) => (
            <div className="cart-item" key={i.id}>
              <div className="ci-thumb"><ProductImage image={i.image} tint={i.tint} label={i.label} /></div>
              <div className="ci-info">
                <Link href={`/producto/${i.slug}`} className="ci-name">{i.name}</Link>
                <span className="muted small">SKU: {i.sku}</span>
                <span className="ci-unit">{peso(i.price)} c/u</span>
              </div>
              <div className="qty">
                <button onClick={() => updateQty(i.id, i.qty - 1)} aria-label="Disminuir">−</button>
                <input value={i.qty} onChange={(e) => updateQty(i.id, Number(e.target.value) || 1)} />
                <button onClick={() => updateQty(i.id, i.qty + 1)} aria-label="Aumentar">+</button>
              </div>
              <div className="ci-total">{peso(i.price * i.qty)}</div>
              <button className="ci-remove" onClick={() => removeItem(i.id)} aria-label="Eliminar">✕</button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Resumen</h3>
          <div className="sum-row"><span>Subtotal</span><b>{peso(total)}</b></div>
          <div className="sum-row"><span>Envío</span><span className="muted">Se calcula en el checkout</span></div>
          <div className="sum-row total"><span>Total</span><b>{peso(total)}</b></div>
          <Link className="btn-primary block" href="/checkout">Finalizar compra <ArrowRight size={16} /></Link>
          <Link className="btn-ghost block" href="/categoria/laptops-pc">Seguir comprando</Link>
        </aside>
      </div>
    </div>
  )
}
