import { useState } from 'react'
import { LOCATIONS } from '../../data/site'
import { useReveal } from '../../lib/hooks'
import { IconPin, IconArrowRight } from '../ui/icons'

export default function IndiaMap({ onExplore }: { onExplore: (city: string) => void }) {
  const [sel, setSel] = useState<string>('Mumbai')
  const { ref, cls } = useReveal()
  const active = LOCATIONS.find((l) => l.city === sel)!

  return (
    <section className="relative overflow-hidden bg-ivory py-24 sm:py-28">
      <div ref={ref} className={`${cls} container-lux grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr_0.9fr]`}>
        {/* Left copy */}
        <div>
          <span className="eyebrow !text-gold-deep">Why Choose Nexora</span>
          <h2 className="mt-5 font-display text-[clamp(30px,3.6vw,44px)] font-medium leading-[1.08] text-ink">
            Locations
            <br />
            That Add Value
          </h2>
          <p className="mt-5 max-w-xs text-[14.5px] leading-relaxed text-ink/60">
            We help you find properties in the most promising locations, ensuring a better lifestyle and higher
            returns.
          </p>
          <div className="mt-8 flex divide-x divide-ink/10">
            {[
              ['15+', 'Cities'],
              ['250+', 'Properties'],
              ['10K+', 'Clients'],
            ].map(([v, l], i) => (
              <div key={l} className={i > 0 ? 'pl-6' : ''}>
                <div className="font-display text-[26px] text-ink">{v}</div>
                <div className="text-[11.5px] text-ink/50">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="relative mx-auto aspect-[10/11] w-full max-w-[520px]">
          <svg viewBox="0 0 400 440" className="absolute inset-0 size-full text-sanddeep/60">
            {/* Stylized India silhouette */}
            <path
              d="M55 208c-8-16-14-38-9-55 4-14 16-24 20-38 3-11-1-24 5-34 5-9 16-13 25-19 8-5 14-13 23-16 12-4 25 2 37 0 14-2 26-12 40-11 12 1 22 10 34 13 12 3 26-1 36 6 9 6 12 18 15 29 3 12 10 22 10 34 0 12-8 22-11 34-3 11 0 23-4 34-4 10-13 17-19 26-7 10-9 23-17 32-9 10-24 12-35 20-10 8-17 20-28 26-14 8-31 6-45 12-9 4-16 12-25 15-8 3-17 1-23-5-7-7-6-18-11-27-5-10-16-15-20-26-3-8-1-17-3-25Z"
              fill="currentColor"
            />
            {/* subtle latitude arcs */}
            <path d="M60 150c90 26 200 22 285-18M50 220c100 30 210 26 300-14M70 290c90 26 180 22 260-10"
              stroke="#0c0f16" strokeOpacity="0.06" strokeWidth="1.4" fill="none" />
          </svg>

          {/* compass */}
          <div className="absolute left-3 top-3 grid size-10 place-items-center rounded-full border border-ink/10 bg-white shadow-card">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0c0f16" strokeWidth="1.6">
              <path d="M12 2v20M12 2l-4 6M12 2l4 6" />
            </svg>
          </div>

          {/* Markers */}
          {LOCATIONS.map((l) => {
            const isSel = l.city === sel
            return (
              <button
                key={l.city}
                onClick={() => setSel(l.city)}
                className="group absolute -translate-x-1/2 -translate-y-full outline-none"
                style={{ left: `${l.x}%`, top: `${l.y}%` }}
                aria-label={`${l.city} — ${l.count} properties`}
              >
                <span className="relative flex flex-col items-center">
                  {isSel && (
                    <span className="absolute -inset-4 animate-ping-soft rounded-full bg-gold/25" />
                  )}
                  <span
                    className={`relative grid place-items-center rounded-full transition-all duration-500 ease-lux ${
                      isSel
                        ? 'size-12 bg-gold text-ink shadow-gold-glow'
                        : 'size-9 bg-midnight text-gold group-hover:size-11 group-hover:bg-gold group-hover:text-ink'
                    }`}
                  >
                    <IconPin width={isSel ? 19 : 15} height={isSel ? 19 : 15} />
                  </span>
                  <span
                    className={`mt-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide transition-all duration-300 ${
                      isSel ? 'bg-ink text-ivory' : 'bg-white/90 text-ink/70 shadow-card group-hover:text-ink'
                    }`}
                  >
                    {l.city}
                  </span>
                </span>
              </button>
            )
          })}

          <p className="absolute bottom-2 right-2 max-w-[180px] text-right font-script text-[24px] leading-snug text-gold-deep/80">
            A Brighter Tomorrow Across India.
          </p>
        </div>

        {/* Detail panel */}
        <div>
          <div className="card-ivory overflow-hidden">
            <div className="relative h-44">
              <img key={active.city} src={active.image} alt={active.city} loading="lazy" className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-3 left-4 flex items-center gap-2 text-ivory">
                <IconPin width={14} height={14} className="text-gold" />
                <span className="font-display text-xl">{active.city}</span>
              </span>
            </div>
            <div className="p-6">
              <p className="text-[13.5px] leading-relaxed text-ink/60">{active.desc}</p>
              <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
                <span className="text-[12px] uppercase tracking-[0.16em] text-ink/45">
                  {active.count}+ Properties Listed
                </span>
                <button
                  onClick={() => onExplore(active.city)}
                  className="grid size-10 place-items-center rounded-full bg-gold text-ink transition-transform duration-500 ease-lux hover:rotate-45"
                  aria-label={`Explore ${active.city}`}
                >
                  <IconArrowRight width={15} height={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 hidden justify-end lg:flex">
            <div className="rounded-xl bg-midnight p-5 text-ivory">
              <p className="text-[10px] uppercase tracking-widest2 text-gold">Discover More</p>
              <p className="mt-1.5 font-display text-lg leading-snug">
                Find the Perfect Location for Your Next Move
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
