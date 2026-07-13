import Link from 'next/link'
import { ChevronRight } from './Icons.jsx'

// Migas de pan (equivalente a src/components/ui.jsx Breadcrumbs, con next/link).
export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Migas de pan">
      {items.map((it, i) => (
        <span key={i} className="crumb">
          {it.to && i < items.length - 1
            ? <Link href={it.to}>{it.label}</Link>
            : <span className="crumb-current">{it.label}</span>}
          {i < items.length - 1 && <ChevronRight size={13} className="crumb-sep" />}
        </span>
      ))}
    </nav>
  )
}
