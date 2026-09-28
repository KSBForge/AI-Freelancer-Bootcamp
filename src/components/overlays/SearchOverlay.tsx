import { useMemo, useState } from 'react'
import { PROPERTIES } from '../../data/site'
import { IconSearch, IconClose, IconPin } from '../ui/icons'

export default function SearchOverlay({
  open,
  onClose,
  onOpenProperty,
}: {
  open: boolean
  onClose: () => void
  onOpenProperty: (id: string) => void
}) {
  const [q, setQ] = useState('')

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    return PROPERTIES.filter((p) =>
      [p.name, p.location, p.city, p.type, p.badge ?? ''].some((f) => f.toLowerCase().includes(t)),
    ).slice(0, 6)
  }, [q])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-5 pt-24 sm:pt-32">
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-ink/85 backdrop-blur-xl" />
      <div className="relative w-full max-w-2xl animate-[modalIn_.45s_cubic-bezier(.22,1,.36,1)]">
        <div className="flex items-center gap-4 border-b border-gold/30 pb-4">
          <IconSearch width={22} height={22} className="text-gold" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search villas, apartments, cities…"
            className="w-full bg-transparent font-display text-2xl text-ivory outline-none placeholder:text-ivory/30 sm:text-3xl"
          />
          <button onClick={onClose} aria-label="Close" className="text-ivory/50 transition hover:text-gold">
            <IconClose width={22} height={22} />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {q.trim() === '' && (
            <p className="px-1 py-6 text-center text-sm text-ivory/40">
              Try “villa”, “Mumbai”, “penthouse” or “₹3 Cr”
            </p>
          )}
          {q.trim() !== '' && results.length === 0 && (
            <p className="px-1 py-6 text-center text-sm text-ivory/40">No properties found for “{q}”</p>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onClose()
                onOpenProperty(p.id)
              }}
              className="group flex w-full items-center gap-4 rounded-xl border border-white/8 bg-white/[0.04] p-3 text-left backdrop-blur transition-all duration-300 hover:border-gold/40 hover:bg-white/[0.07]"
            >
              <img src={p.image} alt="" loading="lazy" className="size-14 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg text-ivory">{p.name}</p>
                <p className="flex items-center gap-1.5 text-[12px] text-ivory/55">
                  <IconPin width={11} height={11} className="text-gold" />
                  {p.location} · {p.type}
                </p>
              </div>
              <span className="font-display text-base text-gradient-gold">{p.price}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
