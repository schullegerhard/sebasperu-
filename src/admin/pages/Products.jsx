import { useState } from 'react'
import { Products as ProductsApi, Categories, Attributes as AttrApi } from '../../services/api.js'
import { useAuth } from '../AuthContext.jsx'
import { PageHead, Modal, useAsync, Spinner } from '../components.jsx'
import { ImageUpload, Gallery, RichText, TagInput, AttrList, FaqList, Toggle, Tabs } from '../fields.jsx'
import { ProductImage } from '../../components/imageMap.jsx'
import { Plus, Pencil, Trash, Search, Eye } from '../../components/Icons.jsx'
import { peso, slugify } from '../../lib/util.js'

const TABS = ['General', 'Precios e inventario', 'Multimedia', 'Atributos', 'Compatibilidad y docs', 'Relacionados', 'SEO y social', 'Logística']
const STATUSES = ['Activo', 'Borrador', 'Agotado', 'Descontinuado']

const empty = () => ({
  name: '', slug: '', sku: '', mpn: '', ean: '', brand: '', status: 'Activo',
  category: '', subcategory: '', categories: [], tags: [],
  shortDesc: '', longDesc: '', benefits: [], features: [], faq: [],
  price: '', oldPrice: '', offerStart: '', offerEnd: '',
  stock: '', minStock: 5, allowBackorder: false,
  image: 'laptop', gallery: [], video: '',
  attributes: [], compatibilities: [], documents: [],
  related: [], crossSell: [], upSell: [],
  seo: { keyword: '', metaTitle: '', metaDescription: '', canonical: '', robots: 'index', ogTitle: '', ogDescription: '', ogImage: '' },
  weight: '', length: '', width: '', height: '', shippingClass: '',
  reviewsEnabled: true,
})

