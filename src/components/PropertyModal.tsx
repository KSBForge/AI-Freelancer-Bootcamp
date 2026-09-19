import { useState } from 'react'
import { PROPERTIES } from '../data/site'
import Modal from './ui/Modal'
import { IconBed, IconBath, IconArea, IconPin, IconArrowRight, IconHeart } from './ui/icons'

interface Props {
  id: string | null
  onClose: () => void
  onSchedule?: () => void
}

export default function PropertyModal({ id, onClose, onSchedule }: Props) {
  const [active, setActive] = useState(0)
  const [fav, setFav] = useState(false)
  const p = PROPERTIES.find((x) => x.id === id)
  if (!id || !p) return null
  const gallery = [p.image, ...(p.gallery ?? [])]

  return (
    <Modal open onClose={onClose} wide labelledBy="property-title">
      <div className="grid md:grid-cols-2">
        <div className="relative">
          <img
            src={gallery[active]}
            alt={p.name}
            className="h-64 w-full rounded-t-2xl object-cover md:h-full md:rounded-l-2xl md:rounded-tr-none"
          />
          <div className="absolute bottom-4 left-4 flex gap-2">
            {gallery.map((g, i) => (
              <button
                key={g}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-7 bg-gold' : 'w-4 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setFav((v) => !v)}
            aria-label="Toggle favorite"
            className={`absolute right-4 top-4 grid size-10 place-items-center rounded-full backdrop-blur transition ${
              fav ? 'bg-gold text-ink' : 'bg-ink/50 text-white hover:text-gold'
            }`}
          >
            <IconHeart width={17} height={17} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="p-7 sm:p-9">
          <p className="eyebrow">{p.badge ?? 'Residence'}</p>
          <h3 id="property-title" className="mt-4 font-display text-4xl text-ivory">
            {p.name}
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-ivory/60">
            <IconPin width={15} height={15} className="text-gold" /> {p.location}
          </p>

          <div className="mt-6 flex items-baseline justify-between border-y border-white/10 py-4">
            <span className="font-display text-3xl text-gradient-gold">{p.price}</span>
            <span className="text-xs uppercase tracking-[0.2em] text-ivory/45">{p.type}</span>
          </div>

          <p className="mt-5 text-[14.5px] leading-relaxed text-ivory/70">{p.description}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: <IconBed width={18} height={18} />, label: `${p.beds || '—'} Beds` },
              { icon: <IconBath width={18} height={18} />, label: `${p.baths || '—'} Baths` },
              { icon: <IconArea width={18} height={18} />, label: p.area },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-4 text-ivory/80">
                <span className="text-gold">{s.icon}</span>
                <span className="text-xs tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              onClose()
              onSchedule?.()
            }}
            className="btn-gold mt-7 w-full"
          >
            Schedule a Visit
            <IconArrowRight width={16} height={16} />
          </button>
        </div>
      </div>
    </Modal>
  )
}
