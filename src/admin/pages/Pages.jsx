import { useState } from 'react'
import { Pages as PagesApi } from '../../services/api.js'
import { useAuth } from '../AuthContext.jsx'
import { PageHead, Modal, useAsync, Spinner } from '../components.jsx'
import { RichText, Toggle } from '../fields.jsx'
import { Plus, Pencil, Trash, Eye } from '../../components/Icons.jsx'
import { slugify } from '../../lib/util.js'

const blank = { slug: '', title: '', body: '', active: true }

export default function Pages() {
  const { canManage } = useAuth()
  const editable = canManage('banners')
  const { data: rows, loading, reload } = useAsync(() => PagesApi.list(), [])
  const [modal, setModal] = useState(null)
  const [slugEdited, setSlugEdited] = useState(false)
  const [del, setDel] = useState(null)
  const [busy, setBusy] = useState(false)
  if (loading || !rows) return <Spinner />

  const setM = (patch) => setModal((m) => ({ ...m, ...patch }))
  const setTitle = (title) => setM(slugEdited || modal.id ? { title } : { title, slug: slugify(title) })
  const openNew = () => { setModal({ ...blank }); setSlugEdited(false) }
  const openEdit = (p) => { setModal({ ...p }); setSlugEdited(true) }

  const save = async (e) => {
    e.preventDefault()
    if (!modal.title.trim()) return alert('El título es obligatorio.')
    setBusy(true)
    try {
      await PagesApi.save({ ...modal, slug: (modal.slug || slugify(modal.title)).trim() })
      setModal(null); await reload()
    } catch (err) { alert(err.message) } finally { setBusy(false) }
  }
  const remove = async () => { try { await PagesApi.remove(del.id); setDel(null); await reload() } catch (e) { alert(e.message) } }

  return (
    <div>
      <PageHead title="Páginas" subtitle={`${rows.length} páginas de contenido · aparecen en el pie del sitio`}>
        {editable && <button className="adm-btn primary" onClick={openNew}><Plus size={16} /> Nueva página</button>}
      </PageHead>

      <div className="adm-card nopad">
        <table className="adm-table">
          <thead><tr><th>Título</th><th>URL</th><th>Estado</th>{editable && <th></th>}</tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td><b>{p.title || '(sin título)'}</b></td>
                <td className="muted small">/legal/{p.slug}</td>
                <td>{p.active === false ? <span className="adm-status cancel">Oculta</span> : <span className="adm-status done">Visible</span>}</td>
                {editable && <td><div className="adm-rowactions">
                  <a href={`/legal/${p.slug}`} target="_blank" rel="noreferrer" title="Ver en la tienda"><Eye size={15} /></a>
                  <button onClick={() => openEdit(p)} title="Editar"><Pencil size={15} /></button>
                  <button className="danger" onClick={() => setDel(p)} title="Eliminar"><Trash size={15} /></button>
                </div></td>}
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={editable ? 4 : 3} className="muted" style={{ padding: 24, textAlign: 'center' }}>Aún no hay páginas.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.id ? 'Editar página' : 'Nueva página'} onClose={() => setModal(null)} wide>
          <form className="adm-form" onSubmit={save}>
            <div className="adm-form-grid">
              <label className="col2">Título <i>*</i><input required value={modal.title} onChange={(e) => setTitle(e.target.value)} placeholder="Política de Privacidad" /></label>
              <label className="col2">URL (slug)<input value={modal.slug} onChange={(e) => { setSlugEdited(true); setM({ slug: slugify(e.target.value) }) }} placeholder="privacidad" /><span className="muted small">La página quedará en /legal/{modal.slug || '…'}</span></label>
              <div className="col2"><label className="lbl">Contenido</label><RichText value={modal.body} onChange={(v) => setM({ body: v })} /></div>
              <div className="adm-statuspick col2">
                <span className="lbl">Estado</span>
                <Toggle checked={modal.active !== false} onChange={(v) => setM({ active: v })} label={modal.active !== false ? 'Visible' : 'Oculta'} />
              </div>
            </div>
            <div className="adm-form-foot">
              <button type="button" className="adm-btn ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="adm-btn primary" disabled={busy}>{busy ? 'Guardando…' : (modal.id ? 'Guardar cambios' : 'Crear página')}</button>
            </div>
          </form>
        </Modal>
      )}

      {del && (
        <Modal title="Eliminar página" onClose={() => setDel(null)}>
          <p>¿Eliminar la página <b>{del.title}</b>? Si tiene texto por defecto, volverá a mostrarse ese.</p>
          <div className="adm-form-foot"><button className="adm-btn ghost" onClick={() => setDel(null)}>Cancelar</button><button className="adm-btn danger" onClick={remove}>Eliminar</button></div>
        </Modal>
      )}
    </div>
  )
}
