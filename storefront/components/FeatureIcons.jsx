// Íconos "de imagen" (ilustraciones SVG a color, con degradado y detalle) para
// la franja de beneficios del inicio. Sustituyen a los íconos de línea simples.
const S = 40

export const TruckImg = () => (
  <svg width={S} height={S} viewBox="0 0 48 48" aria-hidden="true">
    <defs><linearGradient id="fi-tr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4f8bff" /><stop offset="1" stopColor="#1b4dd8" /></linearGradient></defs>
    <rect x="3" y="12" width="26" height="18" rx="3" fill="url(#fi-tr)" />
    <path d="M29 17h8l6 7v6a2 2 0 0 1-2 2h-12z" fill="#8fb4ff" />
    <path d="M32 19h4.6l4.4 5H32z" fill="#e8f0ff" />
    <circle cx="12" cy="32" r="4.4" fill="#16233f" /><circle cx="12" cy="32" r="1.9" fill="#c9d7f5" />
    <circle cx="35" cy="32" r="4.4" fill="#16233f" /><circle cx="35" cy="32" r="1.9" fill="#c9d7f5" />
    <rect x="6" y="16" width="12" height="2.6" rx="1.3" fill="#bcd2ff" opacity=".9" />
  </svg>
)

export const ShieldImg = () => (
  <svg width={S} height={S} viewBox="0 0 48 48" aria-hidden="true">
    <defs><linearGradient id="fi-sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#34d27b" /><stop offset="1" stopColor="#0e9a4f" /></linearGradient></defs>
    <path d="M24 4l15 5.5v11c0 9.6-6.4 17.3-15 21-8.6-3.7-15-11.4-15-21v-11z" fill="url(#fi-sh)" />
    <path d="M24 4l15 5.5v11c0 .5 0 1-.05 1.5L24 8.2z" fill="#7fe3ac" opacity=".55" />
    <path d="M16.5 23.5l5.2 5.2 10-10" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const BoltImg = () => (
  <svg width={S} height={S} viewBox="0 0 48 48" aria-hidden="true">
    <defs><linearGradient id="fi-bo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd24d" /><stop offset="1" stopColor="#f59e0b" /></linearGradient></defs>
    <circle cx="24" cy="24" r="20" fill="#fff3d6" />
    <path d="M27 6L12 27h9l-2 15 15-21h-9z" fill="url(#fi-bo)" stroke="#e08900" strokeWidth="1" strokeLinejoin="round" />
  </svg>
)

export const HeadsetImg = () => (
  <svg width={S} height={S} viewBox="0 0 48 48" aria-hidden="true">
    <defs><linearGradient id="fi-he" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c084fc" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
    <path d="M8 28v-4a16 16 0 0 1 32 0v4" fill="none" stroke="url(#fi-he)" strokeWidth="5" strokeLinecap="round" />
    <rect x="5" y="26" width="9" height="13" rx="4.5" fill="url(#fi-he)" />
    <rect x="34" y="26" width="9" height="13" rx="4.5" fill="url(#fi-he)" />
    <path d="M38 39c0 4-4 6-9 6" fill="none" stroke="#7c3aed" strokeWidth="3.4" strokeLinecap="round" />
    <circle cx="27" cy="45" r="2.6" fill="#c084fc" />
  </svg>
)

export const PayImg = () => (
  <svg width={S} height={S} viewBox="0 0 48 48" aria-hidden="true">
    <defs><linearGradient id="fi-pa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#0284c7" /></linearGradient></defs>
    <rect x="4" y="10" width="40" height="26" rx="4" fill="url(#fi-pa)" />
    <rect x="4" y="15" width="40" height="5.5" fill="#0b3a56" />
    <rect x="9" y="25" width="12" height="3.4" rx="1.7" fill="#d6f0ff" />
    <circle cx="36" cy="30" r="7.5" fill="#ffd24d" stroke="#e08900" strokeWidth="1" />
    <path d="M36 26.6v6.8M32.8 30h6.4" stroke="#8a5a00" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
