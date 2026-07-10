// Streaming: skeleton que se envía de inmediato mientras el server component
// obtiene el producto (mejora LCP/percepción y Core Web Vitals).
export default function Loading() {
  return (
    <div className="container page product-page" aria-busy="true">
      <div className="sk-crumb sk" />
      <div className="product-grid">
        <div className="sk sk-gallery" />
        <div className="product-info">
          <div className="sk sk-line w60" />
          <div className="sk sk-line w90" />
          <div className="sk sk-line w40" />
          <div className="sk sk-price" />
          <div className="sk sk-btn" />
        </div>
      </div>
    </div>
  )
}
