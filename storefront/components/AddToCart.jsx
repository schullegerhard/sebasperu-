'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cart, Zap, Shield, Plus } from './Icons.jsx'
import { useCart } from './CartProvider.jsx'

// Isla cliente para la ficha de producto: renderiza el "buybox" (stock,
// cantidad, agregar/comprar y sello de confianza) con las clases `pdp-*`.
export default function AddToCart({ product }) {
  const { addToCart } = useCart()
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const doAdd = () => { addToCart(product, qty); setAdded(true); setTimeout(() => setAdded(false), 2000) }
  const buyNow = () => { addToCart(product, qty); router.push('/checkout') }
  return (
    <div className="pdp-buybox">
      <div className="pdp-stock"><i className="dot" /> <b>En stock</b> <small>· Retiro en 24 horas</small></div>
      <div className="pdp-qtyrow">
        <span>Cantidad:</span>
        <div className="pdp-qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos">−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Más"><Plus size={12} /></button>
        </div>
      </div>
      <button className={`pdp-add ${added ? 'ok' : ''}`} onClick={doAdd}>{added ? <><Shield size={15} /> ¡Agregado!</> : <><Cart size={15} /> Agregar al carrito</>}</button>
      <button className="pdp-buy" onClick={buyNow}><Zap size={14} /> Comprar ahora</button>
      <div className="pdp-trust">
        <Shield size={13} />
        <div><b>Disponible en SEBASTPERU</b><small>Normalmente está listo en 24 horas</small></div>
      </div>
    </div>
  )
}
