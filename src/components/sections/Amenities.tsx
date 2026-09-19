import { useRef, useState, useEffect } from 'react'
import { AMENITIES } from '../../data/site'
import { useReveal } from '../../lib/hooks'
import { ICONS, IconChevronLeft, IconChevronRight } from '../ui/icons'

export default function Amenities() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const { ref, cls } = useReveal()
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const update = () => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < max - 8)
  }

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const scrollBy = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.72, 520), behavior: 'smooth' })
  }

  return (
    <section id="amenities" className="relative overflow-hidden bg-midnight py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/3 top-0 h-px w-1/2 gold-hairline" />
      <div ref={ref} className={`${cls} container-lux relative grid items-end gap-10 lg:grid-cols-[0.9fr_1.6fr]`}>
        <div>
          <span className="eyebrow">Featured Amenities</span>
          <h2 className="mt-5 font-display text-[clamp(34px,4.4vw,54px)] font-medium leading-[1.05] text-ivory">
            Live Beyond
            <br />
            The <span className="text-gradient-gold">Ordinary</span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ivory/60">
            World-class amenities designed for a lifestyle of comfort, wellness, and connection.
          </p>
          <button className="btn-gold mt-8">Explore Amenities</button>
        </div>

        <div className="min-w-0">
          <div
            ref={trackRef}
            onScroll={update}
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none' }}
          >
            {AMENITIES.map((a, i) => {
              const Icon = ICONS[a.icon] ?? ICONS.pool
              return (
                <article
                  key={a.title}
                  className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/8 sm:w-[340px]"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="relative aspect-[3/4] sm:aspect-[4/5]">
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-[1300ms] ease-lux group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full border border-gold/40 bg-ink/40 text-gold backdrop-blur transition-all duration-500 group-hover:bg-gold group-hover:text-ink">
                          <Icon width={18} height={18} />
                        </span>
                        <div>
                          <h3 className="font-display text-[21px] leading-tight text-ivory">{a.title}</h3>
                          <p className="text-[12px] text-ivory/60">{a.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="h-px flex-1 bg-white/10">
              <div
                className="h-px bg-gold transition-[width] duration-200"
                style={{ width: `${Math.max(12, progress * 100)}%` }}
              />
            </div>
            <div className="ml-6 flex gap-3">
              <button
                onClick={() => scrollBy(-1)}
                disabled={!canPrev}
                aria-label="Previous amenity"
                className="grid size-11 place-items-center rounded-full border border-white/15 text-ivory/70 transition-all duration-300 hover:border-gold hover:text-gold disabled:opacity-30"
              >
                <IconChevronLeft width={17} height={17} />
              </button>
              <button
                onClick={() => scrollBy(1)}
                disabled={!canNext}
                aria-label="Next amenity"
                className="grid size-11 place-items-center rounded-full border border-white/15 text-ivory/70 transition-all duration-300 hover:border-gold hover:text-gold disabled:opacity-30"
              >
                <IconChevronRight width={17} height={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
