import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { track } from '../lib/analytics.js'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// Cupones válidos de ejemplo (descuento porcentual).
export const COUPONS = { SEBAS10: 0.1, TECNO15: 0.15 }

export function StoreProvider({ children }) {
  // Carrito persistente (requisito 6: carrito persistente).
  const [cart, setCart] = useState(() => load('sp_cart', []))
  const [compare, setCompare] = useState(() => load('sp_compare', []))
  const [toast, setToast] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  useEffect(() => { localStorage.setItem('sp_cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('sp_compare', JSON.stringify(compare)) }, [compare])

  const showToast = useCallback((msg) => {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 2200)
  }, [])

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id)
      if (found) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
      const href = product.slug ? `/producto/${product.slug}` : `/buscar?q=${encodeURIComponent(product.name)}`
      return [...prev, { id: product.id, sku: product.sku, name: product.name, price: product.price, image: product.image, tint: product.tint, label: product.label, brand: product.brand, slug: product.slug, href, qty }]
    })
    track('add_to_cart', { item_id: product.sku, value: product.price, quantity: qty })
    setCartOpen(true) // abre el panel lateral del carrito
  }, [])

  const setQty = useCallback((id, qty) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)))
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleCompare = useCallback((product) => {
    setCompare((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id)
      if (prev.length >= 4) { showToast('Puedes comparar hasta 4 productos'); return prev }
      showToast(`${product.name} añadido al comparador`)
      return [...prev, { id: product.id, slug: product.slug, name: product.name }]
    })
  }, [showToast])

  const cartCount = cart.reduce((n, i) => n + i.qty, 0)
  const cartTotal = cart.reduce((n, i) => n + i.qty * i.price, 0)

  const value = {
    cart, cartCount, cartTotal,
    addToCart, setQty, removeFromCart, clearCart,
    compare, toggleCompare, setCompare,
    toast, showToast,
    cartOpen, openCart, closeCart,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
