import { VALUES, HERO_IMAGES } from '../../data/site'
import { useReveal, useTilt } from '../../lib/hooks'
import { ICONS } from '../ui/icons'

export default function About({ onWatchStory }: { onWatchStory: () => void }) {
  const { ref, cls } = useReveal()
  const { ref: vRef, cls: vCls } = useReveal(0.1)

  return (
    <section id="about" className="relative overflow-hidden bg-charcoal py-24 sm:py-32">
      <div className="container-lux relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div ref={ref} className={cls}>
            <span className="eyebrow">About Nexora</span>
            <h2 className="mt-5 font-display text-[clamp(34px,4.6vw,58px)] font-medium leading-[1.05] text-ivory">
              Building More
              <br />
              Than <span className="text-gradient-gold">Properties</span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ivory/65">
              At Nexora, we believe real estate is not just about buildings, it's about people, dreams, and a better
              tomorrow. We create spaces that inspire, connect, and add lasting value to your life.
            </p>
            <button className="btn-gold mt-9">Our Story</button>
            <p className="mt-10 font-script text-[30px] leading-tight text-gold/85">
              Spaces for a Brighter
              <br />
              Tomorrow.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 hidden size-28 rounded-tl-2xl border-l border-t border-gold/40 lg:block" />
            <div className="absolute -bottom-6 -right-6 hidden size-28 rounded-br-2xl border-b border-r border-gold/40 lg:block" />
            <img
              src={HERO_IMAGES.about}
              alt="Luxury living room at dusk"
              loading="lazy"
              className="h-[420px] w-full rounded-2xl object-cover shadow-lux sm:h-[480px]"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <button
              onClick={onWatchStory}
              className="group absolute bottom-6 left-6 flex items-center gap-4"
              aria-label="Watch our journey"
            >
              <span className="grid size-14 place-items-center rounded-full border border-white/40 bg-ink/40 backdrop-blur transition-all duration-500 group-hover:border-gold group-hover:bg-gold/20">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-ivory">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              </span>
              <span className="text-left">
                <span className="block text-[10px] uppercase tracking-widest2 text-ivory/60">Watch</span>
                <span className="block font-display text-lg text-ivory">Our Journey</span>
              </span>
            </button>
          </div>
        </div>

        {/* Values */}
        <div ref={vRef} className={`${vCls} mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4`}>
          {VALUES.map((v, i) => {
            const Icon = ICONS[v.icon] ?? ICONS.diamond
            return (
              <ValueCard key={v.title} v={v} i={i} icon={<Icon width={24} height={24} />} />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ValueCard({ v, i, icon }: { v: (typeof VALUES)[number]; i: number; icon: React.ReactNode }) {
  const tilt = useTilt<HTMLDivElement>(6)
  return (
    <div
      className="perspective-1200"
      style={{ transitionDelay: `${i * 80}ms` }}
    >
      <div
        ref={tilt}
        className="group rounded-xl border border-ink/[0.06] bg-ivory p-6 shadow-card transition-all duration-500 ease-lux hover:-translate-y-1.5 hover:shadow-lux-sm"
      >
        <span className="grid size-12 place-items-center rounded-full bg-sand text-gold-deep transition-all duration-500 group-hover:bg-gold group-hover:text-ink">
          {icon}
        </span>
        <h3 className="mt-4 font-display text-[21px] font-medium text-ink">{v.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55">{v.desc}</p>
      </div>
    </div>
  )
}
