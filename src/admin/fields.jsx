import { useState, useRef, useEffect } from 'react'
import { ProductImage } from '../components/imageMap.jsx'
import { Plus, Trash, X } from '../components/Icons.jsx'

/* Redimensiona/comprime una imagen en el navegador → data URL (se guarda en la BD). */
export function fileToDataURL(file, maxW = 800, quality = 0.74) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const c = document.createElement('canvas')
        c.width = w; c.height = h
        const ctx = c.getContext('2d')
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        resolve(c.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
const isImg = (v) => typeof v === 'string' && (v.startsWith('data:') || v.startsWith('http'))

/* Campo de subida de una imagen (con vista previa). */
export function ImageUpload({ value, onChange, maxW = 800, hint, ratio = '1/1' }) {
  const onFile = async (e) => {
    const f = e.target.files?.[0]; if (!f) return
    if (!f.type.startsWith('image/')) return alert('Selecciona una imagen.')
    try { onChange(await fileToDataURL(f, maxW)) } catch { alert('No se pudo procesar la imagen.') }
    e.target.value = ''
  }
  return (
    <div className="fld-img">
      <div className="fld-img-preview" style={{ aspectRatio: ratio }}>
        {isImg(value) ? <img src={value} alt="" /> : <span className="fld-img-empty">Sin imagen</span>}
      </div>
      <div className="fld-img-ctrls">
        <label className="adm-btn ghost adm-file"><input type="file" accept="image/*" hidden onChange={onFile} /> Subir</label>
        {isImg(value) && <button type="button" className="adm-link" onClick={() => onChange('')}>Quitar</button>}
        {hint && <span className="muted small">{hint}</span>}
      </div>
    </div>
  )
}

/* Galería de imágenes (varias). */
export function Gallery({ value = [], onChange }) {
  const onFiles = async (e) => {
    const files = [...(e.target.files || [])]
    const urls = []
    for (const f of files) { if (f.type.startsWith('image/')) urls.push(await fileToDataURL(f, 800)) }
    onChange([...value, ...urls]); e.target.value = ''
  }
  return (
    <div className="fld-gallery">
      {value.map((src, i) => (
        <div className="fld-gal-item" key={i}>
          <img src={src} alt="" />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Quitar"><X size={13} /></button>
        </div>
      ))}
      <label className="fld-gal-add"><input type="file" accept="image/*" multiple hidden onChange={onFiles} /><Plus size={20} /></label>
    </div>
  )
}

/* Editor enriquecido (WYSIWYG) con modo HTML. */
export function RichText({ value = '', onChange }) {
  const ref = useRef(null)
  const [html, setHtml] = useState(false)
  useEffect(() => { if (ref.current && !html && ref.current.innerHTML !== value) ref.current.innerHTML = value || '' }, [html]) // eslint-disable-line
  const exec = (cmd, arg) => { document.execCommand(cmd, false, arg); onChange(ref.current.innerHTML) }
  const link = () => { const u = prompt('URL del enlace:'); if (u) exec('createLink', u) }
  const image = () => { const u = prompt('URL de la imagen:'); if (u) exec('insertImage', u) }
  return (
    <div className="rt">
      <div className="rt-toolbar">
        <button type="button" onClick={() => exec('bold')}><b>B</b></button>
        <button type="button" onClick={() => exec('italic')}><i>I</i></button>
        <button type="button" onClick={() => exec('formatBlock', 'H3')}>H</button>
        <button type="button" onClick={() => exec('insertUnorderedList')}>• Lista</button>
        <button type="button" onClick={() => exec('insertOrderedList')}>1. Lista</button>
        <button type="button" onClick={link}>🔗</button>
        <button type="button" onClick={image}>🖼️</button>
        <button type="button" className={html ? 'on' : ''} onClick={() => setHtml((h) => !h)}>&lt;/&gt;</button>
      </div>
      {html
        ? <textarea className="rt-html" value={value} onChange={(e) => onChange(e.target.value)} rows="6" placeholder="<p>HTML / embed de video…</p>" />
        : <div className="rt-area" contentEditable suppressContentEditableWarning ref={ref} onInput={() => onChange(ref.current.innerHTML)} />}
    </div>
  )
}

/* Lista de etiquetas tipo chips (tags, compatibilidad, beneficios, características). */
export function TagInput({ value = [], onChange, placeholder = 'Escribe y Enter…' }) {
  const [t, setT] = useState('')
  const add = () => { const v = t.trim(); if (v && !value.includes(v)) onChange([...value, v]); setT('') }
  return (
    <div className="fld-tags">
      <div className="fld-chips">
        {value.map((v) => <span className="fld-chip" key={v}>{v}<button type="button" onClick={() => onChange(value.filter((x) => x !== v))}><X size={11} /></button></span>)}
      </div>
      <input value={t} onChange={(e) => setT(e.target.value)} placeholder={placeholder}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }} onBlur={add} />
    </div>
  )
}

