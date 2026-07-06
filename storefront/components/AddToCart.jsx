'use client'
import { useState } from 'react'
import { Cart, Zap } from './Icons.jsx'
import { useCart } from './CartProvider.jsx'

// Isla cliente para la ficha de producto (cantidad + agregar/comprar).
export default function AddToCart({ product }) {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  return (
    <>
      <div className="pd2-qtyrow">
        <span>Cantidad:</span>
        <div className="qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Disminuir">−</button>
          <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
          <button onClick={() => setQty((q) => q + 1)} aria-label="Aumentar">+</button>
        </div>
      </div>
      <button className="add-btn lg pd2-add" disabled={product.stock === 0} onClick={() => addToCart(product, qty)}><Cart size={18} /> Agregar al carrito</button>
      <button className="pd2-buy" disabled={product.stock === 0} onClick={() => addToCart(product, qty)}><Zap size={17} /> Comprar ahora</button>
    </>
  )
}
