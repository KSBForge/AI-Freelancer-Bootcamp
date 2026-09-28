import { useState } from 'react'
import { TESTIMONIALS } from '../../data/site'
import { useReveal, useMedia } from '../../lib/hooks'
import { IconQuote, IconStar, IconChevronLeft, IconChevronRight } from '../ui/icons'

export default function Testimonials() {
  const [idx, setIdx] = useState(0)
  const { ref, cls } = useReveal()
  const isDesktop = useMedia('(min-width: 1024px)')
  const n = TESTIMONIALS.length
  const go = (d: number) => setIdx((v) => (v + d + n) % n)

  return (
    <section id="testimonials" className="relative overflow-hidden bg-ivory py-24 sm:py-32">
      <div className="container-lux">
        <div ref={ref} className={`${cls} grid items-end gap-8 lg:grid-cols-[0.8fr_1.4fr]`}>
          <div>
            <span className="eyebrow !text-gold-deep">Testimonials</span>
            <h2 className="mt-5 font-display text-[clamp(34px,4.2vw,52px)] font-medium leading-[1.06] text-ink">
              Trusted by
              <br />
              Happy Homeowners
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
            <p className="max-w-md text-[15px] leading-relaxed text-ink/60">
              Real stories from people who found more than a home — they found a better life.
            </p>
            {isDesktop && (
              <div className="flex gap-3">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="grid size-12 place-items-center rounded-full border border-ink/15 text-ink/60 transition-all duration-300 hover:border-gold hover:text-gold-deep"
                >
                  <IconChevronLeft width={18} height={18} />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="grid size-12 place-items-center rounded-full border border-ink/15 text-ink/60 transition-all duration-300 hover:border-gold hover:text-gold-deep"
                >
                  <IconChevronRight width={18} height={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {isDesktop ? (
          /* Desktop: 3-up row with subtle perspective; arrows shift the window */
          <div className="mt-12 grid grid-cols-3 gap-6" style={{ perspective: '1400px' }}>
            {[0, 1, 2].map((slot) => {
              const t = TESTIMONIALS[(idx + slot) % n]
              return (
                <article
                  key={`${t.name}-${slot}`}
                  className="card-ivory p-7 transition-all duration-700 ease-lux"
                  style={{
                    transform: `rotateY(${(slot - 1) * 3.4}deg) translateY(${Math.abs(slot - 1) * 14}px) scale(${slot === 1 ? 1 : 0.97})`,
                    opacity: slot === 1 ? 1 : 0.78,
                  }}
                >
                  <span className="text-gold">
                    <IconQuote width={30} height={30} />
                  </span>
                  <blockquote className="mt-4 font-display text-[19px] leading-relaxed text-ink/85">
                    “{t.quote}”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3.5 border-t border-ink/8 pt-5">
                    <img src={t.avatar} alt={t.name} loading="lazy" className="size-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-display text-[17px] font-medium text-ink">{t.name}</p>
                      <p className="text-[12px] text-ink/50">{t.location}</p>
                    </div>
                    <div className="flex gap-0.5 text-gold">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <IconStar key={s} width={13} height={13} />
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          /* Mobile: swipeable snap carousel with dots */
          <div className="mt-10">
            <div
              className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5"
              onScroll={(e) => {
                const el = e.currentTarget
                const card = el.scrollWidth / n
                setIdx(Math.min(n - 1, Math.round(el.scrollLeft / card)))
              }}
            >
              {TESTIMONIALS.map((t) => (
                <article key={t.name} className="card-ivory w-[84vw] shrink-0 snap-center p-7">
                  <span className="text-gold">
                    <IconQuote width={28} height={28} />
                  </span>
                  <blockquote className="mt-4 font-display text-[20px] leading-relaxed text-ink/85">“{t.quote}”</blockquote>
                  <div className="mt-6 flex items-center gap-3.5 border-t border-ink/8 pt-5">
                    <img src={t.avatar} alt={t.name} loading="lazy" className="size-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-display text-[17px] font-medium text-ink">{t.name}</p>
                      <p className="text-[12px] text-ink/50">{t.location}</p>
                    </div>
                    <div className="flex gap-0.5 text-gold">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <IconStar key={s} width={13} height={13} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-2.5">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setIdx(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? 'w-8 bg-gold' : 'w-3 bg-ink/20'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
