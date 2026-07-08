import { useState } from 'react'
import { Categories as CatApi, Products } from '../../services/api.js'
import { useAuth } from '../AuthContext.jsx'
import { PageHead, Modal, useAsync, Spinner } from '../components.jsx'
import { ImageUpload, RichText, Toggle, Tabs, SearchSelect } from '../fields.jsx'
import { ProductImage } from '../../components/imageMap.jsx'
import { Plus, Pencil, Trash, Eye } from '../../components/Icons.jsx'
import { slugify } from '../../lib/util.js'

const FORM_TABS = ['General', 'Imágenes y banners', 'SEO', 'Visibilidad']
const emptyCat = () => ({
  name: '', slug: '', parent: '', description: '', image: '',
  bannerDesktop: '', bannerMobile: '', bannerLink: '',
  active: true, order: 0, showMenu: true, showMobile: true, showFooter: false,
  seo: { keyword: '', metaTitle: '', metaDescription: '', ogTitle: '', ogDescription: '', ogImage: '', canonical: '', robots: 'index' },
})

// Devuelve el slug y todos sus descendientes (para evitar ciclos en el selector de padre).
function withDescendants(slug, cats) {
  const out = new Set([slug])
  let added = true
  while (added) {
    added = false
    for (const c of cats) {
      if (c.parent && out.has(c.parent) && !out.has(c.slug)) { out.add(c.slug); added = true }
    }
  }
  return out
}

