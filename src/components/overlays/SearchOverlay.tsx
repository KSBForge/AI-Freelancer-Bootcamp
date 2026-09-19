import { useState } from 'react'
import { IconSearch, IconClose } from '../ui/icons'

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-5 pt-24 sm:pt-32">
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-[#080706]/85 backdrop-blur-xl" />
      <div className="relative w-full max-w-2xl animate-[modalIn_.45s_cubic-bezier(.22,1,.36,1)]">
        <div className="flex items-center gap-4 border-b border-gold/30 pb-4">
          <IconSearch width={22} height={22} className="text-gold" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search menu, dishes, moments…"
            className="w-full bg-transparent font-display text-2xl text-ivory outline-none placeholder:text-ivory/30 sm:text-3xl"
          />
          <button onClick={onClose} aria-label="Close" className="text-ivory/50 transition hover:text-gold">
            <IconClose width={22} height={22} />
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-ivory/40">
          Recipe search coming soon — explore the menu and gallery instead.
        </p>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
