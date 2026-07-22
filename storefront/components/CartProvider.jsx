'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState(null)
  // Panel lateral del carrito (mini-cart), igual que App 1.
  const [cartOpen, setCartOpen] = useState(false)
  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  // Hidratar desde localStorage tras montar (evita desajustes SSR/cliente).
  useEffect(() => {
    try { const r = localStorage.getItem('sp_cart'); if (r) setCart(JSON.parse(r)) } catch {}
    setReady(true)
  }, [])
  useEffect(() => { if (ready) localStorage.setItem('sp_cart', JSON.stringify(cart)) }, [cart, ready])

  const addToCart = useCallback((p, qty = 1) => {
    setCart((prev) => {
      const f = prev.find((i) => i.id === p.id)
      if (f) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i))
      const href = p.slug ? `/producto/${p.slug}` : '/productos'
      return [...prev, { id: p.id, sku: p.sku, name: p.name, price: p.price, image: p.image, tint: p.tint, label: p.label, brand: p.brand, slug: p.slug, href, qty }]
    })
    setCartOpen(true) // abre el panel lateral del carrito (como App 1)
  }, [])

  const updateQty = useCallback((id, qty) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)))
  }, [])
  const removeItem = useCallback((id) => setCart((prev) => prev.filter((i) => i.id !== id)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const count = cart.reduce((n, i) => n + i.qty, 0)
  const total = cart.reduce((n, i) => n + i.qty * i.price, 0)

  return (
    <CartContext.Provider value={{ cart, count, total, ready, addToCart, updateQty, removeItem, clearCart, cartOpen, openCart, closeCart }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </CartContext.Provider>
  )
}
