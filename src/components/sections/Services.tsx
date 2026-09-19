import { SERVICES } from '../../data/site'
import { useReveal, useTilt } from '../../lib/hooks'
import { ICONS, IconArrowRight } from '../ui/icons'

export default function Services() {
  const { ref, cls } = useReveal()

  return (
    <section id="services" className="relative overflow-hidden bg-charcoal py-24 sm:py-32">
      {/* architectural backdrop */}
      <div className="absolute inset-0 opacity-25" data-parallax>
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1800&auto=format&fit=crop"
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/85 to-charcoal" />

      <div className="container-lux relative">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div ref={ref} className={cls}>
            <span className="eyebrow">Our Services</span>
            <h2 className="mt-5 font-display text-[clamp(34px,4.6vw,58px)] font-medium leading-[1.05] text-ivory">
              More Than Real Estate
              <br />
              A Complete <span className="text-gradient-gold">Experience</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ivory/60">
              From buying and selling to investment advisory, we offer end-to-end real estate solutions tailored to
              your goals.
            </p>
            <button className="btn-gold mt-8">Explore Our Services</button>
          </div>
          <figure ref={ref} className={`${cls} hidden justify-self-end lg:block`}>
            <blockquote className="max-w-[230px] border-l-2 border-gold/50 pl-5 font-display text-[22px] italic leading-snug text-ivory/90">
              “Turning Property into Possibility.”
            </blockquote>
            <figcaption className="mt-3 pl-5 text-[11px] uppercase tracking-widest2 text-ivory/40">Nexora</figcaption>
          </figure>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ s, i }: { s: (typeof SERVICES)[number]; i: number }) {
  const tilt = useTilt<HTMLDivElement>(7)
  const { ref, cls } = useReveal(0.1)
  const Icon = ICONS[s.icon] ?? ICONS.home

  return (
    <div ref={ref} className={`${cls} perspective-1200`} style={{ transitionDelay: `${i * 80}ms` }}>
      <div
        ref={tilt}
        className="group relative h-full overflow-hidden rounded-xl border border-white/8 bg-midnight/70 p-6 backdrop-blur-md transition-[transform,box-shadow,border-color] duration-500 ease-lux hover:border-gold/30 hover:shadow-lux-sm"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(ellipse_at_center,rgba(200,164,95,0.14),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <span className="relative grid size-14 place-items-center rounded-full border border-gold/35 text-gold transition-all duration-500 ease-lux group-hover:scale-110 group-hover:bg-gold/10">
          <Icon width={22} height={22} />
        </span>
        <h3 className="mt-5 text-[15px] font-medium tracking-wide text-ivory">{s.title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ivory/55">{s.desc}</p>
        <div className="mt-6 flex items-center justify-between">
          <span className="h-px w-8 bg-white/10 transition-all duration-500 group-hover:w-12 group-hover:bg-gold/60" />
          <button
            aria-label={`Explore ${s.title}`}
            className="grid size-9 place-items-center rounded-full border border-white/15 text-ivory/60 transition-all duration-500 ease-lux group-hover:rotate-45 group-hover:border-gold group-hover:text-gold"
          >
            <IconArrowRight width={14} height={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
