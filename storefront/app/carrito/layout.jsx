// El carrito es una página de utilidad: declara su canónica y se excluye del
// índice (la página es un componente cliente y no puede exportar metadata).
// Revalidación corta: sin esto la página es 100% estática y se sirve con
// Cache-Control s-maxage de 1 año → tras un redeploy la caché seguiría
// mostrando la versión anterior.
export const revalidate = 300

export const metadata = {
  title: 'Carrito de compra',
  alternates: { canonical: '/carrito' },
  robots: { index: false, follow: true },
}

export default function CarritoLayout({ children }) {
  return children
}
