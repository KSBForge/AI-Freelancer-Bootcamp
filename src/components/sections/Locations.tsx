import { LOCATIONS } from '../../data/site'
import { useReveal } from '../../lib/hooks'
import { IconPin, IconArrowRight } from '../ui/icons'

export default function Locations({ onExplore }: { onExplore: (city: string) => void }) {
  const { ref, cls } = useReveal()

  return (
    <section id="locations" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="container-lux grid items-start gap-12 lg:grid-cols-[0.8fr_1.7fr]">
        <div ref={ref} className={`${cls} lg:sticky lg:top-28`}>
          <span className="eyebrow">Featured Locations</span>
          <h2 className="mt-5 font-display text-[clamp(34px,4.4vw,54px)] font-medium leading-[1.05] text-ivory">
            Prime Locations
            <br />
            For a Brighter <span className="text-gradient-gold">Tomorrow</span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ivory/60">
            Explore some of the most sought-after locations with exceptional connectivity, lifestyle, and growth
            potential.
          </p>
          <button className="btn-gold mt-8">View All Locations</button>
        </div>

        <div ref={ref} className={`${cls} grid gap-5 sm:grid-cols-2`}>
          {LOCATIONS.map((l, i) => (
            <article
              key={l.city}
              onClick={() => onExplore(l.city)}
              data-cursor="view"
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/8 transition-all duration-500 ease-lux hover:-translate-y-1.5 hover:border-gold/30 hover:shadow-lux"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="relative aspect-[16/10]">
                <img
                  src={l.image}
                  alt={l.city}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-[1300ms] ease-lux group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <IconPin width={16} height={16} className="text-gold" />
                    <div>
                      <h3 className="font-display text-[22px] leading-tight text-ivory">{l.city}</h3>
                      <p className="text-[12px] text-ivory/60">{l.tagline}</p>
                    </div>
                  </div>
                  <span className="grid size-10 place-items-center rounded-full border border-white/25 text-ivory transition-all duration-500 ease-lux group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    <IconArrowRight width={15} height={15} />
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {l.tags.map((t) => (
                    <span key={t} className="chip border-white/15 bg-white/[0.06] text-[10.5px] text-ivory/70 backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