/* Lista de atributos: nombre/valor + flags (filtro, ficha, SEO).
   `defs` = atributos fijos definidos en el admin → permite elegirlos de una lista
   y restringe el valor a los permitidos (consistencia para los filtros de la tienda). */
export function AttrList({ value = [], onChange, defs = [] }) {
  const upd = (i, patch) => onChange(value.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const defByName = (name) => defs.find((d) => d.name.toLowerCase() === String(name || '').toLowerCase())
  const addDefined = (name) => {
    const d = defByName(name); if (!d) return
    onChange([...value, { name: d.name, value: d.values[0] || '', filter: true, spec: true }])
  }
  return (
    <div className="fld-attrs">
      {defs.length > 0 && (
        <select className="fld-attr-pick" value="" onChange={(e) => { if (e.target.value) addDefined(e.target.value); e.target.value = '' }}>
          <option value="">+ Agregar atributo definido…</option>
          {defs.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
        </select>
      )}
      {value.map((r, i) => {
        const d = defByName(r.name)
        return (
          <div className="fld-attr-row" key={i}>
            <input placeholder="Atributo (ej. RAM)" value={r.name || ''} onChange={(e) => upd(i, { name: e.target.value })} />
            {d
              ? (
                <select value={r.value || ''} onChange={(e) => upd(i, { value: e.target.value })}>
                  <option value="">— valor —</option>
                  {[...new Set([...(d.values || []), ...(r.value && !d.values.includes(r.value) ? [r.value] : [])])].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              )
              : <input placeholder="Valor (ej. 16GB)" value={r.value || ''} onChange={(e) => upd(i, { value: e.target.value })} />}
            <label title="Usar como filtro"><input type="checkbox" checked={!!r.filter} onChange={(e) => upd(i, { filter: e.target.checked })} /> Filtro</label>
            <label title="Mostrar en ficha técnica"><input type="checkbox" checked={r.spec !== false} onChange={(e) => upd(i, { spec: e.target.checked })} /> Ficha</label>
            <label title="Usar para SEO"><input type="checkbox" checked={!!r.seo} onChange={(e) => upd(i, { seo: e.target.checked })} /> SEO</label>
            <button type="button" className="danger" onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash size={14} /></button>
          </div>
        )
      })}
      <button type="button" className="adm-link" onClick={() => onChange([...value, { name: '', value: '', spec: true }])}><Plus size={14} /> Agregar atributo libre</button>
    </div>
  )
}

/* Lista de preguntas frecuentes (FAQ). */
export function FaqList({ value = [], onChange }) {
  const upd = (i, patch) => onChange(value.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  return (
    <div className="fld-faq">
      {value.map((r, i) => (
        <div className="fld-faq-row" key={i}>
          <input placeholder="Pregunta" value={r.q || ''} onChange={(e) => upd(i, { q: e.target.value })} />
          <textarea placeholder="Respuesta" rows="2" value={r.a || ''} onChange={(e) => upd(i, { a: e.target.value })} />
          <button type="button" className="danger" onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash size={14} /></button>
        </div>
      ))}
      <button type="button" className="adm-link" onClick={() => onChange([...value, { q: '', a: '' }])}><Plus size={14} /> Agregar pregunta</button>
    </div>
  )
}

/* Interruptor on/off. */
export function Toggle({ checked, onChange, label }) {
  return (
    <label className="fld-toggle">
      <button type="button" className={`adm-toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}><i /></button>
      {label && <span>{label}</span>}
    </label>
  )
}

/* Selector con búsqueda (combobox). options = [{value,label}]. */
export function SearchSelect({ value, onChange, options, placeholder = 'Seleccionar…' }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])
  const sel = options.find((o) => o.value === value)
  const list = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="fld-ss" ref={ref}>
      <button type="button" className="fld-ss-btn" onClick={() => setOpen((o) => !o)}>
        <span className={sel ? '' : 'muted'}>{sel ? sel.label : placeholder}</span><span>▾</span>
      </button>
      {open && (
        <div className="fld-ss-pop">
          <input autoFocus placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="fld-ss-list">
            <button type="button" className="fld-ss-opt" onClick={() => { onChange(''); setOpen(false) }}>— Ninguna (categoría principal) —</button>
            {list.map((o) => <button type="button" key={o.value} className={`fld-ss-opt ${o.value === value ? 'on' : ''}`} onClick={() => { onChange(o.value); setOpen(false) }}>{o.label}</button>)}
            {list.length === 0 && <div className="fld-ss-empty">Sin resultados</div>}
          </div>
        </div>
      )}
    </div>
  )
}

/* Tabs simples para formularios largos. */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="fld-tabs">
      {tabs.map((t) => <button type="button" key={t} className={active === t ? 'on' : ''} onClick={() => onChange(t)}>{t}</button>)}
    </div>
  )
}
