import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { ProductImage } from './imageMap.jsx'
import { X, Cart } from './Icons.jsx'
import { peso } from '../data/catalog.js'

// Panel lateral del carrito (mini-cart) que se desliza desde la derecha al
// agregar un producto. Muestra ítems, cantidad, subtotal y accesos al checkout.
export default function CartDrawer() {
  const { cart, cartTotal, cartCount, setQty, removeFromCart, cartOpen, closeCart } = useStore()

  // Cerrar con la tecla Escape.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeCart() }
    if (cartOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [cartOpen, closeCart])

  return (
    <>
      <div className={`cart-drawer-overlay ${cartOpen ? 'on' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer ${cartOpen ? 'on' : ''}`} role="dialog" aria-label="Carrito de compra" aria-hidden={!cartOpen}>
        <div className="cd-head">
          <h3>Carrito de compra</h3>
          <button className="cd-close" onClick={closeCart}><X size={17} /> Cerrar</button>
        </div>

        <div className="cd-body">
          {cart.length === 0 ? (
            <div className="cd-empty"><Cart size={40} /><p>Tu carrito está vacío</p></div>
          ) : cart.map((i) => (
            <div className="cd-item" key={i.id}>
              <Link to={i.href || '#'} className="cd-thumb" onClick={closeCart}><ProductImage image={i.image} tint={i.tint} label={i.label} seed={i.id} brand={i.brand} /></Link>
              <div className="cd-info">
                <Link to={i.href || '#'} className="cd-name" onClick={closeCart}>{i.name}</Link>
                <div className="cd-qty">
                  <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Disminuir">−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Aumentar">+</button>
                </div>
                <div className="cd-line">{i.qty} × {peso(i.price)}</div>
              </div>
              <button className="cd-remove" onClick={() => removeFromCart(i.id)} aria-label="Quitar"><X size={16} /></button>
            </div>
          ))}
        </div>

        <div className="cd-foot">
          <div className="cd-subtotal"><span>Subtotal:</span><b>{peso(cartTotal)}</b></div>
          <Link className="cd-btn ghost" to="/carrito" onClick={closeCart}>Ver carrito</Link>
          <Link className={`cd-btn primary ${cartCount === 0 ? 'disabled' : ''}`} to={cartCount ? '/checkout' : '#'} onClick={(e) => { if (!cartCount) e.preventDefault(); else closeCart() }}>Finalizar compra</Link>
        </div>
      </aside>
    </>
  )
}
