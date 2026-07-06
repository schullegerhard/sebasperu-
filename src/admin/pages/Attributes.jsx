import { useState } from 'react'
import { Attributes as AttrApi, Categories as CatApi } from '../../services/api.js'
import { useAuth } from '../AuthContext.jsx'
import { PageHead, Modal, useAsync, Spinner } from '../components.jsx'
import { TagInput } from '../fields.jsx'
import { Plus, Pencil, Trash } from '../../components/Icons.jsx'

const empty = () => ({ name: '', values: [], categories: [] })

export default function Attributes() {
  const { canManage } = useAuth()
  const editable = canManage('products')
  const { data, loading, reload } = useAsync(
    () => Promise.all([AttrApi.list(), CatApi.list()]).then(([attrs, cats]) => ({ attrs, cats })), [])
  const [modal, setModal] = useState(null)
  const [del, setDel] = useState(null)
  const [busy, setBusy] = useState(false)

  if (loading || !data) return <Spinner />
  const { attrs, cats } = data
  const nameOf = (slug) => cats.find((c) => c.slug === slug)?.name || slug

  const openNew = () => setModal(empty())
  const openEdit = (a) => setModal({ ...empty(), ...a })
  const setM = (patch) => setModal((m) => ({ ...m, ...patch }))
  const toggleCat = (slug) => setModal((m) => ({
    ...m, categories: m.categories.includes(slug) ? m.categories.filter((s) => s !== slug) : [...m.categories, slug],
  }))

  const save = async (e) => {
    e.preventDefault()
    if (!modal.name.trim()) return alert('El nombre del atributo es obligatorio.')
    if (!modal.values.length) return alert('Agrega al menos un valor (ej. 8GB, 16GB).')
    setBusy(true)
    try { await AttrApi.save({ ...modal, name: modal.name.trim() }); setModal(null); await reload() }
    catch (err) { alert(err.message) } finally { setBusy(false) }
  }
  const remove = async () => { try { await AttrApi.remove(del.id); setDel(null); await reload() } catch (e) { alert(e.message) } }

  return (
    <div>
      <PageHead title="Atributos" subtitle={`${attrs.length} atributos de filtro · usados en productos y en los filtros de la tienda`}>
        {editable && <button className="adm-btn primary" onClick={openNew}><Plus size={16} /> Nuevo atributo</button>}
      </PageHead>

      <div className="adm-card nopad">
        <table className="adm-table">
          <thead><tr><th>Atributo</th><th>Valores</th><th>Categorías</th><th></th></tr></thead>
          <tbody>
            {attrs.map((a) => (
              <tr key={a.id}>
                <td><b>{a.name}</b></td>
                <td><div className="fld-chips">{(a.values || []).map((v) => <span className="fld-chip" key={v}>{v}</span>)}</div></td>
                <td className="muted">{(a.categories || []).length ? a.categories.map(nameOf).join(', ') : 'Todas'}</td>
                <td><div className="adm-rowactions">
                  {editable && <button onClick={() => openEdit(a)} title="Editar"><Pencil size={15} /></button>}
                  {editable && <button className="danger" onClick={() => setDel(a)} title="Eliminar"><Trash size={15} /></button>}
                </div></td>
              </tr>
            ))}
            {attrs.length === 0 && <tr><td colSpan="4" className="muted center">Aún no hay atributos. Crea uno (ej. RAM → 8GB, 16GB) para filtrar productos.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.id ? 'Editar atributo' : 'Nuevo atributo'} onClose={() => setModal(null)}>
          <form className="adm-form" onSubmit={save}>
            <div className="adm-form-grid">
              <label className="col2">Nombre del atributo <i>*</i><input required value={modal.name} onChange={(e) => setM({ name: e.target.value })} placeholder="Ej. RAM, Color, Procesador" /></label>
              <div className="col2">
                <label className="lbl">Valores posibles <i>*</i></label>
                <TagInput value={modal.values} onChange={(v) => setM({ values: v })} placeholder="Escribe un valor y Enter (ej. 8GB)…" />
              </div>
              <div className="col2">
                <label className="lbl">Categorías donde aplica</label>
                <p className="muted small" style={{ margin: '2px 0 8px' }}>Si no marcas ninguna, el atributo está disponible en todas las categorías.</p>
                <div className="adm-rel-list" style={{ maxHeight: 200 }}>
                  {cats.map((c) => (
                    <label key={c.slug} className="adm-rel-item">
                      <input type="checkbox" checked={modal.categories.includes(c.slug)} onChange={() => toggleCat(c.slug)} /> {c.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="adm-form-foot">
              <button type="button" className="adm-btn ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="adm-btn primary" disabled={busy}>{busy ? 'Guardando…' : (modal.id ? 'Guardar cambios' : 'Crear atributo')}</button>
            </div>
          </form>
        </Modal>
      )}

      {del && (
        <Modal title="Eliminar atributo" onClose={() => setDel(null)}>
          <p>¿Eliminar el atributo <b>{del.name}</b>? Dejará de ofrecerse al editar productos (los valores ya asignados se conservan).</p>
          <div className="adm-form-foot"><button className="adm-btn ghost" onClick={() => setDel(null)}>Cancelar</button><button className="adm-btn danger" onClick={remove}>Eliminar</button></div>
        </Modal>
      )}
    </div>
  )
}
