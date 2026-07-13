'use client'
import { Cart } from './Icons.jsx'
import { useCart } from './CartProvider.jsx'

// Botón "Agregar al carrito" de las tarjetas relacionadas de la ficha.
export default function RelatedAddButton({ product }) {
  const { addToCart } = useCart()
  return (
    <button className="pdp-rel-add" onClick={() => addToCart(product)}><Cart size={13} /> Agregar al carrito</button>
  )
}
