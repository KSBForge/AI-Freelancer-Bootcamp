import { HERO_IMAGES } from '../../data/site'
import StatCounter from '../ui/StatCounter'
import { useReveal } from '../../lib/hooks'

const STATS = [
  { value: 250, suffix: '+', label: 'Premium Properties' },
  { value: 15, suffix: '+', label: 'Cities Across India' },
  { value: 10, suffix: 'K+', label: 'Happy Clients' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
]

export default function Impact() {
  const { ref, cls } = useReveal()

  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <div data-parallax className="absolute inset-[-12%] will-change-transform">
        <img src={HERO_IMAGES.story} alt="" loading="lazy" className="size-full object-cover opacity-45" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/30" />
      <div className="absolute inset-0 bg-grain opacity-[0.05] mix-blend-overlay" />

      <div ref={ref} className={`${cls} container-lux relative`}>
        <span className="eyebrow">Our Impact</span>
        <div className="mt-10 grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-10' : ''}>
              <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
            </div>
          ))}
        </div>
        <p className="mt-12 max-w-xs font-script text-[26px] leading-snug text-gold/80">
          Homes people love.
        </p>
      </div>
    </section>
  )
}