export default function Categories() {
  const { canManage } = useAuth()
  const editable = canManage('products')
  const { data, loading, reload } = useAsync(() => Promise.all([CatApi.list(), Products.list()]).then(([cats, products]) => ({ cats, products })), [])
  const [modal, setModal] = useState(null)
  const [tab, setTab] = useState('General')
  const [slugEdited, setSlugEdited] = useState(false)
  const [del, setDel] = useState(null)
  const [busy, setBusy] = useState(false)

  if (loading || !data) return <Spinner />
  const { cats, products } = data
  const countIn = (slug) => products.filter((p) => p.category === slug).length
  const nameOf = (slug) => cats.find((c) => c.slug === slug)?.name || '—'

  // Orden jerárquico recursivo (soporta niveles: rubro → grupo → ítem).
  const byOrder = (a, b) => (a.order || 0) - (b.order || 0) || (a.name || '').localeCompare(b.name || '')
  const childrenOf = (slug) => cats.filter((x) => x.parent === slug).sort(byOrder)
  const rows = []
  const walk = (c, depth) => { rows.push({ c, depth }); childrenOf(c.slug).forEach((ch) => walk(ch, depth + 1)) }
  cats.filter((c) => !c.parent).sort(byOrder).forEach((r) => walk(r, 0))
  // Huérfanos (parent inexistente) se muestran como raíces al final.
  cats.filter((c) => c.parent && !cats.some((x) => x.slug === c.parent)).sort(byOrder).forEach((c) => walk(c, 0))

  const openNew = () => { setModal(emptyCat()); setSlugEdited(false); setTab('General') }
  const openEdit = (c) => { setModal({ ...emptyCat(), ...c, seo: { ...emptyCat().seo, ...(c.seo || {}) } }); setSlugEdited(true); setTab('General') }
  const setM = (patch) => setModal((m) => ({ ...m, ...patch }))
  const setName = (name) => setM(slugEdited ? { name } : { name, slug: slugify(name) })

  const parentOptions = () => {
    const blocked = modal?.slug ? withDescendants(modal.slug, cats) : new Set()
    return cats.filter((c) => c.active !== false && !blocked.has(c.slug)).map((c) => ({ value: c.slug, label: c.name }))
  }

  const save = async (e) => {
    e.preventDefault()
    if (!modal.name.trim()) return alert('El nombre es obligatorio.')
    setBusy(true)
    try {
      const payload = { ...modal, slug: (modal.slug || slugify(modal.name)).trim(), order: Number(modal.order) || 0 }
      if (modal._isEdit) await CatApi.update(modal._origSlug || payload.slug, payload)
      else await CatApi.create(payload)
      setModal(null); await reload()
    } catch (err) { alert(err.message) } finally { setBusy(false) }
  }
  const remove = async () => { try { await CatApi.remove(del.slug); setDel(null); await reload() } catch (e) { alert(e.message) } }

  return (
    <div>
      <PageHead title="Categorías" subtitle={`${cats.length} categorías · ${cats.filter((c) => c.parent).length} subcategorías`}>
        <a className="adm-btn ghost" href="/" target="_blank" rel="noreferrer"><Eye size={15} /> Ver categorías</a>
        {editable && <button className="adm-btn primary" onClick={openNew}><Plus size={16} /> Nueva categoría</button>}
      </PageHead>

      <div className="adm-card nopad">
        <table className="adm-table">
          <thead><tr><th>Categoría</th><th>Padre</th><th>Productos</th><th>Orden</th><th>Menús</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {rows.map(({ c, depth }) => (
              <tr key={c.slug}>
                <td>
                  <div className="adm-prodcell" style={{ paddingLeft: depth * 22 }}>
                    <div className="adm-prodthumb"><ProductImage image={c.image || 'laptop'} /></div>
                    <div><b>{depth > 0 ? '↳ ' : ''}{c.name}</b><span className="muted">/{c.slug}</span></div>
                  </div>
                </td>
                <td>{c.parent ? nameOf(c.parent) : <span className="muted">—</span>}</td>
                <td>{countIn(c.slug)}</td>
                <td>{c.order || 0}</td>
                <td><span className="adm-menuflags">{c.showMenu !== false && <em>Web</em>}{c.showMobile !== false && <em>Móvil</em>}{c.showFooter && <em>Footer</em>}</span></td>
                <td>{c.active === false ? <span className="adm-status cancel">Inactiva</span> : <span className="adm-status done">Activa</span>}</td>
                <td><div className="adm-rowactions">
                  <a href={`/categoria/${c.slug}`} target="_blank" rel="noreferrer" title="Ver categoría en la tienda"><Eye size={15} /></a>
                  {editable && <button onClick={() => openEdit({ ...c, _isEdit: true, _origSlug: c.slug })} title="Editar"><Pencil size={15} /></button>}
                  {editable && <button className="danger" onClick={() => setDel(c)} title="Eliminar"><Trash size={15} /></button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal._isEdit ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setModal(null)} wide>
          <Tabs tabs={FORM_TABS} active={tab} onChange={setTab} />
          <form className="adm-form" onSubmit={save}>
            {tab === 'General' && (
              <div className="adm-form-grid">
                <label className="col2">Nombre de categoría <i>*</i><input required value={modal.name} onChange={(e) => setName(e.target.value)} /></label>
                <label>Slug (URL) <i>*</i><input value={modal.slug} onChange={(e) => { setSlugEdited(true); setM({ slug: slugify(e.target.value) }) }} /></label>
                <div>
                  <label className="lbl">Categoría padre</label>
                  <SearchSelect value={modal.parent} onChange={(v) => setM({ parent: v })} options={parentOptions()} placeholder="— Categoría principal —" />
                </div>
                <label>Orden de visualización<input type="number" value={modal.order} onChange={(e) => setM({ order: e.target.value })} /></label>
                <div className="adm-statuspick">
                  <span className="lbl">Estado</span>
                  <Toggle checked={modal.active} onChange={(v) => setM({ active: v })} label={modal.active ? 'Activa' : 'Inactiva'} />
                </div>
                <div className="col2"><label className="lbl">Descripción (SEO)</label><RichText value={modal.description} onChange={(v) => setM({ description: v })} /></div>
              </div>
            )}
            {tab === 'Imágenes y banners' && (
              <div className="adm-form-grid">
                <div><label className="lbl">Imagen de categoría</label><ImageUpload value={modal.image} onChange={(v) => setM({ image: v })} hint="Menú, tarjetas y página" /></div>
                <label className="col2">Enlace del banner (URL)<input value={modal.bannerLink} onChange={(e) => setM({ bannerLink: e.target.value })} placeholder="https://…" /></label>
                <div className="col2"><label className="lbl">Banner destacado (Desktop)</label><ImageUpload value={modal.bannerDesktop} onChange={(v) => setM({ bannerDesktop: v })} maxW={1600} ratio="2000/329" hint="2000 × 329 px" /></div>
                <div><label className="lbl">Banner destacado (Mobile)</label><ImageUpload value={modal.bannerMobile} onChange={(v) => setM({ bannerMobile: v })} maxW={800} ratio="800/600" hint="800 × 600 px" /></div>
              </div>
            )}
            {tab === 'SEO' && (
              <div className="adm-form-grid">
                <label className="col2">Keyword principal<input value={modal.seo.keyword} onChange={(e) => setM({ seo: { ...modal.seo, keyword: e.target.value } })} /></label>
                <label className="col2">Meta Title<input value={modal.seo.metaTitle} onChange={(e) => setM({ seo: { ...modal.seo, metaTitle: e.target.value } })} /></label>
                <label className="col2">Meta Description<textarea rows="2" value={modal.seo.metaDescription} onChange={(e) => setM({ seo: { ...modal.seo, metaDescription: e.target.value } })} /></label>
                <label>Open Graph Title<input value={modal.seo.ogTitle} onChange={(e) => setM({ seo: { ...modal.seo, ogTitle: e.target.value } })} /></label>
                <label>Open Graph Description<input value={modal.seo.ogDescription} onChange={(e) => setM({ seo: { ...modal.seo, ogDescription: e.target.value } })} /></label>
                <div><label className="lbl">Open Graph Image</label><ImageUpload value={modal.seo.ogImage} onChange={(v) => setM({ seo: { ...modal.seo, ogImage: v } })} maxW={1200} ratio="1200/630" /></div>
                <label>Canonical URL<input value={modal.seo.canonical} onChange={(e) => setM({ seo: { ...modal.seo, canonical: e.target.value } })} placeholder="/categoria/…" /></label>
                <label>Robots<select value={modal.seo.robots} onChange={(e) => setM({ seo: { ...modal.seo, robots: e.target.value } })}><option value="index">Index, Follow</option><option value="noindex">Noindex</option></select></label>
              </div>
            )}
            {tab === 'Visibilidad' && (
              <div className="adm-visgrid">
                <Toggle checked={modal.showMenu !== false} onChange={(v) => setM({ showMenu: v })} label="Mostrar en Menú Principal" />
                <Toggle checked={modal.showMobile !== false} onChange={(v) => setM({ showMobile: v })} label="Mostrar en Menú Móvil" />
                <Toggle checked={!!modal.showFooter} onChange={(v) => setM({ showFooter: v })} label="Mostrar en Footer" />
              </div>
            )}
            <div className="adm-form-foot">
              <button type="button" className="adm-btn ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="adm-btn primary" disabled={busy}>{busy ? 'Guardando…' : (modal._isEdit ? 'Guardar cambios' : 'Crear categoría')}</button>
            </div>
          </form>
        </Modal>
      )}

      {del && (
        <Modal title="Eliminar categoría" onClose={() => setDel(null)}>
          <p>¿Eliminar <b>{del.name}</b>? Las subcategorías y productos quedarán sin esta categoría.</p>
          <div className="adm-form-foot"><button className="adm-btn ghost" onClick={() => setDel(null)}>Cancelar</button><button className="adm-btn danger" onClick={remove}>Eliminar</button></div>
        </Modal>
      )}
    </div>
  )
}
