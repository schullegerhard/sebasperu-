import { useState } from 'react'
import { Banners as BannersApi } from '../../services/api.js'
import { useAuth } from '../AuthContext.jsx'
import { PageHead, Modal, useAsync, Spinner } from '../components.jsx'
import { ImageUpload } from '../fields.jsx'
import { Plus, Pencil, Trash } from '../../components/Icons.jsx'

const blank = { slot: 'hero', theme: 'blue', badge: '', title: '', accent: '', subtitle: '', cta: 'Ver más', link: '/productos', image: '', active: true }
const THEMES = [['blue', 'Azul'], ['orange', 'Naranja'], ['green', 'Verde'], ['dark', 'Oscuro'], ['purple', 'Morado'], ['navy', 'Azul marino']]
const SLOTS = [['hero', 'Carrusel principal'], ['promo', 'Bloque promocional']]
const slotLabel = (s) => (SLOTS.find((x) => x[0] === (s || 'hero')) || [])[1] || 'Carrusel principal'

export default function Banners() {
  const { canManage } = useAuth()
  const editable = canManage('banners')
  const { data: rows, loading, reload } = useAsync(() => BannersApi.list(), [])
  const [modal, setModal] = useState(null)
  const [del, setDel] = useState(null)
  if (loading || !rows) return <Spinner />

  const save = async (e) => {
    e.preventDefault()
    if (!modal.title.trim()) return alert('El título es obligatorio.')
    await BannersApi.save(modal)
    setModal(null); reload()
  }
  const move = async (id, dir) => { await BannersApi.move(id, dir); reload() }

  return (
    <div>
      <PageHead title="Banners del inicio" subtitle={`${rows.length} banner${rows.length !== 1 ? 's' : ''} · carrusel principal y bloques promocionales`}>
        {editable && <button className="adm-btn primary" onClick={() => setModal({ ...blank })}><Plus size={16} /> Nuevo banner</button>}
      </PageHead>
      <div className="adm-card nopad">
        <table className="adm-table">
          <thead><tr><th style={{ width: 90 }}>Imagen</th><th>Título</th><th>Tipo</th><th>Tema</th><th>Enlace</th><th>Orden</th><th>Estado</th>{editable && <th></th>}</tr></thead>
          <tbody>
            {rows.map((b, i) => (
              <tr key={b.id}>
                <td>
                  <div className="adm-banner-thumb" style={{ width: 72, height: 40, borderRadius: 6, overflow: 'hidden', background: '#0e3dbf' }}>
                    {b.image ? <img src={b.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                  </div>
                </td>
                <td><b>{b.title || '(sin título)'}</b>{b.accent ? <span className="muted small"> · {b.accent}</span> : null}<br /><span className="muted small">{b.badge}</span></td>
                <td><span className={`adm-status ${(b.slot || 'hero') === 'promo' ? 'pend' : 'done'}`}>{slotLabel(b.slot)}</span></td>
                <td><span className="muted small">{(THEMES.find((t) => t[0] === b.theme) || [])[1] || b.theme}</span></td>
                <td className="muted small">{b.link}</td>
                <td>
                  {editable ? (
                    <div className="adm-rowactions">
                      <button disabled={i === 0} onClick={() => move(b.id, -1)} aria-label="Subir">↑</button>
                      <button disabled={i === rows.length - 1} onClick={() => move(b.id, 1)} aria-label="Bajar">↓</button>
                    </div>
                  ) : <span className="muted small">{i + 1}</span>}
                </td>
                <td><button className={`adm-toggle ${b.active ? 'on' : ''}`} disabled={!editable} onClick={async () => { await BannersApi.toggle(b.id); reload() }}><i /></button></td>
                {editable && <td><div className="adm-rowactions"><button onClick={() => setModal({ ...b })}><Pencil size={15} /></button><button className="danger" onClick={() => setDel(b)}><Trash size={15} /></button></div></td>}
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={editable ? 8 : 7} className="muted" style={{ padding: 24, textAlign: 'center' }}>Aún no hay banners. La tienda mostrará los del diseño por defecto hasta que crees uno.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.id ? 'Editar banner' : 'Nuevo banner'} onClose={() => setModal(null)}>
          <form className="adm-form" onSubmit={save}>
            <label className="lbl">Imagen del banner</label>
            <ImageUpload value={modal.image} onChange={(v) => setModal({ ...modal, image: v })} maxW={1920} quality={0.92} ratio="16/6" hint="Imagen YA DISEÑADA del banner (el texto va dentro de la imagen). Recomendado 1920 × 720 px." />
            <div className="adm-form-grid">
              <label>Ubicación<select value={modal.slot || 'hero'} onChange={(e) => setModal({ ...modal, slot: e.target.value })}>{SLOTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
              <label>Tema de color<select value={modal.theme} onChange={(e) => setModal({ ...modal, theme: e.target.value })}>{THEMES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
              <label>Título <i>*</i><input required value={modal.title} onChange={(e) => setModal({ ...modal, title: e.target.value })} placeholder="Impresoras HP" /></label>
              <label>Línea destacada<input value={modal.accent} onChange={(e) => setModal({ ...modal, accent: e.target.value })} placeholder="desde S/ 299 · hasta 40% OFF" /></label>
              <label>Etiqueta (badge)<input value={modal.badge} onChange={(e) => setModal({ ...modal, badge: e.target.value })} placeholder="ESPECIAL IMPRESIÓN" /></label>
              <label className="col2">Subtítulo<input value={modal.subtitle} onChange={(e) => setModal({ ...modal, subtitle: e.target.value })} placeholder="Inkjet, multifunción y tanque de tinta." /></label>
              <label>Texto del botón<input value={modal.cta} onChange={(e) => setModal({ ...modal, cta: e.target.value })} placeholder="Ver impresoras" /></label>
              <label>Enlace del botón<input value={modal.link} onChange={(e) => setModal({ ...modal, link: e.target.value })} placeholder="/categoria/impresoras" /></label>
              <label className="adm-switch row"><input type="checkbox" checked={modal.active} onChange={(e) => setModal({ ...modal, active: e.target.checked })} /> Activo (visible en la tienda)</label>
            </div>
            <p className="muted small" style={{ margin: '2px 2px 0' }}>La <b>línea destacada</b> se usa en los bloques promocionales (p. ej. «desde S/ 299»). El <b>carrusel principal</b> es el grande giratorio arriba; los <b>bloques promocionales</b> son las tarjetas entre las secciones de productos.</p>
            <div className="adm-form-foot"><button type="button" className="adm-btn ghost" onClick={() => setModal(null)}>Cancelar</button><button className="adm-btn primary">Guardar</button></div>
          </form>
        </Modal>
      )}
      {del && (
        <Modal title="Eliminar banner" onClose={() => setDel(null)}>
          <p>¿Eliminar el banner <b>{del.title}</b>?</p>
          <div className="adm-form-foot"><button className="adm-btn ghost" onClick={() => setDel(null)}>Cancelar</button><button className="adm-btn danger" onClick={async () => { await BannersApi.remove(del.id); setDel(null); reload() }}>Eliminar</button></div>
        </Modal>
      )}
    </div>
  )
}
