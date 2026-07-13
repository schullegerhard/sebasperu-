'use client'
import { useState } from 'react'
import { Star } from './Icons.jsx'

const Stars = ({ value = 5 }) => (
  <span className="pdp-stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} style={{ opacity: i < Math.round(value) ? 1 : 0.3 }} />)}</span>
)

const REVIEWS = [
  { name: 'Carlos M.', rating: 5, text: 'Excelente producto, llegó en perfecto estado y muy rápido. Totalmente recomendado.', date: 'hace 3 días' },
  { name: 'María G.', rating: 5, text: 'Muy buena calidad, exactamente como se describe. El envío fue muy rápido.', date: 'hace 1 semana' },
  { name: 'Juan P.', rating: 4, text: 'Buen producto, cumple con lo especificado. El embalaje estaba en perfecto estado.', date: 'hace 2 semanas' },
]

// Pestañas de la ficha: Descripción (HTML), Especificaciones y Reseñas.
export default function ProductTabs({ name, longDesc, faq = [], specsRows = [], rating = 5, reviews = 0 }) {
  const [tab, setTab] = useState('desc')
  return (
    <div className="pdp-tabs">
      <div className="pdp-tab-head">
        {[['desc', 'Descripción'], ['specs', 'Especificaciones'], ['reviews', 'Reseñas']].map(([k, label]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      <div className="pdp-tab-body">
        {tab === 'desc' && (
          <div className="pdp-desc">
            {longDesc
              ? <div className="pdp-desc-html" dangerouslySetInnerHTML={{ __html: longDesc }} />
              : (
                <>
                  <p className="lead">{name}</p>
                  <p>Producto original con garantía oficial de fábrica. Ideal para uso profesional y personal. Cuenta con las últimas tecnologías para garantizar el mejor rendimiento y durabilidad.</p>
                  <p>En SEBASTPERU ofrecemos únicamente productos auténticos de las mejores marcas con factura y garantía oficial, respaldados por nuestro equipo de soporte técnico especializado en Lima y provincias.</p>
                </>
              )}
            {faq.length > 0 && (
              <div className="pdp-faq">
                <h3>Preguntas frecuentes</h3>
                {faq.map((f, i) => (
                  <details className="pdp-faq-item" key={i}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === 'specs' && (
          <table className="pdp-spec-table">
            <tbody>{specsRows.map((s, i) => <tr key={s.label} className={i % 2 === 0 ? 'alt' : ''}><th>{s.label}</th><td>{s.value}</td></tr>)}</tbody>
          </table>
        )}
        {tab === 'reviews' && (
          <div className="pdp-reviews">
            <div className="pdp-rev-summary">
              <div className="pdp-rev-score"><b>{rating}</b><Stars value={rating} /><small>{reviews.toLocaleString('es-PE')} reseñas</small></div>
              <div className="pdp-rev-bars">
                {[5, 4, 3, 2, 1].map((r) => (
                  <div className="pdp-rev-bar" key={r}><span>{r}</span><Star size={11} /><div className="track"><i style={{ width: r === 5 ? '72%' : r === 4 ? '18%' : r === 3 ? '7%' : '2%' }} /></div></div>
                ))}
              </div>
            </div>
            <div className="pdp-rev-list">
              {REVIEWS.map((rev) => (
                <div className="pdp-rev" key={rev.name}>
                  <div className="pdp-rev-head"><span className="av">{rev.name[0]}</span><div><b>{rev.name}</b><small>{rev.date}</small></div><Stars value={rev.rating} /></div>
                  <p>{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