export default function Products() {
  const { canManage } = useAuth()
  const editable = canManage('products')
  const { data, loading, reload } = useAsync(() => Promise.all([ProductsApi.list(), Categories.list(), AttrApi.list()]).then(([products, cats, attrDefs]) => ({ products, cats, attrDefs })), [])
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [tab, setTab] = useState('General')
  const [slugEdited, setSlugEdited] = useState(false)
  const [del, setDel] = useState(null)
  const [busy, setBusy] = useState(false)

  if (loading || !data) return <Spinner />
  const { products: rows, cats, attrDefs = [] } = data
  // Atributos definidos disponibles para la categoría del producto en edición.
  const attrDefsForCat = attrDefs.filter((d) => !d.categories?.length || d.categories.includes(modal?.category))
  const filtered = rows.filter((p) =>
    (!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())) &&
    (!catFilter || p.category === catFilter || (p.categories || []).includes(catFilter)))

  const openNew = () => { setModal(empty()); setSlugEdited(false); setTab('General') }
  const openEdit = (p) => { setModal({ ...empty(), ...p, oldPrice: p.oldPrice || '', seo: { ...empty().seo, ...(p.seo || {}) }, _isEdit: true }); setSlugEdited(true); setTab('General') }
  const setM = (patch) => setModal((m) => ({ ...m, ...patch }))
  const setName = (name) => setM(slugEdited ? { name } : { name, slug: slugify(name) })
  const toggleProdCat = (slug) => setModal((m) => {
    const cur = m.categories || []
    return { ...m, categories: cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug] }
  })
  // Subcategorías = categorías hijas reales (parent === categoría) para poder
  // enlazar el producto a las subcategorías del menú; si no hay, usa el array legacy.
  const subOptions = (catSlug) => {
    const kids = cats.filter((c) => c.parent === catSlug).map((c) => ({ slug: c.slug, name: c.name }))
    return kids.length ? kids : (cats.find((c) => c.slug === catSlug)?.subcategories || [])
  }
  const otherProducts = rows.filter((p) => !modal?.id || p.id !== modal.id).map((p) => ({ id: p.id, name: p.name }))

  const save = async (e) => {
    e.preventDefault()
    if (!modal.name.trim() || !modal.sku.trim()) return alert('Nombre y SKU son obligatorios.')
    setBusy(true)
    try {
      await ProductsApi.save({
        ...modal, slug: (modal.slug || slugify(modal.name)).trim(),
        // categorías adicionales: sin duplicar la principal ni vacíos
        categories: [...new Set((modal.categories || []).filter((s) => s && s !== modal.category))],
        price: Number(modal.price) || 0,
        oldPrice: modal.oldPrice ? Number(modal.oldPrice) : undefined,
        stock: Number(modal.stock) || 0, minStock: Number(modal.minStock) || 0,
      })
      setModal(null); await reload()
    } catch (err) { alert(err.message) } finally { setBusy(false) }
  }
  const remove = async () => { try { await ProductsApi.remove(del.id); setDel(null); await reload() } catch (e) { alert(e.message) } }
  const toggleRel = (key, id) => setM({ [key]: modal[key].includes(id) ? modal[key].filter((x) => x !== id) : [...modal[key], id] })

  return (
    <div>
      <PageHead title="Productos" subtitle={`${rows.length} productos en catálogo`}>
        <a className="adm-btn ghost" href="/productos" target="_blank" rel="noreferrer"><Eye size={15} /> Ver productos</a>
        {editable && <button className="adm-btn primary" onClick={openNew}><Plus size={16} /> Nuevo producto</button>}
      </PageHead>

      <div className="adm-toolbar">
        <div className="adm-search"><Search size={16} /><input placeholder="Buscar por nombre o SKU…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">Todas las categorías</option>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="adm-card nopad">
        <table className="adm-table">
          <thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td><div className="adm-prodcell"><div className="adm-prodthumb"><ProductImage image={p.image} tint={p.tint} label={p.label} /></div><div><b>{p.name}</b><span className="muted">{p.brand}</span></div></div></td>
                <td className="muted">{p.sku}</td>
                <td>{cats.find((c) => c.slug === p.category)?.name || p.category}</td>
                <td><b>{peso(p.price)}</b></td>
                <td><span className={`adm-stockpill ${p.stock <= 5 ? 'crit' : p.stock <= (p.minStock || 10) ? 'warn' : 'ok'}`}>{p.stock}</span></td>
                <td><div className="adm-rowactions">
                  <a href={`/producto/${p.slug}`} target="_blank" rel="noreferrer" title="Ver producto en la tienda"><Eye size={15} /></a>
                  {editable && <button onClick={() => openEdit(p)} title="Editar"><Pencil size={15} /></button>}
                  {editable && <button className="danger" onClick={() => setDel(p)} title="Eliminar"><Trash size={15} /></button>}
                </div></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="6" className="muted center">No se encontraron productos.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal._isEdit ? 'Editar producto' : 'Nuevo producto'} onClose={() => setModal(null)} wide>
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
          <form className="adm-form" onSubmit={save}>
            {tab === 'General' && (
              <div className="adm-form-grid">
                <label className="col2">Nombre del producto <i>*</i><input required value={modal.name} onChange={(e) => setName(e.target.value)} /></label>
                <label>Slug (URL)<input value={modal.slug} onChange={(e) => { setSlugEdited(true); setM({ slug: slugify(e.target.value) }) }} /></label>
                <label>SKU único <i>*</i><input required value={modal.sku} onChange={(e) => setM({ sku: e.target.value })} /></label>
                <label>Código fabricante (MPN)<input value={modal.mpn} onChange={(e) => setM({ mpn: e.target.value })} /></label>
                <label>EAN / GTIN / UPC<input value={modal.ean} onChange={(e) => setM({ ean: e.target.value })} /></label>
                <label>Marca<input value={modal.brand} onChange={(e) => setM({ brand: e.target.value })} /></label>
                <label>Estado<select value={modal.status} onChange={(e) => setM({ status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
                <label>Categoría principal<select value={modal.category} onChange={(e) => setM({ category: e.target.value, subcategory: '' })}><option value="">Selecciona…</option>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
                <label>Subcategoría<select value={modal.subcategory} onChange={(e) => setM({ subcategory: e.target.value })}><option value="">—</option>{subOptions(modal.category).map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select></label>
                <div className="col2">
                  <label className="lbl">Categorías adicionales <span className="muted small">(el producto también aparecerá en estas)</span></label>
                  <div className="adm-rel-list" style={{ maxHeight: 180 }}>
                    {cats.filter((c) => c.slug !== modal.category).map((c) => (
                      <label key={c.slug} className="adm-rel-item">
                        <input type="checkbox" checked={(modal.categories || []).includes(c.slug)} onChange={() => toggleProdCat(c.slug)} /> {c.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col2"><label className="lbl">Etiquetas</label><TagInput value={modal.tags} onChange={(v) => setM({ tags: v })} placeholder="Agregar etiqueta…" /></div>
                <label className="col2">Descripción corta<textarea rows="2" value={modal.shortDesc} onChange={(e) => setM({ shortDesc: e.target.value })} /></label>
                <div className="col2"><label className="lbl">Descripción larga</label><RichText value={modal.longDesc} onChange={(v) => setM({ longDesc: v })} /></div>
                <div><label className="lbl">Beneficios</label><TagInput value={modal.benefits} onChange={(v) => setM({ benefits: v })} placeholder="Beneficio…" /></div>
                <div><label className="lbl">Características principales</label><TagInput value={modal.features} onChange={(v) => setM({ features: v })} placeholder="Característica…" /></div>
                <div className="col2"><label className="lbl">Preguntas frecuentes (FAQ)</label><FaqList value={modal.faq} onChange={(v) => setM({ faq: v })} /></div>
              </div>
            )}
            {tab === 'Precios e inventario' && (
              <div className="adm-form-grid">
                <label>Precio regular (S/) <i>*</i><input type="number" step="0.01" required value={modal.price} onChange={(e) => setM({ price: e.target.value })} /></label>
                <label>Precio oferta (S/)<input type="number" step="0.01" value={modal.oldPrice ? modal.price : modal.offerPrice || ''} onChange={(e) => setM({ offerPrice: e.target.value })} placeholder="opcional" /></label>
                <label>Inicio de oferta<input type="date" value={modal.offerStart} onChange={(e) => setM({ offerStart: e.target.value })} /></label>
                <label>Fin de oferta<input type="date" value={modal.offerEnd} onChange={(e) => setM({ offerEnd: e.target.value })} /></label>
                <label>Precio anterior (tachado)<input type="number" step="0.01" value={modal.oldPrice} onChange={(e) => setM({ oldPrice: e.target.value })} /></label>
                <div />
                <label>Stock disponible <i>*</i><input type="number" required value={modal.stock} onChange={(e) => setM({ stock: e.target.value })} /></label>
                <label>Stock mínimo<input type="number" value={modal.minStock} onChange={(e) => setM({ minStock: e.target.value })} /></label>
                <div className="adm-statuspick"><span className="lbl">Compra sin stock</span><Toggle checked={modal.allowBackorder} onChange={(v) => setM({ allowBackorder: v })} label={modal.allowBackorder ? 'Permitida' : 'No permitida'} /></div>
              </div>
            )}
            {tab === 'Multimedia' && (
              <div className="adm-form-grid">
                <div><label className="lbl">Imagen principal</label><ImageUpload value={modal.image && (modal.image.startsWith('data:') || modal.image.startsWith('http')) ? modal.image : ''} onChange={(v) => setM({ image: v || 'laptop' })} hint="o usa un ícono si no hay foto" /></div>
                <label>Video del producto (URL)<input value={modal.video} onChange={(e) => setM({ video: e.target.value })} placeholder="https://youtube.com/…" /></label>
                <div className="col2"><label className="lbl">Galería de imágenes</label><Gallery value={modal.gallery} onChange={(v) => setM({ gallery: v })} /></div>
              </div>
            )}
            {tab === 'Atributos' && (
              <div>
                <p className="muted small" style={{ marginBottom: 10 }}>Atributos (RAM, Procesador, Color, etc.). Usa los <b>atributos definidos</b> para mantener los filtros consistentes, o agrega uno libre. Marca cuáles se usan como <b>filtro</b>, se muestran en la <b>ficha</b> técnica o cuentan para <b>SEO</b>.</p>
                <AttrList value={modal.attributes} onChange={(v) => setM({ attributes: v })} defs={attrDefsForCat} />
              </div>
            )}
            {tab === 'Compatibilidad y docs' && (
              <div className="adm-form-grid">
                <div className="col2"><label className="lbl">Compatibilidad (equipos compatibles)</label><TagInput value={modal.compatibilities} onChange={(v) => setM({ compatibilities: v })} placeholder="Ej. HP LaserJet M1132…" /></div>
                <div className="col2"><label className="lbl">Documentos (ficha técnica / manual / drivers — URLs)</label><TagInput value={modal.documents} onChange={(v) => setM({ documents: v })} placeholder="https://…/ficha.pdf" /></div>
              </div>
            )}
            {tab === 'Relacionados' && (
              <div className="adm-rel-cols">
                {[['related', 'Relacionados'], ['crossSell', 'Cross-selling'], ['upSell', 'Up-selling']].map(([key, label]) => (
                  <div className="adm-rel-col" key={key}>
                    <h4>{label}</h4>
                    <div className="adm-rel-list">
                      {otherProducts.map((p) => (
                        <label key={p.id} className="adm-rel-item"><input type="checkbox" checked={modal[key].includes(p.id)} onChange={() => toggleRel(key, p.id)} /> {p.name}</label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === 'SEO y social' && (
              <div className="adm-form-grid">
                <label className="col2">Keyword principal<input value={modal.seo.keyword} onChange={(e) => setM({ seo: { ...modal.seo, keyword: e.target.value } })} /></label>
                <label className="col2">Meta Title<input value={modal.seo.metaTitle} onChange={(e) => setM({ seo: { ...modal.seo, metaTitle: e.target.value } })} /></label>
                <label className="col2">Meta Description<textarea rows="2" value={modal.seo.metaDescription} onChange={(e) => setM({ seo: { ...modal.seo, metaDescription: e.target.value } })} /></label>
                <label>Canonical URL<input value={modal.seo.canonical} onChange={(e) => setM({ seo: { ...modal.seo, canonical: e.target.value } })} /></label>
                <label>Robots<select value={modal.seo.robots} onChange={(e) => setM({ seo: { ...modal.seo, robots: e.target.value } })}><option value="index">Index, Follow</option><option value="noindex">Noindex</option></select></label>
                <label>Open Graph Title<input value={modal.seo.ogTitle} onChange={(e) => setM({ seo: { ...modal.seo, ogTitle: e.target.value } })} /></label>
                <label>Open Graph Description<input value={modal.seo.ogDescription} onChange={(e) => setM({ seo: { ...modal.seo, ogDescription: e.target.value } })} /></label>
                <div className="col2"><label className="lbl">Open Graph Image</label><ImageUpload value={modal.seo.ogImage} onChange={(v) => setM({ seo: { ...modal.seo, ogImage: v } })} maxW={1200} ratio="1200/630" /></div>
                <div className="col2 adm-schema-note">🔎 Schema automático: <b>Product, Offer, Brand, Review, AggregateRating, FAQPage, BreadcrumbList</b> se generan en el frontend a partir de estos datos.</div>
              </div>
            )}
            {tab === 'Logística' && (
              <div className="adm-form-grid">
                <label>Peso (kg)<input type="number" step="0.01" value={modal.weight} onChange={(e) => setM({ weight: e.target.value })} /></label>
                <label>Clase de envío<input value={modal.shippingClass} onChange={(e) => setM({ shippingClass: e.target.value })} placeholder="Ej. Estándar / Frágil" /></label>
                <label>Largo (cm)<input type="number" step="0.1" value={modal.length} onChange={(e) => setM({ length: e.target.value })} /></label>
                <label>Ancho (cm)<input type="number" step="0.1" value={modal.width} onChange={(e) => setM({ width: e.target.value })} /></label>
                <label>Alto (cm)<input type="number" step="0.1" value={modal.height} onChange={(e) => setM({ height: e.target.value })} /></label>
                <div className="adm-statuspick"><span className="lbl">Reseñas</span><Toggle checked={modal.reviewsEnabled} onChange={(v) => setM({ reviewsEnabled: v })} label={modal.reviewsEnabled ? 'Activadas' : 'Desactivadas'} /></div>
              </div>
            )}
            <div className="adm-form-foot">
              <button type="button" className="adm-btn ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="adm-btn primary" disabled={busy}>{busy ? 'Guardando…' : (modal._isEdit ? 'Guardar cambios' : 'Crear producto')}</button>
            </div>
          </form>
        </Modal>
      )}

      {del && (
        <Modal title="Eliminar producto" onClose={() => setDel(null)}>
          <p>¿Seguro que deseas eliminar <b>{del.name}</b>? Esta acción no se puede deshacer.</p>
          <div className="adm-form-foot"><button className="adm-btn ghost" onClick={() => setDel(null)}>Cancelar</button><button className="adm-btn danger" onClick={remove}>Eliminar</button></div>
        </Modal>
      )}
    </div>
  )
}
