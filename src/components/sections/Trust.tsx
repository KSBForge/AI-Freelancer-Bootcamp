import { useReveal } from '../../lib/hooks'
import { scrollToId } from '../../lib/smooth'
import { IconArrowRight } from '../ui/icons'

const STATS = [
  { icon: 'users', value: '10K+', label: 'Happy Clients' },
  { icon: 'home', value: '250+', label: 'Premium Properties' },
  { icon: 'chart', value: '15+', label: 'Cities Across India' },
  { icon: 'star', value: '98%', label: 'Client Satisfaction' },
]

export default function Trust() {
  const { ref, cls } = useReveal()

  return (
    <section id="trust" className="relative overflow-hidden bg-midnight py-24 sm:py-28">
      {/* parallax architectural backdrop */}
      <div data-parallax className="absolute inset-0 opacity-[0.14] will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1800&auto=format&fit=crop"
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/80 to-midnight/40" />
      <p className="pointer-events-none absolute -right-8 top-10 select-none font-display text-[16vw] leading-none text-white/[0.03]">
        NEXORA
      </p>

      <div ref={ref} className={`${cls} container-lux relative grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]`}>
        <div>
          <span className="eyebrow">Trusted By Thousands</span>
          <h2 className="mt-5 font-display text-[clamp(34px,4.4vw,54px)] font-medium leading-[1.06] text-ivory">
            Numbers
            <br />
            That <span className="text-gradient-gold">Build Trust</span>
          </h2>
          <button onClick={() => scrollToId('properties')} className="btn-gold mt-9">
            View All Properties
            <IconArrowRight width={16} height={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-2 sm:px-7 ${i > 0 ? 'sm:border-l sm:border-white/10' : ''} ${i === 2 ? 'border-l border-white/10 pl-6 sm:pl-7' : ''}`}
            >
              <span className="text-gold/85">
                <StatIcon name={s.icon} />
              </span>
              <div className="mt-3 font-display text-[34px] font-medium leading-none text-ivory sm:text-[38px]">{s.value}</div>
              <div className="mt-2 text-[12.5px] leading-snug text-ivory/55">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatIcon({ name }: { name: string }) {
  const common = { width: 24, height: 24, fill: 'none' as const, stroke: 'currentColor', strokeWidth: 1.4 }
  if (name === 'users')
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    )
  if (name === 'home')
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    )
  if (name === 'chart')
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    )
  return (
    <svg {...common} viewBox="0 0 24 24">
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8L6.6 19.7l1-6L3.2 9.4l6.1-.9L12 3Z" />
    </svg>
  )
}
